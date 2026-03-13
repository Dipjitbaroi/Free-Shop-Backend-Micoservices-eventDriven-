FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY tsconfig.base.json ./

# Copy shared packages
COPY packages/shared-types ./packages/shared-types
COPY packages/shared-utils ./packages/shared-utils
COPY packages/shared-events ./packages/shared-events
COPY packages/shared-middleware ./packages/shared-middleware

# Copy service
COPY services/api-gateway ./services/api-gateway

# Install dependencies and build
RUN npm install --foreground-scripts
RUN npm run build --workspace=@freeshop/shared-types
RUN npm run build --workspace=@freeshop/shared-utils
RUN npm run build --workspace=@freeshop/shared-events
RUN npm run build --workspace=@freeshop/shared-middleware
RUN npm run build --workspace=@freeshop/api-gateway

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built files
COPY --from=builder /app/package*.json ./
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

# Install production dependencies only
RUN npm install --omit=dev --foreground-scripts

EXPOSE 3000

CMD ["node", "services/api-gateway/dist/index.js"]
