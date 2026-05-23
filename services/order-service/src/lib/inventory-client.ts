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