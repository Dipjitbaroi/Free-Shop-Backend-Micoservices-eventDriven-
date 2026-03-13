const config = {
  port: parseInt(process.env.ORDER_SERVICE_PORT || '3004', 10),
  environment: process.env.NODE_ENV || 'development',
  productServiceUrl: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3003',
  
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
    defaultShippingFee: parseFloat(process.env.DEFAULT_SHIPPING_FEE || '60'),
    freeShippingMinAmount: parseFloat(process.env.FREE_SHIPPING_MIN_AMOUNT || '500'),
    guestCartExpiryHours: parseInt(process.env.GUEST_CART_EXPIRY_HOURS || '72', 10),
  },
  
  cache: {
    cartTTL: 3600, // 1 hour
  },
};

export default config;
