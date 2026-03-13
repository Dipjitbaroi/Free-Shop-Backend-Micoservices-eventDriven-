export default {
  port: parseInt(process.env.PRODUCT_SERVICE_PORT || '3003', 10),
  environment: process.env.NODE_ENV || 'development',
  
  database: {
    url: process.env.PRODUCT_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/freeshop_product',
  },
  
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || '',
  },
  
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  },
  
  cache: {
    productTTL: 300, // 5 minutes
    categoryTTL: 600, // 10 minutes
    searchTTL: 60, // 1 minute
  },
  
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },
  
  upload: {
    maxImages: parseInt(process.env.PRODUCT_UPLOAD_MAX_IMAGES || '5', 10),
  },
};
