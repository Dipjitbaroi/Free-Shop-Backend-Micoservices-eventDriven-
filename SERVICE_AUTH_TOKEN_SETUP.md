# Service-to-Service Authentication Setup

## Overview

Inter-service communication now uses a dedicated **SERVICE_AUTH_TOKEN** for system-level API calls, separate from user authentication. This prevents permission-denied errors during data enrichment and internal operations.

## Configuration

### Environment Variables

Add the following environment variable to all microservices that need service-to-service communication:

```env
SERVICE_AUTH_TOKEN=your-secure-system-token-here
```

**Where to set:**
- Local: `.env` file in each service root
- Docker: Add to `docker-compose.yml` environment or `.env` file
- Kubernetes: Add to `ConfigMap` or `Secret` resources
- GitHub Actions: Add to Secrets

### Recommended Token Generation

Generate a secure random token (minimum 32 characters):

```bash
# Linux/Mac
openssl rand -base64 32

# PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).Guid + (New-Guid).Guid))
```

**Example:**
```
SERVICE_AUTH_TOKEN=rB8kL2mN9pQ4xY7vW3sT6uJ1fG5hD8cA
```

## Internal Service APIs

### User Service

**Endpoint:** `GET /users/internal/profile/:userId`

**Authentication:** Bearer token (SERVICE_AUTH_TOKEN)

**Purpose:** Fetch user profile data for enrichment in other services

**Not exposed in:** Swagger/OpenAPI documentation

**Usage Example (Product Service):**
```typescript
const response = await axios.get(
  `${userServiceUrl}/users/internal/profile/${userId}`,
  { 
    headers: {
      'Authorization': `Bearer ${SERVICE_AUTH_TOKEN}`,
      'X-Service-Call': 'true',
    }
  }
);
```

### Delivery Service

Uses the same user profile endpoint for fetching delivery man information.

## Where It's Used

### Product Service
- Enriching products with `createdBy` user info (name, email, avatar)
- Enriching products with `lastUpdatedBy` user info
- Applies to:
  - `getProductById()`
  - `getProductBySlug()`
  - `getProducts()` (list with pagination)
  - `getFeaturedProducts()`
  - `getFlashSaleProducts()`

### Order Service / Delivery Service
- Enriching delivery records with delivery man profile info
- Applies to:
  - `getDeliveryByOrderId()`
  - `getDeliveriesByDeliveryMan()`

## Security Considerations

1. **Token Management:**
   - Never commit tokens to Git
   - Use different tokens for dev/staging/production
   - Rotate tokens periodically

2. **Network Security:**
   - Service-to-service calls happen over internal networks (Docker/Kubernetes networks)
   - HTTPS recommended for production deployments

3. **Endpoint Protection:**
   - Internal endpoints (`/internal/*`) only accept SERVICE_AUTH_TOKEN
   - They bypass user permission checks since system calls don't have user context
   - These endpoints are NOT exposed in Swagger documentation

## Docker Compose Setup

Add to `docker-compose.yml`:

```yaml
services:
  product-service:
    environment:
      - SERVICE_AUTH_TOKEN=rB8kL2mN9pQ4xY7vW3sT6uJ1fG5hD8cA
      
  order-service:
    environment:
      - SERVICE_AUTH_TOKEN=rB8kL2mN9pQ4xY7vW3sT6uJ1fG5hD8cA
      
  user-service:
    environment:
      - SERVICE_AUTH_TOKEN=rB8kL2mN9pQ4xY7vW3sT6uJ1fG5hD8cA
```

## Kubernetes Setup

Add to `ConfigMap`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: freeshop-service-config
data:
  SERVICE_AUTH_TOKEN: "rB8kL2mN9pQ4xY7vW3sT6uJ1fG5hD8cA"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: product-service
spec:
  template:
    spec:
      containers:
      - name: product-service
        env:
        - name: SERVICE_AUTH_TOKEN
          valueFrom:
            configMapKeyRef:
              name: freeshop-service-config
              key: SERVICE_AUTH_TOKEN
```

## Troubleshooting

### "SERVICE_AUTH_TOKEN not configured"
- Check `.env` file exists and token is set
- Restart service after updating env variables
- Check Docker/Kubernetes pods have the env variable injected

### "Invalid service token"
- Verify token matches across all services (should be identical)
- Check for extra whitespace in `.env` file
- Verify token in error logs matches the one you set

### User data still not populating
- Enable logging to see if internal endpoint is being called
- Check user-service logs for requests to `/users/internal/profile/*`
- Verify user exists in database with correct firstName/lastName

### Axios timeout errors
- Default timeout is 5 seconds, may need increase for slow networks
- Check network connectivity between services
- Verify user-service is running and accessible

## API Endpoints Reference

| Service | Public Endpoint | Internal Endpoint | Auth |
|---------|---|---|---|
| User Service | `GET /users/:userId` | `GET /users/internal/profile/:userId` | `authenticate` | `authenticateService` |
| User Service | `GET /users/:userId/public-profile` | N/A | None | N/A |

## Migration Notes

**Before this update:**
- Product service called `/users/:userId` with user auth token
- This caused 401 Unauthorized errors since user had no permission to access other users' profiles

**After this update:**
- Product service calls `/users/internal/profile/:userId` with SERVICE_AUTH_TOKEN
- No permission checks, system-level access
- Logs show "[internal API]" for these calls
