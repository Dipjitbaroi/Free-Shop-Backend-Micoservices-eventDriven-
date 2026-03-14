import express, { Application } from 'express';

import {
  requestId,
  responseTime,
  httpLogger,
  errorHandler,
  notFoundHandler,
} from '@freeshop/shared-middleware';


import cartRoutes from './routes/cart.routes';
import orderRoutes from './routes/order.routes';
import healthRoutes from './routes/health.routes';
import settingsRoutes from './routes/settings.routes';

const app: Application = express();

app.use(requestId);
app.use(responseTime);
app.use(httpLogger);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', healthRoutes);

app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/settings', settingsRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
