import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';

import {
  requestId,
  responseTime,
  securityHeaders,
  corsMiddleware,
  compressionMiddleware,
  hppMiddleware,
  httpLogger,
  errorHandler,
  notFoundHandler,
  apiRateLimiter,
} from '@freeshop/shared-middleware';

import { setupRoutes } from './routes/index.js';
import { healthRoutes } from './routes/health.routes.js';
import swaggerDocument from './docs/swagger.js';

const app: Application = express();

// Trust proxy (for rate limiting and IP detection behind load balancer)
app.set('trust proxy', 1);

// Basic middleware
app.use(requestId);
app.use(responseTime);
app.use(securityHeaders);
app.use(corsMiddleware);
app.use(compressionMiddleware);
app.use(hppMiddleware);
app.use(httpLogger);

// NOTE: Do NOT add body-parsing middleware here.
// The api-gateway is a pure reverse proxy — parsing the request body would
// consume the readable stream, leaving http-proxy-middleware nothing to forward.
// Each downstream service parses its own body.
app.use(cookieParser());

// Rate limiting
app.use('/api', apiRateLimiter);

// API Documentation — inject correct server URL from env so Swagger "Try it out"
// works both locally and behind the VPS NGINX ingress (https://api.domain.com)
const publicApiUrl = process.env.PUBLIC_API_URL || 'http://localhost:3000/api/v1';
const swaggerDoc = {
  ...swaggerDocument,
  servers: [
    { url: publicApiUrl, description: 'API server' },
    { url: 'http://localhost:3000/api/v1', description: 'Local development' },
  ],
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Serve raw JSON spec for API clients (with CORS headers)
app.get('/api-docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  res.send(swaggerDoc);
});

// Health check routes (no auth required)
app.use('/', healthRoutes);

// Setup proxy routes to microservices
setupRoutes(app);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
