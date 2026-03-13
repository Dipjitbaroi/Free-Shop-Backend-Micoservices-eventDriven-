#!/bin/bash
# ============================================================
# setup-vps.sh  —  Run this ONCE on your fresh VPS (Ubuntu 22.04)
# Usage: chmod +x setup-vps.sh && sudo bash setup-vps.sh
# VPS Spec: 6 cores / 18 GB RAM / 300 GB SSD
# ============================================================
set -euo pipefail

echo "========================================"
echo " Free-Shop VPS Setup — k3s Kubernetes"
echo "========================================"

# --- 1. System update & essentials ---
apt-get update -y && apt-get upgrade -y
apt-get install -y curl wget git ufw htop unzip apt-transport-https ca-certificates gnupg

# --- 2. Configure firewall ---
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 6443/tcp  # K3s API server (only if you need kubectl access remotely)
ufw --force enable
echo "Firewall configured."

# --- 3. Install Docker (for building images on VPS if needed) ---
curl -fsSL https://get.docker.com | sh
usermod -aG docker $USER || true
echo "Docker installed."

# --- 4. Install k3s (single-node, disable built-in Traefik — we use NGINX) ---
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--disable traefik --disable servicelb --kube-apiserver-arg=service-node-port-range=80-32767" sh -
echo "k3s installed."

# Wait for k3s to be ready
sleep 10
k3s kubectl get nodes

# --- 5. Set up kubeconfig for current user ---
mkdir -p $HOME/.kube
k3s kubectl config view --raw > $HOME/.kube/config
chmod 600 $HOME/.kube/config
export KUBECONFIG=$HOME/.kube/config
echo "export KUBECONFIG=$HOME/.kube/config" >> $HOME/.bashrc

# --- 6. Install Helm ---
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
echo "Helm installed."

# --- 7. Install NGINX Ingress Controller (bare-metal) ---
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.1/deploy/static/provider/baremetal/deploy.yaml

# Patch NodePort to use standard 80/443
kubectl patch svc ingress-nginx-controller -n ingress-nginx \
  --type='json' \
  -p='[
    {"op":"replace","path":"/spec/ports/0/nodePort","value":80},
    {"op":"replace","path":"/spec/ports/1/nodePort","value":443}
  ]' || true

echo "NGINX Ingress Controller installed."

# --- 8. Install cert-manager (for Let's Encrypt SSL) ---
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.14.5/cert-manager.yaml
echo "cert-manager installed. Waiting for it to be ready..."
sleep 30
kubectl wait --for=condition=Available deployment --all -n cert-manager --timeout=120s

# --- 9. Enable Metrics Server (required for HPA) ---
# k3s ships metrics-server by default, but if missing:
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml || true
echo "Metrics-server verified."

# --- 10. Install local-path provisioner (for PVCs — already default in k3s) ---
echo "local-path storage provisioner: already bundled with k3s."

# --- 11. Set local-path as default StorageClass ---
kubectl patch storageclass local-path -p '{"metadata":{"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}' || true

echo ""
echo "========================================"
echo " VPS setup complete!"
echo " Next step: run  bash deploy.sh"
echo "========================================"
