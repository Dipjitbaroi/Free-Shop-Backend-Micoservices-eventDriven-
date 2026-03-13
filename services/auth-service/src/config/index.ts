export default {
  port: parseInt(process.env.AUTH_SERVICE_PORT || '3001', 10),
  environment: process.env.NODE_ENV || 'development',

  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    // Base64-encoded service account JSON (recommended for Docker env vars)
    // OR individual fields below
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
    // Private key newlines are escaped in env vars; we unescape them here
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  },
  
  database: {
    url: process.env.AUTH_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/freeshop_auth',
  },
  
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || '',
  },
  
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  },
  
  security: {
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    passwordMinLength: 8,
    guestTokenExpiry: 24 * 60 * 60 * 1000, // 24 hours
    adminSecretKey: process.env.ADMIN_SECRET_KEY || '',
  },
};
