FROM node:20-alpine AS builder

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
COPY tsconfig.base.json ./

COPY packages/shared-types/package*.json ./packages/shared-types/
COPY packages/shared-utils/package*.json ./packages/shared-utils/
COPY packages/shared-events/package*.json ./packages/shared-events/
COPY packages/shared-middleware/package*.json ./packages/shared-middleware/
COPY services/delivery-service/package*.json ./services/delivery-service/

RUN npm ci --foreground-scripts

COPY packages/shared-types/ ./packages/shared-types/
COPY packages/shared-utils/ ./packages/shared-utils/
COPY packages/shared-events/ ./packages/shared-events/
COPY packages/shared-middleware/ ./packages/shared-middleware/
COPY services/delivery-service/ ./services/delivery-service/

WORKDIR /app/services/delivery-service
RUN npx prisma generate
WORKDIR /app

RUN npm run build --workspace=@freeshop/shared-types
RUN npm run build --workspace=@freeshop/shared-utils
RUN npm run build --workspace=@freeshop/shared-events
RUN npm run build --workspace=@freeshop/shared-middleware
RUN npm run build --workspace=services/delivery-service

FROM node:20-alpine AS production

RUN apk add --no-cache openssl

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/services/delivery-service/dist ./services/delivery-service/dist
COPY --from=builder /app/services/delivery-service/package*.json ./services/delivery-service/
COPY --from=builder /app/services/delivery-service/prisma ./services/delivery-service/prisma
COPY --from=builder /app/services/delivery-service/generated ./services/delivery-service/generated

WORKDIR /app/services/delivery-service

EXPOSE 3010

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
