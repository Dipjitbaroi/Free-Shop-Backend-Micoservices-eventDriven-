FROM node:24-alpine AS builder

RUN apk add --no-cache openssl

WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY tsconfig.base.json ./

# Copy shared packages
COPY packages/shared-types/package*.json ./packages/shared-types/
COPY packages/shared-utils/package*.json ./packages/shared-utils/
COPY packages/shared-events/package*.json ./packages/shared-events/
COPY packages/shared-middleware/package*.json ./packages/shared-middleware/

# Copy service package files
COPY services/product-service/package*.json ./services/product-service/

# Install dependencies
RUN npm ci --foreground-scripts

# Copy source code
COPY packages/shared-types/ ./packages/shared-types/
COPY packages/shared-utils/ ./packages/shared-utils/
COPY packages/shared-events/ ./packages/shared-events/
COPY packages/shared-middleware/ ./packages/shared-middleware/
COPY services/product-service/ ./services/product-service/

# Generate Prisma client (must run before tsc build)
WORKDIR /app/services/product-service
RUN npx prisma generate
WORKDIR /app

# Build shared packages
RUN npm run build --workspace=@freeshop/shared-types
RUN npm run build --workspace=@freeshop/shared-utils
RUN npm run build --workspace=@freeshop/shared-events
RUN npm run build --workspace=@freeshop/shared-middleware

# Build service
RUN npm run build --workspace=services/product-service

# Production stage
FROM node:24-alpine AS production

RUN apk add --no-cache openssl

WORKDIR /app

# Copy built files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/services/product-service/dist ./services/product-service/dist
COPY --from=builder /app/services/product-service/package*.json ./services/product-service/
COPY --from=builder /app/services/product-service/prisma ./services/product-service/prisma
COPY --from=builder /app/services/product-service/generated ./services/product-service/generated

WORKDIR /app/services/product-service

EXPOSE 3003

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
