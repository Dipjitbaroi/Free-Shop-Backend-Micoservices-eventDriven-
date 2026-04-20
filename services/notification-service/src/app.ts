import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { errorHandler, requestLogger, notFoundHandler } from '@freeshop/shared-middleware';

import notificationRoutes from './routes/notification.routes.js';
import templateRoutes from './routes/template.routes.js';
import healthRoutes from './routes/health.routes.js';

const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.use('/api/notifications/templates', templateRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/', healthRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
