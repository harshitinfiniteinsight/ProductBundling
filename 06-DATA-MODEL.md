# Data Model & Schema

## Overview
This document defines the complete data structures, database schemas, and API contracts for the product bundling feature.

---

## Core Data Types

### Bundle (Base)

```typescript
interface Bundle {
  // Identifiers
  id: string; // UUID
  storeId: string; // Multi-tenant support
  
  // Basic Info
  name: string; // Required, 3-100 chars
  description?: string; // Optional, max 500 chars
  bundleType: BundleType; // 'BOGO' | 'BUNDLE'
  status: BundleStatus; // 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'
  
  // Timestamps
  createdAt: DateTime;
  createdBy: string; // User ID
  updatedAt: DateTime;
  updatedBy: string;
  
  // Discriminated Union - Type-specific data
  bogo?: BOGOBundle;
  productBundle?: ProductBundleData;
  
  // Shared Discount/Schedule
  schedule?: {
    startDate: Date;
    endDate: Date;
  };
  
  // Metadata
  priority?: number; // For ordering bundles on storefront
  metadata?: Record<string, any>; // Custom fields
}

type BundleType = 'BOGO' | 'BUNDLE';
type BundleStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
```

### BOGO Bundle (Discriminated Union)

```typescript
interface BOGOBundle {
  // Buy Section
  buyProducts: {
    productId: string;
    name: string; // Denormalized for display
    sku: string;
    quantity: number; // X quantity
    price: number; // Current price at bundle creation
  }[];
  
  // Get Section
  getProducts: {
    productId: string;
    name: string;
    sku: string;
    quantity: number; // Y quantity
    price: number;
  }[];
  
  // Discount on Get Items
  discount: DiscountRule;
  
  // Optional Constraints
  limitPerOrder?: number; // Max times this BOGO applies per order
}

interface DiscountRule {
  type: DiscountType; // 'FREE' | 'PERCENTAGE' | 'FIXED_AMOUNT'
  value: number; // For PERCENTAGE: 0-100, For FIXED_AMOUNT: dollar amount
}

type DiscountType = 'FREE' | 'PERCENTAGE' | 'FIXED_AMOUNT';
```

### Product Bundle Data

```typescript
interface ProductBundleData {
  // Products in Bundle
  products: BundleProduct[];
  
  // Bundle-Level Discount
  bundleDiscount?: {
    type: BundlePricingType;
    value?: number; // For percentage/fixed amount
    fixedPrice?: number; // For 'FIXED_PRICE' type
  };
  
  // Calculations (Denormalized)
  calculations: {
    subtotal: number; // Sum of all product prices × quantities
    totalDiscount: number; // Total discount applied
    finalPrice: number; // What customer pays
    customerSavings: number; // Difference
  };
}

interface BundleProduct {
  // Product Ref
  productId: string;
  name: string; // Denormalized
  sku: string;
  category?: string;
  imageUrl?: string;
  
  // Quantity in Bundle
  quantity: number;
  
  // Individual Discount (Optional)
  individualDiscount?: {
    type: DiscountType;
    value: number;
  };
  
  // Pricing
  unitPrice: number; // Current price at bundle creation
  subtotal: number; // unit price × quantity × (1 - discount)
  
  // Order in bundle
  position: number; // For maintaining order
}

type BundlePricingType = 
  | 'NO_DISCOUNT'      // Sell at sum of items
  | 'FIXED_PRICE'      // Fixed bundle price
  | 'PERCENTAGE_DISCOUNT'; // % off entire bundle
```

---

## API Request/Response Models

### Create Bundle Request

```typescript
interface CreateBundleRequest {
  // Step 1: Basics
  name: string;
  description?: string;
  bundleType: BundleType;
  active: boolean;
  
  // Step 2A: BOGO Terms (if BOGO)
  buyProductIds?: string[];
  buyQuantity?: number;
  getProductIds?: string[];
  getQuantity?: number;
  limitPerOrder?: number;
  
  // Step 2B: Products (if Product Bundle)
  products?: {
    productId: string;
    quantity: number;
    individualDiscount?: {
      type: DiscountType;
      value: number;
    };
  }[];
  
  // Step 3: Discount & Schedule
  discountConfig?: {
    type: DiscountType | BundlePricingType;
    value?: number;
    fixedPrice?: number;
  };
  
  schedule?: {
    startDate: Date;
    endDate: Date;
  };
}
```

### Bundle Response

```typescript
interface BundleResponse {
  id: string;
  storeId: string;
  name: string;
  description?: string;
  bundleType: BundleType;
  status: BundleStatus;
  createdAt: DateTime;
  createdBy: UserRef;
  updatedAt: DateTime;
  updatedBy: UserRef;
  
  // Type-specific data
  bogo?: BOGOBundle;
  productBundle?: ProductBundleData;
  
  // For frontend display
  displayInfo: {
    bundleTypeLabel: string; // "BOGO" | "Product Bundle"
    statusLabel: string;
    discountLabel: string; // e.g., "10% off", "Free", "$5 off"
    productsCount: number;
    totalPrice: number;
    savingsAmount: number;
  };
}
```

### List Bundles Request

```typescript
interface ListBundlesRequest {
  page: number; // 0-indexed
  pageSize: number; // 10, 25, 50, 100
  
  // Filters
  filters?: {
    dateRange?: {
      startDate: Date;
      endDate: Date;
    };
    status?: BundleStatus | 'ALL';
    bundleType?: BundleType | 'ALL';
    searchQuery?: string; // Search name/ID/creator
  };
  
  // Sort
  sortBy?: 'name' | 'createdAt' | 'discount'; // Column to sort
  sortOrder?: 'ASC' | 'DESC';
}
```

### List Bundles Response

```typescript
interface ListBundlesResponse {
  data: BundleResponse[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  filters?: {
    applied: ListBundlesRequest['filters'];
    available: {
      statuses: BundleStatus[];
      bundleTypes: BundleType[];
    };
  };
}
```

### Update Bundle Request

```typescript
interface UpdateBundleRequest {
  // All fields are optional, only include changed fields
  name?: string;
  description?: string;
  status?: BundleStatus;
  
  // Can update discount/schedule
  bogo?: Partial<BOGOBundle>;
  productBundle?: Partial<ProductBundleData>;
  schedule?: {
    startDate?: Date;
    endDate?: Date;
  };
}
```

### Delete Bundle Request

```typescript
interface DeleteBundleRequest {
  bundleId: string;
  reason?: string; // Optional audit trail
}
```

### Duplicate Bundle Request

```typescript
interface DuplicateBundleRequest {
  bundleId: string;
  newName: string; // Required, will be "Copy of [original]" by default
  copyStatus?: boolean; // Include original status or default to ACTIVE
}
```

---

## Database Schema (SQL)

### Bundles Table

```sql
CREATE TABLE bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id),
  
  -- Basic Info
  name VARCHAR(100) NOT NULL,
  description TEXT,
  bundle_type VARCHAR(20) NOT NULL CHECK (bundle_type IN ('BOGO', 'BUNDLE')),
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'ARCHIVED')),
  
  -- Discriminated data (JSON)
  bogo_data JSONB,
  product_bundle_data JSONB,
  
  -- Schedule
  schedule_start_date TIMESTAMP,
  schedule_end_date TIMESTAMP,
  
  -- Metadata
  priority INTEGER DEFAULT 0,
  metadata JSONB,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by UUID NOT NULL REFERENCES users(id),
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_by UUID NOT NULL REFERENCES users(id),
  
  -- Indexes
  UNIQUE(store_id, name, deleted_at),
  INDEX idx_store_status (store_id, status),
  INDEX idx_created_at (created_at DESC),
  FULLTEXT idx_name_search (name)
);
```

### Bundle Products (Join Table for BOGO)

```sql
CREATE TABLE bundle_bogo_buy_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id UUID NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  
  quantity INTEGER NOT NULL,
  price_at_bundle_creation DECIMAL(10,2),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bundle_bogo_get_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id UUID NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  
  quantity INTEGER NOT NULL,
  price_at_bundle_creation DECIMAL(10,2),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Bundle Usage Analytics (Future)

```sql
CREATE TABLE bundle_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id UUID NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
  
  date DATE NOT NULL,
  views_count INTEGER DEFAULT 0,
  add_to_cart_count INTEGER DEFAULT 0,
  purchase_count INTEGER DEFAULT 0,
  total_revenue DECIMAL(10,2),
  
  UNIQUE(bundle_id, date)
);
```

---

## Denormalization Strategy

### Why Denormalize?

1. **Product Names & Prices**: Store at bundle creation time so displays don't break if products are deleted/renamed
2. **Calculations**: Pre-calculate final prices for fast display
3. **Bundle Type Data**: JSONB allows flexible structure for BOGO vs Product Bundle

### Refresh Strategy

- Denormalized data is **immutable** (product snapshots at bundle creation)
- If product price changes, it doesn't affect bundles (business decision: bundles lock in prices)
- Can recalculate/refresh via admin action if needed

---

## Validation Rules (Schema Level)

```typescript
// Product Count Validations
BOGO_MIN_BUY_PRODUCTS = 1;
BOGO_MIN_GET_PRODUCTS = 1;
BUNDLE_MIN_PRODUCTS = 2;

// Quantity Validations
MIN_QUANTITY = 1;
MAX_QUANTITY = 1000;

// Discount Validations
DISCOUNT_PERCENTAGE_MIN = 0;
DISCOUNT_PERCENTAGE_MAX = 100;
DISCOUNT_FIXED_AMOUNT_MIN = 0.01;

// Name Validation
BUNDLE_NAME_MIN_LENGTH = 3;
BUNDLE_NAME_MAX_LENGTH = 100;
BUNDLE_NAME_UNIQUE_PER_STORE = true;

// Schedule Validation
SCHEDULE_END_MUST_BE_AFTER_START = true;
SCHEDULE_CAN_BE_IN_PAST = true;
SCHEDULE_CAN_BE_IN_FUTURE = true;

// Per-Order Limit
PER_ORDER_LIMIT_MIN = 1;
PER_ORDER_LIMIT_MAX = 100;
```

---

## Field Constraints & Types

### Numeric Fields

| Field | Type | Range | Example |
|-------|------|-------|---------|
| Quantity | Integer | 1-1000 | 5 |
| Discount % | Integer | 0-100 | 50 |
| Discount $ | Decimal(10,2) | 0.01-999999.99 | 19.99 |
| Price | Decimal(10,2) | 0.01-999999.99 | 4.99 |
| Per-Order Limit | Integer | 1-100 | 3 |

### String Fields

| Field | Type | Max Length | Pattern |
|-------|------|-----------|---------|
| Name | VARCHAR | 100 | Any (no HTML) |
| Description | TEXT | 500 | Any (no HTML) |
| SKU | VARCHAR | 50 | Alphanumeric |

### Date Fields

| Field | Type | Constraints |
|-------|------|-------------|
| Start Date | DATE | Can be past/future |
| End Date | DATE | Must be ≥ Start Date |
| Created At | TIMESTAMP | Auto, immutable |
| Updated At | TIMESTAMP | Auto, updatable |

---

## Error Handling & Validation

### Validation Errors

```typescript
interface ValidationError {
  field: string;
  message: string;
  code: string; // 'REQUIRED' | 'INVALID_FORMAT' | 'DUPLICATE' | 'OUT_OF_RANGE'
  value?: any;
}

// Example Response
{
  "success": false,
  "error": {
    "type": "VALIDATION_ERROR",
    "errors": [
      {
        "field": "name",
        "code": "DUPLICATE",
        "message": "A bundle with this name already exists"
      },
      {
        "field": "scheduleEndDate",
        "code": "INVALID_DATE_RANGE",
        "message": "End date must be after start date"
      }
    ]
  }
}
```

### Conflict Scenarios

```typescript
// Same Product in Buy & Get
{
  "warning": "SAME_PRODUCT_IN_BUY_GET",
  "message": "You've selected the same product for both Buy and Get. This creates a self-fulfilling promotion.",
  "canProceed": true
}

// Bundle Price Higher Than Subtotal
{
  "warning": "PRICE_HIGHER_THAN_SUBTOTAL",
  "message": "Bundle price is higher than item sum. Customers pay more when buying together.",
  "canProceed": true
}

// Out of Stock
{
  "warning": "PRODUCT_OUT_OF_STOCK",
  "products": ["Coca Cola 2L"],
  "message": "One or more products are out of stock. Bundle will be inactive.",
  "canProceed": true
}
```

---

## Calculations & Formulas

### BOGO Pricing

```
Get Items Total = SUM(getProduct.price × getProduct.quantity)

If Discount Type = FREE:
  Discount Amount = Get Items Total
  
If Discount Type = PERCENTAGE:
  Discount Amount = Get Items Total × (discountValue / 100)
  
If Discount Type = FIXED_AMOUNT:
  Discount Amount = discountValue

Final Get Price = Get Items Total - Discount Amount
Bundle Price = Buy Items Total + Final Get Price
Customer Savings = Discount Amount
```

### Product Bundle Pricing

```
Subtotal = SUM(product.price × product.quantity × (1 - product.individualDiscount))

If Bundle Discount Type = NO_DISCOUNT:
  Final Price = Subtotal
  Savings = 0
  
If Bundle Discount Type = FIXED_PRICE:
  Final Price = bundleDiscount.fixedPrice
  Savings = Subtotal - fixedPrice
  
If Bundle Discount Type = PERCENTAGE_DISCOUNT:
  Discount Amount = Subtotal × (bundleDiscount.value / 100)
  Final Price = Subtotal - Discount Amount
  Savings = Discount Amount

Savings Percentage = (Savings / Subtotal) × 100
```

---

## Enum Values

```typescript
enum BundleType {
  BOGO = 'BOGO',
  BUNDLE = 'BUNDLE'
}

enum BundleStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED'
}

enum DiscountType {
  FREE = 'FREE',
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT'
}

enum BundlePricingType {
  NO_DISCOUNT = 'NO_DISCOUNT',
  FIXED_PRICE = 'FIXED_PRICE',
  PERCENTAGE_DISCOUNT = 'PERCENTAGE_DISCOUNT'
}

enum SortField {
  NAME = 'name',
  CREATED_AT = 'createdAt',
  DISCOUNT = 'discount',
  STATUS = 'status',
  TYPE = 'bundleType'
}

enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}
```

---

## State Management Pattern

### Frontend State (React Context)

```typescript
interface BundleFormState {
  // Current step in creation flow
  currentStep: number;
  
  // Form data
  formData: CreateBundleRequest;
  
  // Validation
  errors: Record<string, string>;
  isValid: boolean;
  touchedFields: Set<string>;
  
  // Loading
  isLoading: boolean;
  isSaving: boolean;
  
  // Results
  savedBundle?: BundleResponse;
  error?: string;
}

interface BundleListState {
  // Data
  bundles: BundleResponse[];
  totalCount: number;
  
  // Pagination
  currentPage: number;
  pageSize: number;
  
  // Filters
  activeFilters: ListBundlesRequest['filters'];
  
  // Sort
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
  
  // Loading
  isLoading: boolean;
  error?: string;
}
```

---

## Related Documents
- [Bundle Listing Page](01-BUNDLE-LISTING-PAGE.md)
- [BOGO Creation Flow](02-BOGO-CREATION-FLOW.md)
- [Product Bundle Flow](03-PRODUCT-BUNDLE-FLOW.md)
- [Component Breakdown](05-COMPONENT-BREAKDOWN.md)
- [Edge Cases & Validation](07-EDGE-CASES.md)
