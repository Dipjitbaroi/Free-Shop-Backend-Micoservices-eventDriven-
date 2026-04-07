FROM node:24-alpine AS builder

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
COPY tsconfig.base.json ./

COPY packages/shared-types/package*.json ./packages/shared-types/
COPY packages/shared-utils/package*.json ./packages/shared-utils/
COPY packages/shared-events/package*.json ./packages/shared-events/
COPY packages/shared-middleware/package*.json ./packages/shared-middleware/
COPY services/payment-service/package*.json ./services/payment-service/

RUN npm ci --foreground-scripts

COPY packages/shared-types/ ./packages/shared-types/
COPY packages/shared-utils/ ./packages/shared-utils/
COPY packages/shared-events/ ./packages/shared-events/
COPY packages/shared-middleware/ ./packages/shared-middleware/
COPY services/payment-service/ ./services/payment-service/

WORKDIR /app/services/payment-service
RUN npx prisma generate
WORKDIR /app

RUN npm run build --workspace=@freeshop/shared-types
RUN npm run build --workspace=@freeshop/shared-utils
RUN npm run build --workspace=@freeshop/shared-events
RUN npm run build --workspace=@freeshop/shared-middleware
RUN npm run build --workspace=services/payment-service

FROM node:24-alpine AS production

RUN apk add --no-cache openssl

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/services/payment-service/dist ./services/payment-service/dist
COPY --from=builder /app/services/payment-service/package*.json ./services/payment-service/
COPY --from=builder /app/services/payment-service/prisma ./services/payment-service/prisma
COPY --from=builder /app/services/payment-service/generated ./services/payment-service/generated

WORKDIR /app/services/payment-service

EXPOSE 3005

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
