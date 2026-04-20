# Database Migration Guide

## 🔄 Workflow: How to Create & Deploy Migrations

### Step 1: Modify Your Schema
Edit any `services/*/prisma/schema.prisma` file:

```bash
# Example: Add a field to User model
nano services/auth-service/prisma/schema.prisma
```

### Step 2: Create Migration Locally
**Always run this before committing:**

```bash
# Generate migration file locally
pnpm -C services/auth-service exec prisma migrate dev --name add_new_field

# This will:
# ✓ Create a new migration file in prisma/migrations/
# ✓ Apply it to your local database
# ✓ Update the Prisma client
```

### Step 3: Commit Migration Files
**Migration files MUST be committed to git:**

```bash
git add services/auth-service/prisma/migrations/
git commit -m "Add user field migration"
```

### Step 4: Push to Dev Branch
```bash
git push origin dev
```

### Step 5: CI/CD Automatically Builds Image
✓ CI generates Prisma client  
✓ CI builds Docker image with migration files  
✓ Image is pushed to registry  

### Step 6: K8s Deployment Runs Init Container
When you deploy to K8s:

```bash
kubectl apply -f k8s/services/auth-service/auth-service.yaml
```

**Init container automatically:**
1. Runs `npx prisma migrate deploy` (applies all migrations)
2. Runs `node --import=tsx ./prisma/seed.ts` (seeds database)
3. Then main service starts

---

## ⚠️ Common Mistakes

### ❌ Modified schema but forgot to create migration
```bash
# DON'T do this:
git add services/auth-service/prisma/schema.prisma
git commit -m "Updated schema"
git push

# Result: Deployment will FAIL because migration files are missing!
```

### ✅ Correct Way
```bash
# DO this:
pnpm -C services/auth-service exec prisma migrate dev --name describe_change
git add services/auth-service/prisma/migrations/
git add services/auth-service/prisma/schema.prisma
git commit -m "Add new user field with migration"
git push
```

---

## 🏗️ For All 9 Services

If you modify schemas in multiple services:

```bash
# Auth service
pnpm -C services/auth-service exec prisma migrate dev --name your_migration_name

# User service  
pnpm -C services/user-service exec prisma migrate dev --name your_migration_name

# Product service
pnpm -C services/product-service exec prisma migrate dev --name your_migration_name

# ... repeat for all modified services

# Then commit all migration files:
git add services/*/prisma/migrations/
git commit -m "Add migrations for new features"
git push
```

---

## 📋 Checklist Before Pushing

- [ ] Modified `schema.prisma`?
- [ ] Ran `prisma migrate dev --name migration_name`?
- [ ] Migration files created in `prisma/migrations/`?
- [ ] Committed migration files to git?
- [ ] Tested locally with docker-compose?

---

## 🔍 Verify Migrations

### Locally
```bash
# See all migrations
ls services/auth-service/prisma/migrations/

# Test migration locally
docker-compose down
docker-compose up -d postgres
pnpm -C services/auth-service exec prisma migrate deploy
```

### On VPS
```bash
# Check migration history
kubectl exec -it <auth-service-pod> -n freeshop -- sh -c "cd /app/services/auth-service && npx prisma migrate status"

# View migration files in image
kubectl exec -it <auth-service-pod> -n freeshop -- ls /app/services/auth-service/prisma/migrations/
```

---

## 🆘 If Migrations Fail

If deployment init container fails with migration errors:

```bash
# 1. Check init container logs
kubectl logs -f <pod-name> -n freeshop -c migrate-database

# 2. Manual fix on K8s
kubectl exec -it <pod-name> -n freeshop -- sh -c "cd /app/services/auth-service && npx prisma migrate resolve --rolled-back <migration_name>"

# 3. Or rollback and reapply
kubectl rollout undo deployment/auth-service -n freeshop
```

---

## 📚 Prisma Documentation
- [Prisma Migrations](https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate)
- [Common Migration Issues](https://www.prisma.io/docs/orm/prisma-migrate/troubleshooting)
