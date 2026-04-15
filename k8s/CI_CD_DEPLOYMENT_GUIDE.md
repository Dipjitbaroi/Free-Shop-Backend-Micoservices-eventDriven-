# Free-Shop — Industry-Standard CI/CD Deployment with GitHub Actions

> **Stack:** Node.js microservices · k3s (Kubernetes) · GitHub Actions CI/CD · Helm · PostgreSQL · Redis · RabbitMQ · NGINX Ingress · Let's Encrypt SSL  
> **VPS Spec:** 6 cores / 18 GB RAM / 300 GB SSD · Ubuntu 24.04 LTS  
> **Registry:** GitHub Container Registry (GHCR) — free with any GitHub account  
> **Deployment Automation:** Fully automated via GitHub Actions on every `git push` to `main`

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Prerequisites & Prerequisites](#2-prerequisites--prerequisites)
3. [Phase 1 — VPS: One-Time Initial Setup](#3-phase-1--vps-one-time-initial-setup)
4. [Phase 2 — GitHub Secrets Configuration](#4-phase-2--github-secrets-configuration)
5. [Phase 3 — Prepare Your Repository](#5-phase-3--prepare-your-repository)
6. [Phase 4 — Deploy First Time via GitHub Actions](#6-phase-4--deploy-first-time-via-github-actions)
7. [How CI/CD Workflows Work](#7-how-cicd-workflows-work)
8. [Migration from Manual Deployment](#8-migration-from-manual-deployment)
9. [Daily Operations & Deployments](#9-daily-operations--deployments)
10. [Troubleshooting & Debugging](#10-troubleshooting--debugging)
11. [Rollback Strategies](#11-rollback-strategies)
12. [Useful Commands](#12-useful-commands)

---

## 1. Architecture Overview

### The CI/CD Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│ Your Local Machine: git push to main                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │  GitHub (your repository)  │
        │                            │
        │  Detects: push to main     │
        └────────────┬───────────────┘
                     │
        ┌────────────▼──────────────────────────────┐
        │  GitHub Actions Workflows Start           │
        │                                           │
        │  .github/workflows/ci.yml    (on PRs)     │
        │  .github/workflows/deploy.yml (on main)   │
        └────────────┬──────────────────────────────┘
                     │
         ┌───────────▼────────────┐
         │  CI: Type Check & Test │
         │  (runs on PR)          │
         └───────────┬────────────┘
                     │
         ┌───────────▼────────────────────────┐
         │  Deploy: Build & Push (all services)
         │  in PARALLEL via matrix strategy   │
         └───────────┬────────────────────────┘
                     │
         ┌───────────▼────────────────────────────┐
         │  Images pushed to GHCR                 │
         │  ghcr.io/YOUR_USERNAME/freeshop-*:SHA │
         └───────────┬────────────────────────────┘
                     │
         ┌───────────▼────────────────────────────┐
         │  Deploy: SSH into VPS                  │
         │  - Update pull secret                  │
         │  - git pull latest manifests           │
         │  - Run Prisma migrations               │
         │  - Helm upgrade all services           │
         │  - Wait for rollouts to complete       │
         └───────────┬────────────────────────────┘
                     │
         ┌───────────▼────────────────────┐
         │  VPS: k3s cluster               │
         │                                │
         │  NGINX Ingress + SSL (Let's    │
         │  Encrypt)                      │
         │        │                       │
         │   api.freeshopbd.com            │
         │        │                       │
         │  ┌─────┴──────────────────────┐│
         │  │ New Pods (blue-green roll) ││
         │  │ auth  user  product ...     ││
         │  └─────────────────────────────┘│
         │        │         │         │    │
         │   PostgreSQL  Redis  RabbitMQ   │
         └────────────────────────────────┘
                     │
         ┌───────────▼─────────────────┐
         │  Deployment Successful ✓    │
         │  All services running        │
         │  GitHub shows green checkmark
         └──────────────────────────────┘
```

### Key Differences from Manual Deployment

| Aspect | Manual (Old) | CI/CD (New) |
|--------|------|--------|
| **How to deploy** | SSH to VPS, run `build-push.sh`, then `deploy.sh` | `git push` to main → GitHub Actions does everything |
| **Build consistency** | Local Docker version-dependent | GitHub Actions standard runners (consistent) |
| **Image versioning** | Manual tagging, easy to mix up | Automatic semantic tagging with commit SHA |
| **Database migrations** | Run manually before deploy | Automatic in pipeline before pods start |
| **Zero-downtime deployments** | Helm handles it | Helm + GitHub Actions orchestration |
| **Secrets management** | `.env` files on VPS (risky) | GitHub Secrets (encrypted, audited) |
| **Audit trail** | Who knows who deployed what | Full Git history + GitHub Actions logs |
| **Rollback** | Manual `kubectl rollout undo` | One-click GitHub UI or revert commit + redeploy |

---

## 2. Prerequisites & Prerequisites

### What You Already Have
- ✅ **Source code repo** — `Free-Shop-Backend-Micoservices-eventDriven-` on GitHub
- ✅ **k8s manifests** — in the same repo under `k8s/`
- ✅ **GitHub Actions workflows** — already created in `.github/workflows/`
  - `ci.yml` — runs linting and type checks on PRs
  - `deploy.yml` — builds, pushes, and deploys on merges to `main`
- ✅ **Helm charts** — in `helm/freeshop/` for orchestrated deployment
- ✅ **VPS** — Ubuntu 24.04 LTS with k3s (if you followed the manual guide before)

### What You Need to Set Up

**On GitHub:**
- [ ] GitHub Personal Access Token (PAT) with `write:packages` scope
- [ ] GitHub Secrets configured (`VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `GHCR_TOKEN`)
- `main` branch protection (optional but recommended for quality gates)

**On Your VPS:**
- [ ] k3s installed and running
- [ ] kubectl configured and accessible
- [ ] SSH access configured for GitHub Actions
- [ ] Git installed (for pulling manifests)
- [ ] Helm installed (for deployments)

**On Your Local Machine:**
- [ ] Git configured to push to GitHub
- [ ] GitHub CLI (for easy secret management) — optional

---

## 3. Phase 1 — VPS: One-Time Initial Setup

If you've already followed the **VPS_SETUP_AND_DEPLOY_GUIDE** manually, k3s and all tools are already installed. **Skip to Phase 2.**

If not, run the one-time setup:

```bash
ssh root@YOUR_VPS_IP

# Clone the backend repo (contains k8s setup scripts)
git clone https://github.com/YOUR_USERNAME/Free-Shop-Backend-Micoservices-eventDriven-.git /opt/freeshop-backend
cd /opt/freeshop-backend

# Run the VPS setup script
chmod +x k8s/scripts/setup-vps.sh
sudo bash k8s/scripts/setup-vps.sh
```

This installs:
- k3s (Kubernetes)
- NGINX Ingress
- cert-manager (Let's Encrypt)
- Helm
- Metrics Server (for autoscaling)

**Verify it worked:**
```bash
source ~/.bashrc
kubectl get nodes
# Should show your VPS node in Ready status
```

---

## 4. Phase 2 — GitHub Secrets Configuration

### Step 2.1 — Create a GitHub Personal Access Token (PAT)

1. Go to **GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)**
2. Click **"Generate new token (classic)"**
3. Name: `freeshop-ghcr-deploy`
4. Scopes: ✅ `write:packages` ✅ `read:packages` ✅ `delete:packages`
5. Click **Generate token** and **copy it immediately** (you won't see it again)

### Step 2.2 — Set Up SSH Key for VPS Access

**On your local machine:**

```powershell
# Windows (PowerShell)
ssh-keygen -t ed25519 -C "github-actions-freeshop" -f "$env:USERPROFILE\.ssh\freeshop-deploy" -P ""
# Copy public key to VPS (upload then append to authorized_keys)
scp $env:USERPROFILE\.ssh\freeshop-deploy.pub root@YOUR_VPS_IP:/tmp/freeshop-deploy.pub
ssh root@YOUR_VPS_IP "mkdir -p ~/.ssh && cat /tmp/freeshop-deploy.pub >> ~/.ssh/authorized_keys && rm /tmp/freeshop-deploy.pub && chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys"
# Display the private key (for GitHub Secret)
Get-Content $env:USERPROFILE\.ssh\freeshop-deploy -Raw
```

```bash
# macOS / Linux (bash)
ssh-keygen -t ed25519 -C "github-actions-freeshop" -f ~/.ssh/freeshop-deploy -N ""
ssh-copy-id -i ~/.ssh/freeshop-deploy.pub -o StrictHostKeyChecking=no root@YOUR_VPS_IP
cat ~/.ssh/freeshop-deploy
```

### Step 2.3 — Add Secrets to GitHub Repository

Go to **GitHub → your repository → Settings → Secrets and variables → Actions → New repository secret**

Add these secrets one by one:

| Secret Name | Value | Example |
|-------------|-------|---------|
| `VPS_HOST` | Your VPS public IP | `203.0.113.45` |
| `VPS_USER` | SSH username (usually `root`) | `root` |
| `VPS_SSH_KEY` | Private SSH key (the one you just generated) | `-----BEGIN PRIVATE KEY-----...` (full content) |
| `GHCR_TOKEN` | GitHub PAT token from Step 2.1 | `ghp_xxxxxxxxxxxxxxx...` |

**Verify secrets are saved:**
```bash
curl -H "Authorization: token YOUR_GITHUB_PAT" \
  https://api.github.com/repos/YOUR_USERNAME/Free-Shop-Backend-Micoservices-eventDriven-/actions/secrets
```

---

## 5. Phase 3 — Prepare Your Repository

### Step 3.1 — Ensure Workflows Exist

The workflows should already be in your repo:

```bash
# From your local machine, in the repo root
ls -la .github/workflows/
# Should show: ci.yml  deploy.yml
```

If not, contact the repo maintainer — they likely need to be checked in.

### Step 3.2 — Configure App Secrets

**On your VPS**, update the secrets file with real values:

```bash
ssh root@YOUR_VPS_IP
cd /opt/freeshop-backend

nano k8s/secrets/app-secrets.yaml
```

Replace all placeholders with base64-encoded values (same as manual deployment):

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: freeshop-secrets
  namespace: freeshop
type: Opaque
data:
  # Database
  POSTGRES_PASSWORD: <base64-encoded-value>
  
  # JWT secrets
  JWT_SECRET: <base64-encoded-value>
  JWT_REFRESH_SECRET: <base64-encoded-value>
  
  # Cloudinary
  CLOUDINARY_CLOUD_NAME: <base64-encoded-value>
  CLOUDINARY_API_KEY: <base64-encoded-value>
  CLOUDINARY_API_SECRET: <base64-encoded-value>
  
  # Add remaining secrets...
```

**Encode a secret easily:**
```bash
echo -n "mypassword" | base64
# Output: bXlwYXNzd29yZA==
```

### Step 3.3 — Configure DNS

**Same as manual deployment.** In **Namecheap → Advanced DNS** for `freeshopbd.com`:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | `api` | YOUR_VPS_IP | 300 |
| A | `@` | Vercel frontend IP | Auto |
| A | `www` | Vercel frontend IP | Auto |

### Step 3.4 — Update Manifests with Your Domain

**On the VPS:**

```bash
cd /opt/freeshop-backend

YOUR_REGISTRY="ghcr.io/YOUR_GITHUB_USERNAME"
YOUR_EMAIL="your-email@freeshopbd.com"

# Replace placeholders
find k8s -name "*.yaml" | xargs sed -i "s|YOUR_DOMAIN.com|freeshopbd.com|g"
find k8s -name "*.yaml" | xargs sed -i "s|YOUR_EMAIL@example.com|$YOUR_EMAIL|g"
find k8s -name "*.yaml" | xargs sed -i "s|YOUR_REGISTRY|$YOUR_REGISTRY|g"

# Verify no placeholders remain
grep -r "YOUR_" k8s --include="*.yaml"
# Should return nothing
```

---

## 6. Phase 4 — Deploy First Time via GitHub Actions

### Option A: Deploy via GitHub Actions UI (Recommended)

1. Go to **GitHub → your repository → Actions**
2. Click **"Build, Push & Deploy"** on the left
3. Click **"Run workflow"** button
4. Select branch: `main`
5. Click **"Run workflow"** again
6. Watch the build and deployment happen in real-time!

### Option B: Deploy via Git Push

Simply push your code to `main`:

```bash
# On your local machine
git add .
git commit -m "Initial CI/CD deployment setup"
git push origin main
```

**GitHub Actions will automatically:**
1. Build all 10 microservice images in parallel
2. Push them to GHCR with the commit SHA
3. SSH into your VPS
4. Update manifests and run migrations
5. Deploy via Helm
6. Wait for rollouts to complete

### Monitor the Deployment

**In GitHub UI:**
- Go to **Actions** tab
- Click the latest workflow run
- Watch each job complete (Build steps 1-10 in parallel, then Deploy)
- Logs are live-streamed — you can see everything in real-time

**On your VPS in a separate terminal:**
```bash
kubectl get pods -n freeshop -w
# Watch pods transitioning from Pending → Running
```

**When complete, test the API:**
```bash
curl https://api.freeshopbd.com/health
# Should return {"status":"ok"} or similar
```

---

## 7. How CI/CD Workflows Work

### The CI Workflow (`ci.yml`)

**Triggers:** On every PR to `main` or `dev` branch, and on every push to `dev`.

**What it does:**
1. **Type-check** — runs `npx tsc --noEmit` on all services
2. **Lint Dockerfiles** — validates syntax with hadolint
3. **Build test** — builds each image without pushing (to catch Dockerfile errors early)

**Purpose:** Catch bugs before merging. Approvers get confidence that code is valid.

### The Deploy Workflow (`deploy.yml`)

**Triggers:** Only on successful merges to `main` branch.

**Job 1: Build (Parallel Matrix)**
- Builds all 10 services simultaneously
- Each service:
  - Logs into GHCR with your PAT
  - Builds Docker image with `--platform linux/amd64`
  - Tags with short commit SHA (first 7 chars) + `latest`
  - Pushes to GHCR
- Uses GitHub Actions cache per-service (saves rebuild time)

**Job 2: Deploy (After all builds succeed)**
- SSHes into VPS with your SSH key
- Creates GHCR pull secret for private images
- Patches Kubernetes default ServiceAccount
- Pulls latest manifests via `git pull`
- Runs Prisma migrations before pods restart (critical!)
- Helm upgrades all 10 services with new image tags
- Waits for rollouts to complete (10 min timeout)
- Exits with error if any service fails

**Total time:** ~15–25 minutes (depending on build cache hits)

### Environment Variables Used

These are automatically set by GitHub Actions:

| Variable | Value | Used For |
|----------|-------|----------|
| `${{ github.sha }}` | Full 40-character commit SHA | Image versioning |
| `${{ steps.tag.outputs.sha }}` | First 7 characters of SHA | Short tag, human-readable |
| `${{ github.repository_owner }}` | Your GitHub username | GHCR registry path |
| `${{ secrets.VPS_HOST }}` | Your VPS IP | SSH destination |
| `${{ secrets.VPS_USER }}` | SSH user | SSH login |
| `${{ secrets.VPS_SSH_KEY }}` | Private SSH key | Authentication |

---

## 8. Migration from Manual Deployment

If you've already deployed using **VPS_SETUP_AND_DEPLOY_GUIDE** manually, follow these steps to switch to CI/CD while keeping your data intact.

### Step 8.1 — Backup Everything (Safety First!)

```bash
ssh root@YOUR_VPS_IP

# Backup PostgreSQL
kubectl exec -it postgres-0 -n freeshop -- \
  pg_dumpall -U postgres > /opt/freeshop-db-backup-$(date +%Y%m%d-%H%M%S).sql

# Backup persistent volumes
tar -czf /opt/freeshop-pvc-backup-$(date +%Y%m%d-%H%M%S).tar.gz \
  /var/lib/rancher/k3s/storage/pvc-* 2>/dev/null || true

# Verify backups
ls -lh /opt/freeshop-*.sql /opt/freeshop-*.tar.gz
```

Copy backups to a safe location:
```bash
# On your local machine
scp root@YOUR_VPS_IP:/opt/freeshop-db-backup-*.sql ~/Backups/freeshop/
scp root@YOUR_VPS_IP:/opt/freeshop-pvc-backup-*.tar.gz ~/Backups/freeshop/
```

### Step 8.2 — Keep Your Data (Scale Down Instead of Delete)

**DO NOT delete the old manual deployment.** Instead, scale it down:

```bash
ssh root@YOUR_VPS_IP

# Scale all services to 0 replicas (no deletion)
kubectl scale deploy --all --replicas=0 -n freeshop

# Verify they're no longer running
kubectl get pods -n freeshop
# Should show: No resources found

# Keep the databases and infrastructure running
# (we're reusing them in the CI/CD deployment)
kubectl get statefulsets -n freeshop
# Should still show postgres, redis, rabbitmq as Running
```

**Your data is safe!** The databases, Redis cache, and RabbitMQ are untouched and will be reused.

### Step 8.3 — Initialize GitHub Secrets

Follow **Phase 2** above to set up GitHub Secrets if not already done.

### Step 8.4 — Prepare Manifests (One-Time)

```bash
ssh root@YOUR_VPS_IP
cd /opt/freeshop-backend

# These should already be done from Phase 3, but verify
grep -r "YOUR_" k8s --include="*.yaml"
# Should return nothing (all placeholders already replaced)
```

### Step 8.5 — Trigger First CI/CD Deployment

Go to **GitHub → Actions → "Build, Push & Deploy"** and click **"Run workflow"** on the `main` branch, or simply:

```bash
# On your local machine
git push origin main
```

**The CI/CD pipeline will:**
1. Build new images (commit SHA)
2. Push to GHCR
3. SSH into VPS
4. Run migrations against **existing databases** (no data loss!)
5. Deploy new pods using **existing Persistent Volumes** (RabbitMQ, Redis, PostgreSQL)
6. Helm will scale up the services

**Result:** Your data is preserved, services are now managed by CI/CD! ✅

### Step 8.6 — Verify Data is Preserved

```bash
ssh root@YOUR_VPS_IP

# Check databases still exist and have data
kubectl exec -it postgres-0 -n freeshop -- psql -U postgres -c "\l"

# Check sample data (example)
kubectl exec -it postgres-0 -n freeshop -- \
  psql -U postgres -d freeshop_product -c "SELECT COUNT(*) FROM products;"

# Check new pods are running with CI/CD image tags
kubectl get pods -n freeshop -o wide
# Image column should show: ghcr.io/.../freeshop-*:abc1234  (commit SHA)
```

---

## 9. Daily Operations & Deployments

### Making Your First Code Change

```bash
# On your local machine
cd /path/to/Free-Shop-Backend-Micoservices-eventDriven-

# Make your code change (e.g., fix a bug in auth-service)
nano services/auth-service/src/index.ts

# Commit and push
git add .
git commit -m "Fix: auth token validation issue"
git push origin main
```

**GitHub Actions automatically:**
1. Runs CI checks (type-check, lint)
2. Builds all images (only `auth-service` changes, but all are rebuilt for consistency)
3. Pushes to GHCR
4. Deploys to VPS
5. Blue-green rollout (old pods stay up, new pods start, traffic switches when ready)

### Deployment Approval (Optional)

If you want extra safety, enable manual approval:

1. Go to **GitHub → Settings → Environments → production**
2. Enable **"Require approvals before deployment"**
3. Add reviewers
4. Now deployments wait for approval before hitting the VPS

### Deploy a Specific Commit (Not Latest)

If you pushed multiple commits and want to deploy an old one:

```bash
# Check out the commit you want to deploy
git checkout abc1234def5678

# Force push to main (use with caution!)
git push origin HEAD:main --force

# Or use GitHub UI: Actions → select old workflow run → click "Re-run all jobs"
```

### Deploy Without Code Change (Re-deploy Current Version)

Use GitHub Actions UI to re-run a previous deployment:

1. Go to **Actions** tab
2. Click the workflow run you want to re-run
3. Click **"Re-run failed jobs"** or **"Re-run all jobs"**

---

## 10. Troubleshooting & Debugging

### Check GitHub Actions Logs

1. Go to **GitHub → Actions → [workflow name] → latest run**
2. Expand each job to see detailed logs
3. SSH commands output shows everything: migrations, Helm deploys, kubectl commands

### Check VPS Pod Logs

```bash
ssh root@YOUR_VPS_IP

# Watch real-time pod logs
kubectl logs -f deployment/api-gateway -n freeshop

# Check all pods status
kubectl get pods -n freeshop

# Describe a pod to see events
kubectl describe pod <pod-name> -n freeshop
```

### Image Pull Errors

```bash
# Problem: Pod stuck in ImagePullBackOff

# Check if image exists
docker pull ghcr.io/YOUR_USERNAME/freeshop-auth-service:abc1234

# If not found, check GHCR_TOKEN secret
# Re-create it if expired:
ssh root@YOUR_VPS_IP
kubectl create secret docker-registry ghcr-pull-secret \
  --namespace=freeshop \
  --docker-server=ghcr.io \
  --docker-username=YOUR_GITHUB_USERNAME \
  --docker-password=YOUR_GHCR_TOKEN \
  --dry-run=client -o yaml | kubectl apply -f -
```

### Database Migration Failures

```bash
# Problem: Pod crashes with "NX_ERROR: migrate failed"

# Check migration logs
kubectl logs <pod-name> -n freeshop | grep -i migrate

# Manually run migration on VPS
kubectl run migration-debug --image=ghcr.io/YOUR_USERNAME/freeshop-auth-service:abc1234 \
  -it --restart=Never -n freeshop -- npx prisma migrate deploy

# If migration is stuck, you may need to edit it:
ssh root@YOUR_VPS_IP
kubectl exec -it postgres-0 -n freeshop -- psql -U postgres -d freeshop_auth

# Inside PostgreSQL console:
SELECT * FROM "_prisma_migrations" WHERE status != 'Success';
# Delete failed migration and retry
DELETE FROM "_prisma_migrations" WHERE id = 'xxxxx';
```

### Helm Deployment Fails

```bash
# Problem: Helm upgrade failed

# Check Helm release(s)
kubectl get all -n freeshop
helm list -n freeshop

# Debug a specific service
helm get values api-gateway -n freeshop
helm status api-gateway -n freeshop

# Rollback Helm release
helm rollback api-gateway 0 -n freeshop  # 0 means previous revision
```

### Can't SSH from GitHub Actions

```bash
# Problem: Deployment job fails at SSH step

# Verify VPS SSH key works locally
ssh -i ~/.ssh/freeshop-deploy root@YOUR_VPS_IP "echo OK"

# Check GitHub Secrets aren't expired
# SSH keys don't expire, but PAT tokens do (after 90 days if set that way)

# Regenerate secrets if needed:
# 1. Create new SSH key: ssh-keygen -t ed25519 ...
# 2. Copy to VPS: ssh-copy-id ...
# 3. Update GitHub Secret: VPS_SSH_KEY with new private key
```

### Check GitHub Actions Quotas

```bash
# GitHub gives free runners 2000 minutes/month (public repos get unlimited)
# Check your usage:
curl -H "Authorization: token YOUR_PAT" \
  https://api.github.com/user/actions/summary
```

---

## 11. Rollback Strategies

### Option 1: Fastest — Revert Last Commit & Push

```bash
# On your local machine
git revert HEAD --no-edit
git push origin main

# GitHub Actions will build the previous version and deploy it
# Total time: ~15 minutes
```

### Option 2: Roll Back Individual Service via Helm

```bash
ssh root@YOUR_VPS_IP

# See previous Helm revisions
helm history api-gateway -n freeshop

# Rollback to previous revision
helm rollback api-gateway 0 -n freeshop

# Watch rollout
kubectl rollout status deployment/api-gateway -n freeshop -w
```

### Option 3: Scale Down and Restart (Quick)

```bash
ssh root@YOUR_VPS_IP

# Force pod restart (triggering readiness checks)
kubectl rollout restart deployment/api-gateway -n freeshop

# Or re-apply the last known good config
helm upgrade api-gateway helm/freeshop \
  --namespace freeshop \
  --values helm/freeshop/values.yaml \
  --values helm/freeshop/values-prod.yaml \
  --values helm/freeshop/services/values-api-gateway.yaml \
  --set serviceName=api-gateway
```

### Option 4: Full Rollback (If Everything Broken)

```bash
ssh root@YOUR_VPS_IP

# Stop all services
kubectl scale deploy --all --replicas=0 -n freeshop

# Check if databases are intact
kubectl exec -it postgres-0 -n freeshop -- psql -U postgres -c "\l"

# Restore from backup if needed
kubectl exec -it postgres-0 -n freeshop -- psql -U postgres < /opt/freeshop-db-backup-YYYYMMDD.sql

# Restart services at old version
git checkout LAST_KNOWN_GOOD_COMMIT_SHA
git push origin main
```

---

## 12. Useful Commands

### Real-Time Monitoring

```bash
# Watch all pods
kubectl get pods -n freeshop -w

# Watch only running pods
kubectl get pods -n freeshop --field-selector=status.phase=Running -w

# Watch HPA status (autoscaling metrics)
kubectl get hpa -n freeshop -w

# Monitor resource usage
kubectl top pods -n freeshop
kubectl top nodes
```

### Logs & Debugging

```bash
# Follow logs from a service (last 50 lines)
kubectl logs -f --tail=50 deployment/api-gateway -n freeshop

# Get logs from all pods of a service
kubectl logs deployment/order-service -n freeshop --all-containers=true

# Get past logs if pod crashed
kubectl logs <pod-name> --previous -n freeshop

# Search logs for errors
kubectl logs deployment/auth-service -n freeshop | grep -i error
```

### Database Access

```bash
# Connect to PostgreSQL
kubectl exec -it postgres-0 -n freeshop -- psql -U postgres

# Inside psql:
\l              # list databases
\c freeshop_auth  # connect to auth database
\d              # list tables
SELECT * FROM "User" LIMIT 5;  # query data
\q              # exit

# One-liner to check if data exists
kubectl exec -it postgres-0 -n freeshop -- \
  psql -U postgres -d freeshop_product -c "SELECT COUNT(*) as product_count FROM \"Product\";"
```

### Manual Deployment (Without Git)

```bash
ssh root@YOUR_VPS_IP

# Build and deploy a single service manually
cd /opt/freeshop-backend
SERVICE="auth-service"
TAG="manual-abc1234"

# Build locally on VPS
docker build -t ghcr.io/YOUR_USERNAME/freeshop-$SERVICE:$TAG \
  -f services/$SERVICE/Dockerfile .

# Push to GHCR (requires login)
docker login ghcr.io -u YOUR_USERNAME -p YOUR_PAT
docker push ghcr.io/YOUR_USERNAME/freeshop-$SERVICE:$TAG

# Update deployment
kubectl set image deployment/$SERVICE \
  $SERVICE=ghcr.io/YOUR_USERNAME/freeshop-$SERVICE:$TAG \
  -n freeshop

# Watch rollout
kubectl rollout status deployment/$SERVICE -n freeshop
```

### Service Scaling

```bash
# Manually scale a service (ignores HPA temporarily)
kubectl scale deployment/api-gateway --replicas=5 -n freeshop

# Disable HPA and use manual scaling
kubectl delete hpa api-gateway -n freeshop

# Re-enable by re-applying Helm
helm upgrade api-gateway helm/freeshop -n freeshop -f helm/freeshop/services/values-api-gateway.yaml
```

### Port Forwarding (Local Development)

```bash
# Access internal services from your laptop
kubectl port-forward svc/postgres 5432:5432 -n freeshop &
kubectl port-forward svc/rabbitmq 15672:15672 -n freeshop &
kubectl port-forward svc/redis 6379:6379 -n freeshop &

# Now connect: psql -U postgres -h localhost
# RabbitMQ UI: http://localhost:15672
# Redis CLI: redis-cli -h localhost

# Kill port forwarding
pkill -f "kubectl port-forward"
```

### Secrets Management

```bash
# View a secret (base64 encoded)
kubectl get secret freeshop-secrets -n freeshop -o yaml

# Decode a specific secret
kubectl get secret freeshop-secrets -n freeshop \
  -o jsonpath='{.data.POSTGRES_PASSWORD}' | base64 -d
echo  # add newline

# Update a secret
kubectl create secret generic freeshop-secrets \
  --namespace freeshop \
  --from-literal=NEW_KEY=new_value \
  --dry-run=client -o yaml | kubectl apply -f -
```

### Check Ingress & SSL

```bash
# View NGINX ingress configuration
kubectl get ingress -n freeshop

# Check SSL certificate status
kubectl get certificate -n freeshop

# View certificate details
kubectl describe certificate -n freeshop

# Test HTTPS manually
curl -v https://api.freeshopbd.com/health

# Check cert-manager logs
kubectl logs -f -n cert-manager deploy/cert-manager
```

---

## Quick Reference Table

| Task | Command | Time |
|------|---------|------|
| Full deploy (code push) | `git push origin main` | ~15–25 min |
| Re-run deployment | GitHub UI: Actions → Re-run | ~15–25 min |
| Rollback one service | `helm rollout undo deploy/SERVICE -n freeshop` | ~2 min |
| Check deployment status | `kubectl get pods -n freeshop` | instant |
| View logs | `kubectl logs -f deploy/SERVICE -n freeshop` | instant |
| Restart service | `kubectl rollout restart deploy/SERVICE -n freeshop` | 1–3 min |
| Manual backup | SSH + `pg_dumpall -U postgres` | ~5 min |
| SSH to VPS | `ssh root@YOUR_VPS_IP` | instant |

---

## File Structure & Key Locations

### On Your Local Machine
```
Free-Shop-Backend-Micoservices-eventDriven-/
├── .github/workflows/
│   ├── ci.yml                    ← Lint & type-check (runs on PRs)
│   └── deploy.yml               ← Build, push, deploy (runs on main merge)
├── k8s/
│   ├── secrets/
│   │   └── app-secrets.yaml      ← Fill with real values on VPS
│   ├── services/
│   │   ├── api-gateway/
│   │   ├── auth-service/
│   │   └── ... (8 more services)
│   └── scripts/
│       ├── setup-vps.sh          ← One-time VPS init
│       └── (manual scripts — no longer used)
├── helm/
│   └── freeshop/
│       ├── Chart.yaml
│       ├── values.yaml           ← Base Helm values
│       ├── values-prod.yaml      ← Production overrides
│       └── services/ (per-service config files)
└── services/
    ├── api-gateway/Dockerfile
    ├── auth-service/Dockerfile
    └── ... (8 more services)
```

### On Your VPS
```
/opt/freeshop-backend/          ← Git repo (synced via CI/CD pipeline)
　├── k8s/                       ← Manifests applied by Helm
　├── helm/                      ← Chart definitions
　└── services/                  ← Source code (used for Helm to find templates)

/var/lib/rancher/k3s/           ← k3s data
　└── storage/                   ← Persistent Volumes (PostgreSQL, Redis, RabbitMQ)

/etc/rancher/k3s/               ← k3s configuration
　└── k3s.yaml                   ← kubectl config

/root/.ssh/                      ← SSH keys for GitHub Actions
```

---

## Next Steps

> **You are here:** CI/CD deployment guide prepared  
> **Next steps:**
> 1. Follow **Phase 2** to set up GitHub Secrets
> 2. Follow **Phase 3** to prepare your repository
> 3. Follow **Phase 4** to trigger your first CI/CD deployment
> 4. Monitor in **GitHub Actions** tab to watch the deployment live
> 5. Test your API: `curl https://api.freeshopbd.com/health`

---

## Comparison: Manual vs CI/CD

| Scenario | Manual Way | CI/CD Way |
|----------|-----------|----------|
| **Deploy a fix** | SSH to VPS, run build script, run deploy script | `git push origin main` (done automatically!) |
| **Rollback** | SSH, run `kubectl rollout undo` | Click a button or `git revert HEAD` |
| **Scale a service** | SSH, run `kubectl scale deploy/...` | Change replicas in `values-prod.yaml`, commit, push |
| **Update a secret** | SSH, edit VPS files with nano | Add/update in GitHub Secrets (encrypted, audited) |
| **Deploy to staging** | Different manual steps | Create new branch → push → separate workflow (future) |
| **Audit trail** | Who deployed what? 😕 | Full git history + GitHub Actions logs 📊 |
| **Consistency** | Depends on who's deploying | Always the same process ✅ |

---

## Support & Troubleshooting

If something breaks:

1. **Check GitHub Actions logs** — go to Actions tab, click the failed run
2. **Check VPS pod logs** — `kubectl logs -f deployment/SERVICE -n freeshop`
3. **Describe problematic pod** — `kubectl describe pod POD_NAME -n freeshop`
4. **Check secrets** — `kubectl get secret freeshop-secrets -n freeshop -o yaml`
5. **Check Helm release** — `helm status SERVICE -n freeshop`

**Still stuck?** Check [Troubleshooting & Debugging](#10-troubleshooting--debugging) above.

---

## Additional Resources

- **Kubernetes Docs:** https://kubernetes.io/docs/
- **GitHub Actions:** https://github.com/features/actions
- **Helm Charts:** https://helm.sh/docs/
- **k3s Documentation:** https://docs.k3s.io/
- **cert-manager:** https://cert-manager.io/docs/

Good luck with your industry-standard CI/CD deployment! 🚀
