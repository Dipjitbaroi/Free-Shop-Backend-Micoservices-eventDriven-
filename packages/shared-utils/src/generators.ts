import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';

/**
 * Generate a unique UUID v4
 */
export const generateId = (): string => uuidv4();

/**
 * Generate a unique order number
 */
export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `FS-${timestamp}-${random}`;
};

/**
 * Generate a unique SKU
 */
export const generateSku = (prefix?: string): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return prefix ? `${prefix}-${timestamp}${random}` : `SKU-${timestamp}${random}`;
};

/**
 * Generate a URL-friendly slug
 */
export const generateSlug = (text: string): string => {
  return slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });
};

/**
 * Generate a unique slug with random suffix
 */
export const generateUniqueSlug = (text: string): string => {
  const baseSlug = generateSlug(text);
  const random = Math.random().toString(36).substring(2, 6);
  return `${baseSlug}-${random}`;
};

/**
 * Generate a random verification code
 */
export const generateVerificationCode = (length: number = 6): string => {
  const digits = '0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return code;
};

/**
 * Generate a random string
 */
export const generateRandomString = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Generate a guest ID
 */
export const generateGuestId = (): string => {
  return `guest_${uuidv4().replace(/-/g, '')}`;
};

/**
 * Generate a transaction ID
 */
export const generateTransactionId = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 10);
  return `TXN${timestamp}${random}`.toUpperCase();
};
