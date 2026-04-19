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
COPY services/auth-service/ ./services/auth-service/

# Install with pnpm and BuildKit cache, optimized for slow networks
RUN --mount=type=cache,id=pnpm-cache,target=/root/.pnpm-store pnpm install --frozen-lockfile

# Generate Prisma client (uses fallback DB from config)
RUN pnpm -C services/auth-service exec prisma generate

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
COPY --from=builder /app/services/auth-service/package*.json ./services/auth-service/
COPY --from=builder /app/services/auth-service/prisma.config.ts ./services/auth-service/
COPY --from=builder /app/services/auth-service/generated ./services/auth-service/generated
COPY --from=builder /app/services/auth-service/prisma ./services/auth-service/prisma

# Reinstall with frozen-lockfile to ensure dependencies, uses cache (no re-download)
RUN --mount=type=cache,id=pnpm-cache,target=/root/.pnpm-store pnpm install --frozen-lockfile

COPY --from=builder /app/services/auth-service/dist ./services/auth-service/dist

WORKDIR /app/services/auth-service

EXPOSE 3001

# Run app directly; migrations should be executed by CI/k8s Job before rollout
CMD ["node", "dist/src/index.js"]
