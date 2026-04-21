import { Prisma } from '../../generated/client/client.js';
import { BadRequestError, NotFoundError } from '@freeshop/shared-utils';
import { prisma } from '../lib/prisma.js';
import { cacheGet, cacheSet, cacheDelete, cartCacheKey } from '../lib/redis.js';
import config from '../config/index.js';
import { settingsService } from './settings.service.js';
import { fetchProduct } from '../lib/product-client.js';

type CartWithItems = Prisma.CartGetPayload<{
  include: { items: true };
}>;

interface EnrichedCartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  productName?: string;
  productImage?: string;
  freeItems: Array<{
    id: string;
    name: string;
    sku?: string;
    image?: string;
  }>;
  
}

interface EnrichedCart extends Omit<CartWithItems, 'items'> {
  items: EnrichedCartItem[];
}

interface AddToCartData {
  productId: string;
  quantity: number;
  freeItemIds?: string[];
  price: number;
}

class CartService {
  async getCart(userId?: string, guestId?: string): Promise<EnrichedCart | null> {
    const identifier = userId || guestId;
    if (!identifier) return null;

    const cached = await cacheGet<EnrichedCart>(cartCacheKey(identifier));
    if (cached && this.isCurrentCartCacheShape(cached)) {
      return cached;
    }

    const where = userId ? { userId } : { guestId };
    const cart = await prisma.cart.findFirst({
      where,
      include: { items: { orderBy: { createdAt: 'asc' } } },
    });

    if (!cart) return null;

    // Enrich items with product data
    const enrichedItems: EnrichedCartItem[] = await Promise.all(
      cart.items.map(async (item) => {
        try {
          const product = await fetchProduct(item.productId);
          return {
            id: item.id,
            cartId: item.cartId,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            productName: product.name,
            productImage: product.images?.[0],
            freeItems: product.freeItems || [],
          };
        } catch (error) {
          // If product fetch fails, return item without product data
          console.warn(`Failed to fetch product ${item.productId} for cart:`, error);
          return {
            id: item.id,
            cartId: item.cartId,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            freeItems: [],
          };
        }
      })
    );

    const enrichedCart: EnrichedCart = {
      ...cart,
      items: enrichedItems,
    };

    await cacheSet(cartCacheKey(identifier), enrichedCart, config.cache.cartTTL);

    return enrichedCart;
  }

  private isCurrentCartCacheShape(cart: EnrichedCart): boolean {
    if (!Array.isArray(cart.items)) return false;

    return cart.items.every((item) => {
      const hasLegacyProductObject = Object.prototype.hasOwnProperty.call(item, 'product');
      const hasFreeItemsField = Object.prototype.hasOwnProperty.call(item, 'freeItems');

      return !hasLegacyProductObject && hasFreeItemsField;
    });
  }

  async getOrCreateCart(userId?: string, guestId?: string): Promise<EnrichedCart> {
    if (!userId && !guestId) {
      throw new BadRequestError('User ID or Guest ID is required');
    }

    let cart = await this.getCart(userId, guestId);

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
          guestId,
          expiresAt: guestId 
            ? new Date(Date.now() + config.order.guestCartExpiryHours * 60 * 60 * 1000)
            : undefined,
        },
        include: { items: true },
      }) as EnrichedCart;
      // Since it's a new cart, items will be empty, so no need to enrich
    }

    return cart;
  }

  async addToCart(userId: string | undefined, guestId: string | undefined, data: AddToCartData): Promise<EnrichedCart> {
    const cart = await this.getOrCreateCart(userId, guestId);

    // Check if product already in cart
    const existingItem = cart.items.find(item => item.productId === data.productId);

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { 
          quantity: existingItem.quantity + data.quantity,
          price: data.price,
          freeItemIds: data && (data as any).freeItemIds
            ? ((data as any).freeItemIds as string[]).slice(0, 1)
            : (Array.isArray((existingItem as any).freeItemIds) ? (existingItem as any).freeItemIds : ((existingItem as any).freeItemId ? [(existingItem as any).freeItemId] : undefined)),
        },
      });
    } else {
      // Add new item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: data.productId,
          quantity: data.quantity,
          price: data.price,
          freeItemIds: data && (data as any).freeItemIds ? ((data as any).freeItemIds as string[]).slice(0,1) : undefined,
        },
      });
    }

    await this.invalidateCache(userId, guestId);
    return this.getCartOrThrow(userId, guestId);
  }

  async updateCartItem(
    userId: string | undefined, 
    guestId: string | undefined, 
    productId: string, 
    quantity: number
  ): Promise<EnrichedCart> {
    const cart = await this.getCart(userId, guestId);
    if (!cart) {
      throw new NotFoundError('Cart not found');
    }

    const item = cart.items.find(i => i.productId === productId);
    if (!item) {
      throw new NotFoundError('Item not found in cart');
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: item.id } });
    } else {
      await prisma.cartItem.update({
        where: { id: item.id },
        data: { quantity },
      });
    }

    await this.invalidateCache(userId, guestId);
    return this.getCartOrThrow(userId, guestId);
  }

  async removeFromCart(
    userId: string | undefined, 
    guestId: string | undefined, 
    productId: string
  ): Promise<EnrichedCart> {
    const cart = await this.getCart(userId, guestId);
    if (!cart) {
      throw new NotFoundError('Cart not found');
    }

    const item = cart.items.find(i => i.productId === productId);
    if (!item) {
      throw new NotFoundError('Item not found in cart');
    }

    await prisma.cartItem.delete({ where: { id: item.id } });

    await this.invalidateCache(userId, guestId);
    return this.getCartOrThrow(userId, guestId);
  }

  async clearCart(userId?: string, guestId?: string): Promise<void> {
    const cart = await this.getCart(userId, guestId);
    if (!cart) return;

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    await this.invalidateCache(userId, guestId);
  }

  async mergeGuestCart(userId: string, guestId: string): Promise<EnrichedCart | null> {
    const guestCart = await this.getCart(undefined, guestId);
    if (!guestCart || guestCart.items.length === 0) return null;

    const userCart = await this.getOrCreateCart(userId, undefined);

    // Merge items
    for (const guestItem of guestCart.items) {
      const existingItem = userCart.items.find(i => i.productId === guestItem.productId);
      
      if (existingItem) {
        // Update quantity (add guest quantity to existing)
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + guestItem.quantity },
        });
      } else {
        // Move item to user cart
        await prisma.cartItem.create({
          data: {
            cartId: userCart.id,
            productId: guestItem.productId,
            quantity: guestItem.quantity,
            price: guestItem.price,
          },
        });
      }
    }

    // Delete guest cart
    await prisma.cart.delete({ where: { id: guestCart.id } });

    await this.invalidateCache(userId, undefined);
    await this.invalidateCache(undefined, guestId);

    return this.getCart(userId, undefined);
  }

  /**
   * Get cart summary with delivery charge by zone.
   * @param userId
   * @param guestId
   * @param shippingZone (optional) - zone key to use for delivery charge
   */
  async getCartSummary(userId?: string, guestId?: string, shippingZone?: string): Promise<{
    itemCount: number;
    subtotal: number;
    shippingFee: number;
    total: number;
  }> {
    const cart = await this.getCart(userId, guestId);
    if (!cart || cart.items.length === 0) {
      return { itemCount: 0, subtotal: 0, shippingFee: 0, total: 0 };
    }

    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Get deliveryCharges from settings
    let deliveryCharges: Record<string, number> = {};
    try {
      const charges = await settingsService.get('deliveryCharges');
      if (charges && typeof charges === 'object') {
        deliveryCharges = charges;
      }
    } catch {}

    // Determine shipping fee by zone
    let shippingFee = 0;
    if (shippingZone && deliveryCharges[shippingZone] !== undefined) {
      shippingFee = deliveryCharges[shippingZone];
    } else if (deliveryCharges['default'] !== undefined) {
      shippingFee = deliveryCharges['default'];
    } else {
      // fallback to 0 if no deliveryCharges set
      shippingFee = 0;
    }

    return {
      itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      shippingFee,
      total: subtotal + shippingFee,
    };
  }

  private async getCartOrThrow(userId?: string, guestId?: string): Promise<EnrichedCart> {
    const cart = await this.getCart(userId, guestId);
    if (!cart) throw new NotFoundError('Cart not found');
    return cart;
  }

  private async invalidateCache(userId?: string, guestId?: string): Promise<void> {
    if (userId) await cacheDelete(cartCacheKey(userId));
    if (guestId) await cacheDelete(cartCacheKey(guestId));
  }
}

export const cartService = new CartService();
