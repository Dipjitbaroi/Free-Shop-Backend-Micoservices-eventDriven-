import express, { Application } from 'express';

import {
  requestId,
  responseTime,
  httpLogger,
  errorHandler,
  notFoundHandler,
} from '@freeshop/shared-middleware';

import authRoutes from './routes/auth.routes';
import healthRoutes from './routes/health.routes';

const app: Application = express();

// Middleware
app.use(requestId);
app.use(responseTime);
app.use(httpLogger);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', healthRoutes);
app.use('/', authRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
