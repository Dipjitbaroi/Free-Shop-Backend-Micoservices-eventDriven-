import express, { Application } from 'express';

import {
  requestId,
  responseTime,
  httpLogger,
  errorHandler,
  notFoundHandler,
} from '@freeshop/shared-middleware';

import userRoutes from './routes/user.routes';
import sellerRoutes from './routes/seller.routes';
import wishlistRoutes from './routes/wishlist.routes';
import healthRoutes from './routes/health.routes';

const app: Application = express();

app.use(requestId);
app.use(responseTime);
app.use(httpLogger);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', healthRoutes);
app.use('/', userRoutes);
app.use('/sellers', sellerRoutes);
app.use('/wishlist', wishlistRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
