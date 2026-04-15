# Free-Shop — Full VPS Setup & Deployment Guide

> **Stack:** Node.js microservices · k3s (Kubernetes) · PostgreSQL · Redis · RabbitMQ · NGINX Ingress · Let's Encrypt SSL  
> **VPS Spec:** 6 cores / 18 GB RAM / 300 GB SSD · Ubuntu 24.04 LTS  
> **Registry:** GitHub Container Registry (GHCR) — free with any GitHub account

---

## Table of Contents

1. [What You Need Before Starting](#1-what-you-need-before-starting)
2. [How It All Works (Big Picture)](#2-how-it-all-works-big-picture)
3. [Phase 1 — Local Machine: Build & Push Docker Images](#3-phase-1--local-machine-build--push-docker-images)
4. [Phase 2 — VPS: Initial Server Setup](#4-phase-2--vps-initial-server-setup)
5. [Phase 3 — VPS: Configure Secrets](#5-phase-3--vps-configure-secrets)
6. [Phase 4 — VPS: Replace Placeholder Values](#6-phase-4--vps-replace-placeholder-values)
7. [Phase 5 — VPS: Deploy Everything](#7-phase-5--vps-deploy-everything)
8. [Phase 6 — Verify the Deployment](#8-phase-6--verify-the-deployment)
9. [Phase 7 — Connect Frontend on Vercel](#9-phase-7--connect-frontend-on-vercel)
10. [Phase 8 — Set Up CI/CD (GitHub Actions)](#10-phase-8--set-up-cicd-github-actions)
11. [Updating / Rolling Deployments](#11-updating--rolling-deployments)
12. [Troubleshooting](#12-troubleshooting)
13. [Useful Daily Commands](#13-useful-daily-commands)
14. [Backups](#14-backups)

---

## 1. What You Need Before Starting

### On Your Local Machine
- [ ] **Docker Desktop** installed and running
- [ ] **Git** installed
- [ ] **GitHub account** — used for GHCR (free container registry)

### Your VPS
- [ ] Fresh **Ubuntu 24.04 LTS** VPS (root or sudo SSH access) ✅ confirmed
- [ ] Your VPS public IP address noted down

### DNS & Domain
- [ ] Domain: **`freeshopbd.com`** (Namecheap)
- [ ] Access to Namecheap dashboard to create DNS A records

### External Service Credentials (gather these before starting)
- [ ] **Cloudinary** — cloud name, API key, API secret (for image uploads)
- [ ] **bKash** — app key, app secret, username, password, base URL (for payments)
- [ ] **SMTP** — host, port, user, password, from email (for notifications)
- [ ] **Firebase** — project ID, client email, private key (for push notifications)

---

## 2. How It All Works (Big Picture)

```
Your Local Machine
┌────────────────────────────────────┐
│  Source Code (services/, packages/)│
│       ↓                            │
│  docker build (10 services)        │
│       ↓                            │
│  docker push → ghcr.io/YOU/...     │
└────────────────────────────────────┘
             │
             │ images stored in
             ▼
    GitHub Container Registry
    (ghcr.io/YOUR_USERNAME/...)
             │
             │ pulled by k3s
             ▼
┌──────────────────────────────────────┐
│  VPS  (Ubuntu 24.04 LTS — k3s)        │
│                                      │
│  NGINX Ingress + Let's Encrypt SSL   │
│        │                             │
│   api.freeshopbd.com                   │
│        │                             │
│   api-gateway  (2–5 replicas HPA)    │
│        │                             │
│  ┌─────┴────── Microservices ──────┐ │
│  │ auth    user    product         │ │
│  │ order   payment inventory       │ │
│  │ vendor  notification analytics  │ │
│  │ (each: 1–3 replicas, HPA)       │ │
│  └─────────────────────────────────┘ │
│        │         │         │         │
│  PostgreSQL    Redis    RabbitMQ     │
│  (9 databases) (cache)  (events)     │
└──────────────────────────────────────┘
             │
             │ API calls from
             ▼
   freeshopbd.com  (Vercel — Next.js frontend)
```

**Key point:** The VPS only needs the `k8s/` folder (YAML manifests + scripts). Your source code stays on your local machine and in GitHub.

---

## 3. Phase 1 — Local Machine: Build & Push Docker Images

This runs on **your computer**, not the VPS.

### Step 1.1 — Create a GitHub Personal Access Token (PAT)

1. Go to **GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)**
2. Click **"Generate new token (classic)"**
3. Name it: `freeshop-ghcr`
4. Select scopes: ✅ `write:packages`  ✅ `read:packages`  ✅ `delete:packages`
5. Click **Generate token** — **copy it now**, you won't see it again
6. Save it somewhere safe (you'll need it again in Phase 2)

### Step 1.2 — Log In to GitHub Container Registry

```bash
# Replace YOUR_GITHUB_USERNAME and YOUR_PAT with your actual values
echo "YOUR_PAT" | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

Expected output: `Login Succeeded`

### Step 1.3 — Build & Push All 10 Service Images

> **Important — two repos, different machines:**
> - `Free-shop-backend/` → stays on your **local machine** (has Dockerfiles + source code)
> - `Free-shop-k8s/` → goes on the **VPS** (has only YAML manifests)
>
> Phase 1 always runs from `Free-shop-backend/` because `build-push.sh` needs the `services/*/Dockerfile` files. The k8s repo has no source code and cannot build images.

Run this from the **root of `Free-shop-backend/`** on your local machine:

**Windows — Git Bash (recommended):**
```bash
cd /d/GitHub/Free-shop-backend
REGISTRY=ghcr.io/dipjitbaroi bash k8s/scripts/build-push.sh
```

**Windows — PowerShell (alternative):**
```powershell
cd D:\GitHub\Free-shop-backend
$env:REGISTRY="ghcr.io/dipjitbaroi"
$env:TAG="latest"
$env:DOCKER_DEFAULT_PLATFORM="linux/amd64"
# Run each service build manually (see build-push.sh for the list)
```

**Mac/Linux:**
```bash
cd ~/path/to/Free-shop-backend
REGISTRY=ghcr.io/dipjitbaroi bash k8s/scripts/build-push.sh
```

> **Important:** GHCR requires the username to be **all lowercase** — `dipjitbaroi` not `Dipjitbaroi`.

This will:
- Build all 10 microservice images for `linux/amd64`
- Tag them as `ghcr.io/YOUR_GITHUB_USERNAME/freeshop-<service>:latest`
- Push them to GHCR

> **On Apple Silicon (M1/M2 Mac):** The `--platform linux/amd64` flag in the script handles cross-compilation — no extra setup needed.

> **This step takes 10–20 minutes** depending on your internet speed. Each image is built from scratch the first time.

### Step 1.4 — Make Images Public (Recommended) or Keep Private

**Option A — Make public (simpler, no pull secret needed):**
1. Go to `https://github.com/YOUR_GITHUB_USERNAME?tab=packages`
2. For each `freeshop-*` package, click it → **Package settings** → **Change visibility** → **Public**

**Option B — Keep private (more secure, requires pull secret on VPS):**  
Skip this step. You will create a pull secret in Phase 2.

---

## 4. Phase 2 — VPS: Initial Server Setup

Everything from here runs on the **VPS**, not your local machine.

### Step 2.1 — SSH Into Your VPS

```bash
ssh root@YOUR_VPS_IP
```

### Step 2.2 — Clone the k8s Repository

Since you have a separate k8s repo, clone **only that** on the VPS. The full backend source code is never needed here.

```bash
git clone https://github.com/Dipjitbaroi/Free-shop-k8s.git /opt/freeshop-k8s
cd /opt/freeshop-k8s
```

All remaining commands in this guide run from `/opt/freeshop-k8s/`.

### Step 2.3 — Run the VPS Setup Script (One-Time Only)

```bash
chmod +x scripts/setup-vps.sh
sudo bash scripts/setup-vps.sh
```

This script automatically installs:
| Tool | Purpose |
|------|---------|
| **k3s** | Lightweight single-node Kubernetes |
| **NGINX Ingress Controller** | Routes HTTP/HTTPS traffic to services |
| **cert-manager** | Issues and renews Let's Encrypt SSL certificates |
| **Metrics Server** | Enables HPA autoscaling |
| **Helm** | Kubernetes package manager |
| **UFW firewall** | Opens ports 22, 80, 443, 6443 only |

> **This takes about 3–5 minutes.**

### Step 2.4 — Reload Shell and Verify

```bash
source ~/.bashrc

# Verify k3s is running
kubectl get nodes
```

Expected output:
```
NAME       STATUS   ROLES                  AGE   VERSION
your-vps   Ready    control-plane,master   1m    v1.x.x+k3s1
```

If status shows `NotReady`, wait 30 seconds and try again.

### Step 2.5 — Configure DNS on Namecheap (do this while the setup runs)

1. Log in to [namecheap.com](https://namecheap.com) → **Domain List** → click **Manage** next to `freeshopbd.com`
2. Go to the **Advanced DNS** tab
3. Add / update these records:

| Type | Host  | Value               | TTL        |
|------|-------|---------------------|------------|
| A    | `@`   | *(Vercel IP — set via Vercel dashboard)* | Automatic |
| A    | `www` | *(Vercel IP — set via Vercel dashboard)* | Automatic |
| A    | `api` | `YOUR_VPS_IP`       | 300        |

> **Tip:** For `@` and `www`, Vercel gives you the exact A record or CNAME value when you add the domain in the Vercel dashboard — use those values. Only `api` points to your VPS.

Wait for DNS to propagate (usually 5–15 minutes). Verify:
```bash
dig api.freeshopbd.com +short
# Should return your VPS IP
```

### Step 2.6 — Create GHCR Pull Secret (if images are private)

Skip this if you made images public in Step 1.4.

```bash
# Replace values with your GitHub credentials
kubectl create namespace freeshop --dry-run=client -o yaml | kubectl apply -f -

kubectl create secret docker-registry ghcr-pull-secret \
  --namespace=freeshop \
  --docker-server=ghcr.io \
  --docker-username=YOUR_GITHUB_USERNAME \
  --docker-password=YOUR_PAT \
  --dry-run=client -o yaml | kubectl apply -f -

# Patch default ServiceAccount so all pods use the pull secret automatically
kubectl patch serviceaccount default \
  --namespace=freeshop \
  -p '{"imagePullSecrets":[{"name":"ghcr-pull-secret"}]}'
```

---

## 5. Phase 3 — VPS: Configure Secrets

### Step 3.1 — Generate Your Secret Values

Run these commands on the VPS to generate base64-encoded values:

```bash
# Generate a strong PostgreSQL password
echo -n "$(openssl rand -base64 24)" | base64

# Generate JWT secrets (run twice — one for JWT, one for refresh token)
echo -n "$(openssl rand -hex 32)" | base64
echo -n "$(openssl rand -hex 32)" | base64

# Encode any known value (replace "myvalue" with the real value)
echo -n "myvalue" | base64
```

> **Important:** All values in the secrets file MUST be base64-encoded.  
> Use `echo -n "value" | base64` — the `-n` flag prevents a trailing newline.

### Step 3.2 — Edit the Secrets File

```bash
nano secrets/app-secrets.yaml
```

Replace every placeholder with your real base64-encoded values:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: freeshop-secrets
  namespace: freeshop
type: Opaque
data:
  # Database
  POSTGRES_PASSWORD: <base64-of-your-strong-postgres-password>

  # Message queue
  RABBITMQ_USER: <base64-of-rabbitmq-username>       # e.g. echo -n "admin" | base64 → YWRtaW4=
  RABBITMQ_PASS: <base64-of-rabbitmq-password>

  # Auth tokens (generate with: echo -n "$(openssl rand -hex 32)" | base64)
  JWT_SECRET: <base64-of-random-64-char-string>
  JWT_REFRESH_SECRET: <base64-of-different-random-64-char-string>

  # Cloudinary (image uploads)
  CLOUDINARY_CLOUD_NAME: <base64-of-your-cloud-name>
  CLOUDINARY_API_KEY: <base64-of-your-api-key>
  CLOUDINARY_API_SECRET: <base64-of-your-api-secret>

  # bKash payment gateway
  BKASH_APP_KEY: <base64-of-your-app-key>
  BKASH_APP_SECRET: <base64-of-your-app-secret>
  BKASH_USERNAME: <base64-of-your-username>
  BKASH_PASSWORD: <base64-of-your-password>
  BKASH_BASE_URL: <base64-of-sandbox-or-live-url>

  # Email / SMTP
  SMTP_HOST: <base64-of-smtp-host>                   # e.g. smtp.gmail.com
  SMTP_PORT: <base64-of-smtp-port>                   # e.g. 587
  SMTP_USER: <base64-of-smtp-email>
  SMTP_PASS: <base64-of-smtp-password-or-app-password>
  EMAIL_FROM: <base64-of-from-email>

  # Firebase (push notifications)
  FIREBASE_PROJECT_ID: <base64-of-project-id>
  FIREBASE_CLIENT_EMAIL: <base64-of-client-email>
  FIREBASE_PRIVATE_KEY: <base64-of-private-key>
```

Save and close: `Ctrl+O` → `Enter` → `Ctrl+X`

> **NEVER commit this file to Git with real values.** Add it to `.gitignore`.

---

## 6. Phase 4 — VPS: Replace Placeholder Values

All YAML manifests use placeholder strings that must be replaced with your actual domain and registry. Run these commands from inside the `k8s/` directory:

```bash
# Your actual values — already filled in for freeshopbd.com
YOUR_REGISTRY="ghcr.io/YOUR_GITHUB_USERNAME"   # ← change to your GitHub username
YOUR_EMAIL="you@freeshopbd.com"                   # ← change to your real email

# Replace domain placeholder (freeshopbd.com is the domain, api.freeshopbd.com is the backend)
find . -name "*.yaml" | xargs sed -i "s|YOUR_DOMAIN.com|freeshopbd.com|g"

# Replace email placeholder (used by cert-manager for Let's Encrypt notifications)
find . -name "*.yaml" | xargs sed -i "s|YOUR_EMAIL@example.com|$YOUR_EMAIL|g"

# Replace registry placeholder
find . -name "*.yaml" | xargs sed -i "s|YOUR_REGISTRY|$YOUR_REGISTRY|g"

# Set CORS in api-gateway to allow requests from freeshopbd.com (Vercel frontend)
# Update with your actual Vercel deployment URL:
sed -i "s|YOUR_VERCEL_DOMAIN.vercel.app|freeshopbd.com|g" services/api-gateway/api-gateway.yaml
sed -i "s|YOUR_CUSTOM_DOMAIN.com|freeshopbd.com|g" services/api-gateway/api-gateway.yaml
```

### Verify No Placeholders Remain

```bash
grep -r "YOUR_" . --include="*.yaml"
# Should return nothing (or only lines inside comments)
```

If any results appear, edit the relevant file and fix them manually.

---

## 7. Phase 5 — VPS: Deploy Everything

### Step 5.1 — Run the Deploy Script

```bash
chmod +x scripts/deploy.sh
bash scripts/deploy.sh
```

The script does the following in order:

| Step | What Happens |
|------|-------------|
| 1 | Creates the `freeshop` Kubernetes namespace |
| 2 | Applies secrets from `secrets/app-secrets.yaml` |
| 3 | Starts PostgreSQL, Redis, RabbitMQ (StatefulSets with persistent volumes) |
| 4 | Waits for databases to be ready (up to 3 min each) |
| 5 | Runs Prisma database migrations for all 9 services |
| 6 | Deploys all 10 microservices (Deployments + Services + HPAs) |
| 7 | Applies NGINX Ingress rules and cert-manager ClusterIssuer |

**Expected total time: 5–10 minutes**

### Step 5.2 — Watch the Deployment

Open a second SSH session and watch pods come up:

```bash
kubectl get pods -n freeshop -w
```

You should see pods go from `Pending` → `Init` → `Running` over a few minutes.

---

## 8. Phase 6 — Verify the Deployment

### Check All Pods Are Running

```bash
kubectl get pods -n freeshop
```

All pods should show `STATUS=Running` and `READY=1/1`. If any show `CrashLoopBackOff` or `Error`, see the [Troubleshooting](#11-troubleshooting) section.

### Check Services and Ingress

```bash
kubectl get svc -n freeshop
kubectl get ingress -n freeshop
```

### Check SSL Certificate

```bash
kubectl get certificate -n freeshop
```

Initial SSL issuance takes 1–3 minutes. Status should show `READY=True`.

### Check HPA (Autoscaling)

```bash
kubectl get hpa -n freeshop
```

All HPAs should show `TARGETS` with current and max values.

### Test the API

```bash
curl https://api.freeshopbd.com/health
# Expected: {"status":"ok"} or similar JSON response
```

If you get a `502 Bad Gateway`, the api-gateway pod may still be starting. Wait 30 seconds and try again.

### Check Databases Were Created

```bash
kubectl exec -it postgres-0 -n freeshop -- psql -U postgres -c "\l"
```

Should list these 9 databases:
- `freeshop_auth`
- `freeshop_user`
- `freeshop_product`
- `freeshop_order`
- `freeshop_payment`
- `freeshop_inventory`
- `freeshop_vendor`
- `freeshop_notification`
- `freeshop_analytics`

---

## 9. Phase 7 — Connect Frontend on Vercel

### Step 7a — Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your frontend repo
2. Set environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://api.freeshopbd.com
   ```
3. Deploy — Vercel gives you a `.vercel.app` URL first

### Step 7b — Add freeshopbd.com to Vercel

1. In Vercel project → **Settings → Domains**
2. Add `freeshopbd.com` and `www.freeshopbd.com`
3. Vercel will show you the exact DNS values to set — go back to **Namecheap → Advanced DNS** and update the `@` and `www` A records with those values
4. Vercel handles SSL for the frontend automatically

### Step 7c — Verify CORS

Your backend `api-gateway` must allow requests from `https://freeshopbd.com`. Confirm the `CORS_ORIGIN` env var in `services/api-gateway/api-gateway.yaml` includes:
```
https://freeshopbd.com,https://www.freeshopbd.com
```
If you need to update it after deploy:
```bash
kubectl edit deployment api-gateway -n freeshop
# Find CORS_ORIGIN and update the value, save and exit
```

---

## 10. Phase 8 — Set Up CI/CD (GitHub Actions)

Once the initial manual deploy is done, future deployments happen automatically on every push to the `main` branch.

### Step 8.1 — Add GitHub Repository Secrets

Go to your **GitHub repository → Settings → Secrets and variables → Actions → New repository secret** and add each of these:

| Secret Name   | Value | Where to Get It |
|---------------|-------|-----------------|
| `VPS_HOST`    | Your VPS IP address (e.g. `123.45.67.89`) | Your VPS provider dashboard |
| `VPS_USER`    | SSH user (usually `root`) | Your VPS provider dashboard |
| `VPS_SSH_KEY` | Full contents of your private SSH key | `cat ~/.ssh/id_rsa` on your local machine |
| `GHCR_TOKEN`  | GitHub PAT with `read:packages` + `write:packages` | Same PAT you created in Step 1.1 |

### Step 8.2 — Generate an SSH Key (if you don't have one)

```powershell
# On your LOCAL machine (Windows PowerShell)
ssh-keygen -t ed25519 -C "freeshop-deploy" -f "$env:USERPROFILE\.ssh\freeshop_deploy" -P ""
scp $env:USERPROFILE\.ssh\freeshop_deploy.pub root@YOUR_VPS_IP:/tmp/freeshop_deploy.pub
ssh root@YOUR_VPS_IP "mkdir -p ~/.ssh && cat /tmp/freeshop_deploy.pub >> ~/.ssh/authorized_keys && rm /tmp/freeshop_deploy.pub && chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys"

# The PRIVATE key content goes into VPS_SSH_KEY secret
Get-Content $env:USERPROFILE\.ssh\freeshop_deploy -Raw
```

```bash
# On your LOCAL machine (macOS / Linux)
ssh-keygen -t ed25519 -C "freeshop-deploy" -f ~/.ssh/freeshop_deploy -N ""
ssh-copy-id -i ~/.ssh/freeshop_deploy.pub root@YOUR_VPS_IP
cat ~/.ssh/freeshop_deploy
```

### Step 8.3 — How the Pipeline Works

After setup, every `git push` to `main` triggers:

1. **Build** — all 10 Docker images built in parallel (matrix), tagged with the commit SHA + `latest`
2. **Push** — images pushed to GHCR
3. **Deploy** — SSHes into VPS and runs:
   - Refreshes GHCR pull secret
   - `kubectl set image` on each deployment → zero-downtime rolling updates
   - Waits for all rollouts to complete
   - Fails the pipeline (and notifies you) if any service doesn't come up

---

## 11. Updating / Rolling Deployments

### Deploy a Specific Tag

```bash
# On the VPS — roll all services to a specific image tag
REGISTRY=ghcr.io/YOUR_GITHUB_USERNAME TAG=abc1234 bash scripts/rollout-update.sh
```

### Update a Single Service

```bash
# Example: update only the auth-service to a new image
kubectl set image deployment/auth-service \
  auth-service=ghcr.io/YOUR_GITHUB_USERNAME/freeshop-auth-service:latest \
  -n freeshop

# Watch the rollout
kubectl rollout status deployment/auth-service -n freeshop
```

### Roll Back a Service

```bash
# Roll back to the previous version
kubectl rollout undo deployment/auth-service -n freeshop
```

### Restart a Service (without changing image)

```bash
kubectl rollout restart deployment/api-gateway -n freeshop
```

### Update k8s Manifests

```bash
# On the VPS — pull latest manifest changes and re-apply
cd /opt/freeshop-k8s
git pull
kubectl apply -f services/api-gateway/
```

---

## 12. Troubleshooting

### Pod stuck in `ImagePullBackOff`

```bash
# Check what error is happening
kubectl describe pod <pod-name> -n freeshop | grep -A 10 Events

# Check if pull secret exists
kubectl get secret ghcr-pull-secret -n freeshop

# Re-create the pull secret
kubectl create secret docker-registry ghcr-pull-secret \
  --namespace=freeshop \
  --docker-server=ghcr.io \
  --docker-username=YOUR_GITHUB_USERNAME \
  --docker-password=YOUR_PAT \
  --dry-run=client -o yaml | kubectl apply -f -
```

### Pod in `CrashLoopBackOff`

```bash
# Check the logs — this usually shows the real error
kubectl logs <pod-name> -n freeshop

# Check previous crash logs
kubectl logs <pod-name> -n freeshop --previous

# Describe the pod for events
kubectl describe pod <pod-name> -n freeshop
```

Common causes:
- Wrong database URL or password in secrets
- Missing environment variable (check the deployment YAML)
- Database migration not run yet

### SSL Certificate Not Issuing

```bash
# Check cert-manager is running
kubectl get pods -n cert-manager

# Check certificate status
kubectl describe certificate -n freeshop

# Check the HTTP challenge (DNS must resolve and port 80 must be open)
kubectl get challenges -n freeshop
kubectl describe challenge -n freeshop
```

Make sure:
- DNS A record for `api.freeshopbd.com` points to your VPS IP (set in Namecheap)
- Port 80 is open on the VPS firewall (`ufw status`)
- The NGINX Ingress pod is running (`kubectl get pods -n ingress-nginx`)

### Service Returns 502 Bad Gateway

```bash
# Check if the target service pod is running
kubectl get pods -n freeshop | grep api-gateway

# Check api-gateway logs
kubectl logs -f deployment/api-gateway -n freeshop

# Check if the service endpoint exists
kubectl get endpoints -n freeshop
```

### Database Connection Errors

```bash
# Check if PostgreSQL pod is running
kubectl get pods -n freeshop | grep postgres

# Check PostgreSQL logs
kubectl logs postgres-0 -n freeshop

# Verify the secret password is correct
kubectl get secret freeshop-secrets -n freeshop -o jsonpath='{.data.POSTGRES_PASSWORD}' | base64 -d
echo  # just adds a newline

# Connect to postgres directly
kubectl exec -it postgres-0 -n freeshop -- psql -U postgres
```

### Out of Memory / OOMKilled

```bash
# Check resource usage
kubectl top pods -n freeshop
kubectl top nodes

# Check OOM events
kubectl get events -n freeshop --sort-by='.lastTimestamp' | grep -i oom

# Increase memory limit for a service (edit its YAML then re-apply)
kubectl edit deployment api-gateway -n freeshop
```

### Check All Pod States at Once

```bash
kubectl get pods -n freeshop
```

| Status | Meaning | Action |
|--------|---------|--------|
| `Running` | Healthy | Nothing needed |
| `Pending` | Waiting for resources | Check node capacity: `kubectl describe node` |
| `Init:0/1` | Init container running | Wait, or check: `kubectl logs <pod> -c <init-container> -n freeshop` |
| `CrashLoopBackOff` | App is crashing | Check logs (see above) |
| `ImagePullBackOff` | Can't pull image | Check pull secret / image name |
| `Error` | Container exited with error | Check logs |
| `Terminating` | Being deleted | Wait for it to finish |

---

## 13. Useful Daily Commands

```bash
# ── Status Overview ──────────────────────────────────────────
kubectl get all -n freeshop
kubectl get pods -n freeshop -w          # watch in real-time
kubectl get hpa -n freeshop -w           # watch autoscaling

# ── Logs ─────────────────────────────────────────────────────
kubectl logs -f deployment/api-gateway -n freeshop
kubectl logs -f deployment/auth-service -n freeshop
kubectl logs -f deployment/order-service -n freeshop

# ── Resource Usage ────────────────────────────────────────────
kubectl top pods -n freeshop
kubectl top nodes

# ── Exec Into a Pod ───────────────────────────────────────────
kubectl exec -it <pod-name> -n freeshop -- sh

# ── Scaling ───────────────────────────────────────────────────
kubectl scale deployment api-gateway --replicas=3 -n freeshop
kubectl rollout restart deployment/api-gateway -n freeshop

# ── Port Forwarding (local access to internal services) ───────
kubectl port-forward svc/rabbitmq 15672:15672 -n freeshop
# Then open: http://localhost:15672  (RabbitMQ management UI)

kubectl port-forward svc/postgres 5432:5432 -n freeshop
# Then connect with psql or any DB client

# ── Recent Events ─────────────────────────────────────────────
kubectl get events -n freeshop --sort-by='.lastTimestamp' | tail -20

# ── NGINX Ingress Logs ────────────────────────────────────────
kubectl logs -f deployment/ingress-nginx-controller -n ingress-nginx
```

---

## 14. Backups

### Manual PostgreSQL Backup

```bash
# Full backup of all databases
kubectl exec -it postgres-0 -n freeshop -- \
  pg_dumpall -U postgres > backup_$(date +%Y%m%d_%H%M).sql

# Backup a single database
kubectl exec -it postgres-0 -n freeshop -- \
  pg_dump -U postgres freeshop_auth > auth_backup_$(date +%Y%m%d).sql

# Copy a backup from the pod to the VPS host filesystem
kubectl cp freeshop/postgres-0:/tmp/backup.sql ./backup.sql

# Restore from backup
kubectl exec -it postgres-0 -n freeshop -- \
  psql -U postgres < backup.sql
```

### Backup Persistent Volumes

PVCs use k3s local-path provisioner, stored at `/var/lib/rancher/k3s/storage/` on the VPS.

```bash
# List all volumes
ls /var/lib/rancher/k3s/storage/

# Backup a volume (stop the pod first for consistency)
kubectl scale statefulset postgres --replicas=0 -n freeshop
tar -czf postgres-data-backup-$(date +%Y%m%d).tar.gz /var/lib/rancher/k3s/storage/pvc-<postgres-pvc-id>
kubectl scale statefulset postgres --replicas=1 -n freeshop
```

### Automated Backups (Recommended)

Set up a cron job on the VPS to run backups daily:

```bash
crontab -e
```

Add:
```cron
0 2 * * * kubectl exec -it postgres-0 -n freeshop -- pg_dumpall -U postgres > /opt/backups/db_$(date +\%Y\%m\%d).sql 2>&1
```

---

## Quick Reference

| Task | Command |
|------|---------|
| SSH into VPS | `ssh root@YOUR_VPS_IP` |
| View all pods | `kubectl get pods -n freeshop` |
| View logs | `kubectl logs -f deployment/<service> -n freeshop` |
| Restart a service | `kubectl rollout restart deployment/<service> -n freeshop` |
| Roll back a service | `kubectl rollout undo deployment/<service> -n freeshop` |
| Run full deploy | `bash scripts/deploy.sh` |
| Build & push images | `REGISTRY=ghcr.io/YOU bash scripts/build-push.sh` |
| Check SSL certs | `kubectl get certificate -n freeshop` |
| Check autoscaling | `kubectl get hpa -n freeshop` |
| Access RabbitMQ UI | `kubectl port-forward svc/rabbitmq 15672:15672 -n freeshop` |
| Backup databases | `kubectl exec -it postgres-0 -n freeshop -- pg_dumpall -U postgres > backup.sql` |
| Test API endpoint | `curl https://api.freeshopbd.com/health` |
| Test frontend | Open `https://freeshopbd.com` in browser |

---

## File Structure Reference

```
k8s/
├── namespace.yaml                     ← Creates 'freeshop' namespace
├── secrets/
│   └── app-secrets.yaml               ← ⚠️ Fill in & NEVER commit to Git
├── infrastructure/
│   ├── postgres/
│   │   ├── configmap.yaml             ← Creates 9 databases on first run
│   │   ├── pvc.yaml                   ← 20GB persistent volume
│   │   ├── statefulset.yaml           ← PostgreSQL pod
│   │   └── service.yaml               ← Internal DNS: postgres.freeshop
│   ├── redis/
│   │   └── redis.yaml                 ← Redis cache (StatefulSet + Service)
│   └── rabbitmq/
│       └── rabbitmq.yaml              ← RabbitMQ message broker
├── services/
│   ├── api-gateway/                   ← Entry point (Deployment + Service + HPA)
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
│   ├── cert-manager-issuer.yaml       ← Let's Encrypt ClusterIssuer
│   └── ingress.yaml                   ← NGINX routing rules + SSL
└── scripts/
    ├── setup-vps.sh                   ← ONE-TIME: installs k3s + tools
    ├── build-push.sh                  ← LOCAL: build & push all images
    ├── deploy.sh                      ← VPS: full deploy / re-deploy
    └── rollout-update.sh              ← VPS: rolling update to new tag
```
