import { body } from 'express-validator';

/**
 * Validates the Firebase ID token sent by the client after signing in via
 * the Firebase client SDK (Google, Facebook, email/password, phone, etc.).
 */
export const firebaseLoginValidation = [
  body('idToken')
    .notEmpty()
    .withMessage('idToken is required')
    .isString()
    .withMessage('idToken must be a string'),
  // Optional name fields — used as fallback for providers that supply no
  // display name (email+password, phone/OTP, anonymous).
  body('firstName')
    .optional()
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('firstName must be a string (max 100 chars)'),
  body('lastName')
    .optional()
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('lastName must be a string (max 100 chars)'),
];

/**
 * Validates the payload for creating a new ADMIN or MANAGER account.
 * Requires a secret key that must match ADMIN_SECRET_KEY in the environment.
 */
export const adminCreateValidation = [
  body('secretKey')
    .notEmpty().withMessage('secretKey is required')
    .isString().withMessage('secretKey must be a string'),
  body('email')
    .notEmpty().withMessage('email is required')
    .isEmail().withMessage('email must be a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('password is required')
    .isString().withMessage('password must be a string')
    .isLength({ min: 8 }).withMessage('password must be at least 8 characters'),
  body('firstName')
    .notEmpty().withMessage('firstName is required')
    .isString().isLength({ min: 1, max: 100 }).withMessage('firstName must be 1-100 characters'),
  body('lastName')
    .notEmpty().withMessage('lastName is required')
    .isString().isLength({ min: 1, max: 100 }).withMessage('lastName must be 1-100 characters'),
  body('role')
    .optional()
    .isIn(['ADMIN', 'MANAGER']).withMessage('role must be ADMIN or MANAGER'),
];

/**
 * Validates email + password credentials for the admin/manager login endpoint.
 * Only ADMIN and MANAGER accounts can authenticate through this path.
 */
export const adminLoginValidation = [
  body('email')
    .notEmpty().withMessage('email is required')
    .isEmail().withMessage('email must be a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('password is required')
    .isString().withMessage('password must be a string'),
];
