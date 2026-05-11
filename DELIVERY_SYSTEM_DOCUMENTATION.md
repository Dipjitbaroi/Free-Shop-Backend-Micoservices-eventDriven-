# 📦 Comprehensive Delivery System Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Delivery Types](#delivery-types)
4. [Steadfast Integration](#steadfast-integration)
5. [API Endpoints](#api-endpoints)
6. [Webhook System](#webhook-system)
7. [COD Payment Processing](#cod-payment-processing)
8. [Database Schema](#database-schema)
9. [Status Transitions](#status-transitions)
10. [Setup & Configuration](#setup--configuration)
11. [Error Handling](#error-handling)
12. [Testing & Troubleshooting](#testing--troubleshooting)

---

## Overview

The **Delivery System** is a comprehensive solution for managing both in-house and third-party courier deliveries. It supports:

- ✅ **In-house deliveries** with delivery man assignment
- ✅ **Third-party courier integration** (Steadfast, Pathao, RedX, Sundarban, etc.)
- ✅ **Real-time status tracking** via webhooks
- ✅ **Automatic COD payment processing**
- ✅ **Order status synchronization**
- ✅ **Failed delivery retry management**
- ✅ **Bearer token security** for webhooks

**Key Components:**
- `delivery.service.ts` - Business logic
- `delivery.controller.ts` - HTTP request handlers
- `delivery.routes.ts` - Express route definitions
- `steadfast-client.ts` - Steadfast API client
- `delivery.model.ts` (Prisma) - Database schema

---

## Architecture

### System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      ORDER PLACED                               │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
        ┌────────────────────┐
        │ Delivery Type?     │
        └────┬────────────┬──┘
             │            │
        ┌────▼──┐    ┌────▼────────┐
        │INHOUSE│    │THIRD_PARTY   │
        └────┬──┘    └────┬────────┘
             │            │
             │        ┌───▼──────────┐
             │        │ Provider?    │
             │        └───┬─┬─┬──────┘
             │        ┌───▼─▼─▼──┐
             │    ┌───┤Steadfast  │◄─── Webhook Callback
             │    │   └───────────┘
             │    │
             ▼    ▼
     ┌──────────────────┐
     │ Update Status    │
     │ Sync Order       │
     │ Process COD      │
     └──────────────────┘
             │
             ▼
     ┌──────────────────┐
     │ DELIVERED ✅     │
     └──────────────────┘
```

---

## Delivery Types

### 1. **INHOUSE Delivery**

**Use Case:** Your own delivery team handles the shipment

**Flow:**
```
1. Create DeliveryInfo (type: INHOUSE)
   ├─ status: PENDING
   └─ No external provider involved

2. Assign to Delivery Man
   ├─ status: ASSIGNED
   └─ deliveryManId: assigned user

3. Pickup
   ├─ status: PICKED_UP
   └─ pickedUpAt: timestamp

4. In Transit
   ├─ status: IN_TRANSIT
   └─ inTransitAt: timestamp

5. Out for Delivery
   ├─ status: OUT_FOR_DELIVERY
   └─ outForDeliveryAt: timestamp

6. Delivery Attempt
   ├─ Success → status: DELIVERED
   │           └─ actualDeliveryDate: timestamp
   └─ Failed → Record attempt
               └─ Retry later

7. Process COD (if applicable)
   └─ Complete payment transaction
```

**Example Request:**
```bash
POST /api/v1/deliveries/create/{orderId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "INHOUSE",
  "deliveryManId": "user_456",
  "weight": 2.5,
  "fragile": true,
  "estimatedDeliveryDate": "2026-05-15T18:00:00Z"
}
```

---

### 2. **THIRD_PARTY Delivery**

**Use Case:** External courier company (Steadfast, Pathao, etc.) handles shipment

**Flow:**
```
1. Create DeliveryInfo (type: THIRD_PARTY)
   ├─ status: PENDING
   └─ provider: STEADFAST

2. For Steadfast:
   ├─ Call Steadfast API: POST /create_order
   ├─ Send order details (recipient, address, COD amount)
   ├─ Receive: consignment_id, tracking_code
   ├─ Save tracking IDs to DeliveryInfo
   └─ status: ASSIGNED ✓ (confirmed with Steadfast provider)

3. Wait for Webhook
   └─ Steadfast sends real-time status updates

4. On Webhook:
   ├─ Validate Bearer token
   ├─ Match delivery by consignment_id/tracking_code/invoice
   ├─ Normalize status (Steadfast → internal)
   ├─ Update DeliveryInfo status + timestamps
   ├─ Sync Order status
   └─ If DELIVERED + COD: Auto-process payment

5. Delivery Complete
   └─ status: DELIVERED (or FAILED)
```

**Example Request:**
```bash
POST /api/v1/deliveries/create/{orderId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "THIRD_PARTY",
  "provider": "STEADFAST",
  "weight": 2.5,
  "fragile": true
}
```

---

## Steadfast Integration

### What We Send to Steadfast

When creating a delivery with Steadfast, we send a `POST` request to their `/create_order` endpoint:

```json
{
  "invoice": "ORD-2026-001",
  "recipient_name": "Ahmed Khan",
  "recipient_phone": "01712345678",
  "recipient_address": "House 45, Gulshan 2, Dhaka, 1212",
  "cod_amount": 3500,
  "note": "Please ring the bell twice"
}
```

**Field Mapping:**

| Field | Source | Logic |
|-------|--------|-------|
| `invoice` | `order.orderNumber` | Order reference |
| `recipient_name` | `shippingAddress.name` OR `firstName+lastName` OR `guestEmail` OR "Customer" | Prioritized lookup |
| `recipient_phone` | `shippingAddress.phone` OR `guestPhone` OR "0000000000" | Phone number extraction |
| `recipient_address` | `shippingAddress.*` joined | Full formatted address |
| `cod_amount` | `paymentMethod === "COD" ? order.total : 0` | Conditional amount |
| `note` | `customerNote` OR `sellerNote` OR `adminNote` | Optional order notes |

### What Steadfast Responds With

```json
{
  "status": 200,
  "message": "Consignment has been created successfully",
  "consignment": {
    "consignment_id": 54321,
    "invoice": "ORD-2026-001",
    "tracking_code": "SF-2026-54321",
    "recipient_name": "Ahmed Khan",
    "recipient_phone": "01712345678",
    "cod_amount": 3500,
    "created_at": "2026-05-12T10:30:00Z"
  }
}
```

**We Extract & Store:**
- `consignment_id` → `DeliveryInfo.externalConsignmentId`
- `tracking_code` → `DeliveryInfo.externalTrackingId`

### Steadfast API Endpoints Used

```
1. POST /create_order
   Create a new shipment
   Headers: Api-Key, Secret-Key
   Response: consignment_id, tracking_code

2. GET /status_by_cid/{consignment_id}
   Get status by Steadfast consignment ID

3. GET /status_by_trackingcode/{tracking_code}
   Get status by tracking code

4. Webhook: POST /api/v1/webhooks/steadfast
   Receive status updates
   Header: Authorization: Bearer {token}
```

---

## API Endpoints

### Base URL
```
http://api-gateway:3000/api/v1
```

### Delivery Endpoints

#### 1. **Create Delivery**
```http
POST /deliveries/create/{orderId}
Authorization: Bearer {user-token}
Content-Type: application/json

Request Body:
{
  "type": "INHOUSE" | "THIRD_PARTY",
  "deliveryManId": "string",          // Required for INHOUSE
  "provider": "STEADFAST" | "PATHAO", // Required for THIRD_PARTY
  "trackingId": "string",             // Optional
  "apiRef": "string",                 // Optional
  "weight": 2.5,                      // Optional
  "fragile": true,                    // Optional
  "estimatedDeliveryDate": "2026-05-15T18:00:00Z"  // Optional
}

Response (201):
{
  "success": true,
  "data": {
    "id": "del_123",
    "orderId": "ord_456",
    "type": "INHOUSE",
    "provider": null,
    "status": "PENDING",
    "deliveryManId": "user_456",
    "externalTrackingId": null,
    "externalConsignmentId": null,
    "weight": 2.5,
    "fragile": true,
    "estimatedDeliveryDate": "2026-05-15T18:00:00Z",
    "createdAt": "2026-05-12T10:00:00Z",
    "updatedAt": "2026-05-12T10:00:00Z"
  },
  "message": "Delivery created successfully"
}
```

#### 2. **Get Delivery by Order**
```http
GET /deliveries/order/{orderId}?search=optional
Authorization: Bearer {user-token}

Response (200):
{
  "success": true,
  "data": { /* Delivery object */ },
  "message": "Delivery retrieved successfully"
}
```

#### 3. **Get Delivery by ID**
```http
GET /deliveries/{deliveryId}
Authorization: Bearer {user-token}

Response (200):
{
  "success": true,
  "data": { /* Delivery object */ },
  "message": "Delivery retrieved successfully"
}
```

#### 4. **Update Delivery Status**
```http
PATCH /deliveries/{deliveryId}/status
Authorization: Bearer {user-token}
Content-Type: application/json

Request Body:
{
  "status": "PICKED_UP" | "IN_TRANSIT" | "OUT_FOR_DELIVERY" | "DELIVERED" | "FAILED",
  "notes": "Optional status notes"
}

Response (200):
{
  "success": true,
  "data": { /* Updated Delivery object */ },
  "message": "Delivery status updated successfully"
}
```

#### 5. **Record Failed Attempt**
```http
POST /deliveries/{deliveryId}/failed-attempt
Authorization: Bearer {user-token}
Content-Type: application/json

Request Body:
{
  "reason": "Customer not available"
}

Response (200):
{
  "success": true,
  "data": { /* Delivery object */ },
  "message": "Failed attempt recorded successfully"
}
```

#### 6. **Get Deliveries for Delivery Man**
```http
GET /deliveries/delivery-man/{deliveryManId}?page=1&limit=20&status=ASSIGNED&search=optional
Authorization: Bearer {user-token}

Response (200):
{
  "success": true,
  "data": {
    "deliveries": [ /* Array of deliveries */ ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3
    }
  },
  "message": "Deliveries retrieved successfully"
}
```

#### 7. **Get Deliveries by Provider**
```http
GET /deliveries/provider/{provider}?page=1&limit=20&status=PENDING
Authorization: Bearer {user-token}

Response (200):
{
  "success": true,
  "data": {
    "deliveries": [ /* Array of deliveries */ ],
    "pagination": { /* Pagination info */ }
  },
  "message": "Deliveries retrieved successfully"
}
```

#### 8. **Get Delivery Statistics**
```http
GET /deliveries/stats
Authorization: Bearer {user-token}

Response (200):
{
  "success": true,
  "data": {
    "total": 1500,
    "byStatus": {
      "PENDING": 120,
      "ASSIGNED": 45,
      "IN_TRANSIT": 250,
      "DELIVERED": 1080,
      "FAILED": 5
    },
    "byProvider": {
      "INHOUSE": 500,
      "STEADFAST": 1000
    }
  },
  "message": "Delivery statistics retrieved successfully"
}
```

#### 9. **Handle Steadfast Webhook** (Public - No Auth)
```http
POST /api/v1/webhooks/steadfast
Authorization: Bearer {steadfast-bearer-token}
Content-Type: application/json

Request Body (from Steadfast):
{
  "consignment_id": "54321",
  "invoice": "ORD-2026-001",
  "tracking_code": "SF-2026-54321",
  "status": "delivered",
  "cod_amount": 3500,
  "cod_status": "completed",
  "note": "Package delivered successfully",
  "updated_at": "2026-05-12T15:30:00Z"
}

Response (200):
{
  "success": true,
  "data": {
    "matched": true,
    "deliveryId": "del_123",
    "orderId": "ord_456",
    "internalStatus": "DELIVERED"
  },
  "message": "Steadfast delivery status processed"
}
```

---

## Webhook System

### Webhook Endpoint

**URL:** `POST /api/v1/webhooks/steadfast`

**Port:** 3000 (API Gateway)  
**Actual Service:** Order Service (port 3004)

### Security

**Bearer Token Validation:**
```typescript
// In deliveryController.handleSteadfastWebhook()
const authorization = String(req.headers.authorization || '');
if (authorization !== `Bearer ${config.steadfast.webhookBearerToken}`) {
  throw new UnauthorizedError('Invalid Steadfast webhook token');
}
```

### Webhook Payload

Steadfast sends this payload when delivery status changes:

```json
{
  "consignment_id": "54321",
  "invoice": "ORD-2026-001",
  "tracking_code": "SF-2026-54321",
  "status": "in_transit",
  "cod_amount": 3500,
  "cod_status": "pending",
  "note": "Package is in transit",
  "updated_at": "2026-05-12T15:30:00Z"
}
```

### Webhook Processing Flow

```
1. Receive Webhook from Steadfast
   ├─ Validate Bearer token
   ├─ Log webhook event (✓ or ⚠)
   └─ If invalid: Return 401

2. Match Delivery
   ├─ By externalConsignmentId (primary)
   ├─ By externalTrackingId (secondary)
   ├─ By invoice/orderNumber (tertiary)
   └─ If no match: Log unmatched warning, return 200

3. Normalize Status
   ├─ Convert Steadfast status → Internal enum
   ├─ Example: "in_transit" → "IN_TRANSIT"
   └─ Example: "delivered" → "DELIVERED"

4. Update Delivery with Timestamps
   ├─ Save new status
   ├─ If PICKED_UP: Set pickedUpAt = now()
   ├─ If IN_TRANSIT: Set inTransitAt = now()
   ├─ If OUT_FOR_DELIVERY: Set outForDeliveryAt = now()
   ├─ If DELIVERED: Set actualDeliveryDate = now()
   └─ Update notes from webhook

5. Sync Order Status
   ├─ Update order.status to match delivery.status
   └─ Keep delivery ↔ order in sync

6. Process COD Payment (if applicable)
   ├─ If status = DELIVERED
   ├─ And payment method = COD
   ├─ And paymentStatus ≠ PAID
   ├─ Then: Call payment service
   ├─ Mark order.paymentStatus = PAID
   ├─ Set order.paidAt = now()
   └─ Log success/failure

7. Return Response
   └─ 200 OK with matched=true/false + status
```

### Status Mapping

**Steadfast Status → Internal Status**

```typescript
{
  'picked_up': 'PICKED_UP',
  'in_transit': 'IN_TRANSIT',
  'out_for_delivery': 'OUT_FOR_DELIVERY',
  'delivered': 'DELIVERED',
  'failed': 'FAILED',
  'returned': 'CANCELLED',
  'cancelled': 'CANCELLED'
}
```

### Webhook Retry Logic (Steadfast's Responsibility)

If your endpoint returns non-200:
- Steadfast retries multiple times over 24 hours
- With exponential backoff

**Always return 200**, even if unmatched:
```json
{
  "success": true,
  "data": {
    "matched": false,
    "message": "No matching delivery found"
  }
}
```

---

## COD Payment Processing

### When COD is Processed

COD (Cash on Delivery) payment is **automatically completed** when:

1. ✅ Webhook received from Steadfast
2. ✅ Delivery status = "DELIVERED"
3. ✅ Original order payment method = "COD"
4. ✅ Order payment status ≠ "PAID"

### Processing Steps

```typescript
// In handleSteadfastWebhook()
if (newDeliveryStatus === 'DELIVERED') {
  await this.completeCODPaymentOnDelivery(orderId);
}

private async completeCODPaymentOnDelivery(orderId: string) {
  1. Fetch Order
     ├─ Check paymentMethod = COD
     └─ Check paymentStatus ≠ PAID

  2. Call Payment Service
     └─ completeCODPayment(orderId, totalAmount)

  3. Update Order
     ├─ paymentStatus: PAID
     └─ paidAt: current timestamp

  4. Log Success
     └─ Console: "✓ COD payment marked as PAID for order {orderId}"
}
```

### Failure Handling

If COD payment fails:
```typescript
catch (error) {
  console.error(`Failed to complete COD payment for order ${orderId}: ${error}`);
  // Logs error but doesn't block webhook response
  // Manual admin action required
}
```

---

## Database Schema

### DeliveryInfo Table

```typescript
model DeliveryInfo {
  id                      String    @id @default(cuid())
  orderId                 String    @unique
  order                   Order     @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  // Type and Provider
  type                    String    // INHOUSE | THIRD_PARTY
  provider                String?   // STEADFAST | PATHAO | REDX | SUNDARBAN | OTHER | null
  
  // Status Tracking
  status                  String    @default("PENDING")
  // PENDING → ASSIGNED → PICKED_UP → IN_TRANSIT → OUT_FOR_DELIVERY → DELIVERED
  // or → FAILED, CANCELLED
  
  // Inhouse Delivery
  deliveryManId           String?
  failedAttempts          Int       @default(0)
  failedAttemptReasons    String[]  @default([])
  
  // External Tracking
  externalTrackingId      String?   // From courier (tracking_code)
  externalConsignmentId   String?   // From courier (consignment_id)
  externalInvoiceId       String?   // External invoice reference
  
  // Delivery Details
  weight                  Float?    // in kg
  fragile                 Boolean   @default(false)
  estimatedDeliveryDate   DateTime?
  
  // Timestamps
  pickedUpAt              DateTime?
  inTransitAt             DateTime?
  outForDeliveryAt        DateTime?
  actualDeliveryDate      DateTime?
  
  createdAt               DateTime  @default(now())
  updatedAt               DateTime  @updatedAt
  
  @@index([orderId])
  @@index([provider])
  @@index([status])
  @@index([deliveryManId])
}
```

### Key Fields Explained

| Field | Type | Purpose |
|-------|------|---------|
| `type` | String | INHOUSE or THIRD_PARTY |
| `provider` | String | Courier company (STEADFAST, PATHAO, etc.) |
| `status` | String | Current delivery status |
| `deliveryManId` | String | Assigned delivery person (INHOUSE only) |
| `externalTrackingId` | String | Courier's tracking code (SF-2026-54321) |
| `externalConsignmentId` | String | Courier's consignment ID (54321) |
| `weight` | Float | Package weight in kg |
| `fragile` | Boolean | Mark as fragile |
| Timestamp fields | DateTime | Status transition timestamps |

---

## Status Transitions

### Complete Status Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                          DELIVERY LIFECYCLE                          │
└─────────────────────────────────────────────────────────────────────┘

INHOUSE DELIVERY:
  PENDING
     ↓
  ASSIGNED (Delivery man assigned)
     ↓
  PICKED_UP (Delivery man collected package)
     ├─ pickedUpAt = timestamp
     ↓
  IN_TRANSIT (Package on the way)
     ├─ inTransitAt = timestamp
     ↓
  OUT_FOR_DELIVERY (Driver nearby)
     ├─ outForDeliveryAt = timestamp
     ↓
  DELIVERED ✅ (Customer received)
     ├─ actualDeliveryDate = timestamp
     ├─ If COD: Complete payment
     └─ Sync order status = DELIVERED
     
  OR
  
  FAILED ❌ (Delivery attempt failed)
     ├─ Record failed attempt
     ├─ failedAttempts + 1
     ├─ failedAttemptReasons.push(reason)
     └─ Retry later


THIRD_PARTY (STEADFAST):
  PENDING
     ├─ Create in Steadfast API
     ├─ Save consignment_id
     ├─ Save tracking_code
     └─ Wait for webhook
     ↓
  [Webhook from Steadfast]
     ↓
  IN_TRANSIT (Webhook: "in_transit")
     ├─ inTransitAt = timestamp
     ↓
  OUT_FOR_DELIVERY (Webhook: "out_for_delivery")
     ├─ outForDeliveryAt = timestamp
     ↓
  DELIVERED ✅ (Webhook: "delivered")
     ├─ actualDeliveryDate = timestamp
     ├─ If COD: Auto-complete payment
     └─ Sync order status = DELIVERED
     
  OR
  
  FAILED ❌ (Webhook: "failed")
     └─ Manual admin review required


VALID TRANSITIONS:
  PENDING        → ASSIGNED (after Steadfast booking confirmed OR inhouse delivery man assigned)
  ASSIGNED       → PICKED_UP, FAILED, CANCELLED
  PICKED_UP      → IN_TRANSIT, FAILED
  IN_TRANSIT     → OUT_FOR_DELIVERY, FAILED
  OUT_FOR_DELIVERY → DELIVERED, FAILED
  DELIVERED      → [Terminal] ✅
  FAILED         → Can be retried (go back to PENDING or ASSIGNED)
  CANCELLED      → [Terminal] ❌
```

### Manual Status Update Permissions

**Who can update status?**
- ✅ Delivery Man (own deliveries, INHOUSE only)
- ✅ Manager (any delivery)
- ✅ Admin (any delivery)
- ❌ Customer (cannot update)

**Required Permission:** `DELIVERY_UPDATE` (code: 6003)

---

## Setup & Configuration

### 1. Environment Variables

Create `.env` file in `services/order-service/`:

```env
# Steadfast Configuration
STEADFAST_BASE_URL=https://api.steadfast.com.bd
STEADFAST_API_KEY=your_api_key_from_steadfast
STEADFAST_SECRET_KEY=your_secret_key_from_steadfast
STEADFAST_BEARER_TOKEN=your_secure_random_webhook_token_123456789

# Service URLs
USER_SERVICE_URL=http://user-service:3002
SERVICE_AUTH_TOKEN=your_service_to_service_auth_token

# Payment Service
PAYMENT_SERVICE_URL=http://payment-service:3003
```

### 2. Steadfast Registration

**Steps in Steadfast Dashboard:**

1. Login to Steadfast Merchant Panel
2. Go to Settings → API Credentials
3. Note your:
   - API Key
   - Secret Key
4. Go to Settings → Webhooks
5. Register webhook:
   - URL: `https://your-domain.com/api/v1/webhooks/steadfast`
   - Bearer Token: Generate secure token (e.g., `openssl rand -hex 32`)
   - Events: Select "Delivery Status Updates"
6. Test webhook (if available)

### 3. Deploy

```bash
# Build
pnpm build

# Start services
docker-compose up -d

# Or with Kubernetes
kubectl apply -f k8s/services/order-service/
```

### 4. Verify Webhook URL is Public

```bash
# Test webhook endpoint
curl -X POST https://your-domain.com/api/v1/webhooks/steadfast \
  -H "Authorization: Bearer your_secure_webhook_token" \
  -H "Content-Type: application/json" \
  -d '{
    "consignment_id": "test",
    "invoice": "test-invoice",
    "status": "picked_up"
  }'

# Expected response:
# 200 OK with {"matched": false} (no matching delivery)
```

---

## Error Handling

### Common Errors & Solutions

#### 1. **Steadfast API Key Invalid**

Error:
```json
{
  "error": "Steadfast booking failed: Invalid API key",
  "status": 401
}
```

Solution:
- ✅ Verify `STEADFAST_API_KEY` in `.env`
- ✅ Verify `STEADFAST_SECRET_KEY` in `.env`
- ✅ Keys should match Steadfast dashboard
- ✅ Restart service: `docker-compose restart order-service`

#### 2. **Webhook Token Mismatch**

Error:
```json
{
  "error": "Invalid Steadfast webhook token"
}
```

Solution:
- ✅ Verify `STEADFAST_BEARER_TOKEN` in `.env`
- ✅ Verify token matches Steadfast webhook settings
- ✅ Steadfast sends: `Authorization: Bearer {token}`
- ✅ Your .env must have matching token

#### 3. **No Delivery Found for Webhook**

Response:
```json
{
  "success": true,
  "data": {
    "matched": false,
    "message": "No matching delivery found"
  }
}
```

Causes:
- ❌ Delivery not created in your system yet
- ❌ consignment_id doesn't match
- ❌ tracking_code incorrect
- ❌ invoice number mismatch

Solution:
- ✅ Check logs: Find why delivery wasn't created
- ✅ Verify order exists in database
- ✅ Check externalConsignmentId and externalTrackingId saved
- ✅ Test with known order ID

#### 4. **Service Unavailable**

Error:
```json
{
  "error": "Steadfast credentials are not configured"
}
```

Solution:
- ✅ Verify all Steadfast env vars are set
- ✅ Run: `echo $STEADFAST_API_KEY` (should show value)
- ✅ Check `.env` file exists
- ✅ Restart service

#### 5. **Failed Delivery Attempts**

When delivery fails multiple times:

```typescript
// Status: FAILED
delivery.failedAttempts = 3
delivery.failedAttemptReasons = [
  "Customer not available",
  "Wrong address",
  "No answer at door"
]
```

Manual Actions:
- ❌ Contact customer
- ❌ Reschedule delivery
- ❌ Or cancel delivery
- ❌ Call delivery man

#### 6. **Webhook Timeout**

If your webhook takes >30 seconds:
- Steadfast marks as failed
- Steadfast retries later

Solution:
- ✅ Optimize database queries
- ✅ Use async operations
- ✅ Cache delivery man profiles
- ✅ Monitor performance

---

## Testing & Troubleshooting

### 1. Test Delivery Creation (INHOUSE)

```bash
curl -X POST http://localhost:3000/api/v1/deliveries/create/ord_123 \
  -H "Authorization: Bearer user-token" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "INHOUSE",
    "deliveryManId": "user_456",
    "weight": 2.5,
    "fragile": false
  }'
```

Expected Response:
```json
{
  "success": true,
  "data": {
    "id": "del_789",
    "orderId": "ord_123",
    "type": "INHOUSE",
    "status": "PENDING",
    "deliveryManId": "user_456",
    "weight": 2.5,
    "fragile": false
  }
}
```

### 2. Test Delivery Creation (STEADFAST)

```bash
curl -X POST http://localhost:3000/api/v1/deliveries/create/ord_123 \
  -H "Authorization: Bearer user-token" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "THIRD_PARTY",
    "provider": "STEADFAST",
    "weight": 2.5
  }'
```

Expected Response:
```json
{
  "success": true,
  "data": {
    "id": "del_789",
    "status": "ASSIGNED",
    "externalConsignmentId": "54321",
    "externalTrackingId": "SF-2026-54321",
    "provider": "STEADFAST",
    "carrier": "STEADFAST"
  }
}
```

**Status is ASSIGNED because:**
- ✓ Steadfast API confirmed the booking
- ✓ Tracking IDs were successfully received
- ✓ Ready to await webhook updates

### 3. Test Webhook Reception

```bash
curl -X POST http://localhost:3000/api/v1/webhooks/steadfast \
  -H "Authorization: Bearer your_webhook_token" \
  -H "Content-Type: application/json" \
  -d '{
    "consignment_id": "54321",
    "invoice": "ORD-2026-001",
    "tracking_code": "SF-2026-54321",
    "status": "in_transit",
    "updated_at": "2026-05-12T15:30:00Z"
  }'
```

Expected Response:
```json
{
  "success": true,
  "data": {
    "matched": true,
    "deliveryId": "del_789",
    "internalStatus": "IN_TRANSIT"
  }
}
```

### 4. Check Logs

```bash
# View order-service logs
docker logs order-service | grep -i delivery

# Or
docker logs order-service | grep -i steadfast

# Or with timestamps
docker logs order-service --timestamps | tail -100
```

### 5. Database Query

```sql
-- Check delivery created
SELECT id, status, externalConsignmentId, externalTrackingId 
FROM "DeliveryInfo" 
WHERE orderId = 'ord_123';

-- Check order sync
SELECT id, status FROM "Order" WHERE id = 'ord_123';

-- Check COD payment
SELECT id, paymentStatus, paidAt 
FROM "Order" 
WHERE id = 'ord_123' AND paymentMethod = 'COD';
```

### 6. Debugging Webhook Issues

**Enable Debug Logging:**

```typescript
// In delivery.service.ts, add:
console.log('📦 Webhook Received:', payload);
console.log('🔍 Searching for delivery...');
console.log('✅ Delivery Found:', delivery);
console.log('📝 New Status:', newDeliveryStatus);
console.log('💾 Updating delivery...');
```

**Check Webhook Execution:**

```bash
# Tail logs while sending webhook
docker logs -f order-service | grep "Webhook"
```

---

## Summary of Key Points

✅ **Two Delivery Types:**
- INHOUSE: Your delivery team
- THIRD_PARTY: External courier (Steadfast)

✅ **Real-time Updates:**
- Steadfast sends webhooks
- Your system processes automatically
- Orders stay in sync

✅ **Automatic COD:**
- When delivery = DELIVERED
- And payment method = COD
- Payment auto-completes

✅ **Security:**
- Bearer token validation on webhooks
- Service-to-service auth for internal calls
- Permission-based access control

✅ **Status Tracking:**
- Full delivery lifecycle tracking
- Timestamps for each status change
- Failed attempt recording

✅ **Error Resilience:**
- Unmatched webhooks logged for manual review
- Failed deliveries can be retried
- Comprehensive error handling

---

## Quick Reference

**API Gateway:** `http://api-gateway:3000`  
**Order Service:** `http://order-service:3004`  
**Webhook URL:** `POST /api/v1/webhooks/steadfast`  
**Required Roles:** MANAGER, ADMIN, DELIVERY_MAN  
**Required Permissions:** DELIVERY_CREATE (6001), DELIVERY_UPDATE (6003)

**Database:** PostgreSQL  
**Sync Method:** Real-time webhooks + on-demand API calls  
**Payment:** Auto-complete COD on DELIVERED status

---

## Status Alignment Summary

### For INHOUSE Delivery:
- **PENDING** → Not yet assigned to a delivery man
- **ASSIGNED** → Assigned to specific delivery man (deliveryManId set)
- **PICKED_UP onwards** → Delivery man updates via API

### For Steadfast (THIRD_PARTY) Delivery:
- **PENDING** → Delivery request created but not yet booked with Steadfast
- **ASSIGNED** → ✓ Booked with Steadfast (consignment_id & tracking_code received), awaiting their pickup
- **PICKED_UP onwards** → Real-time updates via Steadfast webhooks

**Key Insight:** ASSIGNED status means the delivery is confirmed at the provider level, regardless of whether it's a person (INHOUSE) or a service (STEADFAST).

---

For questions or issues, refer to the logs and database queries in the Troubleshooting section.
