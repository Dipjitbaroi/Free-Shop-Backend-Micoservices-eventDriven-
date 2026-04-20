import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import {
  UserStatus,
  OAuthProvider,
  ITokenPayload,
  IAuthTokens,
  IAuthResponse,
} from '@freeshop/shared-types';
import {
  generateGuestId,
  UnauthorizedError,
  ForbiddenError,
  comparePassword,
  hashPassword,
} from '@freeshop/shared-utils';
import { prisma } from '../lib/prisma.js';
import { RBACService } from './rbac.service.js';
import { blacklistToken, isTokenBlacklisted, invalidateAllSessions } from '../lib/redis.js';
import { eventPublisher } from '../lib/message-broker.js';
import { verifyFirebaseToken } from '../lib/firebase.js';
import { createServiceLogger } from '@freeshop/shared-utils';
import config from '../config/index.js';

const logger = createServiceLogger('auth-service');

// Sanitize roles: remove audit/metadata fields before returning to clients
const sanitizeRoles = (roles: any[] = []) =>
  roles.map((r) => ({
    id: r.id,
    name: r.name,
    permissionCount: r.permissionCount ?? (r.permissions?.length ?? undefined),
    permissions:
      r.permissions?.map((p: any) => ({
        id: p.permission?.id ?? p.id,
        permissionCode: p.permission?.permissionCode ?? p.permissionCode,
        action: p.permission?.action ?? p.action,
        resource: p.permission?.resource ?? p.resource,
      })) || [],
  }));

class AuthService {
  private generateTokens(user: { id: string; email: string; role?: string }): IAuthTokens {
    const payload: Omit<ITokenPayload, 'iat' | 'exp'> = {
      userId: user.id,
      email: user.email,
      type: 'access',
    };

    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    } as SignOptions);

    const refreshPayload: Omit<ITokenPayload, 'iat' | 'exp'> = {
      ...payload,
      type: 'refresh',
    };

    const refreshToken = jwt.sign(refreshPayload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
    } as SignOptions);

    // Parse expiry for response
    const decoded = jwt.decode(accessToken) as JwtPayload;
    const expiresIn = decoded.exp! - Math.floor(Date.now() / 1000);

    return {
      accessToken,
      refreshToken,
      expiresIn,
      tokenType: 'Bearer',
    };
  }

  /**
   * Verify a Firebase ID token issued by the client (after Google / Facebook /
   * email-password sign-in via the Firebase client SDK) and exchange it for
   * the application's own JWT pair.  A new user record is created on first
   * sign-in; subsequent calls just update lastLoginAt.
   */
  async loginWithFirebase(
    idToken: string,
    opts?: { deviceId?: string; userAgent?: string; ip?: string; firstName?: string; lastName?: string },
  ): Promise<IAuthResponse> {
    logger.debug('loginWithFirebase → verifying Firebase ID token');

    // 1. Verify token with Firebase Admin SDK
    let decoded;
    try {
      decoded = await verifyFirebaseToken(idToken);
    } catch (err: any) {
      throw new UnauthorizedError(`Invalid Firebase token: ${err?.message}`);
    }

    const firebaseUid   = decoded.uid;
    const emailVerified = decoded.email_verified ?? false;
    const displayName   = (decoded.name as string | undefined) || '';
    const nameParts     = displayName.trim().split(/\s+/);
    const avatar        = decoded.picture as string | undefined;

    // Map Firebase sign_in_provider → OAuthProvider enum
    // Full list: https://firebase.google.com/docs/reference/js/auth.md#signinprovider
    const signInProvider = (decoded.firebase as any)?.sign_in_provider as string ?? 'password';

    let provider: OAuthProvider;
    switch (signInProvider) {
      case 'google.com':     provider = OAuthProvider.GOOGLE;     break;
      case 'facebook.com':   provider = OAuthProvider.FACEBOOK;   break;
      case 'apple.com':      provider = OAuthProvider.APPLE;      break;
      case 'phone':          provider = OAuthProvider.PHONE;      break;
      case 'emailLink':      provider = OAuthProvider.EMAIL_LINK; break;
      case 'anonymous':      provider = OAuthProvider.ANONYMOUS;  break;
      default:               provider = OAuthProvider.LOCAL;      break; // password, custom, etc.
    }

    // Derive display name + email with provider-aware fallbacks
    // Phone users have no email; anonymous users have neither email nor name
    const phoneNumber = decoded.phone_number as string | undefined;
    const email =
      decoded.email
        ? decoded.email.toLowerCase()
        : phoneNumber
          ? `${firebaseUid}@phone.firebase.local`
          : `${firebaseUid}@anonymous.firebase.local`;

    // Name resolution priority:
    //   1. Firebase display name (Google, Facebook, Apple always supply this)
    //   2. Caller-supplied firstName/lastName (email+password, phone/OTP registration)
    //   3. Generic fallback
    const firstName = nameParts[0] || opts?.firstName || (provider === OAuthProvider.PHONE ? 'Phone' : 'User');
    const lastName  = nameParts.slice(1).join(' ') || opts?.lastName || 'User';

    logger.debug('loginWithFirebase → resolved provider', { firebaseUid, email, provider });

    // 2. Find existing user by Firebase UID (stored in oauthId)
    let user = await prisma.user.findFirst({
      where: { oauthId: firebaseUid },
    });

    if (!user) {
      // 3a. For real-email providers, try to match an existing account (link accounts).
      //     Skip for phone/anonymous — they use synthetic e-mail addresses.
      const hasRealEmail = !!decoded.email;
      const byEmail = hasRealEmail
        ? await prisma.user.findUnique({ where: { email } })
        : null;

      if (byEmail) {
        user = await prisma.user.update({
          where: { id: byEmail.id },
          data: {
            oauthId: firebaseUid,
            oauthProvider: provider,
            emailVerified: true,
            phoneVerified: provider === OAuthProvider.PHONE,
            // Sync Firebase profile data — only fill fields that are blank/default
            phone: phoneNumber ?? byEmail.phone ?? undefined,
            avatar: avatar ?? byEmail.avatar,
            firstName: byEmail.firstName !== 'User' ? byEmail.firstName : firstName,
            lastName:  byEmail.lastName  !== 'User' ? byEmail.lastName  : lastName,
          },
        });
        logger.info('loginWithFirebase → linked Firebase UID to existing account', { userId: user.id });
      } else {
        // 3b. Create a brand-new user
        user = await prisma.user.create({
          data: {
            email,
            firstName,
            lastName,
            avatar,
            // Store verified phone number for SMS/OTP sign-ins
            phone: phoneNumber ?? undefined,
            oauthId: firebaseUid,
            oauthProvider: provider,
            emailVerified,
            phoneVerified: provider === OAuthProvider.PHONE,
            status: UserStatus.ACTIVE,
          },
        });

        // Publish user.created event (fire-and-forget)
        eventPublisher.userCreated({
          userId: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone ?? undefined,
          avatar: user.avatar ?? undefined,
          role: 'CUSTOMER', // Default role - actual roles assigned via RBAC system
        }).catch((err) =>
          logger.error('Failed to publish user.created event', { error: err?.message }),
        );

        logger.info('loginWithFirebase → created new user', { userId: user.id, email, provider });
      }
    }

    // 4. Guard: suspended accounts
    if (user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedError('Account has been suspended');
    }

    // 5. Sync fresh Firebase identity data on every login
    //    - Always update: lastLoginAt, verification flags, phone, avatar
    //    - Names: only overwrite the database copy when Firebase provides a
    //      real display name AND the stored value is still the generic default
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        emailVerified: emailVerified || user.emailVerified,
        phoneVerified: provider === OAuthProvider.PHONE ? true : user.phoneVerified,
        phone:  phoneNumber  ?? user.phone  ?? undefined,
        avatar: avatar       ?? user.avatar ?? undefined,
        firstName: (displayName && user.firstName === 'User') ? firstName : user.firstName,
        lastName:  (displayName && user.lastName  === 'User') ? lastName  : user.lastName,
      },
    });

    // 6. Issue application JWTs
    const tokens = this.generateTokens(user);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: tokens.refreshToken,
        deviceId: opts?.deviceId,
        userAgent: opts?.userAgent,
        ip: opts?.ip,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    logger.debug('loginWithFirebase → done', { userId: user.id, email: user.email });

    // Fetch roles & permissions for frontend convenience
    const rbac = await RBACService.getUserRolesAndPermissions(user.id);
    // Sanitize roles: remove audit/metadata fields before returning to clients
    const sanitizeRoles = (roles: any[]) =>
      roles.map((r) => ({
        id: r.id,
        name: r.name,
        permissionCount: r.permissionCount ?? (r.permissions?.length ?? undefined),
        permissions: r.permissions?.map((p: any) => ({ id: p.permission?.id ?? p.id, permissionCode: p.permission?.permissionCode ?? p.permissionCode, action: p.permission?.action ?? p.action, resource: p.permission?.resource ?? p.resource })) || [],
      }));

    return {
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone || undefined,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar || undefined,
        status: user.status as UserStatus,
        oauthProvider: user.oauthProvider as OAuthProvider,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        lastLoginAt: user.lastLoginAt || undefined,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      tokens,
      roles: sanitizeRoles(rbac.roles || []),
      roleNames: rbac.roleNames,
      permissionCodes: rbac.permissionCodes,
    };
  }

  async refreshToken(refreshToken: string): Promise<IAuthTokens> {
    // Check if token is blacklisted
    if (await isTokenBlacklisted(refreshToken)) {
      throw new UnauthorizedError('Token has been revoked');
    }

    // Verify refresh token
    try {
      jwt.verify(refreshToken, config.jwt.refreshSecret);
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    // Check if token exists in database
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken || storedToken.isRevoked) {
      throw new UnauthorizedError('Token has been revoked');
    }

    if (storedToken.expiresAt < new Date()) {
      throw new UnauthorizedError('Refresh token has expired');
    }

    // Generate new tokens
    const tokens = this.generateTokens(storedToken.user);

    // Revoke old refresh token and create new one
    await prisma.$transaction([
      prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { isRevoked: true },
      }),
      prisma.refreshToken.create({
        data: {
          userId: storedToken.userId,
          token: tokens.refreshToken,
          deviceId: storedToken.deviceId,
          userAgent: storedToken.userAgent,
          ip: storedToken.ip,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);

    return tokens;
  }

  async logout(userId: string, refreshToken?: string): Promise<void> {
    if (refreshToken) {
      // Revoke specific refresh token
      await prisma.refreshToken.updateMany({
        where: {
          userId,
          token: refreshToken,
        },
        data: { isRevoked: true },
      });

      // Blacklist the token
      const decoded = jwt.decode(refreshToken) as JwtPayload;
      if (decoded?.exp) {
        const ttl = decoded.exp - Math.floor(Date.now() / 1000);
        if (ttl > 0) {
          await blacklistToken(refreshToken, ttl);
        }
      }
    }
  }

  async logoutAll(userId: string): Promise<void> {
    // Revoke all refresh tokens
    await prisma.refreshToken.updateMany({
      where: { userId },
      data: { isRevoked: true },
    });

    // Invalidate all sessions in Redis
    await invalidateAllSessions(userId);
  }

  async generateGuestToken(): Promise<{ guestId: string; token: string; expiresIn: number }> {
    const guestId = generateGuestId();
    
    const payload: Omit<ITokenPayload, 'iat' | 'exp'> = {
      userId: guestId,
      email: '',
      type: 'guest',
      guestId,
    };

    const token = jwt.sign(payload, config.jwt.secret, {
      expiresIn: '24h',
    });

    // Store guest token
    await prisma.guestToken.create({
      data: {
        guestId,
        token,
        expiresAt: new Date(Date.now() + config.security.guestTokenExpiry),
      },
    });

    return {
      guestId,
      token,
      expiresIn: 86400, // 24 hours in seconds
    };
  }

  async verifyToken(token: string): Promise<ITokenPayload> {
    // Check if token is blacklisted
    if (await isTokenBlacklisted(token)) {
      throw new UnauthorizedError('Token has been revoked');
    }

    try {
      return jwt.verify(token, config.jwt.secret) as ITokenPayload;
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired token');
    }
  }

  /**
   * Authenticate an ADMIN or MANAGER using email + password.
   * This is intentionally separate from loginWithFirebase so that privileged
   * accounts can never be accessed via the social / Firebase flow.
   */
  async loginWithCredentials(
    email: string,
    password: string,
    opts?: { ip?: string; userAgent?: string; deviceId?: string },
  ): Promise<IAuthResponse> {
    logger.debug('loginWithCredentials → enter', { email });

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

    // Only users with password hash (ADMIN/MANAGER) are allowed through this path.
    // Use the same error message for missing user and missing password hash to
    // prevent user enumeration.
    if (!user || !user.passwordHash) {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedError('Account has been suspended');
    }

    // Brute-force guard: reject if account is temporarily locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new UnauthorizedError('Account is temporarily locked. Please try again later.');
    }

    const passwordValid = await comparePassword(password, user.passwordHash);

    if (!passwordValid) {
      // Increment failed attempts; lock after 5 consecutive failures (15 min)
      const attempts = user.loginAttempts + 1;
      const lockedUntil = attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null;
      await prisma.user.update({
        where: { id: user.id },
        data: { loginAttempts: attempts, ...(lockedUntil ? { lockedUntil } : {}) },
      });
      logger.warn('loginWithCredentials → wrong password', { email, attempts });
      throw new UnauthorizedError('Invalid credentials');
    }

    // Reset failed-attempt counter on successful login
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date(), loginAttempts: 0, lockedUntil: null },
    });

    const tokens = this.generateTokens(updatedUser);

    await prisma.refreshToken.create({
      data: {
        userId: updatedUser.id,
        token: tokens.refreshToken,
        deviceId: opts?.deviceId,
        userAgent: opts?.userAgent,
        ip: opts?.ip,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    logger.info('loginWithCredentials → success', { userId: updatedUser.id });

    // Fetch roles & permissions for frontend convenience
    const rbac = await RBACService.getUserRolesAndPermissions(updatedUser.id);

    return {
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        phone: updatedUser.phone || undefined,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        avatar: updatedUser.avatar || undefined,
        status: updatedUser.status as UserStatus,
        oauthProvider: updatedUser.oauthProvider as OAuthProvider,
        emailVerified: updatedUser.emailVerified,
        phoneVerified: updatedUser.phoneVerified,
        lastLoginAt: updatedUser.lastLoginAt || undefined,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
      tokens,
      roles: sanitizeRoles(rbac.roles || []),
      roleNames: rbac.roleNames,
      permissionCodes: rbac.permissionCodes,
    };
  }

  /**
   * Create a new ADMIN or MANAGER account.
   * The caller must supply the correct ADMIN_SECRET_KEY from env; without it
   * the request is rejected with a 403 before any DB work is done.
   */
  async createAdminAccount(
    secretKey: string,
    data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    },
  ): Promise<IAuthResponse> {
    logger.debug('createAdminAccount → enter', { email: data.email });

    const configuredSecret = config.security.adminSecretKey;
    if (!configuredSecret) {
      throw new ForbiddenError('Admin account creation is disabled (ADMIN_SECRET_KEY not configured)');
    }
    if (secretKey !== configuredSecret) {
      throw new ForbiddenError('Invalid admin secret key');
    }

    const existing = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
    if (existing) {
      throw new ForbiddenError('An account with this email already exists');
    }

    const passwordHash = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        firstName: data.firstName,
        lastName: data.lastName,
        passwordHash,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        oauthProvider: OAuthProvider.LOCAL,
      },
    });

    logger.info('createAdminAccount → created', { userId: user.id });

    const tokens = this.generateTokens(user);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone || undefined,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar || undefined,
        status: user.status as UserStatus,
        oauthProvider: user.oauthProvider as OAuthProvider,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        lastLoginAt: user.lastLoginAt || undefined,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      tokens,
    };
  }

  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        avatar: true,
        status: true,
        oauthProvider: true,
        emailVerified: true,
        phoneVerified: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    // Attach RBAC info so `/auth/me` returns roles and permissions
    try {
      const rbac = await RBACService.getUserRolesAndPermissions(userId);
      return {
        ...user,
        roles: sanitizeRoles(rbac.roles || []),
        roleNames: rbac.roleNames,
        permissionCodes: rbac.permissionCodes,
      };
    } catch (err) {
      // If RBAC lookup fails, return user without roles to avoid blocking
      logger.error('Failed to fetch RBAC info for user', { userId, error: (err as any)?.message });
      return user;
    }
  }

  async getUsers(filters: {
    role?: any;
    status?: UserStatus;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ users: object[]; total: number; page: number; limit: number }> {
    const { role, status, search, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;
    const where: any = {};

    if (role) where.role = role;
    if (status) where.status = status;
    if (search) {
      const s = search.trim();
      where.OR = [
        { firstName: { contains: s, mode: 'insensitive' } },
        { lastName:  { contains: s, mode: 'insensitive' } },
        { email:     { contains: s, mode: 'insensitive' } },
        { phone:     { contains: s, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          phone: true,
          firstName: true,
          lastName: true,
          avatar: true,
          status: true,
          oauthProvider: true,
          emailVerified: true,
          phoneVerified: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total, page, limit };
  }

}

export const authService = new AuthService();
