import { Router } from 'express';
import { cartController } from '../controllers/cart.controller';
import { authenticate, guestOrAuth } from '@freeshop/shared-middleware';
import { validate } from '@freeshop/shared-middleware';
import { body, param, query } from 'express-validator';

const router = Router();

// Cart can be used by authenticated users or guests
router.get('/', guestOrAuth, cartController.getCart);
router.get('/summary', guestOrAuth, cartController.getCartSummary);

router.post(
  '/',
  guestOrAuth,
  body('productId').isUUID().withMessage('Valid product ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  validate,
  cartController.addToCart
);

router.patch(
  '/:productId',
  guestOrAuth,
  param('productId').isUUID().withMessage('Valid product ID is required'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be 0 or more'),
  validate,
  cartController.updateCartItem
);

router.delete(
  '/:productId',
  guestOrAuth,
  param('productId').isUUID().withMessage('Valid product ID is required'),
  validate,
  cartController.removeFromCart
);

router.delete('/', guestOrAuth, cartController.clearCart);

// Merge guest cart - requires authentication
router.post(
  '/merge',
  authenticate,
  body('guestId').isString().notEmpty().withMessage('Guest ID is required'),
  validate,
  cartController.mergeCart
);

export default router;
