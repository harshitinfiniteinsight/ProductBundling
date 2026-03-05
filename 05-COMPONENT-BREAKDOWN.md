# Component Breakdown

## Overview
This document defines all reusable components required to build the product bundling feature across both BOGO and Product Bundle flows.

## Component Hierarchy

```
App
├── Pages
│   ├── BundleListingPage
│   ├── CreateBundleFlow (Multi-step)
│   ├── EditBundleFlow (Multi-step)
│   └── BundleDetailPage
├── Shared Components
│   ├── Layout Components
│   ├── Form Components
│   ├── Filter Components
│   ├── Product Selection Components
│   ├── Pricing Components
│   └── Navigation Components
```

---

## Page-Level Components

### 1. **BundleListingPage**
**Location:** `pages/Bundles/BundleListingPage.tsx`

**Responsibility:** Main listing view with table, filters, pagination, and CTA button

**Props:**
```typescript
interface BundleListingPageProps {
  onCreateNew?: () => void;
  onEditBundle?: (bundleId: string) => void;
  onViewBundle?: (bundleId: string) => void;
}
```

**Sub-components:**
- `BundleFiltersBar`
- `BundleTable`
- `BundlePagination`
- `AddBundleButton`

**State Management:**
- Bundles list (from API)
- Current page
- Filters applied
- Sort column & direction
- Loading/error states

---

### 2. **CreateBundleFlow**
**Location:** `pages/Bundles/CreateBundleFlow.tsx`

**Responsibility:** Multi-step wizard for creating new bundles

**Props:**
```typescript
interface CreateBundleFlowProps {
  onSuccess?: (bundle: Bundle) => void;
  onCancel?: () => void;
}
```

**Sub-components:**
- `BundleBasicsStep`
- `BOGOTermsStep` (conditional)
- `ProductBundleStep` (conditional)
- `DiscountConfigStep`
- `PreviewStep`
- `ConfirmationStep`
- `MultiStepForm` (container)

**State Management:**
- Current step (1-5)
- Bundle type (BOGO vs Product Bundle)
- Form data (all 5 steps)
- Validation errors
- Loading/error states

---

### 3. **EditBundleFlow**
**Location:** `pages/Bundles/EditBundleFlow.tsx`

**Responsibility:** Multi-step wizard for editing existing bundles

**Difference from Create:**
- Pre-populated with existing bundle data
- Can skip to specific step
- Confirm before overwriting

**Sub-components:**
- Same as CreateBundleFlow but with initial data

---

### 4. **BundleDetailPage**
**Location:** `pages/Bundles/BundleDetailPage.tsx`

**Responsibility:** Read-only view of a specific bundle

**Props:**
```typescript
interface BundleDetailPageProps {
  bundleId: string;
  onEdit?: () => void;
  onBack?: () => void;
}
```

**Sub-components:**
- `BundleBasicsDisplay`
- `BundleTermsDisplay` (BOGO-specific)
- `BundleProductsDisplay` (Product Bundle-specific)
- `BundlePricingDisplay`

---

## Form Components

### 1. **BundleNameInput**
**Location:** `components/Forms/BundleNameInput.tsx`

**Responsibility:** Text input for bundle name with validation

**Props:**
```typescript
interface BundleNameInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}
```

**Validation:**
- Required
- 3-100 characters
- Unique name check (API call)
- Shows character count

---

### 2. **BundleTypeSelector**
**Location:** `components/Forms/BundleTypeSelector.tsx`

**Responsibility:** Radio button group for BOGO vs Product Bundle selection

**Props:**
```typescript
interface BundleTypeSelectorProps {
  value: BundleType; // 'BOGO' | 'BUNDLE'
  onChange: (type: BundleType) => void;
  disabled?: boolean;
}
```

**Features:**
- Radio buttons side-by-side
- Icons/badges for each type
- Description text for each option

---

### 3. **ProductSelector**
**Location:** `components/Forms/ProductSelector.tsx`

**Responsibility:** Searchable dropdown/modal for selecting one or more products

**Props:**
```typescript
interface ProductSelectorProps {
  products?: Product[];
  selected?: Product[];
  onSelect: (product: Product) => void;
  multiSelect?: boolean;
  searchPlaceholder?: string;
  error?: string;
}
```

**Features:**
- Search by product name or SKU
- Show product price, stock level
- Multi-select toggle
- Debounced search
- Product images (optional)
- Badges for "Out of Stock"

**Modal/Dropdown Variants:**
- Dropdown (for single select in quick flows)
- Full modal (for multi-select with many options)

---

### 4. **QuantityInput**
**Location:** `components/Forms/QuantityInput.tsx`

**Responsibility:** Numeric input for product quantities

**Props:**
```typescript
interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number; // default 1
  max?: number; // default 1000
  error?: string;
  label?: string;
}
```

**Features:**
- +/- buttons
- Direct numeric input
- Min/max validation
- Error display

---

### 5. **DiscountTypeSelector**
**Location:** `components/Forms/DiscountTypeSelector.tsx`

**Responsibility:** Radio group for discount type selection (Free / % / Fixed Amount)

**Props:**
```typescript
interface DiscountTypeSelectorProps {
  type: DiscountType; // 'FREE' | 'PERCENTAGE' | 'FIXED_AMOUNT'
  onChange: (type: DiscountType) => void;
  percentageValue?: number;
  onPercentageChange?: (value: number) => void;
  fixedAmountValue?: number;
  onFixedAmountChange?: (value: number) => void;
  errors?: { [key: string]: string };
}
```

**Features:**
- Radio options for each discount type
- Conditional input fields
- Shows preview calculation
- Currency formatting for fixed amount

---

### 6. **DateRangeSelector**
**Location:** `components/Forms/DateRangeSelector.tsx`

**Responsibility:** Date picker for offer start/end dates

**Props:**
```typescript
interface DateRangeSelectorProps {
  startDate?: Date;
  endDate?: Date;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  error?: string;
  minDate?: Date;
  disablePast?: boolean;
}
```

**Features:**
- Two date pickers (start & end)
- Calendar popup
- Preset ranges (Today, This Week, This Month, Custom)
- Validation: End ≥ Start
- Optional: Disable past dates

---

### 7. **ProductQuickEdit**
**Location:** `components/Forms/ProductQuickEdit.tsx`

**Responsibility:** Inline edit form for product quantity/discount in table rows

**Props:**
```typescript
interface ProductQuickEditProps {
  product: BundleProduct;
  onSave: (updated: BundleProduct) => void;
  onCancel: () => void;
  onDelete: () => void;
}
```

**Features:**
- Quantity selector
- Discount type selector
- Discount value input
- Save/Cancel buttons
- Delete button

---

### 8. **ToggleSwitch**
**Location:** `components/Forms/ToggleSwitch.tsx`

**Responsibility:** Orange-themed toggle for active/inactive status

**Props:**
```typescript
interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  color?: 'orange' | 'gray';
}
```

**Features:**
- Orange when ON, gray when OFF
- Smooth animation
- Accessible keyboard navigation
- Animated transition

---

## Filter Components

### 1. **BundleFiltersBar**
**Location:** `components/Filters/BundleFiltersBar.tsx`

**Responsibility:** Top filter bar with date and status filters

**Props:**
```typescript
interface BundleFiltersBarProps {
  onDateRangeChange?: (start: Date, end: Date) => void;
  onStatusChange?: (status: 'active' | 'inactive' | 'all') => void;
  onSearch?: (query: string) => void;
}
```

**Sub-components:**
- `DateFilterDropdown`
- `StatusFilterDropdown`
- `SearchField`

---

### 2. **DateFilterDropdown**
**Location:** `components/Filters/DateFilterDropdown.tsx`

**Responsibility:** Date range filter with presets

**Props:**
```typescript
interface DateFilterDropdownProps {
  onDateRangeChange: (start: Date, end: Date) => void;
  placeholder?: string;
}
```

**Features:**
- Preset options: Today, This Week, This Month, Custom
- Calendar picker for custom ranges
- Clear filter button

---

### 3. **StatusFilterDropdown**
**Location:** `components/Filters/StatusFilterDropdown.tsx`

**Responsibility:** Filter by Active/Inactive status

**Props:**
```typescript
interface StatusFilterDropdownProps {
  value: string; // 'all' | 'active' | 'inactive'
  onChange: (value: string) => void;
}
```

**Features:**
- Dropdown with options
- Smooth state changes
- Icon indicators

---

### 4. **BundleTypeFilterPanel**
**Location:** `components/Filters/BundleTypeFilterPanel.tsx`

**Responsibility:** Filter by bundle type (BOGO / Product Bundle)

**Props:**
```typescript
interface BundleTypeFilterPanelProps {
  selected: string[];
  onChange: (types: string[]) => void;
}
```

**Features:**
- Checkbox options: BOGO, Product Bundle, All
- Multi-select capability

---

### 5. **SearchField**
**Location:** `components/Filters/SearchField.tsx`

**Responsibility:** Real-time search input with debounce

**Props:**
```typescript
interface SearchFieldProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceMs?: number; // default 500
}
```

**Features:**
- Debounced input (500ms)
- Clear button when text entered
- Search icon
- Min 1 character validation

---

## Table Components

### 1. **BundleTable**
**Location:** `components/Tables/BundleTable.tsx`

**Responsibility:** Main table displaying bundles list

**Props:**
```typescript
interface BundleTableProps {
  bundles: Bundle[];
  loading?: boolean;
  onViewBundle?: (bundle: Bundle) => void;
  onEditBundle?: (bundle: Bundle) => void;
  onToggleStatus?: (bundle: Bundle) => void;
  onDeleteBundle?: (bundle: Bundle) => void;
  onDuplicateBundle?: (bundle: Bundle) => void;
}
```

**Columns:**
- ID (sortable)
- Bundle Name (sortable)
- Bundle Type (sortable, badge)
- Bundle Discount (sortable)
- Created On (sortable)
- Status (toggle)
- Actions (icons)

**Features:**
- Column sorting
- Sortable headers with arrow indicators
- Hover effects on rows
- Loading skeleton
- Empty state

---

### 2. **BundleTableRow**
**Location:** `components/Tables/BundleTableRow.tsx`

**Responsibility:** Individual row in bundles table

**Props:**
```typescript
interface BundleTableRowProps {
  bundle: Bundle;
  onView?: () => void;
  onEdit?: () => void;
  onToggleStatus?: () => void;
  onMenuClick?: (action: string) => void;
}
```

**Features:**
- Click handlers for all actions
- Status toggle inline
- Action menu dropdown
- Hover state

---

### 3. **ProductBundleTable**
**Location:** `components/Tables/ProductBundleTable.tsx`

**Responsibility:** Display products in a bundle (create/edit flow)

**Props:**
```typescript
interface ProductBundleTableProps {
  products: BundleProduct[];
  onEditProduct?: (index: number) => void;
  onDeleteProduct?: (index: number) => void;
  onAddProduct?: () => void;
}
```

**Columns:**
- Product Name
- Quantity
- Unit Price
- Individual Discount
- Subtotal
- Actions (Edit, Delete)

**Features:**
- Editable rows (inline)
- Delete buttons
- Add product row
- Subtotal calculation

---

## Pricing & Preview Components

### 1. **PricingCalculator**
**Location:** `components/Pricing/PricingCalculator.tsx`

**Responsibility:** Real-time pricing calculation display

**Props:**
```typescript
interface PricingCalculatorProps {
  products: BundleProduct[];
  bundleDiscount?: {
    type: DiscountType;
    value: number;
  };
}
```

**Output:**
```
Subtotal: $16.56
Bundle Discount: -$1.66
Final Price: $14.90
Savings: $1.66 (10%)
```

**Features:**
- Real-time calculations
- Breakdown by line item
- Savings percentage
- Formatted currency

---

### 2. **SavingsDisplay**
**Location:** `components/Pricing/SavingsDisplay.tsx`

**Responsibility:** Highlight customer savings

**Props:**
```typescript
interface SavingsDisplayProps {
  originalPrice: number;
  finalPrice: number;
  showPercentage?: boolean;
}
```

**Output:**
```
You Save: $3.99 (29%)
```

**Features:**
- Currency formatting
- Percentage calculation
- Color-coded (green for savings)

---

### 3. **BundlePreviewCard**
**Location:** `components/Preview/BundlePreviewCard.tsx`

**Responsibility:** Customer-facing bundle preview (as it appears on storefront)

**Props:**
```typescript
interface BundlePreviewCardProps {
  bundle: Bundle;
  compact?: boolean; // Full or condensed view
}
```

**Features:**
- Bundle title
- Product list with quantities
- Price breakdown
- Savings amount
- "Add to Cart" button (not functional in preview)
- Image thumbnails (optional)

---

### 4. **PreviewStep**
**Location:** `components/Steps/PreviewStep.tsx`

**Responsibility:** Combined display of bundle details and customer preview

**Props:**
```typescript
interface PreviewStepProps {
  bundle: Partial<Bundle>;
  bundleType: BundleType;
}
```

**Features:**
- Summary section
- Detailed breakdown
- Customer-facing preview
- Offer terms

---

## Navigation Components

### 1. **MultiStepForm**
**Location:** `components/Navigation/MultiStepForm.tsx`

**Responsibility:** Container for 5-step form with navigation

**Props:**
```typescript
interface MultiStepFormProps {
  currentStep: number;
  totalSteps: number;
  steps: {
    label: string;
    component: React.ReactNode;
    isValid?: boolean;
  }[];
  onNextStep?: () => void;
  onPreviousStep?: () => void;
  onStepChange?: (step: number) => void;
  onComplete?: () => void;
}
```

**Features:**
- Step indicator (1 of 5)
- Progress bar
- Previous/Next buttons
- Step labels
- Validation feedback

---

### 2. **StepIndicator**
**Location:** `components/Navigation/StepIndicator.tsx`

**Responsibility:** Visual progress indicator

**Props:**
```typescript
interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: string[]; // Step labels
}
```

**Features:**
- Numbered circles
- Progress bar
- Current step highlight
- Completed steps checkmark

---

### 3. **BundleActionMenu**
**Location:** `components/Navigation/BundleActionMenu.tsx`

**Responsibility:** Dropdown menu for bundle actions (Edit, Duplicate, Archive, Delete)

**Props:**
```typescript
interface BundleActionMenuProps {
  bundleId: string;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
}
```

**Menu Options:**
- Duplicate Bundle
- Archive Bundle
- Delete Bundle
- View Analytics (future)

---

## Validation Components

### 1. **FieldError**
**Location:** `components/Forms/FieldError.tsx`

**Responsibility:** Display field-level error messages

**Props:**
```typescript
interface FieldErrorProps {
  error?: string;
  className?: string;
}
```

**Features:**
- Red text
- Error icon
- Tooltip on hover (optional)

---

### 2. **FormValidationSummary**
**Location:** `components/Forms/FormValidationSummary.tsx`

**Responsibility:** Display all form errors at top

**Props:**
```typescript
interface FormValidationSummaryProps {
  errors: { field: string; message: string }[];
}
```

**Features:**
- List of all errors
- Link to field (scroll/focus)
- Icon indicators

---

### 3. **WarningDialog**
**Location:** `components/Dialogs/WarningDialog.tsx`

**Responsibility:** Show warnings (same product buy/get, etc.)

**Props:**
```typescript
interface WarningDialogProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}
```

---

## Dialog/Modal Components

### 1. **ConfirmDeleteDialog**
**Location:** `components/Dialogs/ConfirmDeleteDialog.tsx`

**Responsibility:** Confirmation before deleting bundle

**Features:**
- Warning message
- Confirm/Cancel buttons
- Destructive action styling

---

### 2. **DuplicateBundleDialog**
**Location:** `components/Dialogs/DuplicateBundleDialog.tsx`

**Responsibility:** Create a copy of existing bundle

**Features:**
- New name input ("Copy of [original name]")
- Duplicate all settings
- Confirm/Cancel buttons

---

### 3. **ProductSelectionModal**
**Location:** `components/Dialogs/ProductSelectionModal.tsx`

**Responsibility:** Large modal for product multi-select

**Features:**
- Search field
- Product list with checkboxes
- Confirm/Cancel buttons
- Currently selected products shown

---

## State & Data Components

### 1. **BundleFormContext**
**Location:** `context/BundleFormContext.tsx`

**Responsibility:** Manage form state across multi-step flow

**Data:**
```typescript
interface BundleFormData {
  // Step 1
  name: string;
  description: string;
  bundleType: BundleType;
  active: boolean;

  // Step 2A (BOGO)
  buyProducts?: Product[];
  buyQuantity?: number;
  getProducts?: Product[];
  getQuantity?: number;

  // Step 2B (Product Bundle)
  products?: BundleProduct[];

  // Step 3
  discountType: DiscountType;
  discountValue?: number;
  perOrderLimit?: number;
  scheduleStart?: Date;
  scheduleEnd?: Date;

  // Metadata
  errors?: Record<string, string>;
  isValid?: boolean;
}
```

**Methods:**
- `updateFormData(data: Partial<BundleFormData>)`
- `setCurrentStep(step: number)`
- `validate(step: number): boolean`
- `resetForm()`

---

## Utility Components

### 1. **LoadingSpinner**
**Location:** `components/UI/LoadingSpinner.tsx`

**Responsibility:** Generic loading indicator

**Features:**
- Orange color theme
- Fullscreen or inline variants
- Custom size

---

### 2. **Toast Notification**
**Location:** `components/UI/Toast.tsx`

**Responsibility:** Success/error/warning notifications

**Features:**
- Auto-dismiss after 3-5 seconds
- Different styles for success/error/warning/info
- Action button (optional)

---

### 3. **EmptyState**
**Location:** `components/UI/EmptyState.tsx`

**Responsibility:** Display when no bundles exist

**Features:**
- Icon/image
- Message
- CTA button

---

### 4. **Skeleton Loaders**
**Location:** `components/UI/Skeleton.tsx`

**Responsibility:** Placeholder while loading

**Features:**
- Table row skeleton
- Card skeleton
- Custom shapes

---

## Typography & Layout Components

### 1. **PageHeader**
**Location:** `components/Layout/PageHeader.tsx`

**Responsibility:** Standard page heading

**Props:**
```typescript
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}
```

---

### 2. **Card**
**Location:** `components/Layout/Card.tsx`

**Responsibility:** Standard card container

**Features:**
- Padding
- Border
- Shadow
- Rounded corners

---

### 3. **SectionCard**
**Location:** `components/Layout/SectionCard.tsx`

**Responsibility:** Grouped section within flow (e.g., "BUY SECTION")

**Features:**
- Title
- Divider
- Content area

---

## Component Import Map

```typescript
// Pages
export { BundleListingPage } from './pages/Bundles/BundleListingPage';
export { CreateBundleFlow } from './pages/Bundles/CreateBundleFlow';
export { EditBundleFlow } from './pages/Bundles/EditBundleFlow';
export { BundleDetailPage } from './pages/Bundles/BundleDetailPage';

// Forms
export { BundleNameInput } from './components/Forms/BundleNameInput';
export { BundleTypeSelector } from './components/Forms/BundleTypeSelector';
export { ProductSelector } from './components/Forms/ProductSelector';
export { QuantityInput } from './components/Forms/QuantityInput';
export { DiscountTypeSelector } from './components/Forms/DiscountTypeSelector';
export { DateRangeSelector } from './components/Forms/DateRangeSelector';
export { ToggleSwitch } from './components/Forms/ToggleSwitch';

// Filters
export { BundleFiltersBar } from './components/Filters/BundleFiltersBar';
export { SearchField } from './components/Filters/SearchField';

// Tables
export { BundleTable } from './components/Tables/BundleTable';
export { ProductBundleTable } from './components/Tables/ProductBundleTable';

// Pricing
export { PricingCalculator } from './components/Pricing/PricingCalculator';
export { BundlePreviewCard } from './components/Preview/BundlePreviewCard';

// Navigation
export { MultiStepForm } from './components/Navigation/MultiStepForm';
export { StepIndicator } from './components/Navigation/StepIndicator';

// Dialogs
export { ProductSelectionModal } from './components/Dialogs/ProductSelectionModal';
export { ConfirmDeleteDialog } from './components/Dialogs/ConfirmDeleteDialog';
```

---

## Related Documents
- [Bundle Listing Page](01-BUNDLE-LISTING-PAGE.md)
- [BOGO Creation Flow](02-BOGO-CREATION-FLOW.md)
- [Product Bundle Flow](03-PRODUCT-BUNDLE-FLOW.md)
- [Data Model](06-DATA-MODEL.md)
