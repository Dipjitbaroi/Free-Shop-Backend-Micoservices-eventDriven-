FROM node:24-alpine AS builder

RUN npm install -g pnpm@9

WORKDIR /app

# Copy root package files and pnpm config
COPY package*.json ./
COPY pnpm-workspace.yaml ./
COPY .pnpmrc ./
COPY tsconfig.base.json ./

# Copy shared packages
COPY packages/shared-types ./packages/shared-types
COPY packages/shared-utils ./packages/shared-utils
COPY packages/shared-events ./packages/shared-events
COPY packages/shared-middleware ./packages/shared-middleware

# Copy service
COPY services/api-gateway ./services/api-gateway

# Install dependencies with pnpm and BuildKit cache, optimized for slow networks
RUN --mount=type=cache,target=/root/.pnpm-store pnpm install --no-frozen-lockfile

# Build all packages in one command (reduces network calls and layer count)
RUN pnpm run build

# Production stage
FROM node:24-alpine

RUN apk add --no-cache openssl
RUN npm install -g pnpm@9

WORKDIR /app

# Copy workspace config and root package files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/.pnpmrc ./

# Copy built files
COPY --from=builder /app/packages/shared-types/dist ./packages/shared-types/dist
COPY --from=builder /app/packages/shared-types/package.json ./packages/shared-types/
COPY --from=builder /app/packages/shared-utils/dist ./packages/shared-utils/dist
COPY --from=builder /app/packages/shared-utils/package.json ./packages/shared-utils/
COPY --from=builder /app/packages/shared-events/dist ./packages/shared-events/dist
COPY --from=builder /app/packages/shared-events/package.json ./packages/shared-events/
COPY --from=builder /app/packages/shared-middleware/dist ./packages/shared-middleware/dist
COPY --from=builder /app/packages/shared-middleware/package.json ./packages/shared-middleware/
COPY --from=builder /app/services/api-gateway/dist ./services/api-gateway/dist
COPY --from=builder /app/services/api-gateway/package.json ./services/api-gateway/

# Install production dependencies with pnpm and BuildKit cache
RUN --mount=type=cache,target=/root/.pnpm-store pnpm install --prod --no-frozen-lockfile

EXPOSE 3000

CMD ["node", "services/api-gateway/dist/index.js"]
