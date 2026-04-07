import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3007', 10),
  
  database: {
    url: process.env.VENDOR_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/freeshop_vendor',
  },
  
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
  },
  
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
  },
  
  defaultCommissionRate: parseFloat(process.env.DEFAULT_COMMISSION_RATE || '10'),
  defaultMinimumWithdrawal: parseFloat(process.env.DEFAULT_MINIMUM_WITHDRAWAL || '500'),
  withdrawalProcessingFee: parseFloat(process.env.WITHDRAWAL_PROCESSING_FEE || '0'),
};
