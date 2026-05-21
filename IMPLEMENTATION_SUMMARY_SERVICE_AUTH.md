# Service-to-Service Authentication Implementation - Summary

## Problem Fixed

User profile data (firstName, lastName, email) was not populating in product and delivery responses because:
1. Inter-service HTTP calls to user-service required user authentication
2. When product/order services called `/users/:userId`, they couldn't include a user token (the call was system-level)
3. This resulted in 401 Unauthorized errors, causing enrichment to fail silently
4. User data fell back to empty/undefined values

## Solution Implemented

Created a dedicated **service-to-service authentication layer** using `SERVICE_AUTH_TOKEN` environment variable.

### Components Added

#### 1. New Middleware: `authenticateService`
**File:** [packages/shared-middleware/src/auth.middleware.ts](packages/shared-middleware/src/auth.middleware.ts#L110-L152)

```typescript
export const authenticateService = (req, _res, next) => {
  const token = extractToken(req);
  const SERVICE_TOKEN = process.env.SERVICE_AUTH_TOKEN;
  
  if (token !== SERVICE_TOKEN) {
    throw new UnauthorizedError('Invalid service token');
  }
  
  // Set system user context
  req.user = {
    userId: 'SYSTEM',
    id: 'SYSTEM',
    email: 'system@freeshop.internal',
    roles: ['SYSTEM'],
    type: 'access',
  };
  next();
};
```

#### 2. Internal User API Endpoint
**File:** [services/user-service/src/routes/user.routes.ts](services/user-service/src/routes/user.routes.ts#L12-L21)

- **Route:** `GET /users/internal/profile/:userId`
- **Authentication:** SERVICE_AUTH_TOKEN (not exposed in Swagger)
- **Purpose:** Service-to-service user profile fetching
- **Route ordering:** Placed BEFORE generic `/:userId` route to prevent conflicts

#### 3. Updated Service Calls

**Product Service:** [services/product-service/src/services/product.service.ts](services/product-service/src/services/product.service.ts#L74-L123)
- Modified `fetchUserProfile()` to:
  - Call `/users/internal/profile/:userId` instead of `/users/:userId`
  - Send SERVICE_AUTH_TOKEN header
  - Add logging for debugging

**Delivery Service:** [services/order-service/src/services/delivery.service.ts](services/order-service/src/services/delivery.service.ts#L30-L82)
- Modified `fetchDeliveryManProfile()` to:
  - Call `/users/internal/profile/:userId` instead of `/users/:userId`
  - Send SERVICE_AUTH_TOKEN header
  - Add logging for timeout/error handling

### Affected API Methods

**Product Service:**
- `getProductById()` - Enriches with createdBy/lastUpdatedBy
- `getProductBySlug()` - Enriches with createdBy/lastUpdatedBy
- `getProducts()` - Batch enrichment for paginated lists
- `getFeaturedProducts()` - Batch enrichment
- `getFlashSaleProducts()` - Batch enrichment

**Order/Delivery Service:**
- `getDeliveryByOrderId()` - Enriches with deliveryMan profile
- `getDeliveriesByDeliveryMan()` - Enriches with deliveryMan profiles

### Configuration Required

Add to `.env` in each service:
```env
SERVICE_AUTH_TOKEN=your-secure-system-token-here
```

Or in `docker-compose.yml`:
```yaml
environment:
  - SERVICE_AUTH_TOKEN=secure-token-value
```

See [SERVICE_AUTH_TOKEN_SETUP.md](SERVICE_AUTH_TOKEN_SETUP.md) for complete setup instructions.

## Data Flow

### Before (Broken)
```
Product Service
    ↓
fetchUserProfile(userId)
    ↓
axios.get('/users/userId', { headers: {} })  ← No auth
    ↓
User Service receives request with no auth token
    ↓
401 Unauthorized (no user context)
    ↓
Enrichment fails, createdBy/lastName shows empty
```

### After (Fixed)
```
Product Service
    ↓
fetchUserProfile(userId)
    ↓
axios.get('/users/internal/profile/userId', {
  headers: { Authorization: 'Bearer SERVICE_AUTH_TOKEN' }
})
    ↓
User Service authenticateService middleware
    ↓
Validates SERVICE_AUTH_TOKEN
    ↓
Sets req.user = { userId: 'SYSTEM', roles: ['SYSTEM'] }
    ↓
Bypasses permission checks (internal call)
    ↓
Returns full UserProfile
    ↓
Enrichment succeeds, createdBy includes firstName/lastName
```

## Security Model

| Aspect | Detail |
|--------|--------|
| **Token Storage** | Environment variables (never in code) |
| **Token Scope** | System-level only, not tied to user |
| **Endpoint Access** | Only accepts SERVICE_AUTH_TOKEN, no user tokens |
| **Documentation** | Not exposed in Swagger/OpenAPI |
| **Network** | Internal microservice communication (Docker/K8s networks) |
| **Permission Checks** | Bypassed for internal endpoints (system calls have no user context) |

## Files Modified

1. **packages/shared-middleware/src/auth.middleware.ts**
   - Added `authenticateService` middleware export

2. **services/user-service/src/routes/user.routes.ts**
   - Added internal route: `GET /users/internal/profile/:userId`
   - Reordered routes to prevent conflicts

3. **services/product-service/src/services/product.service.ts**
   - Updated `fetchUserProfile()` to use internal endpoint
   - Updated endpoint URL with `/internal/profile/`
   - Added SERVICE_AUTH_TOKEN header
   - Enhanced logging

4. **services/order-service/src/services/delivery.service.ts**
   - Updated `fetchDeliveryManProfile()` to use internal endpoint
   - Updated endpoint URL with `/internal/profile/`
   - Added SERVICE_AUTH_TOKEN header
   - Enhanced logging

## Compilation Status

✓ All services compile without TypeScript errors:
- shared-middleware
- user-service
- product-service
- order-service
- api-gateway

## Testing Checklist

- [ ] Set SERVICE_AUTH_TOKEN in .env files
- [ ] Restart all services
- [ ] Test product endpoint: `GET /api/products/:id`
  - Verify `createdBy` has firstName/lastName
  - Verify `lastUpdatedBy` has firstName/lastName
- [ ] Test delivery endpoint: `GET /api/orders/:orderId/delivery`
  - Verify `deliveryMan` has firstName/lastName
- [ ] Check logs for "[internal API]" messages
- [ ] Verify no 401 Unauthorized errors in logs

## Rollback

If issues occur:
1. Remove SERVICE_AUTH_TOKEN from .env
2. Revert endpoint calls to `/users/:userId`
3. Remove internal routes from user-service
4. Rebuild services

## Documentation

See [SERVICE_AUTH_TOKEN_SETUP.md](SERVICE_AUTH_TOKEN_SETUP.md) for:
- Detailed configuration steps
- Docker Compose setup
- Kubernetes setup
- Troubleshooting guide
- Token generation examples
