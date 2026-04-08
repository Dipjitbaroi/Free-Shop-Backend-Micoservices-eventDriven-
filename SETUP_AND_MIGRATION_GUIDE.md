# RBAC & Delivery System - Setup & Migration Guide

## Prerequisites

- Node.js 16+ 
- Docker & Docker Compose (for services)
- PostgreSQL 12+ 
- pnpm or npm package manager

---

## Step 1: Database Migrations

### Auth Service

```bash
cd services/auth-service

# Generate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev --name add_rbac_system

# Apply migration
npx prisma db push

# Verify schema
npx prisma studio  # Opens UI to view database
```

### User Service

```bash
cd services/user-service

npx prisma generate
npx prisma migrate dev --name add_seller_profiles
npx prisma db push
```

### Order Service

```bash
cd services/order-service

npx prisma generate
npx prisma migrate dev --name add_delivery_system
npx prisma db push
```

---

## Step 2: Install Dependencies

Update `package.json` in each service if needed:

```bash
# Auth Service
cd services/auth-service
npm install  # or pnpm install

# User Service
cd services/user-service
npm install

# Order Service
cd services/order-service
npm install

# Shared packages
cd packages/shared-types
npm install

cd packages/shared-middleware
npm install
```

---

## Step 3: Environment Setup

### Auth Service (.env)

```env
# Existing variables
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/auth_db
JWT_SECRET=your-jwt-secret-key
REFRESH_TOKEN_SECRET=your-refresh-secret

# New RBAC variables
SUPERADMIN_EMAIL=superadmin@freeshop.com
SUPERADMIN_PASSWORD=SuperSecurePassword123!
```

### User Service (.env)

```env
NODE_ENV=development
PORT=3008
DATABASE_URL=postgresql://user:password@localhost:5432/user_db
AUTH_SERVICE_URL=http://localhost:3001
ORDER_SERVICE_URL=http://localhost:3004
```

### Order Service (.env)

```env
NODE_ENV=development
PORT=3004
DATABASE_URL=postgresql://user:password@localhost:5432/order_db
AUTH_SERVICE_URL=http://localhost:3001
USER_SERVICE_URL=http://localhost:3008
```

---

## Step 4: Initialize RBAC System

### Method A: Using API (Production)

```bash
# Start auth service
cd services/auth-service
npm run dev

# In another terminal, call init endpoint
curl -X POST http://localhost:3001/rbac/init \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {superadmin_token}"
```

### Method B: Using Seed Script (Development)

Create `services/auth-service/prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import RBACService from '../src/services/rbac.service';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🌱 Seeding database...');

    // Initialize RBAC
    await RBACService.initializeDefaultRoles();

    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
```

Update `package.json` with seed script:

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

Run seed:

```bash
npx prisma db seed
```

---

## Step 5: Create Test Users

### Create Superadmin User

```bash
curl -X POST http://localhost:3001/auth/admin/create \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@freeshop.com",
    "password": "SuperSecurePassword123!",
    "firstName": "Super",
    "lastName": "Admin",
    "adminSecret": "your-admin-secret-key"
  }'
```

### Create Test Sellers

```bash
# Create user
curl -X POST http://localhost:3001/auth/firebase \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seller1@shop.com",
    "password": "Password123!",
    "firstName": "Ahmed",
    "lastName": "Seller"
  }'

# Login to get token
curl -X POST http://localhost:3001/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seller1@shop.com",
    "password": "Password123!"
  }'

# Create seller profile
curl -X POST http://localhost:3008/sellers \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "shopName": "Ahmed Electronics",
    "shopSlug": "ahmed-electronics",
    "phone": "+8801234567890",
    "address": "123 Main St, Dhaka"
  }'

# Get seller user ID from response, then assign role
curl -X POST http://localhost:3001/rbac/users/{userId}/roles \
  -H "Authorization: Bearer {superadmin_token}" \
  -d '{
    "roleId": "{seller_role_id}"
  }'

# Verify seller
curl -X PUT http://localhost:3008/sellers/{userId}/verify \
  -H "Authorization: Bearer {superadmin_token}" \
  -d '{
    "verified": true
  }'
```

### Create Test Delivery Men

```bash
# Create user (same as seller)
# Then create delivery person entry

# Assign DELIVERY_MAN role
curl -X POST http://localhost:3001/rbac/users/{userId}/roles \
  -H "Authorization: Bearer {superadmin_token}" \
  -d '{
    "roleId": "{delivery_man_role_id}"
  }'
```

---

## Step 6: Verify Installation

### Check All Services Are Running

```bash
# Auth Service
curl http://localhost:3001/health
# Response: { "status": "ok" }

# User Service
curl http://localhost:3008/health

# Order Service
curl http://localhost:3004/health
```

### Verify RBAC Endpoints

```bash
# Get permissions reference
curl http://localhost:3001/rbac/permission-codes
# Should return all permission codes

# Get roles
curl http://localhost:3001/rbac/roles \
  -H "Authorization: Bearer {token}"
# Should return default roles

# Get a user's roles
curl http://localhost:3001/rbac/users/{userId}/roles \
  -H "Authorization: Bearer {token}"
# Should return roles and permissions
```

### Verify Seller Endpoints

```bash
# Create seller profile
curl -X POST http://localhost:3008/sellers \
  -H "Authorization: Bearer {token}" \
  -d '{ "shopName": "Test", "shopSlug": "test-shop" }'

# Get all sellers
curl http://localhost:3008/sellers
# Should return list of sellers
```

### Verify Delivery Endpoints

```bash
# Create order first, then
curl -X POST http://localhost:3004/orders/{orderId}/delivery \
  -H "Authorization: Bearer {token}" \
  -d '{ "provider": "INHOUSE" }'

# Get delivery stats
curl http://localhost:3004/deliveries/stats \
  -H "Authorization: Bearer {admin_token}"
```

---

## Step 7: Docker Compose Setup

Update your `docker-compose.yml`:

```yaml
version: '3.8'

services:
  # ... existing services ...

  auth-service:
    build: ./services/auth-service
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=development
      - PORT=3001
      - DATABASE_URL=postgresql://freeshop:password@postgres:5432/auth_db
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
      - rabbitmq

  user-service:
    build: ./services/user-service
    ports:
      - "3008:3008"
    environment:
      - NODE_ENV=development
      - PORT=3008
      - DATABASE_URL=postgresql://freeshop:password@postgres:5432/user_db
      - AUTH_SERVICE_URL=http://auth-service:3001
    depends_on:
      - postgres
      - rabbitmq

  order-service:
    build: ./services/order-service
    ports:
      - "3004:3004"
    environment:
      - NODE_ENV=development
      - PORT=3004
      - DATABASE_URL=postgresql://freeshop:password@postgres:5432/order_db
      - AUTH_SERVICE_URL=http://auth-service:3001
      - USER_SERVICE_URL=http://user-service:3008
    depends_on:
      - postgres
      - rabbitmq
```

---

## Step 8: Testing

### Run Unit Tests (for each service)

```bash
cd services/auth-service
npm run test

cd services/order-service
npm run test

cd services/user-service
npm run test
```

### Manual API Testing

Use Postman or similar:

1. Import the endpoint collection
2. Set variables:
   - `baseUrl`: http://localhost:3001
   - `token`: Your JWT token
   - `superadminToken`: Superadmin JWT token

3. Test each endpoint:
   - RBAC initialization
   - Role creation
   - User role assignment
   - Seller creation
   - Order creation with seller
   - Delivery assignment
   - Status updates

---

## Step 9: Development Workflow

### Watch Mode

Run all services in watch mode:

```bash
# Terminal 1 - Auth Service
cd services/auth-service
npm run dev

# Terminal 2 - User Service
cd services/user-service
npm run dev

# Terminal 3 - Order Service
cd services/order-service
npm run dev
```

### Database Changes

When updating Prisma schema:

```bash
# After modifying schema.prisma
npx prisma format          # Format schema
npx prisma migrate dev     # Create and apply migration
npx prisma generate        # Regenerate Prisma client
```

### Code Changes

TypeScript files are auto-compiled:

```bash
npm run dev  # Restarts on file changes
```

---

## Troubleshooting

### Database Connection Issues

```bash
# Check connection string
echo $DATABASE_URL

# Test connection
npx prisma db execute --stdin < check_connection.sql

# Reset database (⚠️ deletes all data)
npx prisma migrate reset
```

### Migration Issues

```bash
# View migration status
npx prisma migrate status

# Resolve migration issues
npx prisma migrate resolve --rolled-back

# Create empty migration to investigate
npx prisma migrate dev --name debug_migration
```

### Service Connection Issues

```bash
# Check service is running
curl http://localhost:3001/health

# Check network connectivity
docker network ls
docker network inspect freeshop_default

# View service logs
docker logs auth-service
docker logs user-service
docker logs order-service
```

### RBAC Issues

```bash
# Check if RBAC is initialized
curl http://localhost:3001/rbac/roles

# Check user roles
curl http://localhost:3001/rbac/users/{userId}/roles

# Check audit logs
curl http://localhost:3001/rbac/audit-logs

# Reinitialize RBAC (if needed)
curl -X POST http://localhost:3001/rbac/init
```

### Permission Issues

```bash
# Get permission reference
curl http://localhost:3001/rbac/permission-codes

# Check specific permission
curl http://localhost:3001/rbac/users/{userId}/permissions/{code}/check

# Verify role has permission
curl http://localhost:3001/rbac/roles/{roleId}
```

---

## Next Steps

1. ✅ **Set up local development** - Run migrations and seed data
2. ✅ **Test core functionality** - RBAC, sellers, deliveries
3. 🔄 **Integrate with frontend** - Use permission codes in UI
4. 🔄 **Set up third-party providers** - Steadfast, Pathao, RedX APIs
5. 🔄 **Implement webhooks** - Delivery status updates from providers
6. 🔄 **Set up monitoring** - Logs, metrics, alerts
7. 🔄 **Deploy to production** - Follow deployment guide

---

## Deployment Checklist

- [ ] All migrations applied
- [ ] RBAC system initialized
- [ ] Environment variables configured
- [ ] Database backups automated
- [ ] Service health checks in place
- [ ] Logging and monitoring configured
- [ ] Third-party APIs integrated and tested
- [ ] Security hardening completed
- [ ] Load testing completed
- [ ] Disaster recovery plan ready

---

**Version:** 1.0  
**Last Updated:** January 2024  
**For Questions:** Contact DevOps Team
