import { UserStatus, OAuthProvider } from './enums';

export interface IUser {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  // role: Removed - roles are now assigned dynamically via RBAC system
  // Access req.user.roles from token or query auth service instead
  status: UserStatus;
  oauthProvider: OAuthProvider;
  oauthId?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserCreate {
  email: string;
  password?: string;
  phone?: string;
  firstName: string;
  lastName: string;
  // role: Removed - roles are assigned via RBAC system after user creation
  oauthProvider?: OAuthProvider;
  oauthId?: string;
}

export interface IUserUpdate {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  status?: UserStatus;
}

export interface IUserProfile extends IUser {
  addresses?: IAddress[];
  wishlist?: string[];
}

export interface IAddress {
  id: string;
  userId: string;
  label: string;
  fullName: string;
  phone: string;
  addressLine: string;
  upazila?: string;
  district: string;
  postalCode?: string;
  country?: string;
  /** Canonical zone id (UUID) referencing delivery Zone */
  zone: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAddressCreate {
  label: string;
  fullName: string;
  phone: string;
  addressLine: string;
  upazila?: string;
  district: string;
  postalCode?: string;
  country?: string;
  zone: string;
  isDefault?: boolean;
}

export interface IGuestUser {
  guestId: string;
  email?: string;
  phone?: string;
  fullName?: string;
  address?: Omit<IAddress, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
}
