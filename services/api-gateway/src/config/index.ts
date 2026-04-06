export interface IServiceConfig {
  name: string;
  url: string;
  healthCheck: string;
  timeout: number;
}

export interface IConfig {
  port: number;
  environment: string;
  services: Record<string, IServiceConfig>;
  rateLimiting: {
    windowMs: number;
    maxRequests: number;
  };
  cors: {
    origins: string[];
    credentials: boolean;
  };
}

const config: IConfig = {
  port: parseInt(process.env.API_GATEWAY_PORT || '3000', 10),
  environment: process.env.NODE_ENV || 'development',
  
  services: {
    auth: {
      name: 'Auth Service',
      url: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
      healthCheck: '/health',
      timeout: 10000,
    },
    user: {
      name: 'User Service',
      url: process.env.USER_SERVICE_URL || 'http://localhost:3002',
      healthCheck: '/health',
      timeout: 10000,
    },
    product: {
      name: 'Product Service',
      url: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3003',
      healthCheck: '/health',
      timeout: 10000,
    },
    order: {
      name: 'Order Service',
      url: process.env.ORDER_SERVICE_URL || 'http://localhost:3004',
      healthCheck: '/health',
      timeout: 15000,
    },
    payment: {
      name: 'Payment Service',
      url: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3005',
      healthCheck: '/health',
      timeout: 15000,
    },
    inventory: {
      name: 'Inventory Service',
      url: process.env.INVENTORY_SERVICE_URL || 'http://localhost:3006',
      healthCheck: '/health',
      timeout: 10000,
    },
    seller: {
      name: 'Seller Service',
      url: process.env.SELLER_SERVICE_URL || 'http://localhost:3007',
      healthCheck: '/health',
      timeout: 10000,
    },
    notification: {
      name: 'Notification Service',
      url: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3008',
      healthCheck: '/health',
      timeout: 10000,
    },
    analytics: {
      name: 'Analytics Service',
      url: process.env.ANALYTICS_SERVICE_URL || 'http://localhost:3009',
      healthCheck: '/health',
      timeout: 10000,
    },
    delivery: {
      name: 'Delivery Service',
      url: process.env.DELIVERY_SERVICE_URL || 'http://localhost:3010',
      healthCheck: '/health',
      timeout: 10000,
    },
  },
  
  rateLimiting: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  
  cors: {
    origins: (process.env.CORS_ORIGIN || '*').split(',').map(o => o.trim()),
    credentials: true,
  },
};

export default config;
