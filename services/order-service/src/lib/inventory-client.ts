import { BadRequestError } from '@freeshop/shared-utils';
import config from '../config/index.js';

export interface InventoryCheckItem {
  productId?: string;
  quantity: number;
  variantId?: string;
  freeItemId?: string;
}

export interface InventoryAvailabilityResult {
  available: boolean;
  unavailableItems: Array<{
    productId?: string;
    requested: number;
    available: number;
    variantId?: string;
    freeItemId?: string;
  }>;
}

/**
 * Optimized internal availability check using service-to-service auth.
 * Calls individual optimized endpoints per item (not batch).
 * Each endpoint returns only availableStock (no full inventory load).
 * This is the preferred method for order service.
 */
export async function checkInventoryAvailabilityInternal(
  items: InventoryCheckItem[]
): Promise<InventoryAvailabilityResult> {
  if (!config.inventoryServiceUrl) {
    throw new BadRequestError('Inventory service URL not configured');
  }

  const serviceToken = process.env.SERVICE_AUTH_TOKEN;
  if (!serviceToken) {
    // Fallback to public API if service token not available
    return checkInventoryAvailability(items);
  }

  const unavailableItems: Array<{
    productId?: string;
    requested: number;
    available: number;
    variantId?: string;
    freeItemId?: string;
  }> = [];

  // Check each item individually using optimized endpoints
  const results = await Promise.all(
    items.map(async (item) => {
      try {
        if (!item.productId && !item.freeItemId) {
          return {
            item,
            available: 0,
            isAvailable: false,
          };
        }

        const endpoint = item.freeItemId
          ? `/internal/free-item/${item.freeItemId}/availability`
          : `/internal/product/${item.productId}/availability`;

        const url = `${config.inventoryServiceUrl}${endpoint}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${serviceToken}`,
          },
        });

        if (!response.ok) {
          return {
            item,
            available: 0,
            isAvailable: false,
          };
        }

        const body = await response.json();
        const data = body?.data ?? body;
        const availableStock = data?.availableStock ?? 0;

        return {
          item,
          available: availableStock,
          isAvailable: availableStock >= item.quantity,
        };
      } catch {
        return {
          item,
          available: 0,
          isAvailable: false,
        };
      }
    })
  );

  // Collect unavailable items
  for (const result of results) {
    if (!result.isAvailable) {
      unavailableItems.push({
        productId: result.item.productId,
        freeItemId: result.item.freeItemId,
        requested: result.item.quantity,
        available: result.available,
        variantId: result.item.variantId,
      });
    }
  }

  return {
    available: unavailableItems.length === 0,
    unavailableItems,
  };
}

/**
 * Pre-flight inventory availability check.
 * This calls the inventory service before the order is created.
 * Sends actual IDs directly without any prefix encoding.
 */
export async function checkInventoryAvailability(
  items: InventoryCheckItem[]
): Promise<InventoryAvailabilityResult> {
  if (!config.inventoryServiceUrl) {
    throw new BadRequestError('Inventory service URL not configured');
  }

  const url = `${config.inventoryServiceUrl}/api/inventory/check-availability`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items: items.map((item) => ({
        productId: item.productId,
        freeItemId: item.freeItemId,
        variantId: item.variantId,
        quantity: item.quantity,
      })),
    }),
  });

  if (!response.ok) {
    throw new BadRequestError(`Inventory service returned HTTP ${response.status}`);
  }

  const body = await response.json();
  const data = body?.data ?? body;

  return {
    available: Boolean(data?.available),
    unavailableItems: Array.isArray(data?.unavailableItems) ? data.unavailableItems : [],
  };
}