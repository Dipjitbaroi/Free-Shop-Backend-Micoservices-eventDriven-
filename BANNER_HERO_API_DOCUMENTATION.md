# Banner CRUD APIs - Home Page Hero Section

## Overview

Created comprehensive CRUD APIs for managing banners on the home page hero section. The banner system supports multiple link types, scheduling, and dynamic positioning for promotional content management.

## Files Created/Modified

### 1. Database Schema
**File**: `services/product-service/prisma/schema.prisma`

Added Banner model with the following fields:
- `id` (UUID): Primary key
- `title` (String): Banner title/heading
- `description` (String?): Optional banner description
- `image` (String): Banner image URL
- `altText` (String?): Alt text for accessibility
- `link` (String?): Target link URL
- `linkType` (String): Type of link - `internal`, `external`, `product`, or `category` (defaults to 'internal')
- `targetId` (String?): ID of product/category for internal links
- `position` (Int): Display order (defaults to 0)
- `isActive` (Boolean): Active status (defaults to true)
- `startDate` (DateTime?): Optional scheduling start date
- `endDate` (DateTime?): Optional scheduling end date
- `createdBy` (String): User ID of banner creator
- `createdAt` (DateTime): Creation timestamp
- `updatedAt` (DateTime): Last update timestamp

### 2. Service Layer
**File**: `services/product-service/src/services/banner.service.ts`

Implements BannerService class with methods:
- `createBanner(data)` - Create a new banner
- `getBanners(filters)` - Get paginated list of banners with filtering
- `getActiveBanners()` - Get currently active banners (respects date range and isActive flag)
- `getBannerById(id)` - Get a specific banner
- `updateBanner(id, data)` - Update banner details
- `deleteBanner(id)` - Delete a banner
- `reorderBanners(bannerIds)` - Reorder banners by position

Features:
- Redis caching for improved performance
- Pagination support
- Search capability by title and description
- Date-based scheduling support
- Cache invalidation on updates

### 3. Controller Layer
**File**: `services/product-service/src/controllers/banner.controller.ts`

Implements BannerController with handlers:
- `createBanner` - POST handler for creating banners
- `getBanners` - GET handler for listing banners
- `getActiveBanners` - GET handler for active banners
- `getBannerById` - GET handler for single banner
- `updateBanner` - PATCH handler for updating banners
- `deleteBanner` - DELETE handler for removing banners
- `reorderBanners` - POST handler for reordering

### 4. Routes/API Endpoints
**File**: `services/product-service/src/routes/banner.routes.ts`

#### Public Endpoints

**1. Get Active Banners (for hero section)**
```
GET /api/banners/active
```
- No authentication required
- Returns currently active banners based on:
  - `isActive: true`
  - Current date within `startDate` and `endDate` range
  - Or no date restrictions if both dates are null
- Sorted by position (ascending)
- Response caching: 30 minutes

**Example Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "title": "Summer Sale",
      "description": "Up to 50% off",
      "image": "https://example.com/banner1.jpg",
      "altText": "Summer Sale Banner",
      "link": "/products/summer-sale",
      "linkType": "internal",
      "position": 0,
      "isActive": true,
      "startDate": "2026-06-01",
      "endDate": "2026-08-31",
      "createdAt": "2026-06-02T10:00:00Z",
      "updatedAt": "2026-06-02T10:00:00Z"
    }
  ],
  "message": "Active banners fetched successfully"
}
```

#### Admin Endpoints (Require Authentication + RBAC)

**2. Create Banner**
```
POST /api/banners
Content-Type: application/json
Authorization: Bearer <token>
```

Permission Required: `13001` (BANNER_CREATE)

Request body:
```json
{
  "title": "Summer Sale",
  "description": "Up to 50% off on organic products",
  "image": "https://example.com/banner1.jpg",
  "altText": "Summer Sale Banner",
  "link": "/products/summer-sale",
  "linkType": "internal",
  "targetId": "product-category-uuid",
  "position": 0,
  "startDate": "2026-06-01T00:00:00Z",
  "endDate": "2026-08-31T23:59:59Z"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "uuid-generated",
    "title": "Summer Sale",
    "description": "Up to 50% off on organic products",
    "image": "https://example.com/banner1.jpg",
    "altText": "Summer Sale Banner",
    "link": "/products/summer-sale",
    "linkType": "internal",
    "targetId": "product-category-uuid",
    "position": 0,
    "isActive": true,
    "startDate": "2026-06-01T00:00:00Z",
    "endDate": "2026-08-31T23:59:59Z",
    "createdBy": "user-uuid",
    "createdAt": "2026-06-02T10:00:00Z",
    "updatedAt": "2026-06-02T10:00:00Z"
  },
  "message": "Banner created successfully"
}
```

**3. Get Banners (Paginated)**
```
GET /api/banners?page=1&limit=10&isActive=true&search=sale
Authorization: Bearer <token>
```

Permission Required: `13002` (BANNER_READ)

Query Parameters:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `isActive` (optional): Filter by active status ('true' or 'false')
- `search` (optional): Search in title and description

**Response**:
```json
{
  "success": true,
  "data": {
    "data": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "pages": 1
    }
  },
  "message": "Banners fetched successfully"
}
```

**4. Get Banner By ID**
```
GET /api/banners/:id
Authorization: Bearer <token>
```

Permission Required: `13002` (BANNER_READ)

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "banner-uuid",
    ...
  },
  "message": "Banner fetched successfully"
}
```

**5. Update Banner**
```
PATCH /api/banners/:id
Content-Type: application/json
Authorization: Bearer <token>
```

Permission Required: `13003` (BANNER_UPDATE)

Request body (all fields optional):
```json
{
  "title": "Updated Title",
  "isActive": false,
  "position": 2,
  "startDate": "2026-07-01T00:00:00Z"
}
```

**Response**:
```json
{
  "success": true,
  "data": { ...updated banner },
  "message": "Banner updated successfully"
}
```

**6. Delete Banner**
```
DELETE /api/banners/:id
Authorization: Bearer <token>
```

Permission Required: `13004` (BANNER_DELETE)

**Response**:
```json
{
  "success": true,
  "data": null,
  "message": "Banner deleted successfully"
}
```

**7. Reorder Banners**
```
POST /api/banners/reorder
Content-Type: application/json
Authorization: Bearer <token>
```

Permission Required: `13005` (BANNER_REORDER)

Request body:
```json
{
  "bannerIds": ["uuid-1", "uuid-2", "uuid-3"]
}
```

Updates the position of each banner in order (position 0, 1, 2, etc.)

**Response**:
```json
{
  "success": true,
  "data": [
    { "id": "uuid-1", "position": 0, ... },
    { "id": "uuid-2", "position": 1, ... },
    { "id": "uuid-3", "position": 2, ... }
  ],
  "message": "Banners reordered successfully"
}
```

### 5. Integration
**File**: `services/product-service/src/app.ts`

Added banner routes to Express app:
```typescript
app.use('/banners', bannerRoutes);
```

## Features

### 1. **Multi-Type Linking**
   - `internal`: Links to internal product or category pages
   - `external`: External URLs
   - `product`: Direct link to a product
   - `category`: Direct link to a category

### 2. **Date-Based Scheduling**
   - Optional `startDate` and `endDate` for scheduling campaigns
   - Banners outside date range won't appear in active banners endpoint

### 3. **Position-Based Ordering**
   - Control banner display order via `position` field
   - `reorderBanners` endpoint for easy reordering

### 4. **Caching Strategy**
   - Active banners cached for 30 minutes
   - List views cached for 1 hour
   - Automatic cache invalidation on create/update/delete

### 5. **RBAC Integration**
   - Banner-specific permission codes (13001-13005)
   - Permission codes can be configured in RBAC admin panel
   - Public active banners endpoint (no auth required)

### 6. **Validation**
   - Express-validator for request validation
   - UUID validation for IDs and targetId
   - ISO8601 validation for dates
   - Content validation for required fields

## Database Migration

Run the following commands to apply the schema changes:

```bash
# Generate Prisma client
pnpm -r --filter "@freeshop/product-service" exec prisma generate

# Create and run migration
pnpm -r --filter "@freeshop/product-service" exec prisma migrate dev --name add_banners_table

# Deploy to production
pnpm -r --filter "@freeshop/product-service" exec prisma migrate deploy
```

## Frontend Integration Example

### React Hook for fetching active banners:

```typescript
const useActiveBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/banners/active')
      .then(res => res.json())
      .then(data => setBanners(data.data))
      .finally(() => setLoading(false));
  }, []);

  return { banners, loading };
};

// Usage in Hero component
const Hero = () => {
  const { banners, loading } = useActiveBanners();

  return (
    <div className="hero">
      {banners.map(banner => (
        <div key={banner.id} className="banner">
          <img src={banner.image} alt={banner.altText} />
          <a href={banner.link}>{banner.title}</a>
        </div>
      ))}
    </div>
  );
};
```

## Permission Codes Reference

| Code  | Name         | Description              |
|-------|--------------|--------------------------|
| 13001 | BANNER_CREATE | Create new banners       |
| 13002 | BANNER_READ   | View/list banners        |
| 13003 | BANNER_UPDATE | Edit banner details      |
| 13004 | BANNER_DELETE | Delete banners           |
| 13005 | BANNER_REORDER| Reorder banners          |

## Error Handling

All endpoints return appropriate HTTP status codes:

- `201`: Banner created successfully
- `200`: Successful retrieval/update/deletion
- `400`: Bad request (validation errors)
- `401`: Unauthorized (missing auth token)
- `403`: Forbidden (insufficient permissions)
- `404`: Banner not found
- `500`: Server error

Error response format:
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Banner with ID xyz not found"
  }
}
```

## Next Steps

1. **Database Migration**: Apply migrations to development and production databases
2. **RBAC Configuration**: Add permission codes to your RBAC system if not already configured
3. **Frontend Integration**: Implement the hero section component to fetch and display active banners
4. **Testing**: Create unit and integration tests for the banner APIs
5. **Documentation**: Update API documentation in Swagger/OpenAPI format
