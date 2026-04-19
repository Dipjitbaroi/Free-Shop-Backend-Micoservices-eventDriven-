FROM node:24-alpine AS builder

RUN apk add --no-cache openssl
RUN npm install -g pnpm@10

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY .pnpmrc ./
COPY tsconfig.base.json ./

# Copy all source files BEFORE install (so hoisting works correctly)
COPY packages/shared-types/ ./packages/shared-types/
COPY packages/shared-utils/ ./packages/shared-utils/
COPY packages/shared-events/ ./packages/shared-events/
COPY packages/shared-middleware/ ./packages/shared-middleware/
COPY services/order-service/ ./services/order-service/

# Install with pnpm and BuildKit cache, optimized for slow networks
RUN --mount=type=cache,id=pnpm-cache,target=/root/.pnpm-store pnpm install --frozen-lockfile

# Generate Prisma client (uses fallback DB from config)
RUN pnpm -C services/order-service exec prisma generate

# Build all packages in dependency order
WORKDIR /app
RUN pnpm run build

FROM node:24-alpine AS production

RUN apk add --no-cache openssl
RUN npm install -g pnpm@10

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/.pnpmrc ./

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/services/order-service/package*.json ./services/order-service/
COPY --from=builder /app/services/order-service/prisma.config.ts ./services/order-service/
COPY --from=builder /app/services/order-service/generated ./services/order-service/generated
COPY --from=builder /app/services/order-service/prisma ./services/order-service/prisma

# Reinstall with frozen-lockfile to ensure dependencies, uses cache
RUN --mount=type=cache,id=pnpm-cache,target=/root/.pnpm-store pnpm install --frozen-lockfile

COPY --from=builder /app/services/order-service/dist ./services/order-service/dist

WORKDIR /app/services/order-service

EXPOSE 3004

# Run app directly; migrations should be executed by CI/k8s Job before rollout
CMD ["node", "dist/src/index.js"]
