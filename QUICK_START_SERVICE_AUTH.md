# Quick Start: Service-to-Service Authentication

## 🚀 5-Minute Setup

### Step 1: Generate Token (1 minute)
```bash
# Copy this token or generate a new one:
SERVICE_AUTH_TOKEN=rB8kL2mN9pQ4xY7vW3sT6uJ1fG5hD8cA
```

### Step 2: Update .env Files (2 minutes)

Add to `.env` in each directory:

**services/product-service/.env**
```env
SERVICE_AUTH_TOKEN=rB8kL2mN9pQ4xY7vW3sT6uJ1fG5hD8cA
```

**services/user-service/.env**
```env
SERVICE_AUTH_TOKEN=rB8kL2mN9pQ4xY7vW3sT6uJ1fG5hD8cA
```

**services/order-service/.env**
```env
SERVICE_AUTH_TOKEN=rB8kL2mN9pQ4xY7vW3sT6uJ1fG5hD8cA
```

### Step 3: Restart Services (2 minutes)

```bash
# Docker Compose
docker-compose restart product-service user-service order-service

# OR local development
pnpm -C services/product-service dev
pnpm -C services/user-service dev
pnpm -C services/order-service dev
```

## ✅ Verify It Works

### Test 1: Product with User Info
```bash
curl http://localhost:3003/api/products/{product-id} \
  -H "Authorization: Bearer {your-jwt-token}"
```

Should return:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "...",
    "createdBy": {
      "id": "...",
      "name": "John Doe",    ← Name should be here now!
      "email": "john@example.com"
    },
    "lastUpdatedBy": {
      "id": "...",
      "name": "Jane Smith",  ← Name should be here now!
      "email": "jane@example.com"
    }
  }
}
```

### Test 2: Delivery with Delivery Man Info
```bash
curl http://localhost:3004/api/orders/{order-id}/delivery \
  -H "Authorization: Bearer {your-jwt-token}"
```

Should return:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "orderId": "...",
    "deliveryMan": {
      "id": "...",
      "name": "Delivery Person",  ← Name should be here now!
      "email": "driver@example.com"
    }
  }
}
```

### Test 3: Check Logs
```bash
# Should see these messages:
docker logs product-service | grep "internal API"
docker logs product-service | grep "✓ Enriched"
```

## 🔍 Troubleshooting

**Issue:** Names still empty
- Verify SERVICE_AUTH_TOKEN is set: `echo $SERVICE_AUTH_TOKEN`
- Restart services: `docker-compose restart product-service`
- Check logs: `docker logs product-service 2>&1 | grep -i "auth\|token"`

**Issue:** 401 Unauthorized errors
- Check token matches in all .env files
- Verify no extra whitespace in env variable
- Ensure USER_SERVICE_URL is correct: `echo $USER_SERVICE_URL`

**Issue:** Timeout errors
- Verify network connectivity between services
- Check user-service is running: `curl http://user-service:3002/health`
- Increase timeout in code if needed (currently 5 seconds)

## 📚 Full Documentation

- **Setup Details:** [SERVICE_AUTH_TOKEN_SETUP.md](SERVICE_AUTH_TOKEN_SETUP.md)
- **Environment Examples:** [SERVICE_AUTH_TOKEN_ENV_TEMPLATE.md](SERVICE_AUTH_TOKEN_ENV_TEMPLATE.md)
- **Architecture:** [SERVICE_AUTH_ARCHITECTURE.md](SERVICE_AUTH_ARCHITECTURE.md)
- **Implementation:** [IMPLEMENTATION_SUMMARY_SERVICE_AUTH.md](IMPLEMENTATION_SUMMARY_SERVICE_AUTH.md)

## 💡 What Was Fixed

Before: User profiles showed empty names when enriching product/delivery data
```json
{
  "createdBy": { "name": "" }  ← Empty!
}
```

After: User profiles now populate correctly
```json
{
  "createdBy": { 
    "name": "John Doe"  ← Working!
  }
}
```

## 🔐 Security Notes

✅ This is safe because:
- SERVICE_AUTH_TOKEN is environment-specific
- It's not exposed in Swagger docs
- It only works for internal service calls
- User data is still restricted by normal auth
- Regular users can't bypass their own auth

## 🎯 What Changed

| Component | Change | Impact |
|-----------|--------|--------|
| shared-middleware | Added `authenticateService` | Internal auth layer |
| user-service | Added `/internal/profile/:userId` route | Service-to-service endpoint |
| product-service | Updated `fetchUserProfile()` | Now uses internal endpoint |
| order-service | Updated `fetchDeliveryManProfile()` | Now uses internal endpoint |

## ⚡ Next Steps

1. ✅ Set SERVICE_AUTH_TOKEN in all .env files
2. ✅ Restart services
3. ✅ Test endpoints (see Verify It Works above)
4. ✅ Monitor logs for success messages
5. ✅ Deploy to Docker/Kubernetes

## 📞 Need Help?

See detailed documentation:
- Configuration issues → [SERVICE_AUTH_TOKEN_SETUP.md](SERVICE_AUTH_TOKEN_SETUP.md#troubleshooting)
- Environment variables → [SERVICE_AUTH_TOKEN_ENV_TEMPLATE.md](SERVICE_AUTH_TOKEN_ENV_TEMPLATE.md)
- Technical deep dive → [IMPLEMENTATION_SUMMARY_SERVICE_AUTH.md](IMPLEMENTATION_SUMMARY_SERVICE_AUTH.md)
