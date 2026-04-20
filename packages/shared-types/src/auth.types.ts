import { OAuthProvider } from './enums';
import { IUser } from './user.types';

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  // role: Removed - users get roles from RBAC system after registration
}

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface IAuthResponse {
  user: Omit<IUser, 'passwordHash'>;
  tokens: IAuthTokens;
  // Optional RBAC snapshot returned at login or from `/auth/me`
  roles?: any[]; // full role objects as returned by RBAC (id, name, permissions...)
  roleNames?: string[];
  permissionCodes?: number[];
}

export interface IRefreshTokenRequest {
  refreshToken: string;
}

export interface IGuestTokenRequest {
  guestId?: string;
}

export interface IGuestTokenResponse {
  guestId: string;
  token: string;
  expiresIn: number;
}

export interface IOAuthProfile {
  provider: OAuthProvider;
  providerId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface IChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface IResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface IForgotPasswordRequest {
  email: string;
}

export interface IVerifyEmailRequest {
  token: string;
}

export interface ITokenPayload {
  userId: string;
  id?: string;  // alias for userId, populated by authenticate middleware
  email: string;
  // role: Removed - roles are assigned dynamically via RBAC system
  // To get user roles/permissions, query auth service GET /auth/users/{userId}/roles
  type: 'access' | 'refresh' | 'guest';
  guestId?: string;
  iat?: number;
  exp?: number;
}

export interface ISessionInfo {
  userId: string;
  deviceId: string;
  ip: string;
  userAgent: string;
  lastActive: Date;
  createdAt: Date;
  expiresAt: Date;
}

export interface IJWTRolePermission {
  resource: string;
  action: string;
  conditions?: Record<string, unknown>;
}

export interface IRolePermissions {
  roleName: string; // Dynamic role name from RBAC system
  permissions: IJWTRolePermission[];
}
