# Rollback Strategy Guide

**Last Updated**: April 2026  
**Status**: Pre-Conversion (Before Helm Migration)  
**Scope**: All 10 microservices, PostgreSQL databases, Kubernetes cluster

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Rollback Levels](#rollback-levels)
3. [Application Rollback](#application-rollback-level-1)
4. [Database Rollback](#database-rollback-level-2)
5. [Infrastructure Rollback](#infrastructure-rollback-level-3)
6. [Pre-Rollback Safety Checklist](#pre-rollback-safety-checklist)
7. [Phase-Specific Rollback Procedures](#phase-specific-rollback-procedures)
8. [Rollback Decision Tree](#rollback-decision-tree)
9. [Time Estimates & RTO/RPO](#time-estimates--rtorpo)
10. [Rollback Dry-Run (Staging)](#rollback-dry-run-staging)
11. [Post-Rollback Verification](#post-rollback-verification)

---

## Overview

This guide provides tested procedures to rollback the Helm + GitHub Actions conversion at any stage. It covers three rollback levels:

- **Level 1 (Fast)**: Application code/container issues → Rollback in 1-5 minutes
- **Level 2 (Medium)**: Database migration problems → Rollback in 30-60 minutes
- **Level 3 (Slow)**: Complete infrastructure failure → Rollback in 1-2 hours

**Key Principle**: Each rollback level assumes the lower level failed or isn't sufficient.

---

## Rollback Levels

### Quick Reference Table

| Level | Scenario | Method | Time | Data Loss | Complexity |
|-------|----------|--------|------|-----------|------------|
| 1 | Code bug, service crash | Helm/GitHub | 2-5 min | None | Low |
| 2 | Migration failure, data corruption | DB Restore | 30-60 min | ≤24h | Medium |
| 3 | Complete K8s/Helm failure | Full Restore | 1-2 hours | ≤7 days | High |

---

## Application Rollback (Level 1)

### ✅ When to Use Level 1

- New code introduced a bug that breaks endpoints
- Service crashes or goes into CrashLoopBackOff
- Deployment completed but services are unhealthy
- Helm chart syntax issue causes pods to fail
- **Time to detect**: Usually within 5-30 minutes via monitoring/alerts

### 1️⃣ Rollback via Helm (Recommended)

**Fastest method for Helm deployments**

```bash
# Step 1: Check release history
helm history freeshop

# Output example:
# REVISION  UPDATED                 STATUS      CHART           APP VERSION  DESCRIPTION
# 5         2026-04-08 14:30:00     DEPLOYED    freeshop-1.0.0  1.0.0       Upgrade complete
# 4         2026-04-08 14:25:00     SUPERSEDED  freeshop-1.0.0  1.0.0       Upgrade complete
# 3         2026-04-08 14:20:00     SUPERSEDED  freeshop-1.0.0  1.0.0       Upgrade complete

# Step 2: Rollback to previous release
helm rollback freeshop 4  # Rollback to revision 4 (previous stable)

# Step 3: Verify pods restarting with old image
kubectl get pods -w
kubectl logs deployment/auth-service

# Step 4: Wait for health checks to pass
kubectl rollout status deployment/auth-service
```

**Advantages**:
- ✅ Reverses all changes instantly (image, config, replicas, HPA)
- ✅ 1-2 minute rollout time
- ✅ No data changes to database
- ✅ Kubernetes handles rolling update automatically

**Rollback Command Reference**:
```bash
# Rollback to immediate previous version
helm rollback freeshop

# Rollback to specific revision
helm rollback freeshop 4

# Rollback with custom waiting time
helm rollback freeshop 4 --wait --timeout 5m

# Check rollback status
helm status freeshop
helm history freeshop
```

---

### 2️⃣ Rollback via GitHub Actions (Code-Based Rollback)

**Tracks entire rollback in Git history**

```bash
# Step 1: Identify problematic commit
git log --oneline -10

# Output:
# a1b2c3d (HEAD) Fix: Update service permissions - BROKEN
# f4e5d6c Fix: Helm chart values - OK
# 7g8h9i0 Feature: Add caching layer
# ...

# Step 2: Revert the problematic commit
git revert a1b2c3d  # Creates new commit that undoes a1b2c3d

# Step 3: Push to trigger GitHub Actions
git push origin new_convertion

# Step 4: Monitor GitHub Actions deployment
# - Open GitHub repo → Actions tab
# - Watch deploy workflow run
# - New image built with reverted code
# - K8s automatically pulls new image and redeploys

# Step 5: Verify services are healthy
kubectl get pods
kubectl logs deployment/auth-service
```

**Advantages**:
- ✅ Complete audit trail (Git shows what changed, why it was reverted)
- ✅ Entire team sees the rollback in commit history
- ✅ Automatic build + deployment via GitHub Actions
- ✅ Easy to identify what was reverted

**Git Revert vs Reset**:
```bash
# Use REVERT (recommended) - creates new commit
git revert <commit-sha>  # Safe, audit trail

# DON'T use RESET - rewrites history
git reset --hard <commit-sha>  # Dangerous, loses commits
```

---

### 3️⃣ Rollback via kubectl (Emergency Only)

**Use ONLY if Helm/GitHub Actions unavailable**

```bash
# Check rollout history
kubectl rollout history deployment/product-service

# Output:
# deployment.apps/product-service
# REVISION  CHANGE-CAUSE
# 5         <none>
# 4         <none>
# 3         <none>

# Undo to previous revision
kubectl rollout undo deployment/product-service

# Undo to specific revision
kubectl rollout undo deployment/product-service --to-revision=3

# Check status
kubectl rollout status deployment/product-service

# Verify all pods running
kubectl get pods -l app=product-service
```

**Limitations**:
- ⚠️ No Helm chart benefits (config management lost)
- ⚠️ Changes lost when next Helm deployment runs
- ⚠️ Use only as emergency measure

---

## Database Rollback (Level 2)

### ⚠️ Critical: Migrations Are Forward-Only

**Important**: Prisma migrations cannot auto-rollback schema changes. Always prepare for manual restore.

### When to Use Level 2

- Migration corrupted data (wrong WHERE clause, deleted records)
- Migration failed partway through (DB left in inconsistent state)
- New schema incompatible with application code
- Data integrity check fails (constraints violated)
- **Time to detect**: 5-60 minutes after deployment

---

### 1️⃣ Prevent Issues: Reversible Migrations

**Create up/down migrations for every change** (BEFORE Phase 1):

```typescript
// File: services/auth-service/prisma/migrations/[timestamp]_reversible_change/migration.sql

-- Add nullable column (reversible)
ALTER TABLE "User" ADD COLUMN "email_verified" BOOLEAN DEFAULT false;

-- DON'T do this (irreversible):
-- DELETE FROM "User" WHERE email IS NULL;
-- ALTER TABLE "User" ALTER COLUMN email SET NOT NULL;

-- Instead, use reversible pattern:
-- UP: Add column
-- DOWN: Remove column
```

**Migration Structure**:
```sql
-- migration.sql (UP)
BEGIN;
  ALTER TABLE "User" ADD COLUMN "email_verified" BOOLEAN DEFAULT false;
COMMIT;

-- In separate folder: down_migration.sql (DOWN) - NOT USED BY PRISMA
BEGIN;
  ALTER TABLE "User" DROP COLUMN "email_verified";
COMMIT;
```

**Store down migrations in version control**:
```
services/auth-service/prisma/migrations/
├── [timestamp]_initial_schema/
│   └── migration.sql
├── [timestamp]_add_email_verified/
│   ├── migration.sql (UP)
│   └── down.sql (DOWN - for manual rollback)
```

---

### 2️⃣ Pre-Deployment Database Backup

**DO THIS BEFORE EVERY DEPLOYMENT**:

```bash
#!/bin/bash
# backup-databases.sh

BACKUP_DIR="./backups/databases"
TIMESTAMP=$(date +%s)
BACKUP_TAG="pre-migration-phase5"

mkdir -p $BACKUP_DIR

# Backup all 9 databases
for SERVICE in auth product order payment user vendor inventory notification analytics; do
    DB_NAME="freeshop_${SERVICE}"
    BACKUP_FILE="$BACKUP_DIR/${DB_NAME}-${BACKUP_TAG}-${TIMESTAMP}.sql"
    
    echo "Backing up $DB_NAME..."
    pg_dump -U postgres $DB_NAME > $BACKUP_FILE
    gzip $BACKUP_FILE
    
    echo "✓ Backed up to $BACKUP_FILE.gz"
done

# Generate backup manifest
cat > $BACKUP_DIR/BACKUP_MANIFEST_${TIMESTAMP}.txt << EOF
Backup timestamp: ${TIMESTAMP}
Backup tag: ${BACKUP_TAG}
Created: $(date)
Git commit: $(git rev-parse HEAD)
Git branch: $(git rev-parse --abbrev-ref HEAD)
Databases backed up: 9
    - freeshop_auth
    - freeshop_product
    - freeshop_order
    - freeshop_payment
    - freeshop_user
    - freeshop_vendor
    - freeshop_inventory
    - freeshop_notification
    - freeshop_analytics
EOF

echo "✓ All databases backed up. Manifest: $BACKUP_DIR/BACKUP_MANIFEST_${TIMESTAMP}.txt"
```

**Run before Phase 4 & 5**:
```bash
chmod +x backup-databases.sh
./backup-databases.sh

# Verify backups
ls -lh backups/databases/ | tail -20
```

---

### 3️⃣ Rollback a Failed Migration

**If migration corrupted data:**

```bash
# Step 1: STOP all services immediately
helm upgrade freeshop ./helm/freeshop \
  --set replicaCount=0 \
  --wait

echo "All pods stopped. Now rolling back..."

# Step 2: Identify which migration failed
kubectl logs deployment/auth-service | grep -i "prisma\|migrate"

# Step 3: Locate backup file (from manifest)
cat backups/databases/BACKUP_MANIFEST_*.txt
# Find backup taken BEFORE the deployment

ls -lh backups/databases/freeshop_auth*.gz

# Step 4: Stop PostgreSQL connections to the database
psql -U postgres << EOF
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'freeshop_auth'
  AND pid <> pg_backend_pid();
EOF

# Step 5: Drop corrupted database and restore from backup
psql -U postgres -c "DROP DATABASE IF EXISTS freeshop_auth;"

# Step 6: Restore from backup
gunzip < backups/databases/freeshop_auth-pre-migration-phase5-*.sql.gz | psql -U postgres

echo "✓ Database restored from backup"

# Step 7: Verify data integrity
psql -U postgres freeshop_auth << EOF
  SELECT COUNT(*) as user_count FROM "User";
  SELECT COUNT(*) as role_count FROM "Role";
  SELECT COUNT(*) as permission_count FROM "Permission";
EOF

# Step 8: Resolve the migration (tell Prisma it failed and needs fixing)
# INSIDE THE SERVICE CONTAINER:
npx prisma migrate resolve --rolled-back "<migration-name>"

# Example:
# npx prisma migrate resolve --rolled-back "add_email_verified"

# Step 9: Redeploy with PREVIOUS image/code that was working
helm upgrade freeshop ./helm/freeshop \
  --set image.tag=<previous-working-sha> \
  --set replicaCount=3 \
  --wait

# Step 10: Verify all services healthy
kubectl get pods
kubectl logs deployment/auth-service
```

**Complete Rollback Example Scenario**:

```bash
# Scenario: Phase 5 deployment breaks auth-service data

# 1. Detect issue
kubectl logs deployment/auth-service
# ERROR: Migration failed at step 5 of 8

# 2. Stop all services
helm upgrade freeshop ./helm/freeshop --set replicaCount=0

# 3. Restore auth database
gunzip < backups/databases/freeshop_auth-pre-migration-phase5-1712604000.sql.gz | psql -U postgres

# 4. Tell Prisma the migration failed
kubectl run migration-resolver --image=ghcr.io/dipjitbaroi/auth:v1.0.0-stable \
  --command -- npx prisma migrate resolve --rolled-back "add_email_verified"

# 5. Redeploy previous version
helm upgrade freeshop ./helm/freeshop \
  --set image.tag=v1.0.0-stable

# 6. Verify
kubectl get pods
kubectl logs deployment/auth-service
```

---

## Infrastructure Rollback (Level 3)

### 🚨 When to Use Level 3

- Helm charts completely broken (can't even deploy)
- Kubernetes cluster partially down
- All services down simultaneously
- Database won't restore from backup
- **Time to detect**: Immediate (all services dead)

---

### 1️⃣ Full Infrastructure Rollback Process

**Go back to raw Kubernetes YAML manifests**:

```bash
# Step 1: Check what we're backing up
ls -la k8s/

# Should see:
# - namespace.yaml
# - services/
# - deployments/ (one per service)
# - infrastructure/ (postgres, redis, rabbitmq)
# - ingress/

# Step 2: BEFORE PHASE 1, backup current state
mkdir -p k8s-backup/v1.0.0-raw-yaml
cp -r k8s/* k8s-backup/v1.0.0-raw-yaml/

# Commit to Git
git add k8s-backup/v1.0.0-raw-yaml/
git commit -m "Backup: Pre-Helm conversion K8s manifests"
git tag v1.0.0-pre-helm-conversion

# Step 3: If Helm fails catastrophically, revert to old manifests
cd k8s-backup/v1.0.0-raw-yaml/

# Stop Helm deployment first (if possible)
helm uninstall freeshop || true

# Step 4: Apply old K8s manifests
kubectl apply -f namespace.yaml
kubectl apply -f infrastructure/
kubectl apply -f services/
kubectl apply -f ingress/

# Step 5: Verify pods coming up
kubectl get pods -w
kubectl get svc

# Step 6: Check service health
kubectl logs deployment/auth-service
curl http://api-gateway:8000/health
```

---

### 2️⃣ Restore Infrastructure in Order

**Correct order prevents initialization issues**:

```bash
# Order is important! Don't skip steps.

# 1. Namespace
kubectl apply -f k8s-backup/v1.0.0-raw-yaml/namespace.yaml
kubectl get namespace freeshop

# 2. Infrastructure (PostgreSQL, Redis, RabbitMQ)
kubectl apply -f k8s-backup/v1.0.0-raw-yaml/infrastructure/
kubectl get statefulset
kubectl get pvc

# 3. Wait for infrastructure ready (CRITICAL!)
kubectl wait --for=condition=Ready pod \
  -l app=postgres --timeout=300s -n freeshop

# 4. Services
kubectl apply -f k8s-backup/v1.0.0-raw-yaml/services/
kubectl get deployment

# 5. Wait for services ready
kubectl wait --for=condition=Available deployment \
  --all --timeout=300s -n freeshop

# 6. Ingress
kubectl apply -f k8s-backup/v1.0.0-raw-yaml/ingress/
kubectl get ingress
```

---

### 3️⃣ Verify Infrastructure Health

```bash
#!/bin/bash
# verify-infrastructure.sh

echo "=== Pod Status ==="
kubectl get pods -n freeshop

echo -e "\n=== Service Status ==="
kubectl get svc -n freeshop

echo -e "\n=== Database Status ==="
kubectl logs statefulset/postgres -n freeshop | tail -10

echo -e "\n=== Auth Service Logs ==="
kubectl logs deployment/auth-service -n freeshop --tail=20

echo -e "\n=== API Gateway Health ==="
kubectl port-forward svc/api-gateway 8000:8000 &
sleep 2
curl http://localhost:8000/health
kill %1
```

---

## Pre-Rollback Safety Checklist

### Do This BEFORE Phase 4 (Staging Testing)

- [ ] **Database Backups**
  - [ ] Test `pg_dump` on all 9 databases
  - [ ] Verify backup files are readable
  - [ ] Test restore process on staging (don't skip!)
  - [ ] Set up automated daily backups
  - [ ] Backup retention policy: Keep 7 days + 4 weekly + 12 monthly
  - [ ] Store backups in 2 locations (local + S3 or external drive)

- [ ] **Image Management**
  - [ ] Keep last 3 working image tags in GHCR:
    ```bash
    docker tag ghcr.io/dipjitbaroi/auth:main-sha-a1b2c3d \
               ghcr.io/dipjitbaroi/auth:stable-v1.0.0
    docker push ghcr.io/dipjitbaroi/auth:stable-v1.0.0
    ```
  - [ ] Tag releases in semantic versioning (v1.0.0, v1.0.1)
  - [ ] Keep SHA tags for last 5 deployments

- [ ] **Code Control**
  - [ ] Create git tag before Phase 1: `git tag v1.0.0-pre-helm-conversion`
  - [ ] Every deployment tagged: `git tag v1.0.0`, `v1.0.1`, etc.
  - [ ] Main branch protected (requires PR review)
  - [ ] Require status checks to pass before merge
  - [ ] Require at least 1 approval

- [ ] **Kubernetes Backup**
  - [ ] Back up current K8s manifests: `cp -r k8s k8s-backup/v1.0.0-raw-yaml`
  - [ ] Commit backup to Git: `git add k8s-backup/ && git commit -m "..."`
  - [ ] Export current deployments:
    ```bash
    kubectl get all -A -o yaml > k8s-current-state-$(date +%s).yaml
    ```

- [ ] **Helm Chart Readiness**
  - [ ] Helm charts created and tested locally
  - [ ] `helm template` output verified
  - [ ] `helm lint` passes
  - [ ] Values files documented
  - [ ] Sample deployment tested on staging

- [ ] **Monitoring & Alerting**
  - [ ] Prometheus scraping metrics from all services
  - [ ] AlertManager configured
  - [ ] Critical alerts: PodCrashLoopBackOff, HighErrorRate, DBConnectionFailed
  - [ ] Slack/PagerDuty channel configured for alerts
  - [ ] On-call rotation defined

- [ ] **Health Checks**
  - [ ] All services have `/health` endpoint
  - [ ] Liveness probes configured (restart if unhealthy)
  - [ ] Readiness probes configured (remove from LB if unhealthy)
  - [ ] Startup probes for slow-starting services

- [ ] **Documentation**
  - [ ] Rollback playbook documented (this file)
  - [ ] Team trained on rollback procedures
  - [ ] On-call engineer has access to playbook
  - [ ] Runbook for each service's common issues

---

## Phase-Specific Rollback Procedures

### Phase 1: Helm Chart Creation

**If Helm charts fail to install**:

```bash
# Check what went wrong
helm lint ./helm/freeshop
helm template freeshop ./helm/freeshop > /tmp/manifest.yaml
kubectl apply --dry-run=client -f /tmp/manifest.yaml

# Fix the issue locally
# (modify chart YAML)

# Verify fix
helm template freeshop ./helm/freeshop | kubectl apply --dry-run=client -f -

# Try install again
helm install freeshop ./helm/freeshop

# If still broken, uninstall and keep using old K8s
helm uninstall freeshop
kubectl apply -f k8s/
```

**No rollback needed** - nothing deployed yet.

---

### Phase 2: Service-Specific Values

**If HPA causes too much scaling**:

```bash
# Check current HPA state
kubectl get hpa

# See what it's scaling to
kubectl describe hpa product-service-hpa

# Fix values.yaml
# Edit: helm/freeshop/values-prod.yaml
# Change: maxReplicas: 5 → maxReplicas: 2

# Upgrade Helm
helm upgrade freeshop ./helm/freeshop -f values-prod.yaml

# Verify HPA behavior
kubectl get hpa -w
```

---

### Phase 3: GitHub Actions Update

**If GitHub Actions deployment fails**:

```bash
# Check GitHub Actions logs
# Open: GitHub repo → Actions → Latest run → See error

# Identify which step failed
# Most likely: migration step or Helm upgrade step

# Option 1: Fix and re-run
# Edit: .github/workflows/deploy.yml
git add .github/workflows/deploy.yml
git commit -m "Fix: GitHub Actions deployment step"
git push

# Option 2: Revert workflow
git revert <commit-with-broken-workflow>
git push
# Old workflow (without broken step) re-activates

# Verify new run completes successfully
# Check GitHub Actions tab
```

---

### Phase 4: Staging Deployment

**If staging deployment causes issues**:

```bash
# Helm rollback on staging
helm rollback freeshop --kubeconfig=$STAGING_KUBECONFIG

# Or revert code
git revert <problematic-commit>
git push

# GitHub Actions automatically redeploys to staging

# Fix the issue
# Test thoroughly on staging
# Commit fix
git push

# Staging now ready for proper testing
```

---

### Phase 5: Production Migration

**If production has issues**:

```bash
# MOST CRITICAL PHASE - Use lowest-level rollback if higher ones fail

# Level 1: Helm rollback
helm rollback freeshop --wait --timeout 5m

# Check services
kubectl get pods
kubectl logs deployment/auth-service

# If Level 1 doesn't work, check if database migration failed
# Level 2: Database restore (see earlier in document)

# If both fail
# Level 3: Full infrastructure restore
kubectl delete -f helm/freeshop
kubectl apply -f k8s-backup/v1.0.0-raw-yaml/

# After any rollback, verify ALL services healthy
kubectl get deployment
kubectl get hpa
curl http://api-gateway/health
```

---

## Rollback Decision Tree

```
SERVICE UNHEALTHY?
│
├─ YES → Is pod restarting? (CrashLoopBackOff)
│         │
│         ├─ YES → Code issue (bug in new version)
│         │        → ACTION: Helm rollback or git revert
│         │        → TIME: 2-5 minutes
│         │
│         └─ NO → Stuck in Pending state
│                 → Check: kubectl describe pod <pod-name>
│                 → Likely: Init container failed (migration issue)
│                 → ACTION: Database restore (Level 2)
│                 → TIME: 30-60 minutes
│
└─ NO → Service running but returning errors
        │
        ├─ YES → Database query errors? (permission errors, data type mismatches)
        │        → ACTION: Database restore OR code rollback
        │        → TIME: 30-60 minutes (restore) or 2-5 min (Helm)
        │
        └─ NO → Check logs for root cause
               → kubectl logs deployment/<service>
```

---

## Time Estimates & RTO/RPO

### RTO: Recovery Time Objective (How long before system works again)

| Rollback Level | Scenario | RTO | Method |
|---|---|---|---|
| 1 | Code bug | 2-5 min | Helm rollback |
| 1 | Bad config | 5-10 min | GitHub Actions revert |
| 2 | Migration failed | 30-60 min | Database restore |
| 3 | Full system down | 1-2 hours | Complete revert to K8s YAML |

### RPO: Recovery Point Objective (How much data do we lose)

| Backup Strategy | RPO | Method |
|---|---|---|
| No backups | 24+ hours | Manual recovery (BAD!) |
| Daily automated | 24 hours | cron job backup daily |
| **Hourly automated** | **1 hour** | PostgreSQL WAL archiving |
| **Pre-deployment** | **0 minutes** | Backup before every deploy |

**Recommended**: Pre-deployment backup before Phase 4 & 5, then hourly automated backups.

---

## Rollback Dry-Run (Staging)

### Practice BEFORE Production (Phase 4)

```bash
# Scenario: Practice rolling back application deployment on staging

# 1. Deploy new version to staging
helm install freeshop-staging ./helm/freeshop \
  --namespace staging \
  --values values-staging.yaml

# 2. Verify deployment successful
kubectl get pods -n staging
kubectl logs deployment/auth-service -n staging

# 3. Introduce a "broken" version
git checkout -b test/rollback-practice
echo "BREAK_ME=true" >> services/auth-service/.env
git add . && git commit -m "Test: Intentional break for rollback practice"
git push origin test/rollback-practice

# Wait for GitHub Actions to redeploy to staging
# Services should start crashing

# 4. TIME: How long until you notice the issue?
# Typically 2-5 minutes for monitoring alerts

# 5. Execute rollback
helm history freeshop-staging
helm rollback freeshop-staging -n staging

# 6. TIME: How long to rollback?
# Make note: _____ minutes

# 7. Verify services healthy
kubectl get pods -n staging
kubectl logs deployment/auth-service -n staging

# 8. Cleanup
git checkout new_convertion
git branch -D test/rollback-practice
git push origin --delete test/rollback-practice
```

**Record Results**:
```
Rollback Dry-Run Results (Staging) - Phase 4
Date: ___________
Time to detect issue: _____ minutes
Time to rollback: _____ minutes
Services restored: Yes / No
Data integrity: Verified / Not verified
Team comments:

Lesson learned:
  _____________________________________________________________________
```

---

## Post-Rollback Verification

### After any rollback, verify with these checks:

```bash
#!/bin/bash
# post-rollback-verification.sh

echo "=== 1. POD STATUS ==="
kubectl get pods
echo "Expected: All pods Running/Ready"

echo -e "\n=== 2. DEPLOYMENT STATUS ==="
kubectl get deployment
echo "Expected: All Desired match Current/Available"

echo -e "\n=== 3. HEALTH CHECKS ==="
# Health check for auth-service
kubectl port-forward svc/auth-service 3001:3001 &
sleep 2
curl http://localhost:3001/health
kill %1

# Health check for product-service
kubectl port-forward svc/product-service 3002:3002 &
sleep 2
curl http://localhost:3002/health
kill %1

# Health check for API Gateway
kubectl port-forward svc/api-gateway 8000:8000 &
sleep 2
curl http://localhost:8000/health
kill %1

echo -e "\n=== 4. DATABASE CONNECTIVITY ==="
kubectl logs deployment/auth-service | grep -i "database"
echo "Expected: No connection errors"

echo -e "\n=== 5. SERVICE INTER-COMMUNICATION ==="
kubectl logs deployment/order-service | grep -i "error\|timeout"
echo "Expected: No communication errors"

echo -e "\n=== 6. DATA INTEGRITY CHECK ==="
# Run in auth-service pod
kubectl exec deployment/auth-service -- \
  npx prisma db execute --stdin << 'EOF'
SELECT COUNT(*) as user_count FROM "User";
SELECT COUNT(*) as role_count FROM "Role";
SELECT COUNT(*) as permission_count FROM "Permission";
EOF

echo -e "\n=== 7. RECENT ERRORS IN LOGS ==="
for service in auth product order payment user vendor inventory notification analytics; do
    echo "--- $service-service ---"
    kubectl logs deployment/$service-service --since=5m | grep -i "ERROR\|WARN\|FATAL" || echo "No errors"
done

echo -e "\n=== 8. RESOURCE USAGE ==="
kubectl top nodes
kubectl top pods -n freeshop
echo "Expected: Memory/CPU within limits"

echo -e "\n=== 9. HPA STATUS ==="
kubectl get hpa
echo "Expected: Replicas match target"

echo -e "\n=== 10. FINAL STATUS ==="
echo "✓ Rollback verification complete"
echo "If any warnings above, investigate before declaring system healthy"
```

**Run after rollback**:
```bash
chmod +x post-rollback-verification.sh
./post-rollback-verification.sh
```

---

## Rollback Communication Template

**Use when you actually rollback to production**:

```
Subject: PRODUCTION ALERT: Service rollback executed

Timeline:
- 14:22 UTC: Deployment started (Phase 5 migration)
- 14:25 UTC: Monitoring detected high error rate (>5%)
- 14:27 UTC: Root cause identified (migration broke auth service)
- 14:28 UTC: Decision made to rollback
- 14:30 UTC: Helm rollback executed
- 14:35 UTC: All services confirmed healthy
- 14:40 UTC: Database restore started
- 15:05 UTC: Database verification completed
- 15:10 UTC: System returned to normal operation

Impact:
- User-facing downtime: ~10 minutes (14:25-14:35)
- Data affected: None (all within last hourly backup)
- Root cause: Migration query with wrong WHERE clause
- Affected transactions: Approximately 150 orders in inconsistent state

Next steps:
- Moment Investigation: Will create detailed post-mortem
- Code review: Will add data validation before migration runs
- Process improvement: Will require staging test for schema changes
- RCA meeting: Tomorrow 10:00 AM UTC

Questions? Contact: on-call-engineer@company.com
```

---

## Troubleshooting: Rollback Not Working

### If Helm rollback doesn't work:

```bash
# Check Helm status
helm status freeshop

# Try explicit wait
helm rollback freeshop --wait --timeout 10m

# Check what's blocking
kubectl describe pod deployment/auth-service
kubectl logs deployment/auth-service

# If pod won't start, check:
kubectl get events -n freeshop | tail -20
```

### If kubectl rollout undo doesn't work:

```bash
# Check rollout history
kubectl rollout history deployment/auth-service

# If history empty, apply old deployment YAML manually
kubectl apply -f k8s-backup/v1.0.0-raw-yaml/services/auth-service/deployment.yaml
```

### If database restore fails:

```bash
# Check database status
psql -U postgres -l

# Try restoring to different name first
gunzip < backup.sql.gz | psql -U postgres -d postgres
# Then rename or migrate data

# Check backup file integrity
psql -U postgres --single-transaction < backup.sql

# If still fails, contact DBA or database team
```

---

## Appendix: Quick Reference Commands

```bash
# ===== LEVEL 1: APPLICATION ROLLBACK =====

# Helm rollback
helm history freeshop
helm rollback freeshop <revision>

# GitHub Actions rollback
git revert <commit-sha>
git push

# Kubectl rollback
kubectl rollout undo deployment/<service>

# ===== LEVEL 2: DATABASE ROLLBACK =====

# Backup databases
./backup-databases.sh

# Stop all services
helm upgrade freeshop ./helm/freeshop --set replicaCount=0

# Restore database
gunzip < backup-auth-*.sql.gz | psql -U postgres

# Restart services
helm upgrade freeshop ./helm/freeshop --set replicaCount=3

# ===== LEVEL 3: INFRASTRUCTURE ROLLBACK =====

# Revert to old K8s manifests
kubectl delete -f helm/ || true
kubectl apply -f k8s-backup/v1.0.0-raw-yaml/

# Verify
kubectl get pods
kubectl get svc

# Check health
./post-rollback-verification.sh
```

---

## Document History

| Date | Version | Change | Author |
|---|---|---|---|
| Apr 8, 2026 | 1.0 | Initial rollback strategy document | DevOps Team |

---

## Sign-Off Checklist (Before Production)

- [ ] All team members reviewed this document
- [ ] At least one rollback drill completed on staging
- [ ] Backup and restore tested and verified working
- [ ] On-call engineer trained on Level 1-2 rollback
- [ ] Rollback decision tree posted in Slack/Wiki
- [ ] Monitoring and alerting configured
- [ ] Estimated RTO/RPO documented and approved by stakeholders
- [ ] Document location known to entire team
- [ ] Monthly rollback drill scheduled

---

**Last Updated**: April 2026  
**Next Review**: Before Phase 4 (Staging)  
**Maintained By**: DevOps Team
