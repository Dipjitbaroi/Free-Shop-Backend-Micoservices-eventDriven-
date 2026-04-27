import { Request, Response } from 'express';
import { asyncHandler } from '@freeshop/shared-middleware';
import { createApiResponse, createServiceLogger, BadRequestError } from '@freeshop/shared-utils';
import { authService } from '../services/auth.service.js';

const logger = createServiceLogger('auth-controller');

/**
 * POST /auth/firebase
 * Body: { idToken: string }
 *
 * The client signs in via the Firebase client SDK (email/password, Google,
 * Facebook, phone, etc.), obtains a Firebase ID token, and sends it here.
 * This endpoint verifies the token and exchanges it for the application's
 * own access + refresh JWT pair.
 */
export const firebaseLogin = asyncHandler(async (req: Request, res: Response) => {
  const { idToken, firstName, lastName } = req.body;
  logger.debug('firebaseLogin → enter', { requestId: req.requestId });

  if (!idToken || typeof idToken !== 'string') {
    throw new BadRequestError('idToken is required', { code: 'MISSING_ID_TOKEN' });
  }

  const result = await authService.loginWithFirebase(idToken, {
    deviceId: req.headers['x-device-id'] as string,
    userAgent: req.headers['user-agent'],
    ip: req.ip,
    firstName: typeof firstName === 'string' ? firstName.trim() : undefined,
    lastName:  typeof lastName  === 'string' ? lastName.trim()  : undefined,
  });

  // Set refresh token as HTTP-only cookie
  res.cookie('refreshToken', result.tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  logger.info('firebaseLogin → success', {
    requestId: req.requestId,
    userId: result.user.id,
    email: result.user.email,
    provider: result.user.oauthProvider,
  });
  res.json(createApiResponse(result, 'Login successful', req.requestId));
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  logger.debug('refreshToken → enter', { requestId: req.requestId });
  const token = req.body.refreshToken || req.cookies?.refreshToken;

  if (!token) {
    throw new BadRequestError('Refresh token is required', { code: 'MISSING_TOKEN' });
  }

  const tokens = await authService.refreshToken(token);

  // Set new refresh token as HTTP-only cookie
  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json(createApiResponse(tokens, 'Token refreshed successfully', req.requestId));
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;

  if (userId) {
    await authService.logout(userId, refreshToken);
  }

  res.clearCookie('refreshToken');
  res.json(createApiResponse(null, 'Logged out successfully', req.requestId));
});

export const logoutAll = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (userId) {
    await authService.logoutAll(userId);
  }

  res.clearCookie('refreshToken');
  res.json(createApiResponse(null, 'Logged out from all devices', req.requestId));
});

export const guestToken = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.generateGuestToken();
  res.json(createApiResponse(result, 'Guest token generated', req.requestId));
});

export const verifyToken = asyncHandler(async (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    throw new BadRequestError('Token is required', { code: 'MISSING_TOKEN' });
  }

  const payload = await authService.verifyToken(token);
  res.json(createApiResponse(payload, 'Token is valid', req.requestId));
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getUserById(req.user!.userId);
  res.json(createApiResponse(user, 'Current user', req.requestId));
});

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const { role, status, search, page, limit } = req.query;
  const result = await authService.getUsers({
    role: role as any,
    status: status as any,
    search: search as string | undefined,
    page: page ? parseInt(page as string) : 1,
    limit: limit ? Math.min(100, parseInt(limit as string)) : 20,
  });
  res.json(createApiResponse(result, 'Users retrieved successfully', req.requestId));
});

/**
 * POST /auth/admin/create
 * Body: { secretKey, email, password, firstName, lastName, role? }
 *
 * Creates a new ADMIN or MANAGER account. The request must include the
 * ADMIN_SECRET_KEY configured in the environment — without it the request
 * is rejected with 403 before any DB work is done.
 */
export const createAdminAccount = asyncHandler(async (req: Request, res: Response) => {
  const { secretKey, email, password, firstName, lastName } = req.body;
  logger.debug('createAdminAccount → enter', { requestId: req.requestId });

  const result = await authService.createAdminAccount(secretKey, {
    email,
    password,
    firstName,
    lastName,
  });

  res.cookie('refreshToken', result.tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  logger.info('createAdminAccount → success', {
    requestId: req.requestId,
    userId: result.user.id,
  });
  res.status(201).json(createApiResponse(result, 'Admin account created successfully', req.requestId));
});

/**
 * POST /auth/admin/login
 * Body: { email: string; password: string }
 *
 * Authenticates ADMIN and MANAGER accounts using email + password.
 * Firebase / social login is intentionally NOT available for these roles.
 */
export const adminLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  logger.debug('adminLogin → enter', { requestId: req.requestId });

  const result = await authService.loginWithCredentials(email, password, {
    deviceId: req.headers['x-device-id'] as string,
    userAgent: req.headers['user-agent'],
    ip: req.ip,
  });

  res.cookie('refreshToken', result.tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  logger.info('adminLogin → success', {
    requestId: req.requestId,
    userId: result.user.id,
  });
  res.json(createApiResponse(result, 'Login successful', req.requestId));
});

/**
 * PATCH /auth/users/:userId
 * Update user profile (firstName, lastName, phone, avatar, status)
 */
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params as { userId: string };
  const { firstName, lastName, phone, avatar, status } = req.body;
  
  logger.debug('updateUser → enter', { userId, requestId: req.requestId });

  const updatedUser = await authService.updateUser(userId, {
    firstName,
    lastName,
    phone,
    avatar,
    status,
  });

  // Track which fields were updated
  const updatedFields: string[] = [];
  if (firstName !== undefined) updatedFields.push('firstName');
  if (lastName !== undefined) updatedFields.push('lastName');
  if (phone !== undefined) updatedFields.push('phone');
  if (avatar !== undefined) updatedFields.push('avatar');
  if (status !== undefined) updatedFields.push('status');

  logger.info('updateUser → success', {
    requestId: req.requestId,
    userId,
    updatedFields,
  });

  res.json(createApiResponse(
    {
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      phone: updatedUser.phone,
      avatar: updatedUser.avatar,
      status: updatedUser.status,
      updatedAt: updatedUser.updatedAt,
    },
    'User updated successfully',
    req.requestId
  ));
});

/**
 * DELETE /auth/users/:userId
 * Delete a user account (hard delete with cascading deletes)
 */
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params as { userId: string };
  
  logger.debug('deleteUser → enter', { userId, requestId: req.requestId });

  await authService.deleteUser(userId);

  logger.info('deleteUser → success', {
    requestId: req.requestId,
    userId,
  });

  res.json(createApiResponse(
    null,
    'User account deleted successfully',
    req.requestId
  ));
});

/**
 * POST /auth/dev/change-password
 * Body: { secretKey, userId, newPassword }
 *
 * Allows a developer to change any user's password by providing the
 * ADMIN_SECRET_KEY. This is intended for development/emergency scenarios only.
 * No authentication required — the ADMIN_SECRET_KEY is the only security measure.
 */
export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { secretKey, userId, newPassword } = req.body;
  logger.debug('changePassword → enter', { userId, requestId: req.requestId });

  const result = await authService.changePassword(secretKey, userId, newPassword);

  logger.info('changePassword → success', {
    requestId: req.requestId,
    userId,
    email: result.email,
  });
  res.json(createApiResponse(result, 'Password changed successfully', req.requestId));
});
