import express, { Application } from 'express';
import {
  requestId,
  responseTime,
  httpLogger,
  errorHandler,
  notFoundHandler,
} from '@freeshop/shared-middleware';

import deliveryRoutes from './routes/delivery.routes';
import healthRoutes from './routes/health.routes';

const app: Application = express();

app.use(requestId);
app.use(responseTime);
app.use(httpLogger);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/', healthRoutes);
app.use('/deliveries', deliveryRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
