# Development shortcuts
.PHONY: dev dev-infra dev-services stop logs clean build build-serial migrate prisma-generate install

# Start infrastructure only (for local development)
dev-infra:
	docker-compose -f docker-compose.dev.yml up -d
	@echo "Infrastructure started!"
	@echo "PostgreSQL: localhost:5432"
	@echo "Redis: localhost:6379"
	@echo "RabbitMQ: localhost:5672 (Management: http://localhost:15672)"
	@echo "Adminer: http://localhost:8080"

# Stop all containers
stop:
	docker-compose -f docker-compose.dev.yml down
	docker-compose down

# View logs
logs:
	docker-compose logs -f

# Clean all volumes
clean:
	docker-compose -f docker-compose.dev.yml down -v
	docker-compose down -v
	docker system prune -f

# Build all services with a *persistent* BuildKit cache (see
# scripts/build/build-services.ps1). The script loops over the 10
# service Dockerfiles using a single `docker-container` BuildKit
# builder that shares one local cache backend, so once the first
# service has populated the pnpm store the other 9 are effectively
# free on rebuild. Services are built serially to avoid the
# registry.npmjs.org ETIMEDOUT storm that `--build-parallelism N`
# triggers when N >= 2.
build:
	pwsh scripts/build/build-services.ps1

# Build a single service (full parallelism is fine for a single image).
build-%:
	pwsh scripts/build/build-services.ps1 -Service $*

# Force a cold build (no cache reuse) — useful when the cache itself
# has been poisoned or you changed pnpm version.
build-cold:
	pwsh scripts/build/build-services.ps1 -NoCache

# Backwards-compat alias. Prefer `make build` (above).
build-serial:
	pwsh scripts/build/build-services.ps1

# Run all services in production mode
prod:
	docker-compose up -d

# Run migrations for all services (uses pnpm to invoke prisma, consistent with Dockerfiles)
migrate:
	@echo "Running migrations for all services..."
	cd services/auth-service && pnpm exec prisma migrate deploy
	cd services/user-service && pnpm exec prisma migrate deploy
	cd services/product-service && pnpm exec prisma migrate deploy
	cd services/order-service && pnpm exec prisma migrate deploy
	cd services/payment-service && pnpm exec prisma migrate deploy
	cd services/inventory-service && pnpm exec prisma migrate deploy
	cd services/vendor-service && pnpm exec prisma migrate deploy
	cd services/notification-service && pnpm exec prisma migrate deploy
	cd services/analytics-service && pnpm exec prisma migrate deploy

# Install all dependencies (workspace-aware via pnpm; no per-package cd needed)
install:
	pnpm install --frozen-lockfile

# Generate Prisma clients for every service in one workspace pass
prisma-generate:
	pnpm -r --filter "./services/**" exec prisma generate

# Build shared packages
build-packages:
	cd packages/shared-types && npm run build
	cd packages/shared-utils && npm run build
	cd packages/shared-events && npm run build
	cd packages/shared-middleware && npm run build

# Health check all services
health:
	@echo "Checking service health..."
	@curl -s http://localhost:3000/health || echo "API Gateway: DOWN"
	@curl -s http://localhost:3001/health || echo "Auth Service: DOWN"
	@curl -s http://localhost:3002/health || echo "User Service: DOWN"
	@curl -s http://localhost:3003/health || echo "Product Service: DOWN"
	@curl -s http://localhost:3004/health || echo "Order Service: DOWN"
	@curl -s http://localhost:3005/health || echo "Payment Service: DOWN"
	@curl -s http://localhost:3006/health || echo "Inventory Service: DOWN"
	@curl -s http://localhost:3007/health || echo "Vendor Service: DOWN"
	@curl -s http://localhost:3008/health || echo "Notification Service: DOWN"
	@curl -s http://localhost:3009/health || echo "Analytics Service: DOWN"
