#!/bin/bash
# ============================================================
# build-push.sh  —  Build all Docker images and push to registry
# Run this LOCALLY before deploying to VPS.
# Usage: REGISTRY=docker.io/YOUR_DOCKERHUB_USERNAME bash build-push.sh
# ============================================================
set -euo pipefail

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
  "vendor-service"
  "notification-service"
  "analytics-service"
)

echo "Building and pushing with REGISTRY=$REGISTRY TAG=$TAG"
echo "=========================================="

# Log in to registry
docker login

for SERVICE in "${SERVICES[@]}"; do
  IMAGE="$REGISTRY/freeshop-$SERVICE:$TAG"
  echo ""
  echo ">>> Building $IMAGE ..."
  docker build \
    --platform linux/amd64 \
    -f "services/$SERVICE/Dockerfile" \
    -t "$IMAGE" \
    .

  echo ">>> Pushing $IMAGE ..."
  docker push "$IMAGE"
done

echo ""
echo "=========================================="
echo " All images built and pushed!"
echo " Now update k8s manifests with your REGISTRY value:"
echo "   find k8s/services -name '*.yaml' | xargs sed -i 's|YOUR_REGISTRY|$REGISTRY|g'"
echo "=========================================="
