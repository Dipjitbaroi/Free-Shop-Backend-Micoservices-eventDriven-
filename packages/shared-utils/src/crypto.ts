import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';

const SALT_ROUNDS = 12;
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';

/**
 * Hash a password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare a password with its hash
 */
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Encrypt sensitive data using AES
 */
export const encrypt = (text: string, key?: string): string => {
  const encryptionKey = key || ENCRYPTION_KEY;
  return CryptoJS.AES.encrypt(text, encryptionKey).toString();
};

/**
 * Decrypt data encrypted with AES
 */
export const decrypt = (ciphertext: string, key?: string): string => {
  const encryptionKey = key || ENCRYPTION_KEY;
  const bytes = CryptoJS.AES.decrypt(ciphertext, encryptionKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

/**
 * Generate a SHA256 hash
 */
export const hashSHA256 = (text: string): string => {
  return CryptoJS.SHA256(text).toString();
};

/**
 * Generate a MD5 hash
 */
export const hashMD5 = (text: string): string => {
  return CryptoJS.MD5(text).toString();
};

/**
 * Generate HMAC signature
 */
export const generateHMAC = (message: string, secret: string): string => {
  return CryptoJS.HmacSHA256(message, secret).toString();
};

/**
 * Verify HMAC signature
 */
export const verifyHMAC = (
  message: string,
  signature: string,
  secret: string
): boolean => {
  const expectedSignature = generateHMAC(message, secret);
  return signature === expectedSignature;
};

/**
 * Mask sensitive data (e.g., email, phone)
 */
export const maskEmail = (email: string): string => {
  const [localPart, domain] = email.split('@');
  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`;
  }
  return `${localPart[0]}***${localPart[localPart.length - 1]}@${domain}`;
};

export const maskPhone = (phone: string): string => {
  if (phone.length < 4) return '***';
  return `***${phone.slice(-4)}`;
};

export const maskCardNumber = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (cleaned.length < 4) return '****';
  return `****${cleaned.slice(-4)}`;
};
