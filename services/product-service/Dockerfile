FROM node:24-alpine AS builder

RUN apk add --no-cache openssl
RUN npm install -g pnpm@9

WORKDIR /app

COPY package*.json ./
COPY pnpm-workspace.yaml ./
COPY .pnpmrc ./
COPY tsconfig.base.json ./

COPY packages/shared-types/package*.json ./packages/shared-types/
COPY packages/shared-utils/package*.json ./packages/shared-utils/
COPY packages/shared-events/package*.json ./packages/shared-events/
COPY packages/shared-middleware/package*.json ./packages/shared-middleware/
COPY services/product-service/package*.json ./services/product-service/

# Install with pnpm and BuildKit cache, optimized for slow networks
RUN --mount=type=cache,target=/root/.pnpm-store pnpm install --no-frozen-lockfile

# Copy source code
COPY packages/shared-types/ ./packages/shared-types/
COPY packages/shared-utils/ ./packages/shared-utils/
COPY packages/shared-events/ ./packages/shared-events/
COPY packages/shared-middleware/ ./packages/shared-middleware/
COPY services/product-service/ ./services/product-service/

# Build all packages in one command (reduces network calls and layer count)
WORKDIR /app
RUN pnpm run build

# Production stage
FROM node:24-alpine AS production

RUN apk add --no-cache openssl
RUN npm install -g pnpm@9

WORKDIR /app

# Copy workspace config and root packages
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/.pnpmrc ./

# Install production dependencies
RUN --mount=type=cache,target=/root/.pnpm-store pnpm install --prod --no-frozen-lockfile

COPY --from=builder /app/packages ./packages
COPY --from=builder /app/services/product-service/dist ./services/product-service/dist
COPY --from=builder /app/services/product-service/package*.json ./services/product-service/
COPY --from=builder /app/services/product-service/prisma.config.ts ./services/product-service/
COPY --from=builder /app/services/product-service/prisma ./services/product-service/prisma
COPY --from=builder /app/services/product-service/generated ./services/product-service/generated

WORKDIR /app/services/product-service

EXPOSE 3003

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
