#!/bin/bash
# ============================================================
# deploy.sh  —  Deploy / update the full stack on k3s VPS
# Run this on the VPS (or remotely with KUBECONFIG set).
# Usage: bash deploy.sh
# ============================================================
set -euo pipefail

NAMESPACE="freeshop"
K8S_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "========================================"
echo " Deploying Free-Shop to Kubernetes"
echo " Namespace: $NAMESPACE"
echo "========================================"

# --- 1. Namespace ---
echo "[1/7] Applying namespace..."
kubectl apply -f "$K8S_DIR/namespace.yaml"

# --- 2. Secrets ---
echo "[2/7] Applying secrets..."
if [ ! -f "$K8S_DIR/secrets/app-secrets.yaml" ]; then
  echo "ERROR: k8s/secrets/app-secrets.yaml not found. Fill in the values first!"
  exit 1
fi
kubectl apply -f "$K8S_DIR/secrets/app-secrets.yaml"

# --- 3. Infrastructure (PostgreSQL, Redis, RabbitMQ) ---
echo "[3/7] Applying infrastructure..."
kubectl apply -f "$K8S_DIR/infrastructure/postgres/configmap.yaml"
kubectl apply -f "$K8S_DIR/infrastructure/postgres/pvc.yaml"
kubectl apply -f "$K8S_DIR/infrastructure/postgres/statefulset.yaml"
kubectl apply -f "$K8S_DIR/infrastructure/postgres/service.yaml"
kubectl apply -f "$K8S_DIR/infrastructure/redis/redis.yaml"
kubectl apply -f "$K8S_DIR/infrastructure/rabbitmq/rabbitmq.yaml"

# Wait for infrastructure to be ready
echo ">>> Waiting for PostgreSQL to be ready (up to 3 min)..."
kubectl rollout status statefulset/postgres -n "$NAMESPACE" --timeout=180s

echo ">>> Waiting for Redis to be ready..."
kubectl rollout status statefulset/redis -n "$NAMESPACE" --timeout=120s

echo ">>> Waiting for RabbitMQ to be ready..."
kubectl rollout status statefulset/rabbitmq -n "$NAMESPACE" --timeout=180s

# --- 4. Run Prisma Migrations ---
echo "[4/7] Running Prisma DB migrations..."
SERVICES=(
  "auth-service"
  "user-service"
  "product-service"
  "order-service"
  "payment-service"
  "inventory-service"
  "vendor-service"
  "notification-service"
  "analytics-service"
)

POSTGRES_PASSWORD=$(kubectl get secret freeshop-secrets -n "$NAMESPACE" -o jsonpath='{.data.POSTGRES_PASSWORD}' | base64 -d)

for SERVICE in "${SERVICES[@]}"; do
  IMAGE=$(kubectl get deployment "$SERVICE" -n "$NAMESPACE" -o jsonpath='{.spec.template.spec.containers[0].image}' 2>/dev/null || echo "")
  if [ -z "$IMAGE" ]; then
    IMAGE_REGISTRY=$(grep -r "image:" "$K8S_DIR/services/$SERVICE/" | head -1 | awk '{print $2}')
  else
    IMAGE_REGISTRY="$IMAGE"
  fi
  DB_NAME="freeshop_${SERVICE%-service}" # strips '-service' suffix
  DB_URL="postgresql://postgres:${POSTGRES_PASSWORD}@postgres.$NAMESPACE.svc.cluster.local:5432/${DB_NAME/_service/}"
  echo "  Migrating $SERVICE..."
  kubectl run "migrate-$SERVICE" \
    --image="$IMAGE_REGISTRY" \
    --restart=Never \
    --namespace="$NAMESPACE" \
    --env="DATABASE_URL=$DB_URL" \
    --command -- npx prisma migrate deploy \
    --wait \
    --pod-running-timeout=60s \
    2>/dev/null || echo "  (migration job for $SERVICE skipped or already done)"
  kubectl delete pod "migrate-$SERVICE" -n "$NAMESPACE" --ignore-not-found=true 2>/dev/null || true
done

# --- 5. Deploy Application Services ---
echo "[5/7] Deploying application services..."
for SERVICE_DIR in "$K8S_DIR"/services/*/; do
  kubectl apply -f "$SERVICE_DIR"
done

# --- 6. Deploy Ingress ---
echo "[6/7] Applying ingress and cert-manager issuer..."
kubectl apply -f "$K8S_DIR/ingress/cert-manager-issuer.yaml"
kubectl apply -f "$K8S_DIR/ingress/ingress.yaml"
# Note: Frontend is deployed on Vercel, not on this cluster.

# --- 7. Status ---
echo "[7/7] Deployment status..."
echo ""
kubectl get pods -n "$NAMESPACE"
echo ""
kubectl get hpa -n "$NAMESPACE"
echo ""
kubectl get ingress -n "$NAMESPACE"

echo ""
echo "========================================"
echo " Deployment complete!"
echo " Check pod logs: kubectl logs -f <pod-name> -n $NAMESPACE"
echo " Monitor HPA:    kubectl get hpa -n $NAMESPACE -w"
echo "========================================"
