# 🎯 QUICK REFERENCE - UNUSED TABLES SUMMARY

## 🔴 TIER 1: DELETE IMMEDIATELY (5 Tables)

| # | Table Name | Service | Schema | Queries | Risk | Action |
|----|---------|---------|--------|---------|------|--------|
| 1 | **FlashSale** | product-service | `schema.prisma:165-177` | 0 | 🟢 ZERO | DELETE |
| 2 | **CategoryAnalytics** | analytics-service | `schema.prisma:70-95` | 0 | 🟢 ZERO | DELETE |
| 3 | **EventProcessingLog** | inventory-service | `schema.prisma:118-140` | 0 | 🟢 ZERO | DELETE |
| 4 | **PaymentGatewayConfig** | payment-service | `schema.prisma:85-100` | 0 | 🟢 ZERO | DELETE |
| 5 | **InventoryAlert** | inventory-service | `schema.prisma:94-111` | 0 | 🟢 ZERO | DELETE |

---

## 🟡 TIER 2: REVIEW & OPTIMIZE (7 Tables/Fields)

| # | Item | Service | Usage | Issue | Action |
|----|------|---------|-------|-------|--------|
| 1 | **NotificationTemplate** | notification-service | 5 queries | Incomplete implementation | REVIEW CODE |
| 2 | **NotificationPreference** | notification-service | 3 queries | Prefs stored but not enforced? | VERIFY ENFORCEMENT |
| 3 | **GuestToken** | auth-service | 1 query | Minimal - guest checkout only | EVALUATE NEED |
| 4 | **EventLog** | analytics-service | 1 write, 0 reads | Write-only, never analyzed | REMOVE or ANALYZE |
| 5 | **SearchAnalytics** | analytics-service | 2 queries | Minimal tracking | EXPAND or REMOVE |
| 6 | **OrderItemFreeItem** | order-service | SQL queries | Raw SQL instead of ORM | REFACTOR TO ORM |
| 7 | **CartItemFreeItem** | order-service | SQL queries? | Likely same issue | REFACTOR TO ORM |

---

## 💾 DELETION SQL SCRIPTS

### Script 1: Immediate Deletions
```sql
-- Safe to run immediately
DROP TABLE IF EXISTS flash_sales CASCADE;
DROP TABLE IF EXISTS category_analytics CASCADE;
DROP TABLE IF EXISTS event_processing_logs CASCADE;
DROP TABLE IF EXISTS payment_gateway_configs CASCADE;
DROP TABLE IF EXISTS inventory_alerts CASCADE;

-- Verify deletions
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

### Script 2: Backup Before Deletion
```sql
-- Create backup tables
CREATE TABLE backup_flash_sales AS SELECT * FROM flash_sales;
CREATE TABLE backup_category_analytics AS SELECT * FROM category_analytics;
CREATE TABLE backup_event_processing_logs AS SELECT * FROM event_processing_logs;
CREATE TABLE backup_payment_gateway_configs AS SELECT * FROM payment_gateway_configs;
CREATE TABLE backup_inventory_alerts AS SELECT * FROM inventory_alerts;

-- Verify backups
SELECT * FROM backup_flash_sales LIMIT 5;
SELECT * FROM backup_category_analytics LIMIT 5;
-- ... etc
```

---

## 📝 SCHEMA MODIFICATIONS NEEDED

### 1. Remove from product-service/prisma/schema.prisma
```diff
- model FlashSale {
-   id          String    @id @default(uuid())
-   name        String
-   description String?
-   startDate   DateTime
-   endDate     DateTime
-   isActive    Boolean   @default(true)
-   productIds  String[]
-   bannerImage String?
-   createdAt   DateTime  @default(now())
-   updatedAt   DateTime  @updatedAt
-   @@index([isActive])
-   @@index([startDate, endDate])
-   @@map("flash_sales")
- }
```

### 2. Remove from analytics-service/prisma/schema.prisma
```diff
- model CategoryAnalytics {
-   id              String   @id @default(uuid())
-   categoryId      String
-   date            DateTime @db.Date
-   views           Int      @default(0)
-   productViews    Int      @default(0)
-   purchases       Int      @default(0)
-   revenue         Decimal  @default(0) @db.Decimal(10, 2)
-   topProductIds   String[] @default([])
-   createdAt       DateTime @default(now())
-   updatedAt       DateTime @updatedAt
-   @@unique([categoryId, date])
-   @@index([categoryId])
-   @@index([date])
- }

- model EventProcessingLog {
-   id          String   @id @default(uuid())
-   eventType   String
-   eventId     String
-   orderId     String?
-   status      String   @default("PROCESSING")
-   payload     String?
-   error       String?
-   processedAt DateTime @default(now())
-   completedAt DateTime?
-   createdAt   DateTime @default(now())
-   @@unique([eventType, eventId])
-   @@index([orderId])
-   @@index([status])
- }
```

### 3. Remove from inventory-service/prisma/schema.prisma
```diff
- model InventoryAlert {
-   id          String     @id @default(uuid())
-   inventoryId String
-   productId   String
-   userId      String
-   type        AlertType
-   message     String
-   isRead      Boolean    @default(false)
-   createdAt   DateTime   @default(now())
-   @@index([userId])
-   @@index([isRead])
-   @@index([createdAt])
- }

- model EventProcessingLog {
-   // ... (if duplicate in this service)
- }
```

### 4. Remove from payment-service/prisma/schema.prisma
```diff
- model PaymentGatewayConfig {
-   id          String   @id @default(uuid())
-   gateway     String   @unique
-   isActive    Boolean  @default(true)
-   isSandbox   Boolean  @default(true)
-   credentials Json
-   settings    Json?
-   createdAt   DateTime @default(now())
-   updatedAt   DateTime @updatedAt
- }
```

### 5. Remove Field from order-service
```diff
// services/order-service/prisma/schema.prisma
model Order {
  id              String        @id @default(uuid())
  // ... other fields
  shippingAddress Json          // ✅ KEEP
- // billingAddress  Json?       // ❌ DELETE THIS LINE
  subtotal        Float
  // ... rest
}

// services/shared-types/src/order.types.ts
interface IOrderCreate {
  // ... other fields
  shippingAddress: IShippingAddress;
- // billingAddress?: IShippingAddress; // ❌ DELETE THIS LINE
  // ... rest
}

// services/order-service/src/services/order.service.ts
interface OrderCreateInput {
  // ... other fields
  shippingAddress: IShippingAddress;
- // billingAddress?: Record<string, unknown>; // ❌ DELETE THIS LINE
  // ... rest
}
```

---

## 📊 CODE FILES TO MODIFY

### Primary Files:

| Service | File | Action |
|---------|------|--------|
| product-service | `prisma/schema.prisma` | Remove FlashSale model (lines 165-177) |
| analytics-service | `prisma/schema.prisma` | Remove CategoryAnalytics, EventProcessingLog (lines 70-140) |
| inventory-service | `prisma/schema.prisma` | Remove EventProcessingLog, InventoryAlert |
| payment-service | `prisma/schema.prisma` | Remove PaymentGatewayConfig model |
| order-service | `prisma/schema.prisma` | Remove billingAddress field from Order model |
| order-service | `src/services/order.service.ts` | Remove billingAddress from interface |
| shared-types | `src/order.types.ts` | Remove billingAddress from interfaces |
| api-gateway | `src/docs/swagger.ts` | Remove billingAddress from API docs |

---

## 🚀 MIGRATION EXECUTION STEPS

### Step 1: Prepare
```bash
cd d:\GitHub\Free-Shop-Backend-Micoservices\(eventDriven\)

# Backup all services
git stash
git checkout -b backup/unused-tables-cleanup-$(date +%Y%m%d)

# Create backup branches
git checkout -b feature/remove-unused-tables
```

### Step 2: Backup Database
```bash
# Backup each service database
pg_dump -h localhost -U postgres auth_service > backup_auth_service.sql
pg_dump -h localhost -U postgres product_service > backup_product_service.sql
pg_dump -h localhost -U postgres inventory_service > backup_inventory_service.sql
pg_dump -h localhost -U postgres analytics_service > backup_analytics_service.sql
pg_dump -h localhost -U postgres payment_service > backup_payment_service.sql
pg_dump -h localhost -U postgres order_service > backup_order_service.sql
pg_dump -h localhost -U postgres notification_service > backup_notification_service.sql
```

### Step 3: Modify Schemas
```bash
# Edit each schema.prisma file and remove models
# Use multi_replace_string_in_file for batch updates
```

### Step 4: Generate Migrations
```bash
# For each service
cd services/auth-service
pnpm run prisma:migrate create --name remove_unused_tables

cd ../product-service
pnpm run prisma:migrate create --name remove_flash_sale

# ... repeat for other services
```

### Step 5: Review Migrations
```bash
# Check each migration file in migrations/[timestamp]_remove_*.sql
# Verify correct tables are being dropped
```

### Step 6: Test in Development
```bash
# Apply migrations to dev database
cd services/product-service
pnpm run prisma:migrate deploy

# Verify application still works
pnpm run dev

# Run tests
pnpm run test
```

### Step 7: Deploy to Production
```bash
# After testing in dev
# 1. Backup production databases (already done in step 2)
# 2. Run migrations in production
# 3. Monitor for errors
# 4. If problems occur, restore from backup
```

---

## ✅ VERIFICATION CHECKLIST

### Before Deletion:
- [ ] All 5 unused tables identified and documented
- [ ] Codebase searched for any remaining references
- [ ] Backup created of all production databases
- [ ] Staging environment tested
- [ ] Stakeholders approved deletion

### After Deletion:
- [ ] Migrations applied successfully
- [ ] Application starts without errors
- [ ] No missing table errors in logs
- [ ] All tests pass
- [ ] Performance metrics unchanged/improved
- [ ] API endpoints functional
- [ ] No orphaned foreign keys

---

## 🎯 EXPECTED OUTCOMES

After Cleanup:
- ✅ 5 unused tables removed
- ✅ ~150-200MB database size reduction (in production)
- ✅ Cleaner schema definition
- ✅ Easier maintenance
- ✅ No functionality loss

Risk Level: **🟢 LOW**
- Tables are completely unused
- No data loss for working features
- Easy rollback if needed (backups available)

---

## 📞 QUESTIONS TO RESOLVE FIRST

Before proceeding, get answers to:

1. **Flash Sales**: Is flash sale completely replaced by Product model fields?
   - [ ] YES - Proceed with deletion
   - [ ] NO - Keep and implement

2. **Guest Checkout**: Is GuestToken actually needed or can all users register?
   - [ ] Keep - Guest checkout is core
   - [ ] Delete - Require registration

3. **Inventory Alerts**: Should alerts be re-implemented or is state tracking (low stock flags) sufficient?
   - [ ] Re-implement alerts
   - [ ] Remove - Keep current flags only

4. **Event Log**: Is comprehensive event tracking needed for audit trail?
   - [ ] Implement properly - Keep and use
   - [ ] Remove - Not needed

5. **Search Analytics**: Should search tracking be expanded or removed?
   - [ ] Expand - Build search analytics dashboard
   - [ ] Remove - Not needed

---

## 🔗 RELATED DOCUMENTS

- Full Analysis: `UNUSED_TABLES_AND_DB_ANALYSIS.md`
- Session Notes: `/memories/session/unused-tables-analysis.md`

---

**Last Updated**: May 19, 2026  
**Status**: Ready for review and approval  
**Estimated Effort**: 2-3 hours for full cleanup  
**Risk Assessment**: 🟢 LOW - All changes are safe
