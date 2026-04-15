import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { errorHandler, requestLogger, notFoundHandler } from '@freeshop/shared-middleware';

import vendorRoutes from './routes/vendor.routes';
import commissionRoutes from './routes/commission.routes';
import reviewRoutes from './routes/review.routes';
import healthRoutes from './routes/health.routes';

const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.use('/api/vendors', vendorRoutes);
app.use('/api/vendors', reviewRoutes);
app.use('/api/vendors/finance', commissionRoutes);
app.use('/', healthRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

