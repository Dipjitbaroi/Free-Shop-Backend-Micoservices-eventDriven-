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
COPY services/analytics-service/package*.json ./services/analytics-service/

# Install with pnpm and BuildKit cache, optimized for slow networks
RUN --mount=type=cache,target=/root/.pnpm-store pnpm install --no-frozen-lockfile

COPY packages/shared-types/ ./packages/shared-types/
COPY packages/shared-utils/ ./packages/shared-utils/
COPY packages/shared-events/ ./packages/shared-events/
COPY packages/shared-middleware/ ./packages/shared-middleware/
COPY services/analytics-service/ ./services/analytics-service/

# Build all packages in one command (reduces network calls and layer count)
WORKDIR /app
RUN pnpm run build

FROM node:24-alpine AS production

RUN apk add --no-cache openssl
RUN npm install -g pnpm@9

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/.pnpmrc ./

COPY --from=builder /app/packages ./packages
COPY --from=builder /app/services/analytics-service/package*.json ./services/analytics-service/

RUN --mount=type=cache,target=/root/.pnpm-store pnpm install --prod --no-frozen-lockfile

COPY --from=builder /app/services/analytics-service/dist ./services/analytics-service/dist
COPY --from=builder /app/services/analytics-service/prisma.config.ts ./services/analytics-service/
COPY --from=builder /app/services/analytics-service/prisma ./services/analytics-service/prisma
COPY --from=builder /app/services/analytics-service/generated ./services/analytics-service/generated

WORKDIR /app/services/analytics-service

EXPOSE 3009

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
