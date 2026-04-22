#!/bin/bash

# List of application services that use Prisma (excluding api-gateway and infra)
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

echo -e "\033[0;35mStarting Prisma migration deployment inside Docker containers...\033[0m"

SUCCESS_COUNT=0
FAIL_COUNT=0
SKIPPED_COUNT=0

# Check if docker-compose or docker compose is available
if command -v docker-compose >/dev/null 2>&1; then
    DOCKER_COMPOSE="docker-compose"
elif docker compose version >/dev/null 2>&1; then
    DOCKER_COMPOSE="docker compose"
else
    echo -e "\033[0;31mError: Docker Compose not found.\033[0m"
    exit 1
fi

for service in "${SERVICES[@]}"; do
    # Check if the service container is running
    RUNNING=$($DOCKER_COMPOSE ps -q "$service" 2>/dev/null)
    
    if [ -z "$RUNNING" ]; then
        echo -e "\n\033[0;33m--- Skipping $service: Container is not running ---\033[0m"
        ((SKIPPED_COUNT++))
        continue
    fi

    echo -e "\n\033[0;36m>>> Migrating in container: $service\033[0m"
    
    # Execute migration inside the container
    $DOCKER_COMPOSE exec -T "$service" pnpm exec prisma migrate deploy
    
    if [ $? -eq 0 ]; then
        echo -e "\033[0;32mSUCCESS: $service\033[0m"
        ((SUCCESS_COUNT++))
    else
        echo -e "\033[0;31mFAILED: $service\033[0m"
        ((FAIL_COUNT++))
    fi
done

echo -e "\n\033[0;35m========================================\033[0m"
echo -e "\033[0;32mMigration process completed.\033[0m"
echo -e "\033[0;32mSuccess: $SUCCESS_COUNT\033[0m"
echo -e "\033[0;31mFailed:  $FAIL_COUNT\033[0m"
echo -e "\033[0;33mSkipped: $SKIPPED_COUNT\033[0m"
echo -e "\033[0;35m========================================\033[0m"
