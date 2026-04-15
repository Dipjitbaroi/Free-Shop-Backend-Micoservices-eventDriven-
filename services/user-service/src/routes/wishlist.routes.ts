import { Router } from 'express';
import { wishlistController } from '../controllers/wishlist.controller';
import { authenticate } from '@freeshop/shared-middleware';
import { validate } from '@freeshop/shared-middleware';
import { body, param, query } from 'express-validator';

const router: Router = Router();

// All routes require authentication
router.use(authenticate);

// Wishlist routes
router.get(
  '/',
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  validate,
  wishlistController.getWishlist
);

router.post(
  '/',
  body('productId').isUUID().withMessage('Valid product ID is required'),
  validate,
  wishlistController.addToWishlist
);

router.delete(
  '/:productId',
  param('productId').isUUID().withMessage('Valid product ID is required'),
  validate,
  wishlistController.removeFromWishlist
);

router.get(
  '/check/:productId',
  param('productId').isUUID().withMessage('Valid product ID is required'),
  validate,
  wishlistController.checkInWishlist
);

router.delete('/', wishlistController.clearWishlist);

// Recently viewed routes
router.get(
  '/recently-viewed',
  query('limit').optional().isInt({ min: 1, max: 50 }),
  validate,
  wishlistController.getRecentlyViewed
);

router.post(
  '/recently-viewed',
  body('productId').isUUID().withMessage('Valid product ID is required'),
  validate,
  wishlistController.addRecentlyViewed
);

router.delete('/recently-viewed', wishlistController.clearRecentlyViewed);

export default router;
