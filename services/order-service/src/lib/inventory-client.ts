import { BadRequestError } from '@freeshop/shared-utils';
import config from '../config/index.js';

export interface InventoryCheckItem {
  productId: string;
  quantity: number;
  variantId?: string;
  freeItemId?: string;
}

export interface InventoryAvailabilityResult {
  available: boolean;
  unavailableItems: Array<{
    productId: string;
    requested: number;
    available: number;
    variantId?: string;
    freeItemId?: string;
  }>;
}

function buildInventoryKey(item: InventoryCheckItem): string {
  if (item.freeItemId) {
    // Standalone free items use "free:freeItemId" format
    return `free:${item.freeItemId}`;
  }

  if (item.variantId) {
    return `${item.productId}:${item.variantId}`;
  }

  return item.productId;
}

/**
 * Pre-flight inventory availability check.
 * This calls the inventory service before the order is created.
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
        productId: buildInventoryKey(item),
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