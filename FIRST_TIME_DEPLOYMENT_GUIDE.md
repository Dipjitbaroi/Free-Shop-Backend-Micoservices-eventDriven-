# First Time Deployment Guide - FreeShop Backend

**Last Updated**: April 9, 2026  
**Status**: Production Ready ✅

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [VPS Setup](#vps-setup)
3. [GitHub Configuration](#github-configuration)
4. [Database Setup](#database-setup)
5. [First Deploy Execution](#first-deploy-execution)
6. [Verification & Testing](#verification--testing)
7. [Monitoring & Logs](#monitoring--logs)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required:
- ✅ VPS with 6 CPU, 18 GB RAM, 300 GB SSD (single-node k3s cluster)
- ✅ Ubuntu 20.04 LTS or later
- ✅ GitHub repository access (push permissions to `new_convertion` branch)
- ✅ Docker registry access (GHCR - GitHub Container Registry)

### Tools to Install (on local machine):
```bash
# Git
git --version

# Docker (if testing locally first)
docker --version

# kubectl (for VPS management)
kubectl version --client

# Helm (for deployments)
helm version
```

---

## VPS Setup

### Step 1: Connect to VPS

```bash
# Replace with your VPS IP and user
ssh -i ~/.ssh/vps-key.pem ubuntu@<VPS_IP>

# Example:
ssh -i ~/.ssh/vps-key.pem ubuntu@203.0.113.45
```

### Step 2: Install k3s (Kubernetes)

```bash
# Install k3s lightweight Kubernetes
curl -sfL https://get.k3s.io | sh -

# Verify installation
sudo k3s kubectl get nodes
```

### Step 3: Configure kubeconfig

```bash
# Create .kube directory on local machine
mkdir -p ~/.kube

# Copy k3s config from VPS to local
scp -i ~/.ssh/vps-key.pem ubuntu@<VPS_IP>:/etc/rancher/k3s/k3s.yaml ~/.kube/config-vps

# Update server IP in config
sed -i 's/127.0.0.1/<VPS_IP>/g' ~/.kube/config-vps

# Set kubeconfig
export KUBECONFIG=~/.kube/config-vps

# Verify connection
kubectl get nodes
```

### Step 4: Create Kubernetes Namespace

```bash
# SSH into VPS
ssh -i ~/.ssh/vps-key.pem ubuntu@<VPS_IP>

# Create freeshop namespace
sudo k3s kubectl create namespace freeshop

# Verify
sudo k3s kubectl get namespaces
```

### Step 5: Install Helm

```bash
# On VPS (or local, depending on preference)
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Verify
helm version
```

---

## GitHub Configuration

### Step 1: Create GitHub Secrets

Navigate to: **GitHub → Repository → Settings → Secrets and variables → Actions**

**Add these secrets:**

```
VPS_HOST: <your-vps-ip>
VPS_USER: ubuntu
VPS_SSH_KEY: <contents of your private SSH key>
GHCR_TOKEN: <GitHub personal access token with read/write packages>
```

**How to create GHCR_TOKEN:**

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens
2. Create new token:
   - Name: `GHCR_DEPLOYMENT_TOKEN`
   - Permissions: `read:packages`, `write:packages`
   - Expiration: 90 days (renewable)
3. Copy token and paste as `GHCR_TOKEN` secret

**How to create SSH key pair (if needed):**

```bash
# On local machine
ssh-keygen -t ed25519 -f ~/.ssh/vps-deployment-key -N ""

# Copy public key to VPS
ssh-copy-id -i ~/.ssh/vps-deployment-key.pub ubuntu@<VPS_IP>

# Use private key content as VPS_SSH_KEY
cat ~/.ssh/vps-deployment-key
```

### Step 2: Verify Workflow Files

Check that these files exist:

```bash
.github/workflows/deploy.yml          # Main deployment workflow
k8s/config/freeshop-config.yaml       # ConfigMap with environment
k8s/secrets/app-secrets.yaml          # Secrets (pre-created)
helm/freeshop/values-prod.yaml        # Production Helm values
```

---

## Database Setup

### Step 1: Initialize Databases on VPS

SSH into VPS:

```bash
ssh -i ~/.ssh/vps-key.pem ubuntu@<VPS_IP>

# Navigate to script directory
cd /opt/freeshop-backend/scripts

# Run database initialization
bash init-databases.sh
```

This script:
- Creates 9 PostgreSQL databases (one per service)
- Sets default credentials
- Initializes schema tables

**Expected output:**
```
Creating freeshop_auth database...     ✓
Creating freeshop_user database...     ✓
Creating freeshop_product database...  ✓
... (6 more databases)
All databases created successfully!
```

### Step 2: Verify Database Connectivity

```bash
# From VPS, test PostgreSQL connection
psql -h localhost -U freeshop_user -d freeshop_auth

# Should connect successfully
psql (12.x)
Type "help" for help.

freeshop_auth=#
```

---

## First Deploy Execution

### Step 1: Prepare Deployment

**Option A: Automatic (GitHub Actions)**

```bash
# On your local machine
cd ~/path/to/Free-Shop-Backend-Micoservices

# Make sure you're on new_convertion branch
git checkout new_convertion

# Make a small commit to trigger the workflow
git commit --allow-empty -m "Trigger first deployment"

# Push to main (this triggers deployment)
git push origin new_convertion:main
```

**Option B: Manual (if GitHub Actions not working)**

```bash
# SSH into VPS
ssh -i ~/.ssh/vps-key.pem ubuntu@<VPS_IP>

# Navigate to repo
cd /opt/freeshop-backend

# Find latest Git commit
COMMIT_SHA=$(git rev-parse --short HEAD)
echo "Deploying commit: $COMMIT_SHA"

# Run deployment manually
bash k8s/scripts/deploy.sh
```

### Step 2: Monitor Deployment

```bash
# Watch pod creation in real-time
kubectl get pods -n freeshop -w

# Expected output (wait 2-3 minutes):
NAME                                READY   STATUS    RESTARTS   AGE
api-gateway-xxxxxx-xxxxx            1/1     Running   0          1m
auth-service-xxxxxx-xxxxx           1/1     Running   0          1m
user-service-xxxxxx-xxxxx           1/1     Running   0          1m
product-service-xxxxxx-xxxxx        1/1     Running   0          1m
... (remaining 6 services)
```

### Step 3: Monitor Helm Deployment

```bash
# Check Helm releases
helm list -n freeshop

# Expected output:
NAME             NAMESPACE   REVISION   STATUS    CHART         APP VERSION
api-gateway      freeshop    1          deployed  freeshop-1.0  1.0.0
auth-service     freeshop    1          deployed  freeshop-1.0  1.0.0
... (10 releases total)
```

### Step 4: Check Logs

```bash
# Check specific service logs
kubectl logs -n freeshop -l app=api-gateway --tail=50

# Watch logs in real-time
kubectl logs -n freeshop -l app=auth-service -f

# Check migration logs
kubectl logs -n freeshop -l app=auth-service -c migrate-database --tail=20
```

---

## Verification & Testing

### Step 1: Verify All Services Running

```bash
# Check pod status
kubectl get pods -n freeshop

# All pods should show:
# - Ready: 1/1
# - Status: Running
# - Restarts: 0

# Count should be:
# api-gateway: 2 replicas
# all others: 1 replica (auto-scale based on CPU)
# Total: ~11 pods
```

### Step 2: Test API Gateway Health

```bash
# Get API Gateway service IP
kubectl get svc -n freeshop api-gateway

# Test health endpoint
curl http://<API_GATEWAY_IP>:3000/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2026-04-09T12:30:00Z"
}
```

### Step 3: Test Authentication

```bash
# Login endpoint
curl -X POST http://<API_GATEWAY_IP>:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@freeshop.com","password":"admin123"}'

# Expected response (on success):
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": { "id": "uuid", "email": "admin@freeshop.com", "roles": [...] }
}
```

### Step 4: Test RBAC (Roles & Permissions)

```bash
# Get user roles
BEARER_TOKEN="<your_access_token_from_login>"

curl -X GET http://<API_GATEWAY_IP>:3000/rbac/users/me/roles \
  -H "Authorization: Bearer $BEARER_TOKEN"

# Expected response:
{
  "userId": "uuid",
  "roles": ["SUPERADMIN"],
  "permissionCodes": [1001, 1002, 1003, ..., 11001]
}
```

### Step 5: Check Resource Usage

```bash
# Monitor CPU and memory
kubectl top nodes

# Expected output (within limits):
# NAME                CPU(cores)   CPU%    MEMORY(Mi)  MEMORY%
# vps-node-1          2100m        35%     8192Mi      45%

# Check per-service
kubectl top pods -n freeshop

# Should all be within limits:
# API Gateway: ~150m CPU, ~256Mi RAM
# Other services: ~100m CPU, ~256Mi RAM
```

### Step 6: Verify Databases Created

```bash
# From VPS, check all databases
psql -h localhost -U freeshop_user -l

# Should see 9 databases:
# - freeshop_auth
# - freeshop_user
# - freeshop_product
# - freeshop_order
# - freeshop_payment
# - freeshop_inventory
# - freeshop_vendor
# - freeshop_notification
# - freeshop_analytics
```

---

## Monitoring & Logs

### Step 1: View Real-Time Logs

```bash
# All services
kubectl logs -n freeshop -f --all-containers=true

# Specific service
kubectl logs -n freeshop -f -l app=auth-service

# Last 100 lines
kubectl logs -n freeshop -l app=order-service --tail=100
```

### Step 2: Check Pod Events

```bash
# See what happened during deployment
kubectl describe pod -n freeshop <pod-name>

# Example:
kubectl describe pod -n freeshop api-gateway-xxxxxx-xxxxx
```

### Step 3: HPA Status

```bash
# Check Horizontal Pod Autoscaler
kubectl get hpa -n freeshop

# Expected output:
NAME             REFERENCE                 TARGETS        MINPODS   MAXPODS   REPLICAS
api-gateway      Deployment/api-gateway    15%/70%        2         2         2
auth-service     Deployment/auth-service   8%/70%         1         2         1
...
```

### Step 4: Check ConfigMap & Secrets

```bash
# View ConfigMap (non-sensitive)
kubectl get configmap -n freeshop freeshop-config -o yaml

# View secret names (not values)
kubectl get secrets -n freeshop

# Verify secrets exist:
# - freeshop-secrets (all credentials)
# - ghcr-pull-secret (Docker registry)
```

---

## Troubleshooting

### Issue 1: Pods Not Starting

**Symptoms:**
```
STATUS: ImagePullBackOff
or
STATUS: ErrImagePull
```

**Solution:**
```bash
# Check image pull secret
kubectl get secrets -n freeshop ghcr-pull-secret

# Verify GHCR token is valid
echo $GHCR_TOKEN | base64 | cut -c1-50

# Manually create pull secret if missing
kubectl create secret docker-registry ghcr-pull-secret \
  --namespace=freeshop \
  --docker-server=ghcr.io \
  --docker-username=<github-username> \
  --docker-password=<ghcr_token> \
  --docker-email=<github-email>
```

### Issue 2: Database Connection Errors

**Symptoms:**
```
Logs show: "connect ECONNREFUSED 127.0.0.1:5432"
```

**Solution:**
```bash
# Check if PostgreSQL is running on VPS
ssh ubuntu@<VPS_IP>
sudo systemctl status postgresql

# Restart if needed
sudo systemctl restart postgresql

# Verify database exists
psql -h localhost -U freeshop_user -d freeshop_auth -c "SELECT 1"
```

### Issue 3: Migrations Timeout

**Symptoms:**
```
Pod stuck in Init state, migration pod hangs
```

**Solution:**
```bash
# Check migration pod logs
kubectl logs -n freeshop migrate-auth-service-<sha> --tail=50

# If stuck, delete pod and retry
kubectl delete pod -n freeshop migrate-auth-service-<sha>

# Manually run migration
kubectl run migrate-manual --image=ghcr.io/.../auth-service:latest \
  -n freeshop \
  -- npx prisma migrate deploy
```

### Issue 4: Invalid Secrets

**Symptoms:**
```
Authentication fails, JWT errors
```

**Solution:**
```bash
# Verify secrets are correctly base64 encoded
kubectl get secret -n freeshop freeshop-secrets -o yaml

# All values should be base64 encoded
# Example: ADMIN_SECRET_KEY: NDQ0NDg4ODg4ODg4

# If secrets incorrect, delete and recreate
kubectl delete secret freeshop-secrets -n freeshop

# Recreate from file
kubectl create secret generic freeshop-secrets \
  --from-file=k8s/secrets/app-secrets.yaml \
  -n freeshop
```

### Issue 5: High CPU/Memory Usage

**Symptoms:**
```
Pods throttled or restarting frequently
```

**Solution:**
```bash
# Check resource requests vs actual
kubectl describe pod -n freeshop <pod-name> | grep -A 5 "Requests"

# Check for memory leaks
kubectl top pods -n freeshop --sort-by=memory

# Increase resource limits if needed (edit values-prod.yaml)
helm upgrade <service> ./helm/freeshop \
  --set services.resources.requests.cpu=150m \
  --set services.resources.limits.cpu=600m
```

### Issue 6: GitHub Actions Workflow Not Triggering

**Symptoms:**
```
Push to main but no deployment starts
```

**Solution:**
```bash
# Check workflow file exists and is correct
cat .github/workflows/deploy.yml

# Verify secrets are set
# Go to: Settings → Secrets → Check VPS_HOST, VPS_USER, VPS_SSH_KEY, GHCR_TOKEN

# Try manual trigger
# Go to: Actions → Select workflow → Run workflow

# Check workflow logs
# Actions tab → Latest run → Job logs
```

---

## Post-Deployment Checklist

After successful first deployment, verify:

- [ ] All 10 services running (kubectl get pods -n freeshop)
- [ ] All services healthy (curl /health endpoints)
- [ ] Authentication working (login returns tokens)
- [ ] RBAC functional (permissions loaded)
- [ ] Databases created (9 databases visible)
- [ ] Migrations completed (no migration pods stuck)
- [ ] ConfigMap populated (non-sensitive config)
- [ ] Secrets created (credentials accessible)
- [ ] HPA working (at least 1 service showing CPU%)
- [ ] Logs flowing (kubectl logs showing no errors)
- [ ] Resource usage within limits (< 40% of VPS)

---

## Next Steps

1. **Test All Endpoints**
   - Use Postman/Insomnia to test all API endpoints
   - Start with `/health`, `/auth/login`, `/rbac/users`

2. **Monitor Performance**
   - Watch metrics for first 24 hours
   - Check for memory leaks or CPU spikes
   - Verify auto-scaling triggers when needed

3. **Configure Backup**
   - Set up daily database backups
   - Store backup credentials securely
   - Test restoration process

4. **Set Up Alerts**
   - Configure alerts for pod crashes
   - Monitor database connection pool
   - Track API error rates

5. **Document Infrastructure**
   - Record VPS IP, credentials, SSH keys
   - Document database URLs and credentials
   - Keep GitHub secrets list updated

---

## Support & Rollback

### If Deployment Fails

```bash
# Rollback to previous Helm release
helm rollback <service-name> -n freeshop

# Example:
helm rollback api-gateway 0 -n freeshop
```

### Refer to

- [ROLLBACK_STRATEGY.md](ROLLBACK_STRATEGY.md) - Detailed rollback procedures
- [VPS_SETUP_AND_DEPLOY_GUIDE.md](k8s/VPS_SETUP_AND_DEPLOY_GUIDE.md) - Infrastructure setup
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Common commands

---

**Estimated Time**: 30-45 minutes for first-time deployment  
**Complexity**: Intermediate (infrastructure knowledge required)  
**Estimated Downtime**: 5-10 minutes (during pod rolling updates)

**Good luck with your deployment! 🚀**
