# Service-to-Service Authentication - Architecture Overview

## Problem → Solution

### Before: Permission-Based User Enrichment (❌ Failed)

```
┌─────────────────────────────────────────────────────────────────┐
│ Client requests: GET /api/products/product-123                  │
└────────────────────────────┬──────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  API Gateway    │
                    │  (validates JWT)│
                    └────────┬────────┘
                             │
                    ┌────────▼────────────────┐
                    │  Product Service       │
                    │  getProductById()      │
                    └────────┬────────────────┘
                             │
                    ┌────────▼──────────────────────────┐
                    │ fetchUserProfile(createdBy.id)    │
                    └────────┬──────────────────────────┘
                             │
    ┌────────────────────────▼────────────────────────┐
    │ axios.get('/users/:userId', {                  │
    │   headers: { /* NO AUTH TOKEN */ }             │
    │ })                                              │
    └────────────────────────┬───────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  User Service   │
                    │ authenticate()  │
                    └────────┬────────┘
                             │
                      ❌ ERROR ❌
              401 Unauthorized - No Token!
                             │
          User profile enrichment FAILS
          createdBy.name = "" (empty)
```

### After: Service-to-Service Token Auth (✅ Works)

```
┌─────────────────────────────────────────────────────────────────┐
│ Client requests: GET /api/products/product-123                  │
│ Header: { Authorization: Bearer eyJhbGc... (User JWT) }         │
└────────────────────────────┬──────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  API Gateway    │
                    │  (validates JWT)│
                    └────────┬────────┘
                             │
                    ┌────────▼────────────────┐
                    │  Product Service       │
                    │  getProductById()      │
                    │ .env: SERVICE_AUTH...  │
                    └────────┬────────────────┘
                             │
                    ┌────────▼──────────────────────────┐
                    │ fetchUserProfile(createdBy.id)    │
                    └────────┬──────────────────────────┘
                             │
    ┌────────────────────────▼────────────────────────┐
    │ axios.get(                                      │
    │   '/users/internal/profile/:userId',            │
    │   { headers: {                                  │
    │     Authorization: 'Bearer SERVICE_AUTH_TOKEN'  │
    │   }}                                             │
    │ )                                                │
    └────────────────────────┬───────────────────────┘
                             │
                    ┌────────▼───────────────────┐
                    │  User Service              │
                    │ authenticateService()      │
                    │ (validates SERVICE_TOKEN)  │
                    └────────┬───────────────────┘
                             │
          ✅ SERVICE_AUTH_TOKEN is valid
               System context: req.user.id = 'SYSTEM'
                             │
                    ┌────────▼────────────────────┐
                    │ Return UserProfile:         │
                    │ {                           │
                    │   id: '...',                │
                    │   firstName: 'John',        │
                    │   lastName: 'Doe',          │
                    │   email: '...',             │
                    │   avatar: '...'             │
                    │ }                           │
                    └────────┬────────────────────┘
                             │
                    ┌────────▼─────────────────────────┐
                    │ Enrich product with user data    │
                    │ createdBy: {                      │
                    │   id: '...',                      │
                    │   name: 'John Doe',       ✅      │
                    │   email: '...',                   │
                    │   avatar: '...'                   │
                    │ }                                 │
                    └────────┬─────────────────────────┘
                             │
                    ┌────────▼────────────────────┐
                    │ Return to Product Service   │
                    │ (enriched product)          │
                    └────────┬────────────────────┘
                             │
                    ┌────────▼──────────────┐
                    │  API Gateway         │
                    │  (returns response)  │
                    └────────┬──────────────┘
                             │
         ┌───────────────────▼───────────────────┐
         │ Client receives:                      │
         │ {                                     │
         │   product: { ... },                   │
         │   createdBy: {                        │
         │     name: 'John Doe',  ✅ SUCCESS!    │
         │     email: '...',                     │
         │     ...                               │
         │   },                                  │
         │   lastUpdatedBy: { ... }              │
         │ }                                     │
         └───────────────────────────────────────┘
```

## Authentication Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                         PUBLIC ENDPOINTS                        │
├─────────────────────────────────────────────────────────────────┤
│ GET /api/products/:id                                           │
│ ↓ authenticate (user JWT)                                       │
│ ✓ User must be logged in                                        │
│ ✓ Has permission context                                        │
│ ✓ Can be rate limited per user                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    INTERNAL ENDPOINTS                           │
├─────────────────────────────────────────────────────────────────┤
│ GET /users/internal/profile/:userId                             │
│ ↓ authenticateService (SERVICE_AUTH_TOKEN)                      │
│ ✓ Only accessible by other microservices                        │
│ ✓ No user permission context needed                             │
│ ✓ Not exposed in Swagger/API docs                               │
│ ✓ Separate token per environment                                │
│ ✓ Bypasses RBAC checks (system-level)                           │
└─────────────────────────────────────────────────────────────────┘
```

## Token Types

```
┌──────────────────────────────────────────────────────────────────────┐
│ USER AUTHENTICATION TOKEN (JWT)                                      │
├──────────────────────────────────────────────────────────────────────┤
│ • Obtained by: User login                                            │
│ • Contains: userId, email, roles, permissions, exp                   │
│ • Used for: Client → API Gateway → Services                          │
│ • Scope: Single user, time-limited                                   │
│ • Format: JWT (JSON Web Token) with signature                        │
│ • Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...                 │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│ SERVICE AUTHENTICATION TOKEN (Plain Bearer)                          │
├──────────────────────────────────────────────────────────────────────┤
│ • Obtained by: Environment configuration                             │
│ • Contains: Random secure string                                     │
│ • Used for: Service → Service internal calls                         │
│ • Scope: System-level, no expiration                                 │
│ • Format: Base64-encoded random bytes                                │
│ • Example: rB8kL2mN9pQ4xY7vW3sT6uJ1fG5hD8cA                         │
│ • Env var: SERVICE_AUTH_TOKEN                                        │
└──────────────────────────────────────────────────────────────────────┘
```

## Service Communication Flow

```
┌─────────────────┐
│  Product Service│
├─────────────────┤
│ • getProductById│         .env:
│                 │         SERVICE_AUTH_TOKEN=xxx
│ fetchUserProfile│         USER_SERVICE_URL=http://user-service
│ for createdBy   │
│ for lastUpdated │                ▼
└────────┬────────┘    ┌──────────────────────┐
         │             │   User Service       │
         │             ├──────────────────────┤
         │             │ PUBLIC: /users/:id   │
         │             │ INTERNAL: /users/    │
         │             │   internal/profile   │
         │             │   :userId            │
         │             └──────┬───────────────┘
         │                    │
         │ ─────────────────────  authenticateService
         │    SERVICE_AUTH_TOKEN    (validates token)
         │                    │
         └────────────────────┘
         
         Returns: { firstName, lastName, email, avatar }
         
         Cached locally: Map<userId, UserProfile>
         
         Product enriched: { createdBy: { name: '...' } }
```

## File Structure Changes

```
packages/shared-middleware/
├── src/
│   ├── auth.middleware.ts            ← Added: authenticateService
│   ├── index.ts                       (exports authenticateService)
│   └── ...

services/user-service/
├── src/
│   └── routes/
│       ├── user.routes.ts             ← Added: /internal/profile/:userId
│       └── ...
└── .env                               ← Add: SERVICE_AUTH_TOKEN

services/product-service/
├── src/
│   └── services/
│       └── product.service.ts         ← Updated: fetchUserProfile()
├── .env                               ← Add: SERVICE_AUTH_TOKEN
└── ...

services/order-service/
├── src/
│   └── services/
│       └── delivery.service.ts        ← Updated: fetchDeliveryManProfile()
├── .env                               ← Add: SERVICE_AUTH_TOKEN
└── ...
```

## Feature Coverage

| Feature | Product Service | Delivery Service | Status |
|---------|---|---|---|
| Fetch user profiles | ✅ | ✅ | Working |
| Cache profiles locally | ✅ | ✅ | Working |
| Enrich createdBy | ✅ | - | Working |
| Enrich lastUpdatedBy | ✅ | - | Working |
| Enrich deliveryMan | - | ✅ | Working |
| Logging | ✅ | ✅ | Enabled |
| Error handling | ✅ | ✅ | Fallback to empty |
| Timeout protection | ✅ | ✅ | 5 seconds |

## Environment Setup Checklist

```
□ Generate SERVICE_AUTH_TOKEN (see SERVICE_AUTH_TOKEN_ENV_TEMPLATE.md)
□ Add to services/product-service/.env
□ Add to services/user-service/.env
□ Add to services/order-service/.env
□ Add to docker-compose.yml (if using Docker)
□ Update Kubernetes ConfigMap (if using K8s)
□ Restart all services
□ Check logs for "[internal API]" messages
□ Test: GET /api/products/:id → verify createdBy.name exists
□ Test: GET /api/orders/:id/delivery → verify deliveryMan.name exists
□ Monitor for 401 Unauthorized errors in logs
```

## Documentation Files

- **SERVICE_AUTH_TOKEN_SETUP.md** - Detailed configuration guide
- **SERVICE_AUTH_TOKEN_ENV_TEMPLATE.md** - Environment variable examples
- **IMPLEMENTATION_SUMMARY_SERVICE_AUTH.md** - Complete technical summary
- **This file** - Architecture overview
