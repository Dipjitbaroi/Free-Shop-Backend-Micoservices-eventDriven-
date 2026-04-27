import { Router } from 'express';
import { validate, authenticate, authorizePermission } from '@freeshop/shared-middleware';
import { PERMISSION_CODES } from '@freeshop/shared-types';
import * as authController from '../controllers/auth.controller.js';
import { firebaseLoginValidation, adminLoginValidation, adminCreateValidation, changePasswordValidation } from '../validators/auth.validators.js';
import { query, param, body } from 'express-validator';

const router: Router = Router();

// ── Public routes ─────────────────────────────────────────────────────────────

/**
 * POST /auth/firebase
 * Exchange a Firebase ID token (obtained from the client after signing in
 * with Google, Facebook, email/password, etc.) for the app's JWT pair.
 */
router.post('/firebase', validate(firebaseLoginValidation), authController.firebaseLogin);

// Token management
router.post('/refresh', authController.refreshToken);
router.get('/verify', authController.verifyToken);
router.post('/guest', authController.guestToken);

// ── Protected routes ──────────────────────────────────────────────────────────
router.post('/logout', authenticate, authController.logout);
router.post('/logout-all', authenticate, authController.logoutAll);
router.get('/me', authenticate, authController.me);

// ── Admin: list all users ─────────────────────────────────────────────────────
router.get(
  '/users',
  authenticate,
  authorizePermission(PERMISSION_CODES.ADMIN_PANEL_ACCESS),
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('role').optional().isIn(['CUSTOMER', 'Vendor', 'MANAGER', 'ADMIN']),
    query('status').optional().isIn(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION']),
    query('search').optional().isString().trim(),
  ],
  validate,
  authController.getUsers
);

// ── Admin: update user ────────────────────────────────────────────────────────
router.patch(
  '/users/:userId',
  authenticate,
  authorizePermission(PERMISSION_CODES.USER_MANAGEMENT_UPDATE),
  [
    param('userId').isUUID().withMessage('Invalid user ID'),
    body('firstName').optional().isString().trim().notEmpty().withMessage('firstName must be a non-empty string'),
    body('lastName').optional().isString().trim().notEmpty().withMessage('lastName must be a non-empty string'),
    body('phone').optional().isString().trim().withMessage('phone must be a string'),
    body('avatar').optional().isString().trim().isURL().withMessage('avatar must be a valid URL'),
    body('status').optional().isIn(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION']).withMessage('Invalid status'),
  ],
  validate,
  authController.updateUser
);

// ── Admin: delete user ────────────────────────────────────────────────────────
router.delete(
  '/users/:userId',
  authenticate,
  authorizePermission(PERMISSION_CODES.USER_MANAGEMENT_DELETE),
  [
    param('userId').isUUID().withMessage('Invalid user ID'),
  ],
  validate,
  authController.deleteUser
);

// ── Admin / Manager login (email + password — no Firebase) ────────────────────
// These paths are intentionally isolated so the API gateway can restrict them
// to internal / admin-panel traffic only.
router.post('/admin/login', validate(adminLoginValidation), authController.adminLogin);

// ── Admin / Manager account creation (requires ADMIN_SECRET_KEY) ─────────────
router.post('/admin/create', validate(adminCreateValidation), authController.createAdminAccount);

// ── Developer: change any user's password (requires ADMIN_SECRET_KEY) ────────
router.post('/dev/change-password', validate(changePasswordValidation), authController.changePassword);

export default router;

