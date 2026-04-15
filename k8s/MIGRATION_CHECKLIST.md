# CI/CD Migration Checklist: Manual → GitHub Actions

> **Purpose:** Step-by-step checklist to migrate from manual VPS deployment to industry-standard CI/CD via GitHub Actions while preserving all data.

> **Estimated time:** 30–45 minutes total (mostly waiting for builds)

---

## ✅ Pre-Migration (Safety)

- [ ] **Backup Database**
  ```bash
  ssh root@YOUR_VPS_IP
  kubectl exec -it postgres-0 -n freeshop -- \
    pg_dumpall -U postgres > /opt/db-backup-$(date +%Y%m%d-%H%M%S).sql
  # Copy to local machine:
  scp root@YOUR_VPS_IP:/opt/db-backup-*.sql ~/Backups/freeshop/
  ```

- [ ] **Backup Persistent Volumes**
  ```bash
  ssh root@YOUR_VPS_IP
  tar -czf /opt/pvc-backup-$(date +%Y%m%d-%H%M%S).tar.gz \
    /var/lib/rancher/k3s/storage/ 2>/dev/null || true
  # Copy to local machine
  scp root@YOUR_VPS_IP:/opt/pvc-backup-*.tar.gz ~/Backups/freeshop/
  ```

- [ ] **Verify current deployment is stable**
  ```bash
  kubectl get pods -n freeshop
  # All pods should be Running
  ```

- [ ] **Note current commit SHA** (if you need to rollback to current state)
  ```bash
  git log -1 --oneline
  ```

---

## ✅ Phase 1: GitHub Secrets Setup (15 min)

### Step 1: Generate SSH Key for Deployment

- [ ] On your local machine, generate SSH key for GitHub Actions:
  ```powershell
  # Windows (PowerShell)
  ssh-keygen -t ed25519 -C "github-actions-freeshop" -f "$env:USERPROFILE\.ssh\freeshop-deploy" -P ""
  # Copy public key to VPS (upload then append to authorized_keys)
  scp $env:USERPROFILE\.ssh\freeshop-deploy.pub root@YOUR_VPS_IP:/tmp/freeshop-deploy.pub
  ssh root@YOUR_VPS_IP "mkdir -p ~/.ssh && cat /tmp/freeshop-deploy.pub >> ~/.ssh/authorized_keys && rm /tmp/freeshop-deploy.pub && chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys"
  # Verify
  ssh -i "$env:USERPROFILE\.ssh\freeshop-deploy" root@YOUR_VPS_IP "echo OK"
  ```

  ```bash
  # macOS / Linux (bash)
  ssh-keygen -t ed25519 -C "github-actions-freeshop" -f ~/.ssh/freeshop-deploy -N ""
  ssh-copy-id -i ~/.ssh/freeshop-deploy.pub -o StrictHostKeyChecking=no root@YOUR_VPS_IP
  ssh -i ~/.ssh/freeshop-deploy root@YOUR_VPS_IP "echo OK"
  ```

### Step 2: Create GitHub PAT (Personal Access Token)

- [ ] Go to **GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)**
- [ ] Click **"Generate new token (classic)"**
- [ ] Settings:
  - Name: `freeshop-ghcr-deploy`
  - Expiration: 90 days (or custom)
  - Scopes: ✅ `write:packages` ✅ `read:packages` ✅ `delete:packages`
- [ ] Click **Generate token** and **copy immediately** (won't show again)

### Step 3: Add Secrets to GitHub

- [ ] Go to **GitHub → your repository → Settings → Secrets and variables → Actions**

- [ ] Click **"New repository secret"** and add each:

  **Secret 1: VPS_HOST**
  - Name: `VPS_HOST`
  - Value: `YOUR_VPS_PUBLIC_IP` (e.g., `203.0.113.45`)
  - Click **Add secret**

  **Secret 2: VPS_USER**
  - Name: `VPS_USER`
  - Value: `root` (or your SSH user)
  - Click **Add secret**

  **Secret 3: VPS_SSH_KEY**
  - Name: `VPS_SSH_KEY`
  - Value: Full contents of `~/.ssh/freeshop-deploy` (private key)
    ```bash
    cat ~/.ssh/freeshop-deploy
    # Copy entire output including -----BEGIN PRIVATE KEY----- and -----END PRIVATE KEY-----
    ```
  - Click **Add secret**

  **Secret 4: GHCR_TOKEN**
  - Name: `GHCR_TOKEN`
  - Value: The GitHub PAT you generated above
  - Click **Add secret**

- [ ] **Verify secrets added:**
  ```bash
  curl -H "Authorization: token YOUR_PAT" \
    https://api.github.com/repos/YOUR_USERNAME/Free-Shop-Backend-Micoservices-eventDriven-/actions/secrets
  # Should list all 4 secrets
  ```

---

## ✅ Phase 2: Manifest Preparation (10 min)

- [ ] SSH to VPS and update manifest placeholders:
  ```bash
  ssh root@YOUR_VPS_IP
  cd /opt/freeshop-backend
  
  YOUR_REGISTRY="ghcr.io/YOUR_GITHUB_USERNAME"
  YOUR_EMAIL="your-email@freeshopbd.com"
  
  find k8s -name "*.yaml" | xargs sed -i "s|YOUR_DOMAIN.com|freeshopbd.com|g"
  find k8s -name "*.yaml" | xargs sed -i "s|YOUR_EMAIL@example.com|$YOUR_EMAIL|g"
  find k8s -name "*.yaml" | xargs sed -i "s|YOUR_REGISTRY|$YOUR_REGISTRY|g"
  
  # Verify no placeholders remain
  grep -r "YOUR_" k8s --include="*.yaml"
  # Should return nothing
  ```

- [ ] Verify app secrets are configured:
  ```bash
  ssh root@YOUR_VPS_IP
  cat /opt/freeshop-backend/k8s/secrets/app-secrets.yaml | head -20
  # Should have base64 values, not "YOUR_" placeholders
  ```

---

## ✅ Phase 3: Scale Down Manual Deployment (5 min)

> **Critical:** Do NOT delete. Just scale down. Databases stay running.

- [ ] Scale down all service deployments (keeps statefulsets intact):
  ```bash
  ssh root@YOUR_VPS_IP
  kubectl scale deploy --all --replicas=0 -n freeshop
  ```

- [ ] Verify services are scaled down:
  ```bash
  kubectl get pods -n freeshop
  # Should show: No resources found (in freeshop namespace)
  
  # But databases should still be running:
  kubectl get statefulsets -n freeshop
  # Should show: postgres, redis, rabbitmq with Running status
  ```

- [ ] Verify data is still intact:
  ```bash
  kubectl exec -it postgres-0 -n freeshop -- \
    psql -U postgres -c "\l"
  # Should list all 9 freeshop databases
  ```

---

## ✅ Phase 4: Trigger First CI/CD Deployment (15 min)

### Option A: Via GitHub UI (Recommended for safety)

- [ ] Go to **GitHub → your repository → Actions tab**
- [ ] Click **"Build, Push & Deploy"** in the left sidebar
- [ ] Click **"Run workflow"** button (top right)
- [ ] Select branch: `main` (should be default)
- [ ] Click **"Run workflow"** again
- [ ] **Watch the build in real-time!**
  - Build jobs (1-10) should start — watch them run in parallel
  - After all builds complete, "Deploy" job will start
  - Deploy should take ~5 minutes total

### Option B: Via Git Push (Automatic trigger)

- [ ] On your local machine:
  ```bash
  cd /path/to/Free-Shop-Backend-Micoservices-eventDriven-
  git status
  # Should be clean or have untracked files
  ```

- [ ] Make a dummy commit (or push if already committed):
  ```bash
  git add .
  git commit -m "feat: switch to CI/CD deployment"
  git push origin main
  ```

- [ ] GitHub Actions will trigger automatically. Go to **Actions tab** and watch.

### During Deployment

- [ ] In GitHub UI, click the running workflow to see live logs
- [ ] On VPS terminal, watch pods come up:
  ```bash
  kubectl get pods -n freeshop -w
  # Wait for all pods to reach Running status
  ```

---

## ✅ Phase 5: Verify Deployment Success

### When GitHub Actions Shows ✅ Green Check

- [ ] Verify all pods are running:
  ```bash
  ssh root@YOUR_VPS_IP
  kubectl get pods -n freeshop
  # All services should show: Running (1/1)
  ```

- [ ] Check new pods use CI/CD image tags (short SHA):
  ```bash
  kubectl get pods -n freeshop -o wide
  # Image column should show: ghcr.io/.../freeshop-*:abc1234 (not 'latest')
  ```

- [ ] Test API endpoint:
  ```bash
  curl https://api.freeshopbd.com/health
  # Should return JSON response
  ```

- [ ] Verify databases were reused (existing data intact):
  ```bash
  kubectl exec -it postgres-0 -n freeshop -- \
    psql -U postgres -d freeshop_product -c "SELECT COUNT(*) FROM \"Product\";"
  # Should return a number > 0 (proof data exists)
  ```

- [ ] Check Helm releases were created:
  ```bash
  helm list -n freeshop
  # Should show: api-gateway, auth-service, ... (10 total)
  ```

---

## ✅ Phase 6: Cleanup Old Manual Deployment

> **Safe to do now:** Old deployments are scaled to 0, CI/CD is running.

### Option A: Keep Old Resources (Safest — recommended for first run)

- [ ] Do nothing yet. Keep old Helm releases for safety.
- [ ] After running CI/CD for 48 hours without issues, proceed to Option B.

### Option B: Remove Old Manual Deployments (After confidence)

- [ ] Check what we're removing:
  ```bash
  ssh root@YOUR_VPS_IP
  helm list -n freeshop | head -20
  # List old Helm releases (if any)
  
  kubectl get all -n freeshop | grep -v freeshop-secrets
  # View all resources to be removed
  ```

- [ ] Remove old manual Helm releases (if they exist):
  ```bash
  # Example: if you previously deployed with kubectl apply (raw YAML)
  # You can remove them with:
  kubectl delete -f k8s/services/ -n freeshop --ignore-not-found
  kubectl delete -f k8s/infrastructure/ -n freeshop --ignore-not-found
  
  # OR if using old Helm releases, uninstall them:
  helm uninstall <old-release-name> -n freeshop
  ```

- [ ] Verify only CI/CD-managed resources remain:
  ```bash
  helm list -n freeshop
  # Should show: api-gateway, auth-service, user-service, ... (new Helm releases)
  
  kubectl get pods -n freeshop
  # All pods should have correct image tags (short SHA)
  ```

---

## ✅ Phase 7: Test Common Scenarios

### Test 1: Make a Code Change and Deploy

- [ ] On local machine, make a simple change:
  ```bash
  cd /path/to/repo
  
  # Example: add a log line
  nano services/auth-service/src/index.ts
  # Add: console.log("CI/CD deployment test");
  
  git add .
  git commit -m "test: verify CI/CD deployment"
  git push origin main
  ```

- [ ] GitHub Actions triggers automatically
- [ ] Wait ~20 minutes for build/deploy to complete
- [ ] Verify new pods started with new image tag
- [ ] Check logs show your new log line:
  ```bash
  kubectl logs deployment/auth-service -n freeshop | grep "CI/CD deployment test"
  ```

### Test 2: Verify Autoscaling Works

- [ ] Check HPA status:
  ```bash
  kubectl get hpa -n freeshop -w
  # Watch metrics update
  ```

- [ ] Generate load (optional — CPU should rise)
- [ ] Verify pods scale up/down appropriately

### Test 3: Test Manual Service Restart

- [ ] Delete a pod (Kubernetes will restart it automatically):
  ```bash
  kubectl delete pod -l app=api-gateway -n freeshop
  ```

- [ ] Watch new pod start:
  ```bash
  kubectl get pods -n freeshop -w
  # api-gateway pod should restart
  ```

---

## ✅ Phase 8: Document for Team

- [ ] Create a `.github/README.md` documenting:
  - How to trigger deployments (git push to main)
  - How to monitor deployments (actions tab)
  - How to rollback (revert commit or helm rollback)

- [ ] Example:
  ```markdown
  # Deployment

  ## To deploy:
  ```bash
  git push origin main  # Automatic trigger
  ```

  ## To monitor:
  - GitHub Actions → Actions tab → Select workflow

  ## To rollback:
  ```bash
  git revert HEAD
  git push origin main
  # Or: helm rollback SERVICE -n freeshop
  ```
  ```

---

## ✅ Phase 9: Confirm CI/CD is Default Path

- [ ] Ensure manual deployment scripts are no longer needed:
  ```bash
  # On your local machine:
  grep -r "build-push.sh\|deploy.sh" README.md docs/ 2>/dev/null
  # Should be no references to manual scripts (or update docs to say "DEPRECATED")
  ```

- [ ] Update `README.md`:
  ```markdown
  ## Deployment

  **Automatic via GitHub Actions:** Just `git push` to `main`!

  See [`CI_CD_DEPLOYMENT_GUIDE.md`](k8s/CI_CD_DEPLOYMENT_GUIDE.md) for details.

  ~~Manual deployment (`VPS_SETUP_AND_DEPLOY_GUIDE.md`) - deprecated~~
  ```

---

## ✅ Troubleshooting During Migration

### If Build Fails

- [ ] Check GitHub Actions logs — expand the failed job
- [ ] Common issues:
  - Image pull error → `GHCR_TOKEN` secret wrong/expired → regenerate
  - SSH error → `VPS_SSH_KEY` secret wrong → check file permissions locally

### If Deploy Fails

- [ ] SSH to VPS and check:
  ```bash
  kubectl get pods -n freeshop
  kubectl logs deployment/api-gateway -n freeshop
  ```

- [ ] Check Helm error:
  ```bash
  helm status api-gateway -n freeshop
  helm get values api-gateway -n freeshop
  ```

### If Data is Lost

- [ ] **RESTORE IMMEDIATELY:**
  ```bash
  kubectl exec -it postgres-0 -n freeshop -- \
    psql -U postgres < /path/to/db-backup-YYYYMMDD.sql
  ```

- [ ] This should never happen (databases are never deleted), but just in case!

### If You Need to Rollback to Manual Deployment

- [ ] Old manual deployments still scale to 0 (they're not deleted):
  ```bash
  ssh root@YOUR_VPS_IP
  kubectl scale deploy --all --replicas=3 -n freeshop  # or however many
  # Old pods will start again
  ```

- [ ] Or rollback via Helm:
  ```bash
  helm rollback <service-name> 0 -n freeshop
  ```

---

## ✅ Post-Migration Checklist

After successful migration:

- [ ] GitHub Secrets are saved and verified
- [ ] VPS SSH key is saved locally (backup in password manager)
- [ ] GitHub PAT is saved securely (backup in password manager)
- [ ] Backups created and stored safely
- [ ] At least 1 successful CI/CD deployment completed
- [ ] Data integrity verified (check key tables have rows)
- [ ] API is responding normally
- [ ] Monitoring is in place (HPA, logs, alerts)
- [ ] Team is informed about the new deployment process
- [ ] Documentation updated

---

## Quick Reference

| Action | Command |
|--------|---------|
| Trigger deployment | `git push origin main` |
| Monitor deployment | GitHub Actions tab |
| Check pod status | `kubectl get pods -n freeshop` |
| View pod logs | `kubectl logs deployment/SERVICE -n freeshop` |
| Rollback service | `helm rollback SERVICE 0 -n freeshop` |
| Rollback code | `git revert HEAD && git push origin main` |
| SSH to VPS | `ssh root@YOUR_VPS_IP` |
| Access k8s | `export KUBECONFIG=/etc/rancher/k3s/k3s.yaml` |
| Scale service | Helm/k8s scales automatically via HPA |

---

## Next Step

When ready, proceed to **[CI_CD_DEPLOYMENT_GUIDE.md](CI_CD_DEPLOYMENT_GUIDE.md)** for detailed documentation on operating the new CI/CD system.

Good luck! 🚀
