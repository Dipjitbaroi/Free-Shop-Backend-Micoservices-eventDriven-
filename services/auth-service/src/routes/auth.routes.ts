import { Router } from 'express';
import { validate, authenticate, authorize } from '@freeshop/shared-middleware';
import * as authController from '../controllers/auth.controller';
import { firebaseLoginValidation, adminLoginValidation, adminCreateValidation } from '../validators/auth.validators';
import { query } from 'express-validator';

const router = Router();

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
  authorize('ADMIN', 'MANAGER'),
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

// ── Admin / Manager login (email + password — no Firebase) ────────────────────
// These paths are intentionally isolated so the API gateway can restrict them
// to internal / admin-panel traffic only.
router.post('/admin/login', validate(adminLoginValidation), authController.adminLogin);

// ── Admin / Manager account creation (requires ADMIN_SECRET_KEY) ─────────────
router.post('/admin/create', validate(adminCreateValidation), authController.createAdminAccount);

export default router;

