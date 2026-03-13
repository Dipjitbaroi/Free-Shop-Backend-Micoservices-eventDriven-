import { InventoryActionType } from './enums';

export interface IInventory {
  id: string;
  productId: string;
  sellerId: string;
  sku: string;
  totalStock: number;
  availableStock: number;
  reservedStock: number;
  lowStockThreshold: number;
  isLowStock: boolean;
  lastRestockedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInventoryUpdate {
  totalStock?: number;
  lowStockThreshold?: number;
}

export interface IInventoryHistory {
  id: string;
  inventoryId: string;
  productId: string;
  sellerId: string;
  action: InventoryActionType;
  quantity: number;
  previousStock: number;
  newStock: number;
  orderId?: string;
  reason?: string;
  performedBy?: string;
  createdAt: Date;
}

export interface IStockReservation {
  id: string;
  inventoryId: string;
  productId: string;
  orderId: string;
  quantity: number;
  status: 'RESERVED' | 'CONFIRMED' | 'RELEASED' | 'EXPIRED';
  expiresAt: Date;
  confirmedAt?: Date;
  releasedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStockReservationRequest {
  productId: string;
  orderId: string;
  quantity: number;
  expirationMinutes?: number;
}

export interface IBulkStockUpdate {
  productId: string;
  quantity: number;
  action: 'ADD' | 'SUBTRACT' | 'SET';
  reason?: string;
}

export interface IInventoryFilter {
  sellerId?: string;
  isLowStock?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface IInventoryAlert {
  id: string;
  inventoryId: string;
  productId: string;
  sellerId: string;
  alertType: 'LOW_STOCK' | 'OUT_OF_STOCK' | 'OVERSTOCK';
  currentStock: number;
  threshold: number;
  isAcknowledged: boolean;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
  createdAt: Date;
}
