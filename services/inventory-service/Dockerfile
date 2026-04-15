FROM node:24-alpine AS builder

RUN apk add --no-cache openssl
RUN npm install -g pnpm@10

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY .pnpmrc ./
COPY tsconfig.base.json ./

COPY packages/shared-types/package*.json ./packages/shared-types/
COPY packages/shared-utils/package*.json ./packages/shared-utils/
COPY packages/shared-events/package*.json ./packages/shared-events/
COPY packages/shared-middleware/package*.json ./packages/shared-middleware/
COPY services/inventory-service/package*.json ./services/inventory-service/

# Install with pnpm and BuildKit cache, optimized for slow networks
RUN --mount=type=cache,target=/root/.pnpm-store pnpm install --frozen-lockfile

COPY packages/shared-types/ ./packages/shared-types/
COPY packages/shared-utils/ ./packages/shared-utils/
COPY packages/shared-events/ ./packages/shared-events/
COPY packages/shared-middleware/ ./packages/shared-middleware/
COPY services/inventory-service/ ./services/inventory-service/

# Build all packages in one command (reduces network calls and layer count)
WORKDIR /app
RUN --mount=type=cache,target=/root/.pnpm-store pnpm --filter ./services/inventory-service install --frozen-lockfile
# Build shared packages first (in dependency order)
RUN pnpm --filter @freeshop/shared-types run build
RUN pnpm --filter @freeshop/shared-utils run build
RUN pnpm --filter @freeshop/shared-events run build
RUN pnpm --filter @freeshop/shared-middleware run build
# Then build the service
RUN pnpm run build

FROM node:24-alpine AS production

RUN apk add --no-cache openssl
RUN npm install -g pnpm@10

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/.pnpmrc ./

COPY --from=builder /app/packages ./packages
COPY --from=builder /app/services/inventory-service/package*.json ./services/inventory-service/
COPY --from=builder /app/services/inventory-service/generated ./services/inventory-service/generated

RUN --mount=type=cache,target=/root/.pnpm-store pnpm install --no-frozen-lockfile

COPY --from=builder /app/services/inventory-service/dist ./services/inventory-service/dist
COPY --from=builder /app/services/inventory-service/prisma.config.ts ./services/inventory-service/
COPY --from=builder /app/services/inventory-service/prisma ./services/inventory-service/prisma
COPY --from=builder /app/services/inventory-service/generated ./services/inventory-service/generated

WORKDIR /app/services/inventory-service

EXPOSE 3006

# Run app directly; migrations should be executed by CI/k8s Job before rollout
CMD ["node", "dist/index.js"]
