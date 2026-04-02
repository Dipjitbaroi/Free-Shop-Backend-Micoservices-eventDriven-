const config = {
  port: parseInt(process.env.PAYMENT_SERVICE_PORT || '3005', 10),
  environment: process.env.NODE_ENV || 'development',
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
  },
  
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  },
  
  // Payment gateways
  bkash: {
    appKey: process.env.BKASH_APP_KEY || '',
    appSecret: process.env.BKASH_APP_SECRET || '',
    username: process.env.BKASH_USERNAME || '',
    password: process.env.BKASH_PASSWORD || '',
    baseUrl: process.env.BKASH_BASE_URL || 'https://tokenized.sandbox.bka.sh/v1.2.0-beta',
    isSandbox: process.env.BKASH_SANDBOX === 'true',
  },
  
  nagad: {
    merchantId: process.env.NAGAD_MERCHANT_ID || '',
    merchantPrivateKey: process.env.NAGAD_PRIVATE_KEY || '',
    pgPublicKey: process.env.NAGAD_PG_PUBLIC_KEY || '',
    baseUrl: process.env.NAGAD_BASE_URL || 'https://sandbox.mynagad.com:10080/api/dfs',
    isSandbox: process.env.NAGAD_SANDBOX === 'true',
  },
  eps: {
    merchantId: process.env.EPS_MERCHANT_ID || '',
    apiKey: process.env.EPS_API_KEY || '',
    secretKey: process.env.EPS_SECRET_KEY || '',
    baseUrl: process.env.EPS_BASE_URL || 'https://sandbox.eps-gateway.com',
    isSandbox: process.env.EPS_SANDBOX === 'true',
  },
  
  callbacks: {
    baseUrl: process.env.CALLBACK_BASE_URL || 'http://localhost:3005',
  },
};

export default config;
