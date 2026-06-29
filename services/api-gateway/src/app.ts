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
  attachPermissions,
} from '@freeshop/shared-middleware';

import { setupRoutes } from './routes/index.js';
import { healthRoutes } from './routes/health.routes.js';
import swaggerDocument from './docs/swagger.js';

const app: Application = express();

// Crash safety nets — without these, an `ERR_HTTP_INVALID_HEADER_VALUE`
// from the proxy (e.g. setting an undefined header) would tear down the
// whole gateway process and leave port 3000 with only TIME_WAIT entries.
// We log loudly so the underlying bug is still visible, but we keep
// serving traffic.
process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.error('[api-gateway] uncaughtException:', err);
});
process.on('unhandledRejection', (reason) => {
  // eslint-disable-next-line no-console
  console.error('[api-gateway] unhandledRejection:', reason);
});

// Trust the full proxy chain (nginx ingress + cloudflare) so req.ip
// resolves to the real client IP and rate-limit keys are not collapsed
// onto a single shared address per pod.
app.set('trust proxy', true);

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

// Attach user permissions (non-blocking) so the rate limiter can pick
// the correct tier (anonymous / customer / vendor / manager / admin).
// Must run BEFORE the rate limiter so `req.user.tier` is available.
app.use('/api', attachPermissions);

// Tier-aware rate limiting (per user / per IP, per workload tier)
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
