# Free-Shop Kubernetes Deployment Guide

VPS: **6 cores / 18 GB RAM / 300 GB SSD** — Single-node k3s cluster

---

## Architecture Overview

```
Internet
    │
    ▼
┌─────────────────────────────────┐
│  VPS  (Ubuntu 22.04)            │
│  ┌───────────────────────────┐  │
│  │  k3s (Kubernetes)         │  │
│  │                           │  │
│  │  NGINX Ingress (+SSL)     │  │
│  │       │          │        │  │
│  │  api.domain  www.domain   │  │
│  │       │          │        │  │
│  │  api-gateway  frontend    │  │
│  │  (HPA: 2–5)   (HPA: 2–4)  │  │
│  │       │                   │  │
│  │  ┌────┴──── Services ───┐ │  │
│  │  │ auth   user  product │ │  │
│  │  │ order  payment  inv  │ │  │
│  │  │ vendor notif  analyt │ │  │
│  │  │ (each HPA: 1–3)      │ │  │
│  │  └──────────────────────┘ │  │
│  │       │      │      │     │  │
│  │  PostgreSQL Redis RabbitMQ│  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

---

## Resource Allocation (18 GB RAM / 6 vCPU)

| Component          | CPU Request | RAM Request | Replicas |
|--------------------|-------------|-------------|----------|
| PostgreSQL         | 500m        | 1 GB        | 1        |
| Redis              | 100m        | 256 MB      | 1        |
| RabbitMQ           | 250m        | 512 MB      | 1        |
| api-gateway        | 150m        | 256 MB      | 2 (min)  |
| auth-service       | 100m        | 256 MB      | 1 (min)  |
| 8× other services  | 100m each   | 256 MB each | 1 each   |
| frontend           | 100m        | 128 MB      | 2 (min)  |
| k3s system         | ~400m       | ~1.5 GB     | —        |
| **Total (min)**    | ~3.2 vCPU   | ~8 GB       | —        |
|**Headroom for HPA**| ~2.8 vCPU   | ~10 GB      | —        |

---

## Step-by-Step Deployment

### Step 1 — Prepare the VPS

```bash
# SSH into your VPS
ssh root@YOUR_VPS_IP

# Clone your repo
git clone https://github.com/pronoybanik/Free-shop-backend.git /opt/freeshop-backend
cd /opt/freeshop-backend

# Run VPS setup (installs k3s, nginx-ingress, cert-manager, helm)
chmod +x k8s/scripts/setup-vps.sh
sudo bash k8s/scripts/setup-vps.sh

# Reload shell for KUBECONFIG
source ~/.bashrc
```

### Step 2 — Point Your Domain DNS

In your domain registrar, add these A records pointing to your VPS IP:

| Record | Value       |
|--------|-------------|
| `@`    | VPS_IP      |
| `www`  | VPS_IP      |
| `api`  | VPS_IP      |

### Step 3 — Configure Secrets

Edit `k8s/secrets/app-secrets.yaml` — replace all empty `""` values with base64-encoded secrets:

```bash
# Encode a value
echo -n "your-strong-password" | base64

# Example for POSTGRES_PASSWORD
echo -n "myStrongPass123!" | base64
```

> ⚠️ **Never commit real secrets to Git.** Add `k8s/secrets/app-secrets.yaml` to `.gitignore`.

### Step 4 — Build & Push Docker Images (locally)

```bash
# From your local machine in the project root
REGISTRY=ghcr.io/pronoybanik bash k8s/scripts/build-push.sh

# Update manifests with your registry
find k8s/services -name "*.yaml" | xargs sed -i 's|YOUR_REGISTRY|ghcr.io/pronoybanik|g'
find k8s/ingress -name "*.yaml"  | xargs sed -i 's|YOUR_REGISTRY|ghcr.io/pronoybanik|g'
```

### Step 5 — Configure Domain in Ingress

```bash
# Replace placeholder domain in ingress
sed -i 's|YOUR_DOMAIN.com|yourdomain.com|g' k8s/ingress/ingress.yaml
sed -i 's|YOUR_EMAIL@example.com|you@yourdomain.com|g' k8s/ingress/cert-manager-issuer.yaml
sed -i 's|YOUR_DOMAIN.com|yourdomain.com|g' k8s/ingress/frontend.yaml
```

### Step 6 — Deploy Everything

```bash
# On the VPS
cd /opt/freeshop-backend
bash k8s/scripts/deploy.sh
```

### Step 7 — Verify

```bash
# Check all pods are Running
kubectl get pods -n freeshop

# Check HPA is active
kubectl get hpa -n freeshop

# Check SSL certificate
kubectl describe certificate -n freeshop

# Check ingress
kubectl get ingress -n freeshop

# Tail logs
kubectl logs -f deployment/api-gateway -n freeshop
```

---

## CI/CD Pipeline (GitHub Actions)

The pipeline is in `.github/workflows/deploy.yml`.

### Required GitHub Secrets

Go to **GitHub → Settings → Secrets and variables → Actions** and add:

| Secret         | Description                                               |
|----------------|-----------------------------------------------------------|
| `VPS_HOST`     | Your VPS IP address                                       |
| `VPS_USER`     | SSH user (e.g. `root`)                                    |
| `VPS_SSH_KEY`  | Full private SSH key (contents of `~/.ssh/id_rsa`)        |
| `GHCR_TOKEN`   | GitHub PAT with `read:packages` + `write:packages` scope  |

The `GITHUB_TOKEN` (for pushing images during build) is automatic.
`GHCR_TOKEN` must be a **Personal Access Token** because `GITHUB_TOKEN` expires after each workflow run and cannot be used by the VPS to pull images on demand.

**Create GHCR_TOKEN:**
1. GitHub → Settings → Developer settings → Personal access tokens → Fine-grained or Classic
2. Select scopes: `read:packages`, `write:packages`
3. Copy the token and add it as the `GHCR_TOKEN` secret

### How It Works

1. Push to `main` → builds all 10 service images **in parallel** (matrix strategy, each cached per-service)
2. Tags each image as `ghcr.io/pronoybanik/freeshop-SERVICE:<short-sha>` + `:latest`
3. SSHes into VPS:
   - Creates/refreshes a k8s `docker-registry` secret from `GHCR_TOKEN`
   - Patches the `default` ServiceAccount so all pods inherit the pull secret
   - Runs `git pull` to get latest k8s manifests
   - Runs `kubectl set image` on each deployment → zero-downtime rolling update
   - Waits for rollouts and fails the pipeline if any service doesn't come up
4. HPA automatically scales pods up/down based on CPU/memory

---

## Horizontal Pod Autoscaling

HPA is configured for every service. Example: under heavy load on `api-gateway`:

```
Normal:    api-gateway  2 replicas  (CPU 30%)
High load: api-gateway  5 replicas  (CPU >60%)
```

Monitor in real-time:
```bash
kubectl get hpa -n freeshop -w
```

Manual scale override:
```bash
kubectl scale deployment api-gateway --replicas=3 -n freeshop
```

---

## Useful Commands

```bash
# View all resources
kubectl get all -n freeshop

# Describe a failing pod
kubectl describe pod <pod-name> -n freeshop

# Exec into a pod
kubectl exec -it <pod-name> -n freeshop -- sh

# View resource usage
kubectl top pods -n freeshop
kubectl top nodes

# Rolling update to a specific tag
REGISTRY=ghcr.io/pronoybanik TAG=abc1234 bash k8s/scripts/rollout-update.sh

# Restart a deployment
kubectl rollout restart deployment/api-gateway -n freeshop

# Access RabbitMQ management UI (via port-forward)
kubectl port-forward svc/rabbitmq 15672:15672 -n freeshop
# Then open: http://localhost:15672

# Access PostgreSQL (via port-forward)
kubectl port-forward svc/postgres 5432:5432 -n freeshop
```

---

## Backups

```bash
# PostgreSQL backup
kubectl exec -it postgres-0 -n freeshop -- \
  pg_dumpall -U postgres > backup_$(date +%Y%m%d).sql

# Copy to local machine
kubectl cp freeshop/postgres-0:/tmp/backup.sql ./backup.sql
```

---

## k8s Directory Structure

```
k8s/
├── namespace.yaml
├── secrets/
│   └── app-secrets.yaml          # ← Fill in & never commit
├── infrastructure/
│   ├── postgres/                  # StatefulSet + PVC + Service
│   ├── redis/                     # StatefulSet + PVC + Service
│   └── rabbitmq/                  # StatefulSet + PVC + Service
├── services/
│   ├── api-gateway/               # Deployment + Service + HPA
│   ├── auth-service/
│   ├── user-service/
│   ├── product-service/
│   ├── order-service/
│   ├── payment-service/
│   ├── inventory-service/
│   ├── vendor-service/
│   ├── notification-service/
│   └── analytics-service/
├── ingress/
│   ├── cert-manager-issuer.yaml   # Let's Encrypt ClusterIssuer
│   ├── ingress.yaml               # NGINX Ingress rules
│   └── frontend.yaml              # Frontend Deployment + HPA
└── scripts/
    ├── setup-vps.sh               # One-time VPS initialization
    ├── build-push.sh              # Build & push all images
    ├── deploy.sh                  # Full deploy / re-deploy
    └── rollout-update.sh          # Rolling update to new tag
```
