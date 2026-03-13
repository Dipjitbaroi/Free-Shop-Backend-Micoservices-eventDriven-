#!/bin/bash
# ============================================================
# rollout-update.sh  —  Rolling update all services to latest image
# Usage: REGISTRY=docker.io/YOUR_USER TAG=v1.2.0 bash rollout-update.sh
# ============================================================
set -euo pipefail

NAMESPACE="freeshop"
REGISTRY="${REGISTRY:-docker.io/YOUR_DOCKERHUB_USERNAME}"
TAG="${TAG:-latest}"

SERVICES=(
  "api-gateway"
  "auth-service"
  "user-service"
  "product-service"
  "order-service"
  "payment-service"
  "inventory-service"
  "seller-service"
  "notification-service"
  "analytics-service"
)
# Note: Frontend is deployed on Vercel, not on this cluster.

echo "Rolling update to $REGISTRY/freeshop-*:$TAG"

for SERVICE in "${SERVICES[@]}"; do
  IMAGE="$REGISTRY/freeshop-$SERVICE:$TAG"
  echo "  Updating $SERVICE → $IMAGE"
  kubectl set image deployment/$SERVICE \
    $SERVICE=$IMAGE \
    -n $NAMESPACE 2>/dev/null || echo "  (skipped $SERVICE — not found)"
done

echo ""
echo "Rolling update triggered. Watching rollout..."
for SERVICE in "${SERVICES[@]}"; do
  kubectl rollout status deployment/$SERVICE -n $NAMESPACE --timeout=120s 2>/dev/null || true
done

echo "Done. Current pods:"
kubectl get pods -n $NAMESPACE
