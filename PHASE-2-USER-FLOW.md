# Product Bundling Prototype - Phase 2 User Flow Guide

## Overview
This document describes the complete user flow through the refactored Product Bundling prototype.

---

## Screen 1: Bundle Management (Listing Page)

**URL**: `http://localhost:5173/` (when mode='manage')

### Layout
```
┌─────────────────────────────────────────────────────────┐
│ ≡   Manage Product Bundles      [+ Add New Bundle]      │
├─────────────────────────────────────────────────────────┤
│ Analytics Grid (4 stat cards)                           │
│ ├─ Active Bundles: [count]                              │
│ ├─ BOGO Bundles: [count]                                │
│ ├─ Product Bundles: [count]                             │
│ └─ Conversion Lift: 14.2%                               │
├─────────────────────────────────────────────────────────┤
│ Filters Row:                                            │
│ [Date Picker] [Status ▼] [Type ▼] [Search...]          │
├─────────────────────────────────────────────────────────┤
│ Bundle Table:                                           │
│ ┌─────┬────────────┬──────┬────────┬─────┬──────┬──┬──┐ │
│ │ ID  │ Name       │ Type │ Disc.  │ Qty │ Date │✓ │  │ │
│ ├─────┼────────────┼──────┼────────┼─────┼──────┼──┼──┤ │
│ │ 1   │ Buy 2 Get 1│ BOGO │ FREE   │ 2   │ Date │✓ │⋯ │ │
│ │ 2   │ Summer Pack│BUNDLE│ 15%    │ 3   │ Date │✓ │⋯ │ │
│ │ ... │            │      │        │     │      │  │  │ │
│ └─────┴────────────┴──────┴────────┴─────┴──────┴──┴──┘ │
│                                                          │
│ Status Toggle Column: [●─────○] (clickable to toggle)  │
│ Actions Column: View | Edit | Duplicate | Archive      │
├─────────────────────────────────────────────────────────┤
│ Pagination: ‹ [1] [2] [3] › (showing 1-5 of 10)        │
└─────────────────────────────────────────────────────────┘
```

### Actions from Listing
- **+ Add New Bundle**: Navigate to Create Bundle page (mode='create')
- **View**: Navigate to Bundle Details page (mode='view')
- **Edit**: Navigate to Create Bundle page with existing data (mode='edit')
- **Duplicate**: Create a copy of bundle (status=false, name="[Original] (Copy)")
- **Archive**: Toggle status to inactive
- **Status Toggle**: Quick activate/deactivate without leaving page

---

## Screen 2: Create/Edit Bundle Page

**URL**: Still `http://localhost:5173/` (when mode='create', 'edit', or 'view')

### Layout
```
┌──────────────────────────────────────────────────────────┐
│ ← Back to Manage Bundles                                │
│                                                          │
│ Create New Product Bundle                               │
│                                                          │
├──────────────────────────────────────────────────────────┤
│ SECTION 1 — BUNDLE BASICS                               │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ Bundle Name:                                         │ │
│ │ [________________________]                            │ │
│ │                                                      │ │
│ │ Bundle Type:                                        │ │
│ │ ○ BOGO (Buy One Get One)  ℹ                         │ │
│ │ ○ Product Bundle             ℹ                         │ │
│ │                                                      │ │
│ │ Description:                                        │ │
│ │ [Basic]  [Advanced]                                 │ │
│ │ [______________ textarea _______________]            │ │
│ │                                                      │ │
│ │ Active: [●─────○] (toggle)                          │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
├──────────────────────────────────────────────────────────┤
│ SECTION 2 — BUNDLE CONFIGURATION                        │
│ ┌──────────────────────────────────────────────────────┐ │
│ │                                                      │ │
│ │ IF BUNDLE TYPE = BOGO:                              │ │
│ │                                                      │ │
│ │   BOGO Rule Configuration                           │ │
│ │   ┌─────────────────────────────────────────────┐   │ │
│ │   │ Buy Product:    [Coke ▼]                   │   │ │
│ │   │ Buy Quantity:   [2 ____]                   │   │ │
│ │   │ Get Product:    [Coke ▼]                   │   │ │
│ │   │ Get Quantity:   [1 ____]                   │   │ │
│ │   │                                             │   │ │
│ │   │ Discount Type:  [FREE ▼]                   │   │ │
│ │   │ Discount Value: [100 ____]                 │   │ │
│ │   │ Limit/Order:    [5 ____]                   │   │ │
│ │   │ Schedule:       From [____] To [____]      │   │ │
│ │   │                                             │   │ │
│ │   │ Preview: Buy 2 Coke → Get 1 Coke Free     │   │ │
│ │   └─────────────────────────────────────────────┘   │ │
│ │                                                      │ │
│ │ IF BUNDLE TYPE = PRODUCT BUNDLE:                    │ │
│ │                                                      │ │
│ │   Bundle Products                                   │ │
│ │   ┌─────────────────────────────────────────────┐   │ │
│ │   │ [+ Add Product ▼]                           │   │ │
│ │   │                                             │   │ │
│ │   │ Product      │ Qty │ Discount │ Price │ ✕  │   │ │
│ │   │ Coke 600ml   │ 2   │ $0       │ $8.00 │ ✕  │   │ │
│ │   │ Sprite       │ 1   │ 10%      │ $3.60 │ ✕  │   │ │
│ │   └─────────────────────────────────────────────┘   │ │
│ │                                                      │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
├──────────────────────────────────────────────────────────┤
│ SECTION 3 — PRICING SUMMARY                             │
│ ┌──────────────────────────────────────────────────────┐ │
│ │                                                      │ │
│ │ Original Total:        $100.00                       │ │
│ │ Product Discounts:     -$12.50                       │ │
│ │ Bundle Discount:                                     │ │
│ │ ├─ Type:    [Percentage ▼]                           │ │
│ │ └─ Value:   [15 ____] %                              │ │
│ │                                                      │ │
│ │ FINAL BUNDLE PRICE:    $74.38                        │ │
│ │ You Save:              $25.62 (25.6%)  ✓             │ │
│ │                                                      │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
├──────────────────────────────────────────────────────────┤
│ SECTION 4 — PREVIEW                                     │
│ ┌──────────────────────────────────────────────────────┐ │
│ │                                                      │ │
│ │   ┌──────────────────────────────────────────┐       │ │
│ │   │                                          │       │ │
│ │   │  Summer Bundle      [SAVE 25.6% ↗]      │       │ │
│ │   │                                          │       │ │
│ │   │  Build your perfect summer refresh!      │       │ │
│ │   │                                          │       │ │
│ │   │  • Coke 600ml (×2)                       │       │ │
│ │   │  • Sprite (×1)                           │       │ │
│ │   │                                          │       │ │
│ │   │  ~~$100.00~~    $74.38                   │       │ │
│ │   │                                          │       │ │
│ │   └──────────────────────────────────────────┘       │ │
│ │                                                      │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
├──────────────────────────────────────────────────────────┤
│ SECTION 5 — ACTIONS                                     │
│                                           [Cancel] [Save│
│                                           Draft] [Save &│
│                                           Activate]     │
└──────────────────────────────────────────────────────────┘
```

### Tab Switching in Description
When user clicks "Advanced" tab:
```
Description:
[Basic]  [Advanced]
┌────────────────────────────────────┐
│ Bold | Italic | List | Link        │  (Toolbar - mock UI)
├────────────────────────────────────┤
│ [_______________________________]   │
│ [Rich text editor content area]    │  (Editable textarea for now)
│ [_______________________________]   │
└────────────────────────────────────┘
```

### Radio Button Selection
When user selects bundle type with info tooltip:
```
Bundle Type:
○ BOGO (Buy One Get One)  ℹ ← Hover shows tooltip
  "Offer: Buy X items, get Y free"

✓ Product Bundle           ℹ
  "Bundle: Sell multiple items together"
```

### Section 2 Conditional Content
**If Bundle Type = BOGO**: Shows BOGORuleCard with:
- Buy Product selector (searchable dropdown)
- Buy Quantity input
- Get Product selector
- Get Quantity input
- Discount Type (FREE / PERCENTAGE / FIXED)
- Discount Value input
- Limit per Order
- Schedule dates
- Live preview: "Buy 2 Coke → Get 1 Coke Free"

**If Bundle Type = PRODUCT BUNDLE**: Shows BundleProductsTable with:
- Add Product dropdown
- Product listing with columns: Product | Qty | Individual Discount | Final Price | Remove

### Button Behaviors
- **Cancel**: Return to manage page (mode='manage')
- **Save Draft**: Save bundle with status=unchanged, navigate to manage page
- **Save & Activate**: Save bundle with status=true (active), navigate to manage page
- **Back to Manage Bundles**: Return to manage page without saving

### In View Mode (mode='view')
- All form fields are disabled (readonly)
- Action buttons (Cancel, Save Draft, Save & Activate) are hidden
- Only "Back to Manage Bundles" link is visible

---

## User Flow Examples

### Flow 1: Create New BOGO Bundle
1. Click "+ Add New Bundle" on listing
   → CreateBundlePage with mode='create'
2. Enter name: "Summer Buy 2 Get 1"
3. Select Bundle Type: BOGO (radio button)
   → Section 2 shows BOGORuleCard
4. Fill BOGO config:
   - Buy Product: Coke 600ml
   - Buy Qty: 2
   - Get Product: Sprite
   - Get Qty: 1
   - Type: FREE
   → Preview updates: "Buy 2 Coke → Get 1 Sprite Free"
5. Pricing auto-calculates in Section 3
6. Review in Section 4 preview card
7. Click "Save & Activate"
   → Bundle added to bundles array with id=11, status=true
   → Navigate to manage page (mode='manage')
   → See new bundle in table

### Flow 2: Edit Existing Bundle
1. On listing, click "Edit" on a bundle row
   → CreateBundlePage with mode='edit', draft=[selected bundle]
2. User can now modify any field
   - Change name
   - Change discount type/value
   - Add/remove products (if BUNDLE type)
   - Toggle active status
3. Click "Save & Activate"
   → Bundle updated in bundles array
   → Navigate to manage page

### Flow 3: View Bundle Details
1. On listing, click "View" on a bundle row
   → CreateBundlePage with mode='view', draft=[selected bundle]
2. All fields shown but disabled (readonly)
3. Preview card displays final bundle for customer
4. No action buttons visible (except "Back to Manage Bundles")
5. Click back link to return to listing

### Flow 4: Duplicate Bundle
1. On listing, click "Duplicate" on a bundle row
   → New bundle created with:
     - All properties from original (name, type, config, pricing)
     - New ID (max+1)
     - New name: "[Original Name] (Copy)"
     - status=false (inactive by default)
     - createdAt=now
   → Bundle appears at top of table
   → No navigation (stays on manage page)

### Flow 5: Quick Archive
1. On listing, click "Archive" on a bundle row
   → Bundle status set to false
   → Row moves to "inactive" filter results
   → Icon/styling shows as archived

### Flow 6: Toggle Status
1. On listing, click status toggle [●─────○] on a bundle row
   → Status flipped immediately (true ↔ false)
   → Visual feedback (toggle changes color/position)
   → No page reload needed

---

## Data Flow Diagram

```
App State:
├─ bundles: Bundle[]
├─ mode: 'manage' | 'create' | 'edit' | 'view'
├─ draft: Bundle (current editing)
├─ search, dateFilter, statusFilter, typeFilter, page
└─ [Filter/pagination state]

User Action              →  App Method           →  Result
───────────────────────────────────────────────────────────
Click "+ Add"            →  openCreate()         →  mode='create', draft=empty
Click "Edit"             →  openEdit(bundle)     →  mode='edit', draft=bundle
Click "View"             →  openView(bundle)     →  mode='view', draft=bundle
Fill form               →  setDraft()            →  draft updated (live)
Click "Save & Activate"  →  saveBundle(true)     →  bundle saved, status=true, mode='manage'
Click "Cancel"           →  goManage()            →  draft discarded, mode='manage'
Click "Duplicate"        →  duplicateBundle()    →  new bundle created, added to top
Click "Archive"          →  archiveBundle()      →  bundle status=false
Click toggle             →  toggleStatus()       →  bundle status flipped
Adjust filter            →  setFilter/setPage()  →  Manage page re-filters/paginates
```

---

## Data Schema

### Bundle Interface
```typescript
interface Bundle {
  id: number;
  name: string;
  type: 'BOGO' | 'BUNDLE';
  descriptionBasic: string;
  descriptionAdvanced: string;
  items: BundleItem[];                    // Product list (for BUNDLE type)
  bogoRule?: BogoRule;                    // BOGO config (if type='BOGO')
  discountType: DiscountType;             // Bundle-level discount
  discountValue: number;
  status: boolean;                        // Active/inactive
  createdAt: string;                      // ISO timestamp
}

interface BundleItem {
  productId: number;
  quantity: number;
  individualDiscount: number;             // Item-level discount %
}

interface BogoRule {
  buyProductId: number;
  buyQuantity: number;
  getProductId: number;
  getQuantity: number;
  discountType: 'FREE' | 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  limitPerOrder?: number;
  scheduleStart?: string;
  scheduleEnd?: string;
}

interface PriceSummary {
  originalTotalPrice: number;
  productDiscounts: number;               // Sum of item-level discounts
  bundleLevelDiscount: number;            // Bundle-level discount
  finalPrice: number;
  savings: number;
}
```

---

## Browser Testing Tips

1. **Test Create Flow**: 
   - Fill form across all 5 sections
   - Watch pricing auto-calculate
   - See preview update in real-time

2. **Test BOGO Rule**:
   - Select different products
   - Change quantities
   - Verify preview shows correct rule

3. **Test Type Switching**:
   - Create BOGO, save
   - Return and click "Edit"
   - Change type to BUNDLE
   - See Section 2 switch to products table

4. **Test Filters**:
   - Search by bundle name or ID
   - Filter by status (Active/Inactive)
   - Filter by type (BOGO/BUNDLE)
   - Filter by date
   - Pagination should work correctly

5. **Test Status Updates**:
   - Toggle status on a bundle
   - Status should update visually
   - Filter behavior should update
   - Verify status persists in data

---

## Known Limitations (Phase 2)

⚠ **Mock Rich Editor**: Advanced description editor is UI-only (mock toolbar)
⚠ **No Validation**: Form allows empty fields, invalid combinations
⚠ **No Backend**: All data stored in React state (lost on page refresh)
⚠ **No Search**: Product selectors don't have search/filter
⚠ **Limited Error Handling**: No error messages for invalid operations
⚠ **Responsive**: Optimized for 1000px+ screens (not mobile-optimized)

---

**Prototype Status**: ✅ Demo-Ready
**Last Updated**: Phase 2 Complete
**Dev Server**: http://localhost:5173/
