# Environment Variables - Service-to-Service Authentication

## Quick Setup

Copy the SERVICE_AUTH_TOKEN below and add to your `.env` files:

```env
SERVICE_AUTH_TOKEN=rB8kL2mN9pQ4xY7vW3sT6uJ1fG5hD8cA
```

This token should be **identical** across all services.

---

## Services That Need This Token

- [ ] product-service
- [ ] order-service (for delivery-service)
- [ ] user-service (to enable the internal endpoint)

---

## Example .env Files

### services/product-service/.env
```env
NODE_ENV=development
PORT=3003
SERVICE_AUTH_TOKEN=rB8kL2mN9pQ4xY7vW3sT6uJ1fG5hD8cA
USER_SERVICE_URL=http://user-service:3002
JWT_SECRET=your-jwt-secret
DATABASE_URL=postgresql://user:pass@postgres:5432/product_db
REDIS_URL=redis://redis:6379
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
```

### services/user-service/.env
```env
NODE_ENV=development
PORT=3002
SERVICE_AUTH_TOKEN=rB8kL2mN9pQ4xY7vW3sT6uJ1fG5hD8cA
JWT_SECRET=your-jwt-secret
DATABASE_URL=postgresql://user:pass@postgres:5432/user_db
REDIS_URL=redis://redis:6379
```

### services/order-service/.env
```env
NODE_ENV=development
PORT=3004
SERVICE_AUTH_TOKEN=rB8kL2mN9pQ4xY7vW3sT6uJ1fG5hD8cA
USER_SERVICE_URL=http://user-service:3002
JWT_SECRET=your-jwt-secret
DATABASE_URL=postgresql://user:pass@postgres:5432/order_db
REDIS_URL=redis://redis:6379
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
```

---

## Docker Compose Setup

```yaml
version: '3.8'

services:
  product-service:
    environment:
      - NODE_ENV=development
      - PORT=3003
      - SERVICE_AUTH_TOKEN=rB8kL2mN9pQ4xY7vW3sT6uJ1fG5hD8cA
      - USER_SERVICE_URL=http://user-service:3002
      - DATABASE_URL=postgresql://user:pass@postgres:5432/product_db

  user-service:
    environment:
      - NODE_ENV=development
      - PORT=3002
      - SERVICE_AUTH_TOKEN=rB8kL2mN9pQ4xY7vW3sT6uJ1fG5hD8cA
      - DATABASE_URL=postgresql://user:pass@postgres:5432/user_db

  order-service:
    environment:
      - NODE_ENV=development
      - PORT=3004
      - SERVICE_AUTH_TOKEN=rB8kL2mN9pQ4xY7vW3sT6uJ1fG5hD8cA
      - USER_SERVICE_URL=http://user-service:3002
      - DATABASE_URL=postgresql://user:pass@postgres:5432/order_db
```

---

## Production Token Generation

**⚠️ Never use the example token in production!**

Generate a new secure token:

### Linux/Mac
```bash
# Generate a random 32-byte token encoded in base64
openssl rand -base64 32

# Example output:
# rB8kL2mN9pQ4xY7vW3sT6uJ1fG5hD8cA+/X3Z1mW9qR2sT5uV8wX6yZ3aB4cD7eF9
```

### PowerShell
```powershell
# Generate a random GUID-based token
$token = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).Guid + (New-Guid).Guid))
Write-Host $token

# Example output:
# Zj1HNjEwRjQtQjNCQy00N0MyLThBODItNkQ1MTk0OTQ2MzZCNjI2RjA5RTgtMUY2MC00RjIyLTlGNDctNzQ3QjdCOTBBQjNG
```

### Python
```python
import secrets
import base64

token = base64.b64encode(secrets.token_bytes(32)).decode()
print(token)

# Example output:
# k+3L/mN8pQ4xY7vW3sT6uJ1fG5hD8cA2B+/X3Z1mW9qR2sT5uV8wX6yZ3aB4cD7eF9
```

---

## Kubernetes Secrets

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: freeshop-service-auth
  namespace: freeshop
type: Opaque
data:
  SERVICE_AUTH_TOKEN: ckkU6SYmN2pR5xY7vW3sT6uJ1fG5hD8cA
  # Base64 encoded: rB8kL2mN9pQ4xY7vW3sT6uJ1fG5hD8cA
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: product-service
  namespace: freeshop
spec:
  template:
    spec:
      containers:
      - name: product-service
        env:
        - name: SERVICE_AUTH_TOKEN
          valueFrom:
            secretKeyRef:
              name: freeshop-service-auth
              key: SERVICE_AUTH_TOKEN
```

---

## GitHub Actions Secrets

Add to repository secrets:
```
SERVICE_AUTH_TOKEN = rB8kL2mN9pQ4xY7vW3sT6uJ1fG5hD8cA
```

In workflow file:
```yaml
env:
  SERVICE_AUTH_TOKEN: ${{ secrets.SERVICE_AUTH_TOKEN }}
```

---

## Verifying Configuration

### Check if token is set correctly

**In Node.js:**
```javascript
console.log('SERVICE_AUTH_TOKEN set:', !!process.env.SERVICE_AUTH_TOKEN);
console.log('Token length:', process.env.SERVICE_AUTH_TOKEN?.length);
```

**In Docker:**
```bash
docker exec product-service env | grep SERVICE_AUTH_TOKEN
```

**In Kubernetes:**
```bash
kubectl get secret freeshop-service-auth -o yaml
```

---

## Token Rotation

To rotate tokens safely:

1. Generate new token
2. Update .env in all services
3. Restart services one by one
4. Monitor logs for any failures
5. If issues occur, restart with old token and investigate

---

## Troubleshooting

**"SERVICE_AUTH_TOKEN not configured"**
- Check .env file exists and SERVICE_AUTH_TOKEN is set
- Check for typos in variable name
- Restart service after updating .env
- Use `docker exec` or `kubectl` to verify env var is set

**"Invalid service token"**
- Verify token matches across all services
- Check for extra whitespace in .env
- Ensure no special characters are escaped
- Verify token is not truncated in env variable

**"Module not found: authenticateService"**
- Rebuild shared-middleware: `pnpm -C packages/shared-middleware build`
- Clear node_modules and reinstall: `pnpm install`

---

## Keeping Tokens Secure

✓ **DO:**
- Store in environment variables only
- Use different tokens for dev/staging/prod
- Rotate tokens periodically
- Store in secure secret management (Vault, GitHub Secrets, K8s Secrets)
- Log token length but not the actual value

✗ **DON'T:**
- Commit tokens to Git
- Put tokens in code comments
- Share tokens in plain text
- Use same token across environments
- Log full token values
- Hardcode tokens in Dockerfiles

---
