# CI/CD Quick Reference Card

> Print this or keep in your IDE sidebar for quick lookup during operations.

---

## 🚀 Common Operations

### Deploy a Code Fix
```bash
git add .
git commit -m "fix: your message"
git push origin main
# → GitHub Actions deploys automatically (~20 min)
```

### Monitor Deployment
1. Go to **GitHub → Actions → Latest run**
2. Watch build/deploy steps in real-time
3. Or on VPS terminal: `kubectl get pods -n freeshop -w`

### Rollback Last Deploy
```bash
git revert HEAD --no-edit
git push origin main
# → Deploys previous version (~20 min)
```

### Restart Single Service (Quick)
```bash
kubectl rollout restart deploy/auth-service -n freeshop
# Takes ~2 min, immediate effect
```

### View Logs
```bash
kubectl logs -f deploy/auth-service -n freeshop
# Last 50 lines: add --tail=50
```

### Scale Service Manually
```bash
kubectl scale deploy/api-gateway --replicas=5 -n freeshop
# (HPA will take over again, but this forces immediate change)
```

---

## 📊 Status Checks

### Current Deployment Status
```bash
kubectl get pods -n freeshop
# All should show: Running (1/1)
```

### Autoscaling Status
```bash
kubectl get hpa -n freeshop
# Shows CPU targets and current replicas
```

### Helm Releases
```bash
helm list -n freeshop
# Shows: api-gateway, auth-service, ... (10 total)
```

### Check Database Survival (After Migration)
```bash
kubectl exec -it postgres-0 -n freeshop -- \
  psql -U postgres -c "SELECT datname FROM pg_database WHERE datname LIKE 'freeshop%';"
# Should list 9 databases — proof data survived
```

### View Image Tags (Proof of CI/CD)
```bash
kubectl get pods -n freeshop -o=custom-columns=\
NAME:.metadata.name,IMAGE:.spec.containers[0].image
# Image should show: ghcr.io/username/freeshop-*:abc1234 (short SHA, not 'latest')
```

---

## 🔍 Troubleshooting Fast Path

### Pod stuck in `ImagePullBackOff`
```bash
# Issue: Can't pull image from GHCR
# Fix: Regenerate GHCR pull secret:
ssh root@YOUR_VPS_IP
kubectl create secret docker-registry ghcr-pull-secret \
  -n freeshop --docker-server=ghcr.io \
  --docker-username=YOUR_GITHUB_USERNAME \
  --docker-password=YOUR_PAT \
  --dry-run=client -o yaml | kubectl apply -f -
```

### Pod stuck in `CrashLoopBackOff`
```bash
# Issue: App is crashing
# Check logs:
kubectl logs <pod-name> -n freeshop
# Or previous logs if already crashed:
kubectl logs <pod-name> -n freeshop --previous
```

### Deployment stuck at zero replicas
```bash
# Issue: No pods starting
# Check HPA:
kubectl get hpa -n freeshop
# Manually scale:
kubectl scale deploy/api-gateway --replicas=2 -n freeshop
```

### Database connection errors
```bash
# Issue: Pods crashing with DB errors
# Check pod environment:
kubectl exec -it <pod> -n freeshop -- env | grep POSTGRES
# Check DB is running:
kubectl get statefulset postgres -n freeshop
# Check database exists:
kubectl exec -it postgres-0 -n freeshop -- psql -U postgres -c "\l"
```

### GitHub Actions stuck at SSH step
```powershell
# Issue: Can't connect to VPS (Windows PowerShell)
# Verify SSH key works locally:
ssh -i "$env:USERPROFILE\.ssh\freeshop-deploy" root@YOUR_VPS_IP "echo OK"
# If fails, regenerate key and update VPS_SSH_KEY secret:
ssh-keygen -t ed25519 -C "github-actions-freeshop" -f "$env:USERPROFILE\.ssh\freeshop-deploy" -P ""
# Copy public key to VPS (upload then append):
scp $env:USERPROFILE\.ssh\freeshop-deploy.pub root@YOUR_VPS_IP:/tmp/freeshop-deploy.pub
ssh root@YOUR_VPS_IP "mkdir -p ~/.ssh && cat /tmp/freeshop-deploy.pub >> ~/.ssh/authorized_keys && rm /tmp/freeshop-deploy.pub && chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys"
# Update GitHub Secret: Settings → Secrets → VPS_SSH_KEY
```

```bash
# macOS / Linux (bash)
# Verify SSH key works locally:
ssh -i ~/.ssh/freeshop-deploy root@YOUR_VPS_IP "echo OK"
# If fails, regenerate key and update VPS_SSH_KEY secret:
ssh-keygen -t ed25519 -C "github-actions-freeshop" -f ~/.ssh/freeshop-deploy -N ""
ssh-copy-id -i ~/.ssh/freeshop-deploy.pub root@YOUR_VPS_IP
# Update GitHub Secret: Settings → Secrets → VPS_SSH_KEY
```

---

## 🔄 Deployment Strategies

### Strategy 1: Rollback Last Commit (Fastest)
```bash
git revert HEAD --no-edit
git push origin main
# Redeploys previous version, no downtime
# Time: ~20 min
```

### Strategy 2: Rollback Single Service (Safest)
```bash
helm rollback auth-service 0 -n freeshop
# Rollback only that service, others stay current
# Time: ~2 min
```

### Strategy 3: Re-run Previous Build (No Git push)
```bash
# GitHub UI: Actions → previous run → Re-run all jobs
# Rebuilds and deploys exact same commit again
# Time: ~20 min
```

### Strategy 4: Hotfix Deploy (Urgent)
```bash
# Quick fix on urgent branch:
git checkout -b hotfix/critical-bug
# Make fix...
git commit -am "hotfix: critical issue"
git push origin hotfix/critical-bug
# Does NOT deploy (only main branch triggers deploy)
# Then merge to main:
git checkout main && git pull
git merge hotfix/critical-bug
git push origin main
# Now deploys to production
```

---

## 🗂️ File Locations

### Local Machine (Your Laptop)
```
~/Free-Shop-Backend-Micoservices-eventDriven-/
├── .github/workflows/
│   ├── ci.yml                          ← What runs on PRs
│   └── deploy.yml                      ← What runs on merge to main
├── k8s/
│   ├── secrets/app-secrets.yaml        ← App secrets (never commit)
│   ├── services/                       ← Service k8s manifests
│   └── scripts/
│       └── setup-vps.sh                ← (One-time setup, not used in CI/CD)
├── helm/freeshop/                      ← Helm chart definitions
└── services/                           ← Your source code
```

### GitHub (Repository)
- **Settings → Secrets and variables → Actions**
  - `VPS_HOST` - VPS public IP
  - `VPS_USER` - SSH user
  - `VPS_SSH_KEY` - Private SSH key
  - `GHCR_TOKEN` - GitHub PAT

### VPS (/etc/rancher/k3s/)
```
/opt/freeshop-backend/                 ← Git repo (auto-synced by CI/CD)
│                                      ← Source code pulled here
└── k8s/                               ← Manifests & secrets
    ├── secrets/app-secrets.yaml      ← App secrets (REAL VALUES)
    └── services/...                  ← Deployed to k8s via Helm

/var/lib/rancher/k3s/storage/        ← PostgreSQL, Redis, RabbitMQ data
```

---

## 📋 GitHub Secrets Checklist

| Secret | Example Value | What It Does |
|--------|---------------|--------------|
| `VPS_HOST` | `203.0.113.45` | Where to SSH deploy |
| `VPS_USER` | `root` | SSH username |
| `VPS_SSH_KEY` | `-----BEGIN PRIVATE KEY-----...` | SSH authentication |
| `GHCR_TOKEN` | `ghp_xxxxxxxxxxxxxxx...` | Push images to GitHub Container Registry |

**Lost a secret?** Regenerate it and update GitHub:
- **SSH key:** `ssh-keygen -t ed25519 ...`, then `ssh-copy-id ...`
- **PAT token:** GitHub → Settings → Developer settings → Tokens (classic) → Generate new
- Then update GitHub Secret: Settings → Secrets and variables → Actions → Edit

---

## ⏱️ Timeline Expectations

| Operation | Time | What's Happening |
|-----------|------|------------------|
| `git push` | immediate | GitHub receives code |
| CI workflow | 3–5 min | Type-check, lint, build test (PRs only) |
| Build job 1-10 | 10–12 min | Build 10 images in parallel |
| Deploy SSH | ~2 min | Connect to VPS, update manifests |
| Migrations | 2–3 min | Run Prisma migration for each service |
| Helm deploy | 2–3 min | Apply new configs, start pods |
| Rollout wait | 3–5 min | Pods transition: Pending → Running |
| **Total** | **15–25 min** | From `git push` to live ✅ |

---

## 🎯 Decision Tree: What to Do When...

```
Problem: Code has a bug
  ├─ → Quick fix needed (not urgent)
  │    └─ Fix locally, git commit, git push main → Wait 20 min
  │
  ├─ → Urgent fix needed NOW
  │    ├─ Option 1: Revert last commit
  │    │   └─ git revert HEAD, git push → Wait 20 min
  │    │
  │    └─ Option 2: Scale down to zero
  │        └─ kubectl scale deploy --all --replicas=0 -n freeshop
  │           (buys time to fix bug)
  │
  └─ → Want to test code first (without deploying)
       └─ Open PR to main (not merge) → CI runs, no deploy

Problem: Pod is crashing
  ├─ → Check logs first
  │    └─ kubectl logs deploy/SERVICE -n freeshop
  │
  ├─ → If it's DB error
  │    └─ Check database exists and has data
  │
  ├─ → If it's connection error
  │    └─ Restart pod: kubectl rollout restart deploy/SERVICE -n freeshop
  │
  └─ → If still crashing
       └─ Check GitHub Actions logs for migration error
           └─ May need to rollback and fix migrations

Problem: Deployment is too slow
  ├─ → Check build cache (should reuse layers)
  │    └─ If not, may be network issue
  │
  ├─ → Check GitHub Actions runner availability
  │    └─ If all busy, queue your workflow
  │
  └─ → Check VPS resource usage
       └─ kubectl top nodes, kubectl top pods

Problem: Lost data
  ├─ → RESTORE IMMEDIATELY from backup
  │    └─ kubectl exec -it postgres-0 ... < backup.sql
  │
  └─ → This should never happen (PostgreSQL never deleted in CI/CD)
       └─ Only manual kubectl delete -pvc would cause data loss
```

---

## 🔐 Security Quick Tips

- ✅ **Never commit secrets** to Git
- ✅ **Use GitHub Secrets** (encrypted, hidden from logs)
- ✅ **SSH keys saved locally** with restrictive permissions: `chmod 600 ~/.ssh/freeshop-deploy`
- ✅ **Audit logs available** — GitHub Actions logs all deployments
- ✅ **Enable branch protection** on `main` to require PR reviews before deploy
- ✅ **Rotate PAT tokens** every 90 days (or set custom expiration)
- ❌ **Don't add secrets to deployment logs** (GitHub Actions hides them automatically)

---

## 📞 Still Stuck?

1. **Check CI/CD logs** → GitHub Actions tab, click failed run
2. **Check pod logs** → `kubectl logs deployment/SERVICE -n freeshop`
3. **Check pod events** → `kubectl describe pod POD_NAME -n freeshop`
4. **Check Helm** → `helm status SERVICE -n freeshop`
5. **SSH to VPS** → `ssh root@YOUR_VPS_IP`
6. **Check kubeconfig** → `export KUBECONFIG=/etc/rancher/k3s/k3s.yaml`
7. **Read full guide** → [CI_CD_DEPLOYMENT_GUIDE.md](CI_CD_DEPLOYMENT_GUIDE.md)

---

## 🎓 Learning More

- **Kubernetes:** https://kubernetes.io/docs/concepts/
- **GitHub Actions:** https://docs.github.com/en/actions
- **Helm:** https://helm.sh/docs/
- **k3s:** https://docs.k3s.io/
- **Docker:** https://docs.docker.com/

---

**Last Updated:** 2026-04-15  
**Audience:** DevOps / Backend Team  
**Next Review:** After 2nd successful CI/CD deployment
