# Development shortcuts
.PHONY: dev dev-infra dev-services stop logs clean build migrate

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

# Build all services
build:
	docker-compose build

# Build specific service
build-%:
	docker-compose build $*

# Run all services in production mode
prod:
	docker-compose up -d

# Run migrations for all services
migrate:
	@echo "Running migrations for all services..."
	cd services/auth-service && npx prisma migrate deploy
	cd services/user-service && npx prisma migrate deploy
	cd services/product-service && npx prisma migrate deploy
	cd services/order-service && npx prisma migrate deploy
	cd services/payment-service && npx prisma migrate deploy
	cd services/inventory-service && npx prisma migrate deploy
	cd services/seller-service && npx prisma migrate deploy
	cd services/notification-service && npx prisma migrate deploy
	cd services/analytics-service && npx prisma migrate deploy

# Install all dependencies
install:
	npm install
	cd packages/shared-types && npm install
	cd packages/shared-utils && npm install
	cd packages/shared-events && npm install
	cd packages/shared-middleware && npm install
	cd services/api-gateway && npm install
	cd services/auth-service && npm install
	cd services/user-service && npm install
	cd services/product-service && npm install
	cd services/order-service && npm install
	cd services/payment-service && npm install
	cd services/inventory-service && npm install
	cd services/seller-service && npm install
	cd services/notification-service && npm install
	cd services/analytics-service && npm install

# Generate Prisma clients
prisma-generate:
	cd services/auth-service && npx prisma generate
	cd services/user-service && npx prisma generate
	cd services/product-service && npx prisma generate
	cd services/order-service && npx prisma generate
	cd services/payment-service && npx prisma generate
	cd services/inventory-service && npx prisma generate
	cd services/seller-service && npx prisma generate
	cd services/notification-service && npx prisma generate
	cd services/analytics-service && npx prisma generate

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
	@curl -s http://localhost:3007/health || echo "Seller Service: DOWN"
	@curl -s http://localhost:3008/health || echo "Notification Service: DOWN"
	@curl -s http://localhost:3009/health || echo "Analytics Service: DOWN"
