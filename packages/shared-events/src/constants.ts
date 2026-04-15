// Event Names
export const Events = {
  // User Events
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',
  USER_VERIFIED: 'user.verified',
  USER_PASSWORD_CHANGED: 'user.password_changed',
  USER_LOGIN: 'user.login',
  USER_LOGOUT: 'user.logout',

  // Product Events
  PRODUCT_CREATED: 'product.created',
  PRODUCT_UPDATED: 'product.updated',
  PRODUCT_DELETED: 'product.deleted',
  PRODUCT_STATUS_CHANGED: 'product.status_changed',
  PRODUCT_APPROVED: 'product.approved',
  PRODUCT_REJECTED: 'product.rejected',
  PRODUCT_FEATURED: 'product.featured',

  // Order Events
  ORDER_CREATED: 'order.created',
  ORDER_CONFIRMED: 'order.confirmed',
  ORDER_PROCESSING: 'order.processing',
  ORDER_SHIPPED: 'order.shipped',
  ORDER_DELIVERED: 'order.delivered',
  ORDER_CANCELLED: 'order.cancelled',
  ORDER_REFUNDED: 'order.refunded',
  ORDER_STATUS_CHANGED: 'order.status_changed',

  // Payment Events
  PAYMENT_INITIATED: 'payment.initiated',
  PAYMENT_COMPLETED: 'payment.completed',
  PAYMENT_RECEIVED: 'payment.received',
  PAYMENT_FAILED: 'payment.failed',
  PAYMENT_REFUNDED: 'payment.refunded',
  PAYMENT_WEBHOOK_RECEIVED: 'payment.webhook_received',

  // Inventory Events
  INVENTORY_UPDATED: 'inventory.updated',
  INVENTORY_LOW_STOCK: 'inventory.low_stock',
  INVENTORY_LOW: 'inventory.low',
  INVENTORY_OUT_OF_STOCK: 'inventory.out_of_stock',
  INVENTORY_RESERVED: 'inventory.reserved',
  INVENTORY_RELEASED: 'inventory.released',
  STOCK_RESERVED: 'stock.reserved',
  STOCK_RELEASED: 'stock.released',
  STOCK_CONFIRMED: 'stock.confirmed',

  // Vendor Events
  VENDOR_CREATED: 'vendor.created',
  VENDOR_UPDATED: 'vendor.updated',
  VENDOR_APPROVED: 'vendor.approved',
  VENDOR_REJECTED: 'vendor.rejected',
  VENDOR_SUSPENDED: 'vendor.suspended',
  WITHDRAWAL_REQUESTED: 'withdrawal.requested',
  WITHDRAWAL_PROCESSED: 'withdrawal.processed',

  // Notification Events
  NOTIFICATION_REQUESTED: 'notification.requested',
  EMAIL_REQUESTED: 'email.requested',
  SMS_REQUESTED: 'sms.requested',
  PUSH_REQUESTED: 'push.requested',

  // Cart Events
  CART_UPDATED: 'cart.updated',
  CART_CLEARED: 'cart.cleared',
  CART_ABANDONED: 'cart.abandoned',

  // Review Events
  REVIEW_CREATED: 'review.created',
  REVIEW_APPROVED: 'review.approved',
  REVIEW_REJECTED: 'review.rejected',

  // Analytics Events
  ANALYTICS_EVENT: 'analytics.event',
  PAGE_VIEW: 'analytics.page_view',
  SEARCH_PERFORMED: 'analytics.search',
  PRODUCT_VIEWED: 'analytics.product_viewed',
} as const;

// Exchange Names
export const Exchanges = {
  USER: 'freeshop.user',
  PRODUCT: 'freeshop.product',
  ORDER: 'freeshop.order',
  PAYMENT: 'freeshop.payment',
  INVENTORY: 'freeshop.inventory',
  VENDOR: 'freeshop.vendor',
  NOTIFICATION: 'freeshop.notification',
  ANALYTICS: 'freeshop.analytics',
  DEAD_LETTER: 'freeshop.dead_letter',
} as const;

// Queue Names
export const Queues = {
  // User Service Queues
  USER_SERVICE: 'user.service',
  USER_EVENTS: 'user.events',
  
  // Product Service Queues
  PRODUCT_SERVICE: 'product.service',
  PRODUCT_EVENTS: 'product.events',
  PRODUCT_INDEXING: 'product.indexing',
  
  // Order Service Queues
  ORDER_SERVICE: 'order.service',
  ORDER_EVENTS: 'order.events',
  ORDER_PROCESSING: 'order.processing',
  
  // Payment Service Queues
  PAYMENT_SERVICE: 'payment.service',
  PAYMENT_EVENTS: 'payment.events',
  PAYMENT_WEBHOOK: 'payment.webhook',
  PAYMENT_RETRY: 'payment.retry',
  
  // Inventory Service Queues
  INVENTORY_SERVICE: 'inventory.service',
  STOCK_UPDATES: 'inventory.stock_updates',
  
  // Vendor Service Queues
  VENDOR_SERVICE: 'vendor.service',
  
  // Notification Service Queues
  NOTIFICATION_EMAIL: 'notification.email',
  NOTIFICATION_SMS: 'notification.sms',
  NOTIFICATION_PUSH: 'notification.push',
  NOTIFICATION_RETRY: 'notification.retry',
  NOTIFICATION_USER_CREATED: 'notification.user_created',
  NOTIFICATION_ORDER_CREATED: 'notification.order_created',
  NOTIFICATION_ORDER_SHIPPED: 'notification.order_shipped',
  NOTIFICATION_ORDER_DELIVERED: 'notification.order_delivered',
  NOTIFICATION_PAYMENT_RECEIVED: 'notification.payment_received',
  NOTIFICATION_PAYMENT_FAILED: 'notification.payment_failed',
  NOTIFICATION_VENDOR_VERIFIED: 'notification.vendor_verified',
  NOTIFICATION_WITHDRAWAL_COMPLETED: 'notification.withdrawal_completed',
  NOTIFICATION_LOW_STOCK: 'notification.low_stock',
  
  // Vendor Service Cross-Domain Queues
  VENDOR_ORDER_COMPLETED: 'vendor.order_completed',
  VENDOR_ORDER_CANCELLED: 'vendor.order_cancelled',
  VENDOR_PAYMENT_COMPLETED: 'vendor.payment_completed',
  VENDOR_PRODUCT_CREATED: 'vendor.product_created',
  VENDOR_PRODUCT_DELETED: 'vendor.product_deleted',
  
  // Inventory Service Cross-Domain Queues
  INVENTORY_ORDER_CREATED: 'inventory.order_created',
  INVENTORY_ORDER_CANCELLED: 'inventory.order_cancelled',
  INVENTORY_ORDER_COMPLETED: 'inventory.order_completed',
  INVENTORY_PAYMENT_REFUNDED: 'inventory.payment_refunded',
  
  // Analytics Service Queues
  ANALYTICS_EVENTS: 'analytics.events',
  ANALYTICS_ORDER_CREATED: 'analytics.order_created',
  ANALYTICS_ORDER_COMPLETED: 'analytics.order_completed',
  ANALYTICS_ORDER_CANCELLED: 'analytics.order_cancelled',
  ANALYTICS_PRODUCT_VIEWED: 'analytics.product_viewed',
  ANALYTICS_USER_CREATED: 'analytics.user_created',
  
  // Dead Letter Queue
  DEAD_LETTER: 'dead_letter.queue',
} as const;

export type EventName = (typeof Events)[keyof typeof Events];
export type ExchangeName = (typeof Exchanges)[keyof typeof Exchanges];
export type QueueName = (typeof Queues)[keyof typeof Queues];

// Backward-compatible aliases
export const EXCHANGES = Exchanges;
export const QUEUES = Queues;

// Helper to generate routing keys from entity + action
export function getRoutingKey(entity: string, action: string): string {
  return `${entity.toLowerCase()}.${action.toLowerCase()}`;
}
