import { UserRole, OAuthProvider } from './enums';
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
  role?: UserRole;
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
  role: UserRole;
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

export interface IPermission {
  resource: string;
  action: string;
  conditions?: Record<string, unknown>;
}

export interface IRolePermissions {
  role: UserRole;
  permissions: IPermission[];
}
