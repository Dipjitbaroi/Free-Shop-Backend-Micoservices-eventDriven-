# Free Shop Backend

## Multi-Vendor Organic Grocery eCommerce Platform

A scalable, microservices-based backend for organic grocery eCommerce with support for multiple vendors, guest checkout, and various payment methods.

## Architecture

This project follows an **Event-Driven Microservices Architecture** with the following services:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API Gateway                                     │
│                    (Routing, Auth, Rate Limiting)                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐         ┌───────────────┐         ┌───────────────┐
│  Auth Service │         │ User Service  │         │Product Service│
│    (JWT)      │         │  (Profiles)   │         │  (Catalog)    │
└───────────────┘         └───────────────┘         └───────────────┘
        │                           │                           │
        └───────────────────────────┼───────────────────────────┘
                                    │
                            ┌───────▼───────┐
                            │   RabbitMQ    │
                            │ (Event Bus)   │
                            └───────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐         ┌───────────────┐         ┌───────────────┐
│ Order Service │         │Payment Service│         │Inventory Svc  │
│  (Orders)     │         │(bKash/EPS/COD)│         │   (Stock)     │
└───────────────┘         └───────────────┘         └───────────────┘
        │                           │                           │
        └───────────────────────────┼───────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐         ┌───────────────┐         ┌───────────────┐
│ Seller Service│         │Notification   │         │Analytics Svc  │
│  (Vendors)    │         │Service (SMS)  │         │  (Reports)    │
└───────────────┘         └───────────────┘         └───────────────┘
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| API Gateway | 3000 | Entry point, routing, rate limiting |
| Auth Service | 3001 | Authentication, JWT, OAuth |
| User Service | 3002 | User management, profiles |
| Product Service | 3003 | Product catalog, categories |
| Order Service | 3004 | Order processing, tracking |
| Payment Service | 3005 | Payment integrations |
| Inventory Service | 3006 | Stock management |
| Seller Service | 3007 | Vendor management |
| Notification Service | 3008 | Email, SMS notifications |
| Analytics Service | 3009 | Reports, metrics |

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Databases**: 
  - PostgreSQL (Primary data with Prisma ORM)
  - MongoDB (Analytics, logs, activity)
- **Cache**: Redis
- **Message Queue**: RabbitMQ
- **Storage**: AWS S3 / Cloudinary
- **Authentication**: JWT + OAuth2
- **Containerization**: Docker

## Prerequisites

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15+
- MongoDB 6+
- Redis 7+
- RabbitMQ 3.12+

## Quick Start

### Using Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/your-repo/free-shop-backend.git
cd free-shop-backend

# Copy environment files
cp .env.example .env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### Manual Setup

```bash
# Install dependencies
npm install

# Run database migrations
npm run db:migrate

# Seed database
npm run db:seed

# Start development
npm run dev
```

## Project Structure

```
free-shop-backend/
├── packages/                    # Shared packages
│   ├── shared-types/           # Common TypeScript types
│   ├── shared-utils/           # Common utilities
│   ├── shared-events/          # Event definitions
│   └── shared-middleware/      # Common middleware
├── services/                   # Microservices
│   ├── api-gateway/           # API Gateway
│   ├── auth-service/          # Authentication
│   ├── user-service/          # User management
│   ├── product-service/       # Product catalog
│   ├── order-service/         # Order processing
│   ├── payment-service/       # Payment processing
│   ├── inventory-service/     # Stock management
│   ├── seller-service/        # Vendor management
│   ├── notification-service/  # Notifications
│   └── analytics-service/     # Analytics & reports
├── docker-compose.yml         # Production compose
├── docker-compose.dev.yml     # Development compose
└── README.md
```

## User Roles

| Role | Access Level | Description |
|------|--------------|-------------|
| Customer | Read + Buy | Browse, purchase, track orders |
| Seller | Product + Order Management | Manage products, process orders |
| Manager | Moderation + Control | Approve products, manage categories |
| Admin | Full Access | Complete system control |

## API Documentation

Each service exposes its own API documentation at `/api-docs` endpoint.

Full API documentation is available at the API Gateway: `http://localhost:3000/api-docs`

## Environment Variables

See `.env.example` for all required environment variables.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
