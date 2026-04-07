FROM node:24-alpine AS builder

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
COPY tsconfig.base.json ./

COPY packages/shared-types/package*.json ./packages/shared-types/
COPY packages/shared-utils/package*.json ./packages/shared-utils/
COPY packages/shared-events/package*.json ./packages/shared-events/
COPY packages/shared-middleware/package*.json ./packages/shared-middleware/
COPY services/notification-service/package*.json ./services/notification-service/

RUN npm ci --foreground-scripts

COPY packages/shared-types/ ./packages/shared-types/
COPY packages/shared-utils/ ./packages/shared-utils/
COPY packages/shared-events/ ./packages/shared-events/
COPY packages/shared-middleware/ ./packages/shared-middleware/
COPY services/notification-service/ ./services/notification-service/

WORKDIR /app/services/notification-service
RUN npx prisma generate
WORKDIR /app

RUN npm run build --workspace=@freeshop/shared-types
RUN npm run build --workspace=@freeshop/shared-utils
RUN npm run build --workspace=@freeshop/shared-events
RUN npm run build --workspace=@freeshop/shared-middleware
RUN npm run build --workspace=services/notification-service

FROM node:24-alpine AS production

RUN apk add --no-cache openssl

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/services/notification-service/dist ./services/notification-service/dist
COPY --from=builder /app/services/notification-service/package*.json ./services/notification-service/
COPY --from=builder /app/services/notification-service/prisma ./services/notification-service/prisma
COPY --from=builder /app/services/notification-service/generated ./services/notification-service/generated

WORKDIR /app/services/notification-service

EXPOSE 3008

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
