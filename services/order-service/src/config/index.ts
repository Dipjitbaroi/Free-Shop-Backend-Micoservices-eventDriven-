const config = {
  port: parseInt(process.env.ORDER_SERVICE_PORT || '3004', 10),
  environment: process.env.NODE_ENV || 'development',
  productServiceUrl: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3003',
  userServiceUrl: process.env.USER_SERVICE_URL || 'http://localhost:3001',
  steadfast: {
    baseUrl: process.env.STEADFAST_BASE_URL || 'https://portal.packzy.com/api/v1',
    apiKey: process.env.STEADFAST_API_KEY || '',
    secretKey: process.env.STEADFAST_SECRET_KEY || '',
    timeoutMs: parseInt(process.env.STEADFAST_TIMEOUT_MS || '10000', 10),
    enabled: process.env.STEADFAST_ENABLED !== 'false',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
  },
  
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  },
  
  order: {
    guestCartExpiryHours: parseInt(process.env.GUEST_CART_EXPIRY_HOURS || '72', 10),
  },
  
  cache: {
    cartTTL: 3600, // 1 hour
  },
};

export default config;
