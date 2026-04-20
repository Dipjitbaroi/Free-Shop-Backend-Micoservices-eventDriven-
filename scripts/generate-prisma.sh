#!/bin/sh

# Generate Prisma clients for all services
set -e

SERVICES=(
  "auth-service"
  "inventory-service"
  "order-service"
  "payment-service"
  "product-service"
  "user-service"
  "vendor-service"
  "notification-service"
  "analytics-service"
)

for service in "${SERVICES[@]}"; do
  echo "Generating Prisma client for $service..."
  cd "/app/services/$service"
  prisma generate
done

echo "✅ All Prisma clients generated successfully!"
