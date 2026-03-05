# Edge Cases & Validation Rules

## Overview
This document details all edge cases, validation rules, boundary conditions, and error scenarios for the product bundling feature.

---

## Validation Rules

### Global Validations

#### Bundle Name
```
✓ Rule: Required, non-empty
✓ Rule: 3-100 characters
✓ Rule: Unique per store (check against DB)
✓ Rule: No HTML/JavaScript allowed
✓ Rule: Trim whitespace

Example Valid: "Buy 2 Get 1 Free Soda Bundle"
Example Invalid: "" (empty)
Example Invalid: "AB" (too short)
Example Invalid: "Buy 2 Get 1 Free Soda Bundle" (if already exists)
Example Invalid: "<script>alert('xss')</script>" (HTML)
```

#### Description
```
✓ Rule: Optional
✓ Rule: Max 500 characters
✓ Rule: No HTML/JavaScript

Example Valid: "Great summer bundle with variety of sodas"
Example Invalid: "<b>Bold</b> description" (HTML)
```

#### Bundle Type
```
✓ Rule: Required
✓ Rule: Must be one of: BOGO, BUNDLE
✓ Rule: Cannot change after creation (immutable)

Example Valid: "BOGO"
Example Invalid: "COMBO" (invalid type)
```

#### Active Status
```
✓ Rule: Boolean (true/false)
✓ Rule: Default: true (active)
✓ Rule: Can change anytime

Note: Inactive bundles don't appear to customers
```

---

## BOGO-Specific Validations

### Buy Section

#### Buy Products
```
✓ Rule: Required
✓ Rule: At least 1 product
✓ Rule: Max 10 products (business rule)
✓ Rule: Cannot have duplicates (cannot add same product twice)
✓ Rule: Product must exist (check DB)
✓ Rule: Product cannot be deleted (or mark bundle inactive)

Example Valid: [ProductId_1, ProductId_2]
Example Invalid: [] (no products)
Example Invalid: [ProductId_1, ProductId_1] (duplicate)
Example Invalid: [ProductId_999999] (doesn't exist)
```

#### Buy Quantity (X)
```
✓ Rule: Required
✓ Rule: Integer >= 1
✓ Rule: Integer <= 1000
✓ Rule: Must be positive integer

Example Valid: 2
Example Invalid: 0 (too low)
Example Invalid: 1.5 (not integer)
Example Invalid: -1 (negative)
Example Invalid: 2000 (too high)
```

### Get Section

#### Get Products
```
✓ Rule: Required
✓ Rule: At least 1 product
✓ Rule: Max 10 products
✓ Rule: Cannot have duplicates
✓ Rule: Product must exist (check DB)
✓ Rule: Cannot be same product as Buy Section (can warn, not error)
✓ Rule: Should be different from Buy for typical BOGO

Example Valid: [ProductId_3, ProductId_4]
Example Invalid: [] (no products)
Example Invalid: [ProductId_1] (same as Buy Section - WARN)
```

#### Get Quantity (Y)
```
✓ Rule: Required
✓ Rule: Integer >= 1
✓ Rule: Integer <= 1000
✓ Rule: Must be positive integer

Example Valid: 1
Example Invalid: 0 (too low)
```

### Discount Configuration (BOGO)

#### Discount Type
```
✓ Rule: Required
✓ Rule: One of: FREE, PERCENTAGE, FIXED_AMOUNT
✓ Rule: Default: FREE

Example Valid: "FREE"
Example Valid: "PERCENTAGE"
Example Valid: "FIXED_AMOUNT"
```

#### Discount Percentage
```
✓ Rule: Required if discount type = PERCENTAGE
✓ Rule: Integer 0-100
✓ Rule: Cannot be 0 (use FREE type instead)
✓ Rule: Cannot exceed 100

Example Valid: 50
Example Invalid: 101 (exceeds 100%)
Example Invalid: -10 (negative)
Example Invalid: "" (empty if PERCENTAGE selected)
Example Invalid: 0 (use FREE instead)
```

#### Discount Fixed Amount
```
✓ Rule: Required if discount type = FIXED_AMOUNT
✓ Rule: Decimal >= 0.01
✓ Rule: Should not exceed typical product price (warn)
✓ Rule: Cannot be zero

Example Valid: 5.99
Example Invalid: 0 (must be > 0)
Example Invalid: -5 (negative)
Example Invalid: "" (empty if FIXED_AMOUNT selected)
```

#### Per-Order Limit
```
✓ Rule: Optional
✓ Rule: If enabled, must be integer 1-100
✓ Rule: Typical values: 1-5

Example Valid: 1 (only once per order)
Example Valid: 3 (up to 3 times per order)
Example Invalid: 0 (minimum 1)
Example Invalid: 500 (typically unrealistic)
Example Invalid: Not checking without enable
```

### BOGO Schedule

#### Start Date
```
✓ Rule: Optional
✓ Rule: Must be valid date
✓ Rule: Can be in past or future
✓ Rule: Cannot be after End Date

Example Valid: "2026-03-05"
Example Valid: "2026-01-01" (past)
Example Invalid: "2026-04-05" (after end date)
Example Invalid: "invalid-date"
```

#### End Date
```
✓ Rule: Optional
✓ Rule: Must be valid date
✓ Rule: Must be >= Start Date (if both provided)
✓ Rule: If schedule enabled, End Date required

Example Valid: "2026-03-31"
Example Invalid: "2026-03-01" (before start date 2026-03-05)
Example Invalid: "" (empty if schedule enabled)
```

---

## Product Bundle-Specific Validations

### Bundle Products

#### Products Count
```
✓ Rule: Minimum 2 products
✓ Rule: Maximum 50 products per bundle
✓ Rule: Cannot add same product twice

Example Valid: [ProductId_1, ProductId_2]
Example Invalid: [ProductId_1] (only 1 product)
Example Invalid: [ProductId_1, ProductId_1] (duplicate)
```

#### Product Quantity
```
✓ Rule: Required per product
✓ Rule: Integer >= 1
✓ Rule: Integer <= 1000

Example Valid: 5
Example Invalid: 0 (too low)
```

#### Individual Product Discount
```
✓ Rule: Optional per product
✓ Rule: If enabled, must specify type and value
✓ Rule: Same types as BOGO discount

Types:
  - PERCENTAGE: 0-100, cannot be 0
  - FIXED_AMOUNT: >= 0.01
  
Example Valid: { type: "PERCENTAGE", value: 20 }
Example Invalid: { type: "PERCENTAGE", value: 101 }
Example Invalid: { type: "FIXED_AMOUNT", value: 0 }
```

### Bundle Pricing

#### Bundle Discount Type
```
✓ Rule: Required
✓ Rule: One of: NO_DISCOUNT, FIXED_PRICE, PERCENTAGE_DISCOUNT
✓ Rule: Default: NO_DISCOUNT

Example Valid: "NO_DISCOUNT"
Example Valid: "FIXED_PRICE"
Example Valid: "PERCENTAGE_DISCOUNT"
```

#### Bundle Fixed Price
```
✓ Rule: Required if bundle discount type = FIXED_PRICE
✓ Rule: Decimal > 0
✓ Rule: Typically < Subtotal (warn if not)
✓ Rule: Cannot be negative

Example Valid: 14.99
Example Invalid: 0 (must be > 0)
Example Invalid: -10 (negative)
Example Invalid: 29.99 (warn if > subtotal of 16.56)
```

#### Bundle Percentage Discount
```
✓ Rule: Required if bundle discount type = PERCENTAGE_DISCOUNT
✓ Rule: Integer 0-100
✓ Rule: Cannot be 0 (use NO_DISCOUNT instead)

Example Valid: 10
Example Invalid: 101 (exceeds 100%)
Example Invalid: 0 (use NO_DISCOUNT)
Example Invalid: -5 (negative)
```

### Bundle Schedule
```
Same validation as BOGO section (optional, start/end dates)
```

---

## Cross-Field Validations

### BOGO Cross-Field Rules

#### Same Product in Buy & Get
```
Scenario: User selects same product in both Buy and Get sections
Detection: productId appears in both arrays
Behavior: 
  - Allow (not an error, valid use case)
  - Show WARNING dialog to user
  - Message: "You've selected [Product Name] for both Buy and Get. 
    This means customer buys some to get more free. 
    Is this what you intended?"
  - User can proceed or cancel

Example: Buy 2 Sprite → Get 1 Sprite Free (VALID but should warn)
```

#### Conflicting Schedule
```
Scenario: End Date is before Start Date
Detection: End Date < Start Date
Behavior: 
  - SHOW ERROR
  - Prevent form submission
  - Message: "End date cannot be before start date"

Example: Start: 2026-04-05, End: 2026-03-01 (INVALID)
```

#### Product Out of Stock
```
Scenario: Selected product is currently out of stock
Detection: Product.stock = 0 at submission time
Behavior:
  - Allow creation (not a blocker)
  - Show WARNING
  - Mark bundle as INACTIVE on save
  - Message: "Product [X] is currently out of stock. 
    Bundle will be inactive until stock is replenished."
```

### Product Bundle Cross-Field Rules

#### Final Price Validation
```
Scenario: Calculated final price <= 0
Detection: Final Price = 0 or negative after discounts
Behavior:
  - SHOW ERROR
  - Prevent form submission
  - Message: "Final bundle price cannot be $0. Adjust discounts."

Example: Subtotal: $10, Discount: 150% = -$5 (INVALID)
```

#### Bundle Price Higher Than Subtotal
```
Scenario: Fixed bundle price > subtotal (customer pays MORE)
Detection: Fixed Price > (Subtotal after individual discounts)
Behavior:
  - Allow but WARN user
  - Message: "Bundle price ($20) is higher than item subtotal ($18).
    Customers would pay more buying together. Continue?"
  - User choice: Cancel or Proceed

Example: Subtotal: $18, Fixed Price: $20 (ALLOWED with warning)
```

#### No Real Discount
```
Scenario: Bundle discount is 0% or fixed price = subtotal
Detection: 
  - Percentage discount = 0%
  - Fixed price = subtotal (within 0.01 tolerance)
Behavior:
  - Use NO_DISCOUNT type instead
  - Message: "You've set no actual discount. 
    Consider using 'No Discount' option instead."
  - Allow to proceed

Example: Subtotal $16.56, Fixed Price $16.56 (WARN)
```

#### Duplicate Product Names
```
Scenario: Bundle already has same product selected
Detection: Product with same SKU already in products array
Behavior:
  - SHOW ERROR when trying to add
  - Message: "Product '[Product Name]' is already in this bundle"

Example: Adding Coca Cola 2L twice (INVALID)
```

#### Minimum Products Requirement
```
Scenario: Product Bundle with only 1 product
Detection: ProductBundleData.products.length < 2
Behavior:
  - Show WARNING during step 2
  - Message: "Bundle should contain at least 2 complementary products"
  - Allow to proceed (edge case: maybe bundle is product + service)

Note: BOGO is not subject to this (can be 1 buy + 1 get)
```

---

## Boundary Conditions

### Numeric Boundaries

| Field | Min | Max | Boundary Test Cases |
|-------|-----|-----|---------------------|
| Quantity | 1 | 1000 | 0, 1, 1000, 1001, -1 |
| Discount % | 1 | 100 | 0, 1, 50, 100, 101 |
| Discount $ | 0.01 | 999999.99 | 0, 0.01, 100, 999999.99, 1000000 |
| Per-Order Limit | 1 | 100 | 0, 1, 50, 100, 101 |
| Bundle Name | 3 | 100 | 2, 3, 100, 101 chars |
| Description | 0 | 500 | 0, 500, 501 chars |
| Products | 1 (BOGO) / 2 (Bundle) | 50 | 1, 2, 50, 51 |

### Decimal Precision

```
Prices: 2 decimal places (cents)
  Valid: 19.99, 0.01, 100.00
  Invalid: 19.999, 0.001
  
Rounding: Use ROUND_HALF_UP (banker's rounding)
  Subtotal: 19.995 → 20.00
  Discount: 10.005 → 10.01
```

### Date Boundaries

```
Past Dates: ALLOWED (for historical bundles)
  Valid: 2020-01-01 (past)
  
Future Dates: ALLOWED
  Valid: 2030-12-31 (future)
  
Same Day: ALLOWED
  Valid: Start: 2026-03-05, End: 2026-03-05
  
Timezone: Use UTC internally, display in user's timezone
```

---

## Error Scenarios & Recovery

### Bundle Creation Errors

#### 1. Duplicate Name Error
```
HTTP 409 Conflict
{
  "error": {
    "type": "DUPLICATE_BUNDLE_NAME",
    "message": "A bundle with this name already exists",
    "field": "name",
    "suggestedName": "Buy 2 Get 1 Free Soda Bundle (1)"
  }
}

User Recovery:
- Show error message
- Highlight name field
- Optional: suggest alternative name
- User edits name and retries
```

#### 2. Product Not Found Error
```
HTTP 404 Not Found
{
  "error": {
    "type": "PRODUCT_NOT_FOUND",
    "message": "Product ID not found",
    "productId": "prod_123"
  }
}

User Recovery:
- Go back to Step 2
- Product may have been deleted
- User must re-select different products
- Show list of available products
```

#### 3. Invalid Discount Value
```
HTTP 400 Bad Request
{
  "error": {
    "type": "VALIDATION_ERROR",
    "errors": [
      {
        "field": "discountPercentage",
        "message": "Discount percentage must be between 0 and 100",
        "value": 150
      }
    ]
  }
}

User Recovery:
- Return to Step 3
- Show field error
- Clear invalid value
- User re-enters valid value
```

#### 4. Stock Unavailable Warning
```
HTTP 201 Created with Warning Header
{
  "data": { bundle },
  "warnings": [
    {
      "type": "PRODUCT_OUT_OF_STOCK",
      "productName": "Coca Cola 2L",
      "action": "BUNDLE_INACTIVE"
    }
  ]
}

User Recovery:
- Bundle is created but INACTIVE
- Show warning message
- Option to activate later when stock available
- Show "View Bundle" link
```

#### 5. Concurrent Edit Conflict
```
HTTP 409 Conflict (during edit)
{
  "error": {
    "type": "CONCURRENT_EDIT",
    "message": "This bundle was modified by another user",
    "lastModifiedBy": "user@example.com",
    "lastModifiedAt": "2026-03-05T10:30:00Z"
  }
}

User Recovery:
- Reload bundle data
- Show conflict dialog
- Options: 
  - View latest version
  - Merge changes
  - Overwrite (not recommended)
```

---

## State Transition Validations

### Valid Status Transitions

```
ACTIVE → INACTIVE (user toggles off)
ACTIVE → ARCHIVED (user archives)
INACTIVE → ACTIVE (user toggles on)
INACTIVE → ARCHIVED (user archives)
ARCHIVED → ACTIVE (user unarchives)
ARCHIVED → INACTIVE (user unarchives as inactive)

Invalid: ARCHIVED → ARCHIVED (no-op, show message)
```

### Bundle Activation Constraints

```
Cannot Activate (INACTIVE → ACTIVE) if:
  - Start date is in future → WARN but allow (will be active at start date)
  - End date has passed → ERROR (schedule expired)
  - All products are out of stock → WARN but allow (will show as unavailable)
  - Bundle price is invalid → ERROR
```

### Schedule Status

```
Active + Schedule Active = SCHEDULED (shown as special status)
Active + Schedule Inactive = ACTIVE
Inactive + Schedule Active = INACTIVE_SCHEDULED
```

---

## Concurrency & Race Conditions

### Scenario: Two Admins Edit Same Bundle

```
Admin A: Opens bundle for edit
Admin B: Opens bundle for edit
Admin B: Saves changes at 10:30
Admin A: Tries to save changes at 10:35

Detection: Check updated_at timestamp
Behavior: Show conflict dialog to Admin A
  - "Bundle was modified at 10:30 by Admin B"
  - Options:
    - Reload and start over
    - View Admin B's changes
    - Force save (overwrite)
```

### Scenario: Product Deleted While In Bundle

```
Product: "Coca Cola 2L" (in active bundle)
Admin: Deletes product from catalog
Bundle: Now references non-existent product

Detection: On bundle load/edit
Behavior: 
  - Show warning: "Product no longer available"
  - Bundle becomes INACTIVE automatically
  - User can remove product from bundle
  - Or archive/delete bundle
```

---

## Input Sanitization

### XSS Prevention

```
All text inputs sanitized:
- Remove HTML tags
- Remove JavaScript
- Escape special characters

Example:
Input: "<img src=x onerror='alert(1)'>"
Stored: "&lt;img src=x onerror='alert(1)'&gt;"
Displayed: Literal text, not executed
```

### SQL Injection Prevention

```
Use parameterized queries for all DB operations
No raw SQL string concatenation

Example SAFE:
  db.query('SELECT * FROM bundles WHERE id = ?', [bundleId])
  
Example UNSAFE:
  db.query(`SELECT * FROM bundles WHERE id = '${bundleId}'`)
```

---

## Performance Validations

### Large Data Sets

```
Product Selection with 10,000+ products:
- Implement virtual scrolling (show 50 at a time)
- Search/filter server-side
- Pagination to 200 max results shown

Bundle List with 100,000+ bundles:
- Pagination: default 10, max 100 per page
- Server-side sorting
- Search indexed on name
```

### Timeout Handling

```
API calls > 30 seconds: Show timeout error
Recommend user to:
- Check internet connection
- Try again
- Contact support if persists
```

---

## Audit & Compliance

### What's Audited

```
✓ Bundle creation (who, when, data)
✓ Bundle updates (what changed, who, when)
✓ Bundle deletion (who, when, reason)
✓ Status changes (active/inactive/archived)
✓ Failed operations (validation errors)
```

### Audit Entry

```
{
  "id": "audit_123",
  "bundleId": "bundle_456",
  "action": "CREATE" | "UPDATE" | "DELETE" | "ACTIVATE" | "ARCHIVE",
  "userId": "user_789",
  "timestamp": "2026-03-05T10:30:00Z",
  "changes": {
    "before": { ... },
    "after": { ... }
  },
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}
```

---

## Related Documents
- [Data Model & Schema](06-DATA-MODEL.md)
- [BOGO Creation Flow](02-BOGO-CREATION-FLOW.md)
- [Product Bundle Flow](03-PRODUCT-BUNDLE-FLOW.md)
