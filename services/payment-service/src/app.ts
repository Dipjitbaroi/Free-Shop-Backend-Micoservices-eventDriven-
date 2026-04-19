import express, { Application } from 'express';

import {
  requestId,
  responseTime,
  httpLogger,
  errorHandler,
  notFoundHandler,
} from '@freeshop/shared-middleware';

import paymentRoutes from './routes/payment.routes.js';
import healthRoutes from './routes/health.routes.js';

const app: Application = express();

app.use(requestId);
app.use(responseTime);
app.use(httpLogger);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', healthRoutes);
app.use('/payments', paymentRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
