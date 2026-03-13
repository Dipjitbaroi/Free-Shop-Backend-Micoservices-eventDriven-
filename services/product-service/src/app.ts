import express, { Application } from 'express';

import {
  requestId,
  responseTime,
  httpLogger,
  errorHandler,
  notFoundHandler,
} from '@freeshop/shared-middleware';

import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import reviewRoutes from './routes/review.routes';
import healthRoutes from './routes/health.routes';

const app: Application = express();

app.use(requestId);
app.use(responseTime);
app.use(httpLogger);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', healthRoutes);
app.use('/categories', categoryRoutes);
app.use('/reviews', reviewRoutes);
app.use('/', productRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
