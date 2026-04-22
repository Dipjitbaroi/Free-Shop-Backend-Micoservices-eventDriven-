import { Prisma } from '../../generated/client/client.js';
import { BadRequestError, NotFoundError } from '@freeshop/shared-utils';
import { prisma } from '../lib/prisma.js';
import { cacheGet, cacheSet, cacheDelete, cartCacheKey } from '../lib/redis.js';
import config from '../config/index.js';
import { settingsService } from './settings.service.js';
import { fetchProduct, resolveEffectivePrice } from '../lib/product-client.js';

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
  freeItems?: Array<{ id: string; name: string; sku?: string; image?: string }>;
}

interface EnrichedCart extends Omit<CartWithItems, 'items'> {
  items: EnrichedCartItem[];
}

interface AddToCartData {
  productId: string;
  quantity: number;
  freeItemIds?: string[];
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
    const itemFreeItems = await this.loadCartItemFreeItems(cart.items.map((item) => item.id));
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
            freeItems: itemFreeItems.get(item.id) || [],
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
            freeItems: itemFreeItems.get(item.id) || [],
          };
        }
      })
    );

    const enrichedCart: EnrichedCart = {
      id: cart.id,
      userId: cart.userId,
      guestId: cart.guestId,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
      expiresAt: cart.expiresAt,
      items: enrichedItems,
    };

    await cacheSet(cartCacheKey(identifier), enrichedCart, config.cache.cartTTL);

    return enrichedCart;
  }

  private isCurrentCartCacheShape(cart: EnrichedCart): boolean {
    if (!Array.isArray(cart.items)) return false;

    return cart.items.every((item) => {
      const hasLegacyProductObject = Object.prototype.hasOwnProperty.call(item, 'product');
      return !hasLegacyProductObject;
    });
  }

  async getOrCreateCart(userId?: string, guestId?: string): Promise<EnrichedCart> {
    if (!userId && !guestId) {
      throw new BadRequestError('User ID or Guest ID is required');
    }

    let cart = await this.getCart(userId, guestId);

    if (!cart) {
      const newCart = await prisma.cart.create({
        data: {
          userId,
          guestId,
          expiresAt: guestId 
            ? new Date(Date.now() + config.order.guestCartExpiryHours * 60 * 60 * 1000)
            : undefined,
        },
        include: { items: true },
      });

      // Build EnrichedCart explicitly (items will be empty)
      cart = {
        id: newCart.id,
        userId: newCart.userId,
        guestId: newCart.guestId,
        createdAt: newCart.createdAt,
        updatedAt: newCart.updatedAt,
        expiresAt: newCart.expiresAt,
        items: [],
      };
    }

    return cart;
  }

  async addToCart(userId: string | undefined, guestId: string | undefined, data: AddToCartData): Promise<EnrichedCart> {
    const cart = await this.getOrCreateCart(userId, guestId);

    // Resolve authoritative product and price server-side
    const product = await fetchProduct(data.productId);
    if (product.status !== 'ACTIVE') {
      throw new BadRequestError(`Product is not available for purchase (status: ${product.status})`);
    }
    if (product.stock < data.quantity) {
      throw new BadRequestError(`Insufficient stock. Available: ${product.stock}`);
    }
    const price = resolveEffectivePrice(product);
    const selectedFreeItems = this.resolveSelectedFreeItems(product.freeItems || [], data.freeItemIds);

    // Check if product already in cart
    const existingItem = cart.items.find(item => item.productId === data.productId);

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { 
          quantity: existingItem.quantity + data.quantity,
          price,
        },
      });

      if (data.freeItemIds !== undefined) {
        await this.replaceCartItemFreeItems(existingItem.id, selectedFreeItems);
      }
    } else {
      // Add new item
      const createdItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: data.productId,
          quantity: data.quantity,
          price,
        },
      });

      if (selectedFreeItems.length > 0) {
        await this.replaceCartItemFreeItems(createdItem.id, selectedFreeItems);
      }
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

        if (guestItem.freeItems && guestItem.freeItems.length > 0) {
          await this.replaceCartItemFreeItems(existingItem.id, guestItem.freeItems);
        }
      } else {
        // Move item to user cart
        const createdItem = await prisma.cartItem.create({
          data: {
            cartId: userCart.id,
            productId: guestItem.productId,
            quantity: guestItem.quantity,
            price: guestItem.price,
          },
        });

        if (guestItem.freeItems && guestItem.freeItems.length > 0) {
          await this.replaceCartItemFreeItems(createdItem.id, guestItem.freeItems);
        }
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

  private resolveSelectedFreeItems(
    available: Array<{ id: string; name: string; sku?: string; image?: string }>,
    selectedIds?: string[]
  ): Array<{ id: string; name: string; sku?: string; image?: string }> {
    if (!selectedIds || selectedIds.length === 0) {
      return [];
    }

    if (selectedIds.length > 1) {
      throw new BadRequestError('Only one free item is allowed for now');
    }

    const selected = available.filter((item) => selectedIds.includes(item.id));
    if (selected.length !== selectedIds.length) {
      throw new BadRequestError('Invalid free item selection');
    }

    return selected;
  }

  private async loadCartItemFreeItems(cartItemIds: string[]): Promise<Map<string, Array<{ id: string; name: string; sku?: string; image?: string }>>> {
    const result = new Map<string, Array<{ id: string; name: string; sku?: string; image?: string }>>();
    if (cartItemIds.length === 0) return result;

    const rows = await prisma.$queryRaw<Array<{
      cartItemId: string;
      freeItemId: string;
      freeItemName: string;
      sku: string | null;
      image: string | null;
    }>>`
      SELECT
        "cartItemId",
        "freeItemId",
        "freeItemName",
        "sku",
        "image"
      FROM "CartItemFreeItem"
      WHERE "cartItemId" IN (${Prisma.join(cartItemIds)})
      ORDER BY "assignedAt" ASC
    `;

    for (const row of rows) {
      const items = result.get(row.cartItemId) || [];
      items.push({
        id: row.freeItemId,
        name: row.freeItemName,
        sku: row.sku ?? undefined,
        image: row.image ?? undefined,
      });
      result.set(row.cartItemId, items);
    }

    return result;
  }

  private async replaceCartItemFreeItems(
    cartItemId: string,
    freeItems: Array<{ id: string; name: string; sku?: string; image?: string }>
  ): Promise<void> {
    await prisma.$executeRaw`
      DELETE FROM "CartItemFreeItem"
      WHERE "cartItemId" = ${cartItemId}
    `;

    if (freeItems.length === 0) return;

    await Promise.all(
      freeItems.map((item) =>
        prisma.$executeRaw`
          INSERT INTO "CartItemFreeItem" ("id", "cartItemId", "freeItemId", "freeItemName", "sku", "image", "assignedAt")
          VALUES (${`${cartItemId}:${item.id}`}, ${cartItemId}, ${item.id}, ${item.name}, ${item.sku ?? null}, ${item.image ?? null}, NOW())
          ON CONFLICT ("cartItemId", "freeItemId") DO NOTHING
        `
      )
    );
  }
}

export const cartService = new CartService();
