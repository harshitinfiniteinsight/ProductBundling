# Product Bundle - Creation Flow

## Overview
Product Bundle (or "Grouping complementary products") allows merchants to group multiple products together and sell them as a single package with optional discounts. Unlike BOGO, this type bundles various products without a "buy X get Y" condition.

## User Flow Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                    START: Create Bundle                              │
└──────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│ STEP 1: Bundle Basics                                                │
│ ┌─ Bundle Name (text field)                                          │
│ ├─ Bundle Type Selector (BOGO / Product Bundle) ◄─ Select Bundle    │
│ ├─ Description (textarea)                                            │
│ └─ Active Status Toggle                                              │
└──────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│ STEP 2B: Add Products to Bundle (Conditional)                        │
│ ┌─ Product Selector (modal/dropdown)                                 │
│ ├─ Inline Editable Table/Rows                                        │
│ │  ├─ Product Name | Quantity | Individual Discount | Actions       │
│ │  └─ [+ Add Product]                                                │
│ └─ Remove, Edit Quantity, Add/Edit Discount per product              │
└──────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│ STEP 3: Bundle Discount Options                                      │
│ ┌─ No Discount (sell at sum of product prices)                      │
│ ├─ Bundle Price (fixed price for entire bundle)                      │
│ ├─ % Discount on Bundle (all products get % off)                     │
│ └─ Optional: Schedule (start date / end date)                        │
└──────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│ STEP 4: Pricing & Savings Preview                                    │
│ ┌─ Product breakdown with prices                                     │
│ ├─ Bundle discount applied visualization                             │
│ ├─ Total bundle price                                                │
│ ├─ Customer savings calculation                                      │
│ └─ Customer-facing bundle preview card                               │
└──────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│ STEP 5: Confirmation & Save                                          │
│ ┌─ Final Review (all products and pricing)                           │
│ ├─ Error Validation (if any)                                         │
│ └─ [Back] [Save Bundle]                                              │
└──────────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
          ✓ Success Toast         ✗ Validation Errors
          Return to List          Show Field Errors
```

---

## Detailed Step Specifications

### STEP 1: Bundle Basics

**Same as BOGO - See BOGO Flow Document**

**Key Difference:** Select "Product Bundle" instead of "BOGO"

---

### STEP 2B: Add Products to Bundle

**Purpose:** Select and manage products that will be included in this bundle

**Layout:**
```
┌────────────────────────────────────────────────────────────┐
│ Step 2 of 5: Add Products to Bundle                        │
├────────────────────────────────────────────────────────────┤
│                                                             │
│ Add products to this bundle:                               │
│                                                             │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ [+ Add Product]  [Search products...]              ▼ │  │
│ └──────────────────────────────────────────────────────┘  │
│                                                             │
│ Bundle Contents:                                            │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ Product        │ Qty │ Price   │ Discount │ Subtotal │  │
│ ├────────────────────────────────────────────────────────┤ │
│ │ Coca Cola 2L   │ 2   │ $4.99   │ None     │ $9.98    │  │
│ │ [edit][delete]                                         │  │
│ ├────────────────────────────────────────────────────────┤ │
│ │ Sprite 2L      │ 1   │ $3.99   │ 10% off  │ $3.59    │  │
│ │ [edit][delete]                                         │  │
│ ├────────────────────────────────────────────────────────┤ │
│ │ Fanta Orange   │ 1   │ $2.99   │ None     │ $2.99    │  │
│ │ [edit][delete]                                         │  │
│ └────────────────────────────────────────────────────────┘ │
│                                                             │
│ [+ Add Another Product]                                    │
│                                                             │
│ Subtotal: $16.56                                            │
│                                                             │
│ [Back]                                        [Next Step] ►│
└────────────────────────────────────────────────────────────┘
```

#### Product Selection Modal/Dropdown

**UX Pattern:**
```
┌─────────────────────────────────────┐
│ Add Product to Bundle               │
├─────────────────────────────────────┤
│ Search products...                  │
├─────────────────────────────────────┤
│ [ ] Coca Cola 2L                    │
│     SKU: CC-2L | Stock: 150         │
│     Current Price: $4.99            │
├─────────────────────────────────────┤
│ [ ] Coca Cola 6-Pack                │
│     SKU: CC-6P | Stock: 89          │
│     Current Price: $12.99           │
├─────────────────────────────────────┤
│ [ ] Sprite 2L                       │
│     SKU: SP-2L | Stock: 200         │
│     Current Price: $3.99            │
├─────────────────────────────────────┤
│ [Cancel]                    [Select]│
└─────────────────────────────────────┘
```

**After Selection:**
```
Enter quantity for Coca Cola 2L:
Quantity: [2]
(Available: 150 units)

[Cancel] [Add to Bundle]
```

#### Inline Edit Row

**Click [edit] on a product:**
```
┌────────────────────────────────────────────────────────┐
│ Editing: Coca Cola 2L                              [✕] │
├────────────────────────────────────────────────────────┤
│ Quantity: [2]                                          │
│ Individual Discount:                                   │
│ ○ No Discount (sell at: $4.99 each)                   │
│ ○ % Discount: [____]% off list price                 │
│ ○ Fixed Amount: $[____] off list price               │
│                                                        │
│ Preview: $4.99 × 2 = $9.98                           │
│                                                        │
│ [Cancel] [Save Changes]                               │
└────────────────────────────────────────────────────────┘
```

**Fields:**

| Field | Type | Validation | Required | Help Text |
|-------|------|-----------|----------|-----------|
| Product | Dropdown/Modal | Must select product | Yes | Search by name/SKU |
| Quantity | Integer | 1-1000 | Yes | Qty in this bundle |
| Individual Discount Type | Radio | One option | No | Discount on this item |
| Individual Discount % | Integer | 0-100 | If % selected | Percentage off |
| Individual Discount Amount | Currency | ≥ 0 | If fixed selected | Dollar amount off |

**Validation Rules:**
- Minimum 2 products in bundle (warn if only 1)
- Cannot add same product twice (error)
- Quantity must be ≥ 1
- Individual discounts: 0-100% or positive currency
- Total bundle price must be > 0 after all discounts

---

### STEP 3: Bundle Discount Options

**Purpose:** Apply optional discount to the entire bundle

**Layout:**
```
┌────────────────────────────────────────────────────────┐
│ Step 3 of 5: Bundle Discount Options                   │
├────────────────────────────────────────────────────────┤
│                                                         │
│ Current Bundle Subtotal: $16.56                        │
│ (Includes all individual product discounts)            │
│                                                         │
│ How to price this bundle?                              │
│                                                         │
│ ○ No Additional Discount (sell at: $16.56)            │
│                                                         │
│ ○ Set Bundle Price (Fixed Price)                      │
│   Bundle Price: $[____]                               │
│   Help: Final price customer pays for entire bundle   │
│   (Individual discounts are applied first)            │
│                                                         │
│ ○ % Discount on Bundle                                │
│   Discount: [____]%                                   │
│   Help: Apply percentage to subtotal                  │
│   (Applied after individual product discounts)       │
│                                                         │
│ ─────────────────────────────────────────────────────  │
│                                                         │
│ Optional: Time-Limited Offer                           │
│ ☐ Schedule this bundle for specific dates             │
│   If checked:                                          │
│   Start Date: [2026-03-05]                            │
│   End Date:   [2026-03-31]                            │
│                                                         │
│ Preview Pricing:                                       │
│ ┌─────────────────────────────────────┐              │
│ │ Coca Cola 2L (2x) .......... $9.98 │              │
│ │ Sprite 2L (1x, -10%) ........ $3.59 │              │
│ │ Fanta Orange (1x) ........... $2.99 │              │
│ │                                     │              │
│ │ Subtotal .................... $16.56 │              │
│ │ Bundle Discount (10%) ....... -$1.66 │              │
│ │ ─────────────────────────────────── │              │
│ │ BUNDLE PRICE ................ $14.90 │              │
│ │ You Save: $1.66 (10%)                │              │
│ └─────────────────────────────────────┘              │
│                                                         │
│ [Back]                                  [Next Step] ►  │
└────────────────────────────────────────────────────────┘
```

**Fields:**

| Field | Type | Validation | Required | Help Text |
|-------|------|-----------|----------|-----------|
| Bundle Discount Type | Radio Group | One selection | Yes | No discount / Fixed / % |
| Bundle Price | Currency | > 0 and < subtotal | If fixed selected | Final price |
| Bundle Discount % | Integer | 0-100 | If % selected | Percentage value |
| Schedule Start | Date | Valid date | If scheduled | Begin date |
| Schedule End | Date | ≥ Start date | If scheduled | End date |

**Validation Rules:**
- If "Fixed Price" selected: Must be > 0 and typically < subtotal
- If "% Discount" selected: 0-100 range
- Schedule: End ≥ Start
- Final bundle price must be positive

**Real-Time Calculation:**
```
Subtotal (with individual discounts) = SUM(product price × qty × (1 - individual discount))

If Fixed Price:
  Final Price = Fixed Price
  Savings = Subtotal - Fixed Price

If % Discount:
  Discount Amount = Subtotal × (% / 100)
  Final Price = Subtotal - Discount Amount
  Savings = Discount Amount
```

---

### STEP 4: Pricing & Savings Preview

**Purpose:** Show detailed breakdown and customer-facing preview

**Layout:**
```
┌────────────────────────────────────────────────────────┐
│ Step 4 of 5: Pricing & Savings Preview                 │
├────────────────────────────────────────────────────────┤
│                                                         │
│ DETAILED BREAKDOWN                                      │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Product          Qty  Price  Discount  Subtotal  │ │
│ ├────────────────────────────────────────────────────┤ │
│ │ Coca Cola 2L     2  $4.99   None      $9.98     │ │
│ │ Sprite 2L        1  $3.99   -10%      $3.59     │ │
│ │ Fanta Orange     1  $2.99   None      $2.99     │ │
│ └────────────────────────────────────────────────────┘ │
│                                                         │
│ PRICING CALCULATION                                     │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Subtotal (items)............ $16.56              │ │
│ │ Bundle Discount (10%)....... -$1.66              │ │
│ │ ─────────────────────────────────────────        │ │
│ │ FINAL BUNDLE PRICE.......... $14.90              │ │
│ │                                                   │ │
│ │ Customer Savings: $1.66 (10%)                    │ │
│ └────────────────────────────────────────────────────┘ │
│                                                         │
│ CUSTOMER-FACING PREVIEW                                │
│ ┌────────────────────────────────────────────────────┐ │
│ │ 🎁 Refreshing Beverage Bundle                     │ │
│ │                                                   │ │
│ │ What's Included:                                 │ │
│ │ • Coca Cola 2L (qty: 2) ............ $9.98       │ │
│ │ • Sprite 2L (qty: 1) ............... $3.99       │ │
│ │ • Fanta Orange (qty: 1) ............ $2.99       │ │
│ │                                                   │ │
│ │ Regular Price: $16.56                            │ │
│ │ Bundle Price: $14.90                             │ │
│ │ 💰 Save $1.66 (10%)                              │ │
│ │                                                   │ │
│ │ [Add to Cart]                                    │ │
│ └────────────────────────────────────────────────────┘ │
│                                                         │
│ OFFER TERMS                                             │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Valid From: March 5, 2026                        │ │
│ │ Valid Until: March 31, 2026                      │ │
│ │ Status: Active                                    │ │
│ └────────────────────────────────────────────────────┘ │
│                                                         │
│ [Back]                                  [Next Step] ►  │
└────────────────────────────────────────────────────────┘
```

**Sections:**
1. **Detailed Breakdown** - Line-by-line product breakdown with discounts
2. **Pricing Calculation** - Step-by-step math showing how final price is calculated
3. **Savings Display** - Total savings amount and percentage
4. **Customer Preview** - Storefront card showing how bundle appears to customers
5. **Offer Terms** - Schedule and status info

---

### STEP 5: Confirmation & Save

**Layout:**
```
┌────────────────────────────────────────────────────────┐
│ Step 5 of 5: Confirmation                              │
├────────────────────────────────────────────────────────┤
│                                                         │
│ ✓ All validations passed                               │
│                                                         │
│ Ready to create bundle:                                │
│ "Refreshing Beverage Bundle"                           │
│                                                         │
│ Summary:                                               │
│ • Type: Product Bundle                                 │
│ • Products: 3 items                                    │
│   - Coca Cola 2L (2x)                                 │
│   - Sprite 2L (1x)                                    │
│   - Fanta Orange (1x)                                │
│ • Bundle Price: $14.90 (10% off)                       │
│ • Discount Type: % Discount on Bundle                 │
│ • Valid: March 5 - March 31, 2026                     │
│ • Active: Yes                                          │
│                                                         │
│ ────────────────────────────────────────────────────  │
│                                                         │
│ Actions:                                               │
│ [Back]                                  [✓ Save Bundle]│
│                                                         │
│ After saving, you'll return to the bundle list.        │
│                                                         │
└────────────────────────────────────────────────────────┘
```

**Save Validation:**
- All required fields present ✓
- At least 2 products selected ✓
- Final price > 0 ✓
- No duplicate bundle names ✓
- All products exist ✓

**On Save:**
1. Show loading spinner
2. Submit to backend API with bundle and product data
3. Show success toast: "Bundle created successfully!"
4. Redirect to bundle listing page
5. Highlight newly created bundle

**On Error:**
- Show error toast with specific message
- Preserve entered data
- Option to go back to specific step

---

## Conditional Flows

### If Less Than 2 Products Selected
```
⚠️ Validation Warning
"Please add at least 2 products to this bundle.
A bundle should contain multiple complementary items.

Current: 1 product selected
[Add Product]"
```

### If Final Price <= 0
```
❌ Invalid Pricing
"The final bundle price cannot be $0 or negative.

Current calculation:
Subtotal: $10.00
Discount: -$15.00 (too high!)

Please adjust your discount settings.
[Back to Discount Options]"
```

### If Bundle Price Higher Than Subtotal (No Savings)
```
⚠️ No Discount Warning
"Your bundle price ($20.00) is higher than 
the subtotal ($18.00). Customers would pay MORE 
than buying items individually.

This is allowed but unusual. Continue anyway?
[Cancel] [Continue with higher price]"
```

### If Duplicate Product Detection
```
❌ Duplicate Product
"You've already added 'Coca Cola 2L' to this bundle.
Duplicate products are not allowed.

[Use existing entry] [Cancel]"
```

---

## Key Differences from BOGO Flow

| Aspect | BOGO | Product Bundle |
|--------|------|-----------------|
| Product Selection | Buy (X qty) + Get (Y qty) | Multiple products, each with qty |
| Conditional Requirements | Specific "buy" condition | Just grouped products |
| Discount Model | Single discount type | Individual + bundle discounts |
| Min Products | 1 buy + 1 get = 2 total | Minimum 2 different products |
| Step 2 Structure | Separate buy/get sections | Inline table/rows for all products |
| Discount Location | On "get" items only | On bundle overall or per-item |

---

## Related Pages & Flows
- [Bundle Listing Page](01-BUNDLE-LISTING-PAGE.md)
- [BOGO Creation Flow](02-BOGO-CREATION-FLOW.md)
- [Component Breakdown](05-COMPONENT-BREAKDOWN.md)
- [Data Model & Schema](06-DATA-MODEL.md)
