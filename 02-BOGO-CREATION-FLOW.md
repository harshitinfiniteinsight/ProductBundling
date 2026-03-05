# BOGO (Buy X Get Y Free) - Creation Flow

## Overview
BOGO (Buy One Get One / Buy X Get Y) allows merchants to create promotions where customers buy specified product(s) in certain quantity and receive free or discounted products.

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
│ ├─ Bundle Type Selector (BOGO / Product Bundle)  ◄─ Select BOGO     │
│ ├─ Description (textarea)                                            │
│ └─ Active Status Toggle                                              │
└──────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│ STEP 2A: BOGO Terms (Conditional - Shows only if BOGO selected)     │
│ ┌─ Buy Product(s) Selector                                           │
│ ├─ Buy Quantity (X) - Numeric input                                  │
│ ├─ Get Product(s) Selector                                           │
│ ├─ Get Quantity (Y) - Numeric input                                  │
│ └─ Optional: Per-Order Limit (numeric input)                         │
└──────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│ STEP 3: Discount Configuration                                       │
│ ┌─ Discount Type Selector:                                           │
│ │  ├─ ○ Free (default for BOGO)                                      │
│ │  ├─ ○ % Discount (field: discount %)                               │
│ │  └─ ○ Fixed Amount (field: discount $)                             │
│ ├─ Optional: Limit Per Order (checkbox + quantity field)             │
│ └─ Optional: Schedule (toggle + start/end date pickers)              │
└──────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│ STEP 4: Preview                                                      │
│ ┌─ Products Included (visual cards)                                  │
│ ├─ BOGO Terms (human readable)                                       │
│ ├─ Discount Applied (human readable)                                 │
│ ├─ Example Calculation (optional)                                    │
│ └─ Customer-Facing Preview                                           │
└──────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│ STEP 5: Confirmation & Save                                          │
│ ┌─ Final Review (summary of all fields)                              │
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

**Purpose:** Collect basic information and determine bundle type

**Layout:**
```
┌────────────────────────────────────────────────────────────┐
│ Step 1 of 5: Bundle Basics                                 │
├────────────────────────────────────────────────────────────┤
│                                                             │
│ Bundle Name                                                │
│ ┌─────────────────────────────────────────────────────┐   │
│ │ e.g., "Buy 2 Get 1 Free on Sodas"                  │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                             │
│ Bundle Type                                                │
│ ○ BOGO (Buy X Get Y)    ◄ Selected for this flow          │
│ ○ Product Bundle (Grouped Products)                       │
│                                                             │
│ Description (Optional)                                     │
│ ┌─────────────────────────────────────────────────────┐   │
│ │ Add a brief description for internal use...        │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                             │
│ Active Status                                              │
│ ☑ This bundle is active                [Toggle: ON]       │
│ (Bundle will be visible to customers once created)        │
│                                                             │
│                                                             │
│ [Back]                                        [Next Step] ►│
└────────────────────────────────────────────────────────────┘
```

**Fields:**

| Field | Type | Validation | Required | Help Text |
|-------|------|-----------|----------|-----------|
| Bundle Name | Text (max 100) | Non-empty, unique | Yes | Internal bundle name |
| Bundle Type | Radio Group | Must select BOGO | Yes | Determines flow path |
| Description | Textarea (max 500) | Optional | No | For admin reference |
| Active Status | Toggle | Boolean | No | Default: ON |

**Validation Rules:**
- Bundle Name: Required, 3-100 characters, unique
- Bundle Type: Must select one option
- Cannot proceed without name and type

---

### STEP 2A: BOGO Terms (Buy X Get Y Configuration)

**Purpose:** Define what customers must buy and what they receive

**Layout:**
```
┌────────────────────────────────────────────────────────────┐
│ Step 2 of 5: BOGO Terms                                    │
├────────────────────────────────────────────────────────────┤
│                                                             │
│ BUY SECTION (What customer must purchase)                  │
│ ┌─────────────────────────────────────────────────────┐   │
│ │ Buy Product(s)                                      │   │
│ │ ┌──────────────────────────────────────────────┐   │   │
│ │ │ Search products...                      ▼   │   │   │
│ │ │ ✓ Coca Cola 2L                               │   │   │
│ │ │ ✓ Sprite 2L                                  │   │   │
│ │ └──────────────────────────────────────────────┘   │   │
│ │ [+ Add Another Product]                             │   │
│ │                                                     │   │
│ │ Quantity (X) to Buy: [2]                            │   │
│ │ Help: Customer must buy this quantity              │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                             │
│ GET SECTION (What customer receives free/discounted)       │
│ ┌─────────────────────────────────────────────────────┐   │
│ │ Get Product(s)                                      │   │
│ │ ┌──────────────────────────────────────────────┐   │   │
│ │ │ Search products...                      ▼   │   │   │
│ │ │ ✓ Sprite 2L                                  │   │   │
│ │ └──────────────────────────────────────────────┘   │   │
│ │ [+ Add Another Product]                             │   │
│ │                                                     │   │
│ │ Quantity (Y) to Get: [1]                            │   │
│ │ Help: Customer receives this quantity free/disc    │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                             │
│ Optional: Limit Per Order                                  │
│ ☐ Limit how many times this BOGO applies per order        │
│   If checked:                                              │
│   Maximum times offer applies: [1]                         │
│                                                             │
│                                                             │
│ [Back]                                        [Next Step] ►│
└────────────────────────────────────────────────────────────┘
```

**Product Selection UX Details:**

```
Product Multi-Selector (Dropdown/Modal)
┌─────────────────────────────────────┐
│ Search products...                  │
├─────────────────────────────────────┤
│ ☐ Coca Cola 2L (SKU: CC-2L)         │
│   $4.99 - Available in 150 units    │
├─────────────────────────────────────┤
│ ☐ Coca Cola 6-Pack (SKU: CC-6P)     │
│   $12.99 - Available in 89 units    │
├─────────────────────────────────────┤
│ ☐ Sprite 2L (SKU: SP-2L)            │
│   $3.99 - Available in 200 units    │
└─────────────────────────────────────┘

Selected: 
[Coca Cola 2L] ✕  [Sprite 2L] ✕

[+ Add Another Product]
```

**Fields:**

| Field | Type | Validation | Required | Help Text |
|-------|------|-----------|----------|-----------|
| Buy Product(s) | Multi-select | At least 1 product | Yes | Cannot be same as Get products |
| Buy Quantity | Integer | 1-1000 | Yes | Must be ≥ 1 |
| Get Product(s) | Multi-select | At least 1 product | Yes | Cannot be same as Buy products |
| Get Quantity | Integer | 1-1000 | Yes | Must be ≥ 1 |
| Per-Order Limit | Integer | 1-100 (optional) | No | If unchecked, unlimited |

**Validation Rules:**
- Cannot select same product in both Buy and Get (warn user)
- Buy Quantity ≥ 1, Get Quantity ≥ 1
- Both product selections required
- Products must be in stock (warning if not)

---

### STEP 3: Discount Configuration

**Purpose:** Define how the "Get" products are discounted

**Layout:**
```
┌────────────────────────────────────────────────────────────┐
│ Step 3 of 5: Discount Configuration                        │
├────────────────────────────────────────────────────────────┤
│                                                             │
│ What is the discount on products customer gets?            │
│                                                             │
│ ○ Free (No charge for these items)      ◄ Default          │
│                                                             │
│ ○ % Discount (Percentage off)                              │
│   Discount Percentage: [____]%                             │
│   Help: E.g., 50 = 50% off                                 │
│                                                             │
│ ○ Fixed Amount Discount (Set price)                        │
│   Discount Amount: $[____]                                 │
│   Help: E.g., $5 off the get items                         │
│                                                             │
│ ─────────────────────────────────────────────────────────  │
│                                                             │
│ Optional: Time-Limited Offer                               │
│ ☐ Schedule this BOGO for specific dates                    │
│   If checked:                                              │
│   Start Date: [2026-03-05]                                 │
│   End Date:   [2026-03-31]                                 │
│                                                             │
│ Optional: Per-Transaction Limit                            │
│ ☐ Limit how many times this offer applies per order        │
│   If checked:                                              │
│   Max times per order: [1]                                 │
│                                                             │
│ Preview:                                                   │
│ ┌─────────────────────────────────────┐                   │
│ │ Buy 2x Coca Cola 2L ($4.99 each)    │                   │
│ │ Get 1x Sprite 2L (Free)             │                   │
│ │                                      │                   │
│ │ Customer Saves: $3.99               │                   │
│ └─────────────────────────────────────┘                   │
│                                                             │
│ [Back]                                        [Next Step] ►│
└────────────────────────────────────────────────────────────┘
```

**Fields:**

| Field | Type | Validation | Required | Help Text |
|-------|------|-----------|----------|-----------|
| Discount Type | Radio Group | One selection | Yes | Free/% Discount/Fixed Amount |
| Discount % | Integer | 0-100 | If % selected | Percentage value |
| Discount Amount | Currency | ≥ 0 | If fixed selected | Dollar amount |
| Schedule Start | Date | Valid date | If scheduled | Begin date |
| Schedule End | Date | Valid date > Start | If scheduled | End date (inclusive) |
| Per-Order Limit | Integer | 1-100 | If limited | Max occurrences |

**Validation Rules:**
- If "% Discount" selected: value must be 0-100
- If "Fixed Amount" selected: value must be > 0
- Schedule: End date must be ≥ Start date
- Per-order limit: Must be ≥ 1

**Real-Time Calculation:**
Show customer savings: `(Get Product Price × Get Quantity) - Discount Amount`

---

### STEP 4: Preview

**Purpose:** Show customer-facing view and confirm all details before saving

**Layout:**
```
┌────────────────────────────────────────────────────────────┐
│ Step 4 of 5: Preview                                       │
├────────────────────────────────────────────────────────────┤
│                                                             │
│ BUNDLE SUMMARY                                             │
│ ┌─────────────────────────────────────────────────────┐   │
│ │ Bundle Name: Buy 2 Get 1 Free on Sodas             │   │
│ │ Type: BOGO                                          │   │
│ │ Status: Active                                      │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                             │
│ BOGO RULES                                                 │
│ ┌─────────────────────────────────────────────────────┐   │
│ │ Buy: 2x Coca Cola 2L @ $4.99 = $9.98              │   │
│ │ Get: 1x Sprite 2L FREE (usual price: $3.99)       │   │
│ │                                                     │   │
│ │ Total Bundle Value: $13.97                         │   │
│ │ Bundle Price: $9.98                                │   │
│ │ Customer Saves: $3.99 (29%)                        │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                             │
│ OFFER TERMS                                                │
│ ┌─────────────────────────────────────────────────────┐   │
│ │ Valid From: March 5, 2026                          │   │
│ │ Valid Until: March 31, 2026                        │   │
│ │ Limit Per Order: 1 time                            │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                             │
│ CUSTOMER-FACING PREVIEW                                    │
│ ┌─────────────────────────────────────────────────────┐   │
│ │ 🎉 Buy 2 Get 1 Free on Sodas                       │   │
│ │                                                     │   │
│ │ [Coca Cola 2L]  [Sprite 2L]                        │   │
│ │ $4.99 each      1 FREE                             │   │
│ │                                                     │   │
│ │ Total Savings: $3.99                               │   │
│ │ [Add to Cart]                                       │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                             │
│ [Back]                                        [Next Step] ►│
└────────────────────────────────────────────────────────────┘
```

**Sections:**
1. Bundle Summary - Name, Type, Status
2. BOGO Rules - Clear breakdown of buy/get terms
3. Pricing Calculation - Total value, bundle price, savings
4. Offer Terms - Schedule, limits
5. Customer Preview - How it appears on storefront

---

### STEP 5: Confirmation & Save

**Purpose:** Final validation and save bundle

**Layout:**
```
┌────────────────────────────────────────────────────────────┐
│ Step 5 of 5: Confirmation                                  │
├────────────────────────────────────────────────────────────┤
│                                                             │
│ ✓ All validations passed                                   │
│                                                             │
│ Ready to create bundle:                                    │
│ "Buy 2 Get 1 Free on Sodas"                                │
│                                                             │
│ Summary:                                                   │
│ • Type: BOGO                                               │
│ • Buy: 2x Coca Cola 2L                                     │
│ • Get: 1x Sprite 2L (Free)                                 │
│ • Limit: 1 per order                                       │
│ • Active: Yes                                              │
│                                                             │
│ ────────────────────────────────────────────────────────   │
│                                                             │
│ Actions:                                                   │
│ [Back]                                   [✓ Save Bundle]   │
│                                                             │
│ After saving, you'll return to the bundle list.            │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

**Save Validation:**
- All required fields present ✓
- No conflicting dates ✓
- Products exist and available ✓
- No duplicate bundle names ✓

**On Save:**
1. Show loading spinner
2. Submit to backend API
3. Show success toast: "Bundle created successfully!"
4. Redirect to bundle listing page
5. Highlight newly created bundle

**On Error:**
- Show error toast with message
- Option to go back to editing
- Preserve entered data in form

---

## Conditional Flows

### If User Selects Same Product for Buy & Get
```
⚠️ Warning Dialog
"You've selected the same product for both Buy and Get.
This is allowed but creates a self-fulfilling promotion.
 
Example: Buy 2 Sprite → Get 1 Sprite Free
 
Is this what you intended?
[Cancel] [Continue]"
```

### If Schedule Validation Fails
```
❌ Validation Error
"End Date must be on or after Start Date.
Current: Start: March 5, 2026 | End: March 1, 2026
Please adjust your dates."
```

### If Product Becomes Out of Stock
```
⚠️ Stock Warning
"The selected product 'Coca Cola 2L' is currently out of stock.
The bundle will be inactive until stock is replenished."
```

---

## Related Pages & Flows
- [Bundle Listing Page](01-BUNDLE-LISTING-PAGE.md)
- [Product Bundle Creation Flow](03-PRODUCT-BUNDLE-FLOW.md)
- [Component Breakdown](05-COMPONENT-BREAKDOWN.md)
- [Data Model & Schema](06-DATA-MODEL.md)
