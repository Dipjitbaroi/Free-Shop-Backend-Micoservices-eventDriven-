import { messageBroker } from '../lib/message-broker.js';
import { Events, Queues, IOrderCreatedEvent, IOrderCancelledEvent, IVendorApprovedEvent, IInventoryUpdatedPayload } from '@freeshop/shared-events';
import { prisma } from '../lib/prisma.js';
import { ProductStatus } from '../../generated/client/client.js';
import { createServiceLogger } from '@freeshop/shared-utils';
import { cacheDelete, productCacheKey, productSlugCacheKey } from '../lib/redis.js';

const logger = createServiceLogger('product-service');

export async function setupEventSubscribers(): Promise<void> {
  await messageBroker.subscribe<IInventoryUpdatedPayload>(
    Queues.PRODUCT_EVENTS,
    Events.INVENTORY_UPDATED,
    async (event) => {
      logger.info('Product service received inventory update event', {
        productId: event.productId,
        freeItemId: event.freeItemId,
        action: event.action,
      });

      // Free-item inventory rows have no associated product — the inventory
      // service publishes `productId: null` for them. Product-status sync is
      // only meaningful for product/variant rows, so skip the rest of the
      // handler in that case. (The inventory service is the source of truth
      // for free-item stock.)
      if (event.productId === null || event.productId === undefined) {
        return;
      }

      const product = await prisma.product.findUnique({ where: { id: event.productId } });

      if (!product) {
        logger.warn('Inventory update received for missing product', { productId: event.productId });
        return;
      }

      const shouldAutoSyncStatus = product.status === ProductStatus.ACTIVE || product.status === ProductStatus.OUT_OF_STOCK;
      const nextStatus = shouldAutoSyncStatus
        ? (event.isOutOfStock || event.newStock <= 0 ? ProductStatus.OUT_OF_STOCK : ProductStatus.ACTIVE)
        : product.status;

      const updatedProduct = await prisma.product.update({
        where: { id: event.productId },
        data: {
          status: nextStatus,
        },
      });

      await Promise.all([
        cacheDelete(productCacheKey(updatedProduct.id)),
        cacheDelete(productSlugCacheKey(product.slug)),
      ]);
    }
  );

  // Subscribe to order created events to potentially track product sales
  await messageBroker.subscribe<IOrderCreatedEvent>(
    Queues.PRODUCT_EVENTS,
    Events.ORDER_CREATED,
    async (event) => {
      logger.info('Product service received order created event', { orderId: event.orderId });
      
      // Update product sold counts if needed
      for (const item of event.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            totalSold: { increment: item.quantity },
          },
        }).catch(err => {
          logger.error('Failed to update product sold count', { 
            productId: item.productId, 
            error: err.message 
          });
        });
      }
    }
  );

  // Subscribe to order cancelled events to decrement sold count
  await messageBroker.subscribe<IOrderCancelledEvent>(
    Queues.PRODUCT_EVENTS,
    Events.ORDER_CANCELLED,
    async (event) => {
      logger.info('Product service received order cancelled event', { orderId: event.orderId });
      
      // Revert product sold counts
      for (const item of event.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            totalSold: { decrement: item.quantity },
          },
        }).catch(err => {
          logger.error('Failed to revert product sold count', { 
            productId: item.productId, 
            error: err.message 
          });
        });
      }
    }
  );

  // Subscribe to Vendor approved events
  await messageBroker.subscribe<IVendorApprovedEvent>(
    Queues.PRODUCT_EVENTS,
    Events.VENDOR_APPROVED,
    async (event) => {
      logger.info('Product service received vendor approved event', { vendorId: event.vendorId });
      
      // Auto-approve pending products from verified Vendors (optional behavior)
      // This is a business logic decision - uncomment if needed
      /*
      await prisma.product.updateMany({
        where: { 
          vendorId: event.vendorId,
          status: 'PENDING',
        },
        data: {
          status: 'APPROVED',
        },
      });
      */
    }
  );

  logger.info('Product service event subscribers initialized');
}

