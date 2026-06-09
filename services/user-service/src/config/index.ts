// IMPORTANT: load env BEFORE reading process.env below (ESM imports are hoisted)
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const config = {
  port: parseInt(process.env.USER_SERVICE_PORT || '3002', 10),
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
  
  cache: {
    profileTTL: 300, // 5 minutes
  },
};

export default config;
