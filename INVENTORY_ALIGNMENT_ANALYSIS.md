# Inventory System Alignment Analysis
**Date:** June 2, 2026  
**Analysis:** Free Items vs Products Stock Management

---

## OVERALL ASSESSMENT: ⚠️ **MISALIGNED - CRITICAL ISSUES FOUND**

While the core inventory model supports both products and free items, there are **critical bugs** in how reservations are fulfilled and released for free items.

---

## 1. STORAGE LAYER - ✅ ALIGNED

### Inventory Model (Prisma)
**Single unified model supports both:**
- **Products**: `productId` (set) + `variantId` (optional) + `freeItemId` (null)
- **Free Items (standalone)**: `freeItemId` (set) + `productId` (null)
- **Free Items (product-attached)**: `productId` (set) + `freeItemId` (set)

**Stock tracking (identical for all):**
```
totalStock       = amount purchased/added
reservedStock    = amount reserved for pending orders
availableStock   = totalStock - reservedStock
```

**Unique Constraints:**
- `[productId, variantId, freeItemId]` - handles all combinations
- `[freeItemId]` - ensures standalone free items are unique

✅ **Verdict:** Storage is well-designed and generic

---

## 2. INVENTORY CHECKING - ✅ ALIGNED

### Order Controller Checking (After Fix)
```typescript
// Both products AND free items checked in batch
checkInventoryAvailability(inventoryCheckItems)
// Items include: { productId, quantity, freeItemId }
```

**Supports:**
- Batch checking of mixed products and free items
- Same validation logic for both

### Inventory Service `checkAvailability()`
```typescript
async checkAvailability(items: Array<{
  productId?: string;
  quantity: number;
  variantId?: string;
  freeItemId?: string;
}>) => { available: boolean; unavailableItems: [] }
```

**Process for each item:**
1. If no productId AND no freeItemId → error
2. Call `getInventory(productId, variantId, freeItemId)`
3. Check: `inventory.availableStock >= quantity`

### `getInventory()` Method
```typescript
const whereClause = { variantId, freeItemId };
if (productId) whereClause.productId = productId;
const inventory = await prisma.inventory.findFirst({ where: whereClause });
```

**Correctly handles:**
- `{ productId: "123" }` → finds product inventory
- `{ freeItemId: "abc", productId: null }` → finds standalone free item
- `{ productId: "123", freeItemId: "abc" }` → finds free item attached to product

✅ **Verdict:** Checking is properly aligned

---

## 3. STOCK RESERVATION - ✅ ALIGNED

### Order Service Event Processing
When `ORDER_CREATED` event fires:
```typescript
for (const item of payload.items) {
  const freeItemId = item.freeItemIds?.[0] || item.freeItemId;
  const reserveQuantity = freeItemId ? 1 : item.quantity;  // Free item = qty 1
  
  const reserved = await inventoryService.reserveStock(
    orderId,
    reserveQuantity,
    item.productId,
    item.variantId,
    freeItemId  // ← Both products and free items passed
  );
}
```

✅ **Correctly reserves both with different quantities:**
- **Products**: reserves requested quantity
- **Free items**: reserves 1 (regardless of product qty)

### Inventory Service `reserveStock()`
```typescript
async reserveStock(
  orderId: string,
  quantity: number,
  productId?: string,
  variantId?: string,
  freeItemId?: string
) {
  // Lock key correctly uses freeItemId as fallback
  const lockKey = `inventory:${freeItemId || variantId || productId}`;
  
  // Gets inventory (handles all combinations)
  const inventory = await this.getInventory(productId, variantId, freeItemId);
  
  // Checks availability
  if (inventory.availableStock < quantity) return null;
  
  // Creates reservation and updates stock
  // Both use same transaction for atomicity
}
```

✅ **Verdict:** Reservation is properly aligned and handles both types

---

## 4. STOCK FULFILLMENT - ❌ **CRITICAL BUG FOUND**

### `fulfillReservation()` Method - BROKEN FOR FREE ITEMS

```typescript
async fulfillReservation(orderId: string) {
  const reservations = await prisma.stockReservation.findMany({
    where: { orderId, status: ReservationStatus.PENDING },
    include: { inventory: true },
  });

  for (const reservation of reservations) {
    // BUG: Lock key uses only productId, ignores freeItemId!
    const lockKey = `inventory:${reservation.inventory.productId}`;
    // ↑ For standalone free items, productId is NULL
    // This creates lockKey = "inventory:null" for ALL free items!
    
    // ... rest of fulfillment
  }
}
```

**Problem:**
- For **products**: `lockKey = "inventory:product-uuid"` ✅
- For **standalone free items**: `lockKey = "inventory:null"` ❌
- For **product-attached free items**: `lockKey = "inventory:product-uuid"` ✅

**Impact:**
- All standalone free items share **the same lock** (`"inventory:null"`)
- Concurrent fulfillments of different free items will **block each other** unnecessarily
- Potential deadlocks or race conditions

---

## 5. STOCK RELEASE - ❌ **SAME CRITICAL BUG**

### `releaseReservation()` Method - BROKEN FOR FREE ITEMS

```typescript
async releaseReservation(orderId: string) {
  const reservations = await prisma.stockReservation.findMany({
    where: { orderId, status: ReservationStatus.PENDING },
    include: { inventory: true },
  });

  for (const reservation of reservations) {
    // BUG: Same issue - lock key only uses productId
    const lockKey = `inventory:${reservation.inventory.productId}`;
    // ↑ For standalone free items, this is NULL!
  }
}
```

**Same issues as fulfillment:**
- All standalone free items use same lock
- Potential race conditions during cancellation

---

## 6. ORDER STORAGE - ✅ ALIGNED

### OrderItem Model
```prisma
model OrderItem {
  productId   String
  quantity    Int          // Product quantity (not affected by free items)
  freeItems   OrderItemFreeItem[]  // Separate relationship
}

model OrderItemFreeItem {
  orderItemId String
  freeItemId  String
  freeItemName String
}
```

**Properly stores:**
- Product with its quantity (e.g., qty 3)
- **Separate** free items with their identifiers
- Not mixed/confused

✅ **Verdict:** Order storage is properly separated

---

## SUMMARY TABLE

| Component | Products | Free Items | Status |
|-----------|----------|-----------|--------|
| Storage (Inventory model) | ✅ Works | ✅ Works | ✅ Aligned |
| Availability Check | ✅ Works | ✅ Works | ✅ Aligned |
| Stock Reservation | ✅ Works | ✅ Works | ✅ Aligned |
| Stock Fulfillment | ✅ Works | ❌ Bug | ❌ **Misaligned** |
| Stock Release | ✅ Works | ❌ Bug | ❌ **Misaligned** |
| Order Storage | ✅ Works | ✅ Works | ✅ Aligned |

---

## ROOT CAUSES OF BUGS

### Lock Key Generation Inconsistency

**Good (in `reserveStock()`):**
```typescript
const lockKey = `inventory:${freeItemId || variantId || productId}`;
```

**Buggy (in `fulfillReservation()` and `releaseReservation()`):**
```typescript
const lockKey = `inventory:${reservation.inventory.productId}`;
```

**Should be:**
```typescript
const lockKey = `inventory:${
  reservation.inventory.freeItemId || 
  reservation.inventory.variantId || 
  reservation.inventory.productId
}`;
```

---

## IMPACT ASSESSMENT

### Scenarios Working Correctly
1. ✅ Creating orders with products only
2. ✅ Creating orders with products that have free items attached
3. ✅ Reserving stock for both products and free items
4. ✅ Single concurrent order with free items

### Scenarios with Issues
1. ❌ Multiple concurrent fulfillments of **different** standalone free items
2. ❌ Multiple concurrent releases of **different** standalone free items
3. ⚠️ High contention on standalone free item inventory
4. ⚠️ Potential deadlocks in edge cases

### Production Risk
- **High** if you have high volume of standalone free item orders
- **Medium** if free items are mostly attached to products
- **Low** in normal/low-concurrency environments

---

## RECOMMENDED FIX

Update lock key generation in both methods:

```typescript
// In fulfillReservation() and releaseReservation()
const lockKey = `inventory:${
  reservation.inventory.freeItemId || 
  reservation.inventory.variantId || 
  reservation.inventory.productId
}`;
```

This ensures each inventory item (product, variant, or free item) gets a unique lock.

---

## CONCLUSION

**Current State:**
- ✅ Inventory model is well-designed for both products and free items
- ✅ Checking and reservation are properly aligned
- ❌ Fulfillment and release have critical bugs affecting standalone free items

**Recommendation:**
Apply the lock key fix immediately to prevent race conditions with standalone free items.
