# Product Bundling Prototype - Complete Guide

## Quick Start

### Running the Prototype

```bash
# Navigate to project directory
cd "/Users/anjaliagarwal/Documents/Inventory - Bundling/prototype"

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev

# Server will start at http://localhost:5173/
```

### Building for Production

```bash
npm run build
# Output: dist/ folder with optimized build
```

---

## Project Structure

```
prototype/
├── src/
│   ├── components/
│   │   ├── CreateBundlePage.tsx          # Main page for create/edit/view
│   │   ├── ManageBundlesPage.tsx         # Bundle listing page
│   │   ├── BundleBasicsSection.tsx       # Section 1: Bundle info
│   │   ├── BOGORuleCard.tsx              # BOGO configuration card
│   │   ├── BundleProductsTable.tsx       # Product table (BUNDLE type)
│   │   ├── BundleTypeSelector.tsx        # Radio button type selector
│   │   ├── BundleDescriptionTabs.tsx     # Basic/Advanced description tabs
│   │   ├── PricingSummaryCard.tsx        # Section 3: Pricing breakdown
│   │   ├── BundlePreviewCard.tsx         # Section 4: Customer preview
│   │   └── ... (other utility components)
│   ├── data/
│   │   ├── mockData.ts                   # Mock bundles (10) and products (20)
│   │   └── types.ts                      # TypeScript interfaces
│   ├── utils/
│   │   └── pricing.ts                    # Pricing calculation logic
│   ├── App.tsx                           # Main app with page navigation
│   ├── styles.css                        # All component styles
│   ├── main.tsx                          # React entry point
│   └── index.css                         # Base styles
├── dist/                                 # Production build output
├── tsconfig.json                         # TypeScript config
├── vite.config.ts                        # Vite config
├── package.json                          # Dependencies
└── index.html                            # HTML template
```

---

## Features Overview

### ✅ Phase 1 - Modal-Based Prototype
- Bundle listing table with filters and pagination
- 4-step modal wizard for creating bundles
- BOGO rule builder
- Product bundle editor
- Status toggles and quick actions
- Real-time pricing calculations

### ✅ Phase 2 - Page-Based Refactoring
- **Full-page create/edit experience** (no modal overlay)
- **5-section scrollable form** with card-based layout
- **Improved UI/UX**:
  - Radio buttons for bundle type selection
  - Basic/Advanced description tabs
  - Dedicated BOGO configuration card
  - Pricing summary with bundle discount options
  - Customer preview card
  - Right-aligned action buttons
- **Enhanced data model** with separate basic/advanced descriptions
- **Cleaner navigation** between manage and create pages

---

## Component Descriptions

### CreateBundlePage.tsx
Main component for creating, editing, or viewing a bundle.

**Props**:
- `mode: 'create' | 'edit' | 'view'`
- `draft: Bundle` - Current bundle being edited
- `products: Product[]` - Available products
- `onChange: (bundle: Bundle) => void` - Update draft
- `onBack: () => void` - Navigate back
- `onCancel: () => void` - Cancel without saving
- `onSaveDraft: () => void` - Save as draft (status unchanged)
- `onSaveActivate: () => void` - Save and activate (status=true)

**Sections**:
1. BundleBasicsSection - Name, type, description, status
2. BOGORuleCard (BOGO) or BundleProductsTable (BUNDLE)
3. PricingSummaryCard - Pricing breakdown
4. BundlePreviewCard - Customer preview
5. Action buttons - Cancel, Save Draft, Save & Activate

---

### ManageBundlesPage.tsx
Bundle listing page with filters and actions.

**Props**:
- `bundles: Bundle[]`
- `search, dateFilter, statusFilter, typeFilter, page, pageSize`
- `onSearchChange, onDateFilterChange, onStatusFilterChange, onTypeFilterChange, onPageChange`
- `onAdd, onStatusToggle, onView, onEdit, onDuplicate, onArchive`

**Features**:
- Filter by date, status, type
- Search by name or ID
- Pagination (5 items per page)
- Status toggle (quick activate/deactivate)
- Actions: View, Edit, Duplicate, Archive

---

### BundleBasicsSection.tsx
Form section for bundle name, type, description, and status.

**Props**:
- `draft: Bundle`
- `onChange: (bundle: Bundle) => void`
- `disabled?: boolean`

---

### BOGORuleCard.tsx
Configuration card for BOGO rules with 8 editable fields.

**Props**:
- `draft: Bundle`
- `products: Product[]`
- `onChange: (bundle: Bundle) => void`
- `disabled?: boolean`

**Fields**:
- Buy Product (dropdown)
- Buy Quantity (number)
- Get Product (dropdown)
- Get Quantity (number)
- Discount Type (FREE / PERCENTAGE / FIXED)
- Discount Value (number)
- Limit per Order (optional)
- Schedule Start/End dates (optional)

---

### BundleProductsTable.tsx
Table for managing products in a bundle.

**Props**:
- `draft: Bundle`
- `products: Product[]`
- `onChange: (bundle: Bundle) => void`
- `disabled?: boolean`

**Columns**:
- Product (with add dropdown)
- Quantity (editable)
- Individual Discount (editable)
- Final Price (calculated)
- Remove (button)

---

### PricingSummaryCard.tsx
Displays pricing breakdown and bundle discount options.

**Props**:
- `draft: Bundle`
- `products: Product[]`
- `onChange: (bundle: Bundle) => void`
- `disabled?: boolean`

**Shows**:
- Original total price
- Product-level discounts
- Bundle-level discount (editable, with Type/Value)
- Final bundle price (highlighted)
- Customer savings (green)

---

### BundlePreviewCard.tsx
Customer-facing preview of the bundle in storefront style.

**Props**:
- `draft: Bundle`
- `products: Product[]`

**Shows**:
- Bundle name
- Savings badge (green)
- Description
- Product list
- Strikethrough original price
- Bold final price

---

## Data Models

### Bundle Interface
```typescript
interface Bundle {
  id: number;
  name: string;
  type: 'BOGO' | 'BUNDLE';
  descriptionBasic: string;
  descriptionAdvanced: string;
  items: BundleItem[];                    // For BUNDLE type
  bogoRule?: BogoRule;                    // For BOGO type
  discountType: 'NONE' | 'PERCENTAGE' | 'FIXED_BUNDLE_PRICE';
  discountValue: number;
  status: boolean;                        // Active/Inactive
  createdAt: string;
}
```

### BundleItem Interface
```typescript
interface BundleItem {
  productId: number;
  quantity: number;
  individualDiscount: number;             // % discount
}
```

### BogoRule Interface
```typescript
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
```

### PriceSummary Interface
```typescript
interface PriceSummary {
  originalTotalPrice: number;
  productDiscounts: number;               // Item-level discounts
  bundleLevelDiscount: number;            // Bundle-level discount
  finalPrice: number;
  savings: number;
}
```

---

## Styling & Design System

### Color Palette
- **Primary CTA**: `#ff5a2c` (Universell orange)
- **Text**: `#1f2937` (dark gray)
- **Subtle**: `#6b7280` (medium gray)
- **Borders**: `#e5e7eb`, `#edf0f5` (light grays)
- **Background**: `#f4f5f9` (off-white)
- **Success**: `#15803d` (green for savings)

### Component Styling
- **Cards**: White background, 1px border, border-radius 14px, subtle shadow
- **Form inputs**: padding 8px 12px, border 1px #d1d5db, radius 8px
- **Buttons**: Primary (orange bg), Secondary (white bg), Link (text only)
- **Spacing**: 12px gap baseline, 18px padding, 24px sections

### CSS Classes
All components use class-based styling organized by purpose:
- `.form-section` - Card wrapper for form sections
- `.section-header` - Section title
- `.section-body` - Section content area
- `.inner-card` - Nested card (e.g., inside form section)
- `.radio-stack`, `.radio-row` - Radio button group
- `.tab-row`, `.tab-btn` - Tab navigation
- `.storefront-card` - Customer preview styling
- `.actions-right` - Right-aligned buttons

---

## Pricing Calculation

### Algorithm
```
For each product in bundle:
  1. Get product base price
  2. Apply individual item discount (if any)
  3. Calculate item line total

Sum all item line totals → originalTotalPrice
Sum all item discounts → productDiscounts

If bundle discount type = NONE:
  bundleLevelDiscount = 0
If bundle discount type = PERCENTAGE:
  bundleLevelDiscount = (originalTotalPrice - productDiscounts) × (discountValue / 100)
If bundle discount type = FIXED_BUNDLE_PRICE:
  bundleLevelDiscount = (originalTotalPrice - productDiscounts) - discountValue

finalPrice = originalTotalPrice - productDiscounts - bundleLevelDiscount
savings = originalTotalPrice - finalPrice
```

### Usage
```typescript
import { calculateBundleSummary } from './utils/pricing';

const summary = calculateBundleSummary(bundle, products);
console.log(summary.finalPrice);
```

---

## State Management

### App.tsx State
```typescript
const [bundles, setBundles] = useState<Bundle[]>(mockBundles);
const [mode, setMode] = useState<PageMode>('manage');
const [draft, setDraft] = useState<Bundle>(createEmptyBundleDraft());
const [search, setSearch] = useState('');
const [dateFilter, setDateFilter] = useState('');
const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
const [typeFilter, setTypeFilter] = useState<TypeFilter>('ALL');
const [page, setPage] = useState(1);
```

### Navigation Methods
- `goManage()` - Return to bundle listing
- `openCreate()` - Start creating new bundle
- `openEdit(bundle)` - Edit existing bundle
- `openView(bundle)` - View bundle (readonly)
- `saveBundle(activate)` - Save changes
- `duplicateBundle(bundle)` - Create copy
- `archiveBundle(bundle)` - Set status=false
- `toggleStatus(id, status)` - Quick toggle

---

## Mock Data

### Products (20)
- Beverages: Coke, Sprite, Juice, Water
- Fast Food: Burger, Fries, Pizza
- Electronics: Phone, Laptop, Headphones
- Accessories: Case, Charger, Cable
- Stationery: Notebook, Pen
- Grocery: Milk, Bread, Eggs
- Personal Care: Shampoo, Toothpaste

**Structure**:
```typescript
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
}
```

### Bundles (10)
- 5 BOGO bundles (free item offers)
- 5 Product bundles (multi-item packages)

**Realistic pricing scenarios**:
- Mix of discount types (FREE, PERCENTAGE, FIXED)
- Various discount values (5%-50%)
- Different item quantities (2-5 items)

---

## Common Tasks

### Adding a New Product
Edit `src/data/mockData.ts`:
```typescript
export const mockProducts: Product[] = [
  // ... existing products
  { id: 21, name: 'New Product', category: 'Category', price: 9.99 }
];
```

### Creating a Test Bundle
Use the UI or programmatically:
```typescript
const newBundle: Bundle = {
  id: 11,
  name: 'Test Bundle',
  type: 'BUNDLE',
  descriptionBasic: 'A test bundle',
  descriptionAdvanced: '<p>Advanced description</p>',
  items: [
    { productId: 1, quantity: 2, individualDiscount: 0 },
    { productId: 2, quantity: 1, individualDiscount: 10 }
  ],
  bogoRule: undefined,
  discountType: 'PERCENTAGE',
  discountValue: 15,
  status: true,
  createdAt: new Date().toISOString()
};
```

### Modifying Pricing Logic
Edit `src/utils/pricing.ts`:
```typescript
export function calculateBundleSummary(bundle: Bundle, products: Product[]): PriceSummary {
  // Current logic here
  // Modify calculation as needed
}
```

### Changing Colors/Design
Edit `src/styles.css`:
```css
:root {
  --primary: #ff5a2c;  /* Main color */
  --text: #1f2937;     /* Text color */
  /* ... add more CSS variables */
}
```

---

## Troubleshooting

### Issue: Build fails with TypeScript errors
**Solution**: Ensure all new components follow the Bundle interface. Run `npm run build` to see detailed errors.

### Issue: Dev server shows blank page
**Solution**: 
```bash
# Clear cache and restart
rm -rf dist node_modules
npm install
npm run dev
```

### Issue: Styles not applying
**Solution**: 
- Check that CSS class names match in JSX
- Verify `styles.css` is imported in `main.tsx`
- Clear browser cache (Cmd+Shift+R)

### Issue: Pricing shows incorrect values
**Solution**: 
- Verify `calculateBundleSummary()` receives correct bundle structure
- Check mock data has valid productId references
- Log pricing calculation: `console.log(calculateBundleSummary(bundle, products))`

---

## Testing Checklist

- [ ] Create new BOGO bundle end-to-end
- [ ] Create new Product Bundle end-to-end
- [ ] Edit existing bundle (change name, discount, products)
- [ ] View bundle in readonly mode
- [ ] Duplicate bundle (verify "Copy" suffix and inactive status)
- [ ] Archive bundle (verify status toggle and filter)
- [ ] Quick toggle status from listing
- [ ] Apply filters (date, status, type, search)
- [ ] Pagination works correctly
- [ ] Pricing calculates correctly for all discount types
- [ ] Preview card displays correctly for both bundle types
- [ ] Tab switching works (Basic ↔ Advanced)
- [ ] BOGO rule preview updates as you change fields
- [ ] Product table add/remove products works
- [ ] Back navigation returns without saving
- [ ] Responsive layout on 1000px+ screens

---

## Performance Notes

- **Bundle Listing**: Renders quickly with pagination (5 items/page)
- **Pricing Calculation**: Real-time on form input (negligible delay)
- **Build Size**: ~169KB JS, ~11.7KB CSS (gzipped: 52KB, 3KB)
- **Dev Server Start**: ~117ms on modern machine

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS 14+, Android Chrome)

**Note**: Optimized for desktop (1000px+), not fully responsive for mobile.

---

## Next Steps / Enhancements

1. **Backend Integration**
   - Replace mock data with API calls
   - Persist bundles to database
   - Add authentication

2. **Advanced Features**
   - Rich text editor for descriptions (use Slate or TipTap)
   - Product image uploads
   - Bundle templates
   - Bulk actions (archive multiple)
   - Export/import bundles
   - Analytics (revenue impact, adoption rate)

3. **Validation & Error Handling**
   - Form validation (required fields, min/max values)
   - Error boundaries for component failures
   - Confirmation dialogs for destructive actions
   - Toast notifications for user feedback

4. **Accessibility**
   - ARIA labels on all interactive elements
   - Keyboard navigation (Tab, Enter, Escape)
   - Screen reader support
   - Focus management

5. **Mobile Optimization**
   - Responsive layout for tablets (800px)
   - Mobile-optimized modals/inputs
   - Touch-friendly buttons (larger tap targets)

---

## Project Status

**Phase 1**: ✅ Complete (Modal-based stepper prototype)
**Phase 2**: ✅ Complete (Page-based refactored architecture)
**Status**: 🟢 Demo-Ready

**Last Updated**: Phase 2 Complete
**Dev Server**: http://localhost:5173/
**Production Build**: `npm run build` → dist/

---

## Support & Questions

For issues or enhancements, refer to:
- **PHASE-2-COMPLETION.md** - What was built
- **PHASE-2-USER-FLOW.md** - How to use the prototype
- **src/components/** - Component implementations
- **src/types.ts** - Data structure definitions

---

**Happy bundling! 🎉**
