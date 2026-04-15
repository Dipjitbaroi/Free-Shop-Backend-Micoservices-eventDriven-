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
COPY services/vendor-service/package*.json ./services/vendor-service/

# Install with pnpm and BuildKit cache, optimized for slow networks
RUN --mount=type=cache,target=/root/.pnpm-store pnpm install --frozen-lockfile

COPY packages/shared-types/ ./packages/shared-types/
COPY packages/shared-utils/ ./packages/shared-utils/
COPY packages/shared-events/ ./packages/shared-events/
COPY packages/shared-middleware/ ./packages/shared-middleware/
COPY services/vendor-service/ ./services/vendor-service/

# Build all packages in one command (reduces network calls and layer count)
WORKDIR /app
RUN --mount=type=cache,target=/root/.pnpm-store pnpm --filter ./services/vendor-service install --frozen-lockfile
RUN pnpm --filter ./services/vendor-service exec prisma generate
RUN pnpm run build

FROM node:24-alpine AS production

RUN apk add --no-cache openssl
RUN npm install -g pnpm@10

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/.pnpmrc ./

COPY --from=builder /app/packages ./packages
COPY --from=builder /app/services/vendor-service/package*.json ./services/vendor-service/
COPY --from=builder /app/services/vendor-service/generated ./services/vendor-service/generated

RUN --mount=type=cache,target=/root/.pnpm-store pnpm install --no-frozen-lockfile

COPY --from=builder /app/services/vendor-service/dist ./services/vendor-service/dist
COPY --from=builder /app/services/vendor-service/prisma.config.ts ./services/vendor-service/
COPY --from=builder /app/services/vendor-service/prisma ./services/vendor-service/prisma
COPY --from=builder /app/services/vendor-service/generated ./services/vendor-service/generated

WORKDIR /app/services/vendor-service

EXPOSE 3007

# Run app directly; migrations should be executed by CI/k8s Job before rollout
CMD ["node", "dist/index.js"]
