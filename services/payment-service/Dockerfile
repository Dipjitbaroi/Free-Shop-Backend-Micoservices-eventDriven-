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
COPY services/payment-service/package*.json ./services/payment-service/

# Install with pnpm and BuildKit cache, optimized for slow networks
RUN --mount=type=cache,target=/root/.pnpm-store pnpm install --frozen-lockfile

COPY packages/shared-types/ ./packages/shared-types/
COPY packages/shared-utils/ ./packages/shared-utils/
COPY packages/shared-events/ ./packages/shared-events/
COPY packages/shared-middleware/ ./packages/shared-middleware/
COPY services/payment-service/ ./services/payment-service/

# Build all packages in one command (reduces network calls and layer count)
WORKDIR /app
RUN --mount=type=cache,target=/root/.pnpm-store pnpm --filter ./services/payment-service install --frozen-lockfile
RUN pnpm run build

FROM node:24-alpine AS production

RUN apk add --no-cache openssl
RUN npm install -g pnpm@10

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/.pnpmrc ./

COPY --from=builder /app/packages ./packages
COPY --from=builder /app/services/payment-service/package*.json ./services/payment-service/
COPY --from=builder /app/services/payment-service/generated ./services/payment-service/generated

RUN --mount=type=cache,target=/root/.pnpm-store pnpm install --no-frozen-lockfile

COPY --from=builder /app/services/payment-service/dist ./services/payment-service/dist
COPY --from=builder /app/services/payment-service/prisma.config.ts ./services/payment-service/
COPY --from=builder /app/services/payment-service/prisma ./services/payment-service/prisma
COPY --from=builder /app/services/payment-service/generated ./services/payment-service/generated

WORKDIR /app/services/payment-service

EXPOSE 3005

# Run app directly; migrations should be executed by CI/k8s Job before rollout
CMD ["node", "dist/index.js"]
