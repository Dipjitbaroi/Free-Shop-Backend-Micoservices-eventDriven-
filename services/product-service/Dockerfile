FROM node:24-alpine AS builder

RUN apk add --no-cache openssl
RUN npm install -g pnpm@10

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY .pnpmrc ./
COPY tsconfig.base.json ./

COPY packages/shared-types/ ./packages/shared-types/
COPY packages/shared-utils/ ./packages/shared-utils/
COPY packages/shared-events/ ./packages/shared-events/
COPY packages/shared-middleware/ ./packages/shared-middleware/
COPY services/product-service/ ./services/product-service/

# Install with pnpm and BuildKit cache, optimized for slow networks
RUN --mount=type=cache,id=pnpm-cache,target=/root/.pnpm-store pnpm install --frozen-lockfile

# Generate Prisma client
RUN pnpm -C services/product-service exec prisma generate

# Build all packages in dependency order
WORKDIR /app
RUN pnpm run build

# Production stage
FROM node:24-alpine AS production

RUN apk add --no-cache openssl
RUN npm install -g pnpm@10

WORKDIR /app

# Copy workspace config and root packages
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/.pnpmrc ./

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/services/product-service/package*.json ./services/product-service/
COPY --from=builder /app/services/product-service/prisma.config.ts ./services/product-service/
COPY --from=builder /app/services/product-service/generated ./services/product-service/generated
COPY --from=builder /app/services/product-service/prisma ./services/product-service/prisma

# Reinstall with frozen-lockfile to ensure dependencies, uses cache
RUN --mount=type=cache,id=pnpm-cache,target=/root/.pnpm-store pnpm install --frozen-lockfile

COPY --from=builder /app/services/product-service/dist ./services/product-service/dist

WORKDIR /app/services/product-service

EXPOSE 3003

# Run app directly; migrations should be executed by CI/k8s Job before rollout
CMD ["node", "dist/src/index.js"]
