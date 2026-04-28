import { Application, Request } from 'express';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { IncomingMessage, ServerResponse } from 'http';
import config from '../config/index.js';
import { createServiceLogger } from '@freeshop/shared-utils';
import { authRateLimiter } from '@freeshop/shared-middleware';

const logger = createServiceLogger('api-gateway');

// Common proxy options
const getProxyOptions = (serviceName: string, serviceUrl: string): Options => ({
  target: serviceUrl,
  changeOrigin: true,
  pathRewrite: {
    [`^/api/v1/${serviceName}`]: '',
  },
  timeout: config.services[serviceName]?.timeout || 10000,
  proxyTimeout: config.services[serviceName]?.timeout || 10000,
  on: {
    proxyReq: (proxyReq: any, req: IncomingMessage) => {
      const expressReq = req as Request;
      // Forward request ID
      if (expressReq.requestId) {
        proxyReq.setHeader('X-Request-ID', expressReq.requestId);
      }
      // Forward user info if authenticated
      if (expressReq.user) {
        proxyReq.setHeader('X-User-ID', expressReq.user.userId);
        // Note: role no longer available - roles are queried from RBAC system separately
        proxyReq.setHeader('X-User-Email', expressReq.user.email);
      }
      // Log request
      logger.debug(`Proxying ${expressReq.method} ${expressReq.originalUrl} to ${serviceName}`);
    },
    proxyRes: (proxyRes: IncomingMessage, req: IncomingMessage) => {
      const expressReq = req as Request;
      logger.debug(`Response from ${serviceName}: ${proxyRes.statusCode} for ${expressReq.originalUrl}`);
    },
    error: (err: Error, _req: IncomingMessage, res: ServerResponse | import('net').Socket) => {
      logger.error(`Proxy error for ${serviceName}: ${(err as any).code || err.message}`);
      if (!(res instanceof ServerResponse) || res.headersSent) return;
      const body = JSON.stringify({
        success: false,
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: `${serviceName} service is currently unavailable`,
        },
      });
      res.writeHead(503, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      });
      res.end(body);
    },
  },
});

export const setupRoutes = (app: Application): void => {
  // Auth Service routes
  app.use(
    '/api/v1/auth',
    authRateLimiter,
    createProxyMiddleware(getProxyOptions('auth', config.services.auth.url))
  );

  // User Service routes
  app.use(
    '/api/v1/users',
    createProxyMiddleware({
      ...getProxyOptions('user', config.services.user.url),
      pathRewrite: { '^/api/v1/users': '' },
    })
  );

  // Product Service routes
  app.use(
    '/api/v1/products',
    createProxyMiddleware({
      ...getProxyOptions('product', config.services.product.url),
      pathRewrite: { '^/api/v1/products': '' },
    })
  );
  
  app.use(
    '/api/v1/categories',
    createProxyMiddleware({
      ...getProxyOptions('product', config.services.product.url),
      pathRewrite: async (path) => `/categories${path === '/' ? '' : path}`,
    })
  );

  app.use(
    '/api/v1/reviews',
    createProxyMiddleware({
      ...getProxyOptions('product', config.services.product.url),
      pathRewrite: async (path) => `/reviews${path === '/' ? '' : path}`,
    })
  );

  // Order Service routes
  app.use(
    '/api/v1/orders',
    createProxyMiddleware({
      ...getProxyOptions('order', config.services.order.url),
      pathRewrite: async (path) => `/orders${path === '/' ? '' : path}`,
    })
  );
  
  // Deliveries (order service) routes
  app.use(
    '/api/v1/deliveries',
    createProxyMiddleware({
      ...getProxyOptions('order', config.services.order.url),
      pathRewrite: async (path) => `/deliveries${path === '/' ? '' : path}`,
    })
  );
  
  app.use(
    '/api/v1/cart',
    createProxyMiddleware({
      ...getProxyOptions('order', config.services.order.url),
      pathRewrite: async (path) => `/cart${path === '/' ? '' : path}`,
    })
  );

  app.use(
    '/api/v1/settings',
    createProxyMiddleware({
      ...getProxyOptions('order', config.services.order.url),
      pathRewrite: async (path) => `/settings${path === '/' ? '' : path}`,
    })
  );

  // Payment Service routes
  app.use(
    '/api/v1/payments',
    createProxyMiddleware({
      ...getProxyOptions('payment', config.services.payment.url),
      pathRewrite: async (path) => `/payments${path === '/' ? '' : path}`,
    })
  );
  
  // Payment webhooks (no rate limiting for webhooks)
  app.use(
    '/api/v1/webhooks/payment',
    createProxyMiddleware({
      ...getProxyOptions('payment', config.services.payment.url),
      pathRewrite: async (path) => `/payments${path === '/' ? '' : path}`,
    })
  );

  // Inventory Service routes
  app.use(
    '/api/v1/inventory',
    createProxyMiddleware({
      ...getProxyOptions('inventory', config.services.inventory.url),
      pathRewrite: async (path) => `/api/inventory${path === '/' ? '' : path}`,
    })
  );

  // Vendor Service routes
  app.use(
    '/api/v1/vendors',
    createProxyMiddleware({
      ...getProxyOptions('vendor', config.services.vendor.url),
      pathRewrite: async (path) => `/api/vendors${path === '/' ? '' : path}`,
    })
  );

  // Notification Service routes (internal, admin only)
  app.use(
    '/api/v1/notifications',
    createProxyMiddleware({
      ...getProxyOptions('notification', config.services.notification.url),
      pathRewrite: async (path) => `/api/notifications${path === '/' ? '' : path}`,
    })
  );

  // Analytics Service routes (admin/manager only)
  app.use(
    '/api/v1/analytics',
    createProxyMiddleware({
      ...getProxyOptions('analytics', config.services.analytics.url),
      pathRewrite: async (path) => `/api/analytics${path === '/' ? '' : path}`,
    })
  );

  logger.info('API routes configured');
};
