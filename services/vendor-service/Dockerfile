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
COPY services/vendor-service/ ./services/vendor-service/

# Install with pnpm and BuildKit cache, optimized for slow networks
RUN --mount=type=cache,id=pnpm-cache,target=/root/.pnpm-store pnpm install --frozen-lockfile

# Generate Prisma client (uses fallback DB from config)
RUN pnpm -C services/vendor-service exec prisma generate

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
COPY --from=builder /app/services/vendor-service/package*.json ./services/vendor-service/
COPY --from=builder /app/services/vendor-service/prisma.config.ts ./services/vendor-service/
COPY --from=builder /app/services/vendor-service/generated ./services/vendor-service/generated
COPY --from=builder /app/services/vendor-service/prisma ./services/vendor-service/prisma

# node_modules was copied above; no need to re-run pnpm install in production stage
# (a second install would just re-hit the npm registry with no benefit since the
# builder stage already produced a complete, lockfile-aligned node_modules).

COPY --from=builder /app/services/vendor-service/dist ./services/vendor-service/dist

WORKDIR /app/services/vendor-service

EXPOSE 3007

# Run app directly; migrations should be executed by CI/k8s Job before rollout
CMD ["node", "dist/src/index.js"]
