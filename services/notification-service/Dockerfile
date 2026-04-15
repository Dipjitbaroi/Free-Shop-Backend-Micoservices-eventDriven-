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
COPY services/notification-service/package*.json ./services/notification-service/

# Install with pnpm and BuildKit cache, optimized for slow networks
RUN --mount=type=cache,target=/root/.pnpm-store pnpm install --frozen-lockfile

COPY packages/shared-types/ ./packages/shared-types/
COPY packages/shared-utils/ ./packages/shared-utils/
COPY packages/shared-events/ ./packages/shared-events/
COPY packages/shared-middleware/ ./packages/shared-middleware/
COPY services/notification-service/ ./services/notification-service/

# Build all packages in dependency order
WORKDIR /app
RUN --mount=type=cache,target=/root/.pnpm-store pnpm --filter ./services/notification-service install --frozen-lockfile
RUN pnpm run build

FROM node:24-alpine AS production

RUN apk add --no-cache openssl
RUN npm install -g pnpm@10

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/.pnpmrc ./

COPY --from=builder /app/packages ./packages
COPY --from=builder /app/services/notification-service/package*.json ./services/notification-service/
COPY --from=builder /app/services/notification-service/generated ./services/notification-service/generated

RUN --mount=type=cache,target=/root/.pnpm-store pnpm install --no-frozen-lockfile

COPY --from=builder /app/services/notification-service/dist ./services/notification-service/dist
COPY --from=builder /app/services/notification-service/prisma.config.ts ./services/notification-service/
COPY --from=builder /app/services/notification-service/prisma ./services/notification-service/prisma
COPY --from=builder /app/services/notification-service/generated ./services/notification-service/generated

WORKDIR /app/services/notification-service

EXPOSE 3008

# Run app directly; migrations should be executed by CI/k8s Job before rollout
CMD ["node", "dist/index.js"]
