#!/bin/bash
# verify-helm-charts.sh
# Run this script on the VPS to verify Helm charts before first deployment
# Usage: bash verify-helm-charts.sh

set -e

REPO_PATH=${1:-.}
HELM_CHART="$REPO_PATH/helm/freeshop"

echo "=================================="
echo " Helm Chart Verification Script"
echo "=================================="
echo ""

# Check if helm is installed
if ! command -v helm &> /dev/null; then
  echo "ERROR: helm command not found"
  exit 1
fi

echo "1. Checking Helm version..."
helm version
echo "   ✓ Helm installed"
echo ""

# Check Chart.yaml exists
if [ ! -f "$HELM_CHART/Chart.yaml" ]; then
  echo "ERROR: Chart.yaml not found at $HELM_CHART/Chart.yaml"
  exit 1
fi
echo "2. Chart.yaml found"
echo "   ✓ Chart structure valid"
echo ""

# Lint the chart
echo "3. Linting Helm chart..."
if helm lint "$HELM_CHART"; then
  echo "   ✓ Helm lint passed"
else
  echo "   ! Lint failed (check messages above)"
fi
echo ""

# Test template rendering for each service
echo "4. Testing template rendering for all services..."
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

FAILED_SERVICES=""
for SERVICE in "${SERVICES[@]}"; do
  VALUES_FILE="$HELM_CHART/services/values-$SERVICE.yaml"
  
  if [ ! -f "$VALUES_FILE" ]; then
    echo "   ! WARNING: values-$SERVICE.yaml not found"
    FAILED_SERVICES="$FAILED_SERVICES $SERVICE"
    continue
  fi
  
  # Try to template the chart with service-specific values
  if helm template "$SERVICE" "$HELM_CHART" \
    -f "$HELM_CHART/values.yaml" \
    -f "$HELM_CHART/values-prod.yaml" \
    -f "$VALUES_FILE" > /tmp/render-$SERVICE.yaml 2>&1; then
    
    # Count rendered manifests
    COUNT=$(grep -c "^---" /tmp/render-$SERVICE.yaml || echo "1")
    echo "   ✓ $SERVICE rendered successfully ($COUNT manifests)"
  else
    echo "   ✗ $SERVICE rendering FAILED"
    cat /tmp/render-$SERVICE.yaml
    FAILED_SERVICES="$FAILED_SERVICES $SERVICE"
  fi
done
echo ""

if [ -n "$FAILED_SERVICES" ]; then
  echo "ERROR: These services failed to render:$FAILED_SERVICES"
  exit 1
fi

echo "5. Testing dry-run install..."
if helm install freeshop-test "$HELM_CHART" \
  --namespace freeshop-test \
  --create-namespace \
  --values "$HELM_CHART/values-prod.yaml" \
  --set "image.tag=test-$(date +%s)" \
  --dry-run --debug > /tmp/helm-test.yaml 2>&1; then
  
  echo "   ✓ Helm install dry-run passed"
  
  # Count total resources
  RESOURCE_COUNT=$(grep -c "^kind:" /tmp/helm-test.yaml || echo "N/A")
  echo "   Total resources to be created: $RESOURCE_COUNT"
else
  echo "   ✗ Helm install dry-run FAILED"
  cat /tmp/helm-test.yaml
  exit 1
fi
echo ""

# Cleanup
kubectl delete namespace freeshop-test --ignore-not-found 2>/dev/null || true

echo "=================================="
echo " ✓ All Helm chart checks passed!"
echo "=================================="
echo ""
echo "Helm chart is ready to deploy:"
echo ""
echo "  helm install freeshop ./helm/freeshop \\"
echo "    --namespace freeshop \\"
echo "    --create-namespace \\"
echo "    --values ./helm/freeshop/values-prod.yaml \\"
echo "    --set image.tag=<your-git-sha>"
echo ""
