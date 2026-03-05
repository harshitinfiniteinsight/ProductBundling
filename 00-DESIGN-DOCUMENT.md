# Product Bundling Feature - Complete Design Document

## Executive Summary

This document provides a comprehensive design specification for the **Product Bundling Feature** in the Universell admin dashboard. The feature enables merchants to create and manage two types of product bundles:

1. **BOGO (Buy X Get Y Free)** - Conditional promotions where customers buy products to receive free or discounted items
2. **Product Bundle** - Complementary product groupings sold as a package with optional discounts

The implementation follows existing Universell UI patterns (orange primary color, table-based listings, card-structured forms) and provides a seamless multi-step creation wizard (5 steps) for both bundle types.

---

## Quick Links

- [Bundle Listing Page](01-BUNDLE-LISTING-PAGE.md) - Main dashboard view
- [BOGO Creation Flow](02-BOGO-CREATION-FLOW.md) - 5-step wizard for BOGO bundles
- [Product Bundle Flow](03-PRODUCT-BUNDLE-FLOW.md) - 5-step wizard for product bundles
- [Component Breakdown](05-COMPONENT-BREAKDOWN.md) - All reusable components
- [Data Model & Schema](06-DATA-MODEL.md) - Database & API specifications
- [Edge Cases & Validation](07-EDGE-CASES.md) - Validation rules & error scenarios

---

## Feature Overview

### Key Objectives

✅ Provide merchants with flexible bundle creation tools  
✅ Support two distinct bundle types (BOGO + Product Bundle)  
✅ Enable time-limited promotions with scheduling  
✅ Maintain consistency with Universell admin design patterns  
✅ Provide clear pricing visibility and customer savings calculation  
✅ Enable easy bundle management (create, edit, duplicate, archive, delete)  

### Supported Features

| Feature | BOGO | Product Bundle | Description |
|---------|------|----------------|-------------|
| Multi-step creation | ✓ | ✓ | 5-step wizard for both types |
| Product selection | ✓ | ✓ | Searchable dropdown/modal |
| Quantity configuration | ✓ | ✓ | X buy qty, Y get qty (BOGO); qty per product (Bundle) |
| Individual discounts | ✗ | ✓ | Per-product discount within bundle |
| Bundle-level discount | ✓ (on get) | ✓ | Free/% discount/fixed amount |
| Scheduling | ✓ | ✓ | Optional start/end dates |
| Status toggle | ✓ | ✓ | Active/Inactive toggle on listing |
| Duplicate bundle | ✓ | ✓ | Create copy with "Copy of" prefix |
| Archive bundle | ✓ | ✓ | Soft delete (status = ARCHIVED) |
| Edit bundle | ✓ | ✓ | Modify all fields after creation |
| Search & filter | ✓ | ✓ | Name search, date filter, status filter, type filter |
| Analytics (future) | ✓ | ✓ | Usage stats, revenue tracking |

---

## User Flows

### High-Level User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│ Merchant navigates to "Manage Product Bundles"                  │
└──────────────────────────────────┬──────────────────────────────┘
                                   │
                ┌──────────────────┴──────────────────┐
                │                                     │
                ▼                                     ▼
    ┌──────────────────────┐            ┌──────────────────────┐
    │ View Bundle List     │            │ Create New Bundle    │
    │ • Filter            │            │ • 5-step Wizard      │
    │ • Search            │            │ • Choose Type        │
    │ • Sort              │            │ • Fill Details       │
    │ • Paginate          │            │ • Preview            │
    │ • Edit/Duplicate    │            │ • Save               │
    └──────────────────────┘            └──────────────────────┘
                │                              │
                │                              ▼
                │                    ┌──────────────────────┐
                │                    │ Conditional Path     │
                │                    │ • BOGO Flow          │
                │                    │ • Product Bundle Flow│
                │                    └──────────────────────┘
                │                              │
                │                    ┌─────────┴─────────┐
                │                    │                   │
                │            ┌───────▼────────┐   ┌─────▼────────┐
                │            │ BOGO Steps 2-5 │   │ Bundle Steps │
                │            │ • Buy/Get      │   │ 2-5          │
                │            │ • Discount     │   │ • Products   │
                │            │ • Preview      │   │ • Discount   │
                │            │ • Save         │   │ • Preview    │
                │            └────────────────┘   │ • Save       │
                │                                 └──────────────┘
                │                                      │
                ▼                                      ▼
    ┌─────────────────────────────────────────────────────┐
    │ Bundle Created Successfully                         │
    │ • Displayed in table                                │
    │ • Can edit, duplicate, archive, delete              │
    │ • Can toggle status (active/inactive)               │
    └─────────────────────────────────────────────────────┘
```

---

## Page Structure Hierarchy

```
Dashboard
├── Manage Bundles (Listing)
│   ├── Filters Bar
│   │   ├── Date Range Filter
│   │   ├── Status Filter
│   │   ├── Search Field
│   │   └── [+ Add New Bundle CTA]
│   ├── Bundle Table
│   │   ├── Columns: ID, Name, Type, Discount, Created On, Status, Actions
│   │   ├── Rows: [Bundle entries]
│   │   ├── Row Actions: View, Edit, Menu (Duplicate/Archive/Delete)
│   │   └── Status Toggles: On/Off switches (orange when active)
│   └── Pagination
│       ├── Rows per page selector
│       ├── Page numbers
│       └── Previous/Next buttons
│
├── Create Bundle Flow (Multi-step Wizard)
│   ├── Step Indicator (1 of 5, 2 of 5, etc.)
│   ├── Step 1: Bundle Basics
│   │   ├── Bundle Name input
│   │   ├── Bundle Type selector (BOGO / Product Bundle)
│   │   ├── Description textarea
│   │   └── Active toggle
│   │
│   ├── Step 2A: BOGO Terms (Conditional)
│   │   ├── Buy Products selector
│   │   ├── Buy Quantity input
│   │   ├── Get Products selector
│   │   ├── Get Quantity input
│   │   └── Per-Order Limit (optional)
│   │
│   ├── Step 2B: Product Bundle (Conditional)
│   │   ├── Product Selector (modal/dropdown)
│   │   ├── Inline Product Table
│   │   │   ├── Product | Qty | Price | Discount | Subtotal | Actions
│   │   │   └── [+ Add Product]
│   │   └── Subtotal display
│   │
│   ├── Step 3: Discount Configuration
│   │   ├── Discount Type selector (Free/% Discount/Fixed Amount)
│   │   ├── Discount Value input (conditional)
│   │   ├── Optional: Per-Order Limit
│   │   ├── Optional: Schedule (Start/End Date)
│   │   └── Real-time Pricing Preview
│   │
│   ├── Step 4: Preview
│   │   ├── Bundle Summary
│   │   ├── Detailed Breakdown
│   │   ├── Pricing Calculation
│   │   ├── Customer Savings
│   │   └── Customer-Facing Preview Card
│   │
│   ├── Step 5: Confirmation
│   │   ├── Final Review
│   │   ├── Validation Status
│   │   └── [Back] [Save Bundle]
│   │
│   └── Success Toast + Redirect to Listing
│
├── Edit Bundle Flow (Same as Create, with Pre-filled Data)
│   └── Can edit all fields and re-save
│
└── Bundle Detail Page (Read-Only)
    ├── Bundle Information
    ├── BOGO/Product Details (depending on type)
    ├── Pricing Information
    ├── Schedule (if applicable)
    └── Edit/Duplicate/Archive/Delete Actions
```

---

## Design System Alignment

### Color Palette

| Element | Color | Usage |
|---------|-------|-------|
| Primary CTA | Orange (#FF6B35) | "Add New", "Save Bundle", active toggles |
| Hover State | Dark Orange (#E55A2B) | Buttons on hover |
| Inactive | Gray (#999999) | Inactive toggles, disabled states |
| Badges | Light Gray (#F5F5F5) | Bundle type badges |
| Success | Green (#4CAF50) | Success toasts, checkmarks |
| Error | Red (#F44336) | Error messages, validation |
| Warning | Amber (#FFC107) | Warning dialogs |
| Text Primary | Dark Gray (#333333) | Main text |
| Text Secondary | Medium Gray (#666666) | Labels, help text |
| Border | Light Gray (#DDDDDD) | Card borders, separators |

### Typography

| Element | Font Size | Weight | Usage |
|---------|-----------|--------|-------|
| Page Title | 28px | Bold (700) | "Manage Product Bundles" |
| Section Header | 18px | SemiBold (600) | Step titles, card headers |
| Label | 14px | Medium (500) | Form labels, table headers |
| Body | 14px | Regular (400) | Descriptions, help text |
| Caption | 12px | Regular (400) | Timestamps, secondary info |
| Code/Error | 12px | Monospace | Error messages |

### Spacing

| Spacing | Value | Usage |
|---------|-------|-------|
| Compact | 8px | Inline spacing, icon margins |
| Default | 16px | Form field margins, card padding |
| Comfortable | 24px | Section spacing |
| Large | 32px | Page section spacing |
| Extra Large | 48px | Major section breaks |

### Borders & Shadows

- **Border Radius:** 4px (cards), 2px (inputs)
- **Border Width:** 1px (standard), 2px (focus states)
- **Shadow:** `0 2px 4px rgba(0,0,0,0.1)` (cards)
- **Hover Shadow:** `0 4px 8px rgba(0,0,0,0.15)` (interactive elements)

### Component Styling

**Card:**
- Background: White (#FFFFFF)
- Border: 1px solid #DDDDDD
- Padding: 16px
- Border-radius: 4px
- Box-shadow: 0 2px 4px rgba(0,0,0,0.1)

**Input Fields:**
- Background: White (#FFFFFF)
- Border: 1px solid #CCCCCC
- Padding: 10px 12px
- Border-radius: 2px
- Focus: 2px solid #FF6B35, Box-shadow: 0 0 0 3px rgba(255,107,53,0.1)

**Buttons:**
- Primary: Orange background, white text, 14px font
- Secondary: White background, gray text, gray border
- Hover: Darker shade
- Active: Even darker shade
- Disabled: Gray background, gray text, cursor: not-allowed

**Toggle Switch:**
- Width: 36px, Height: 20px
- On: Orange background, white circle
- Off: Gray background, white circle
- Animated transition: 200ms

---

## User Interactions

### Creating a BOGO Bundle

**Trigger:** User clicks "+ Add New Product Bundle"

**Step 1 - Bundle Basics:**
1. User enters bundle name
2. Selects "BOGO" from type selector
3. Optionally adds description
4. Ensures active toggle is ON
5. Clicks "Next Step"

**Step 2A - BOGO Terms:**
1. Clicks "Add Product" for buy section
2. Searches and selects products (e.g., "Coca Cola 2L")
3. Enters quantity to buy (e.g., 2)
4. Clicks "Add Product" for get section
5. Searches and selects products (e.g., "Sprite 2L")
6. Enters quantity to get (e.g., 1)
7. Optionally enables per-order limit and sets value (e.g., 1)
8. Clicks "Next Step"

**Step 3 - Discount:**
1. Selects discount type (default: Free)
2. If percentage, enters value (e.g., 50)
3. Optionally enables schedule and sets dates
4. Sees real-time preview: "Buy 2x Cola → Get 1x Sprite FREE"
5. Clicks "Next Step"

**Step 4 - Preview:**
1. Reviews summary of all settings
2. Views customer-facing preview
3. Sees pricing breakdown and savings
4. Clicks "Next Step"

**Step 5 - Confirmation:**
1. Reviews final summary
2. Clicks "Save Bundle"
3. Loading spinner appears
4. On success: Toast "Bundle created successfully!" + Redirect to listing
5. Bundle appears in table with new ID

---

### Creating a Product Bundle

**Trigger:** User clicks "+ Add New Product Bundle"

**Steps 1-2B:** Same as BOGO Step 1, then:

**Step 2B - Products:**
1. Clicks "[+ Add Product]" button
2. Product selector modal opens with search
3. User searches for products (e.g., "Coca Cola")
4. Selects products and sets quantities
5. For each product, optionally adds individual discount
6. Clicks "Add to Bundle" or confirms selection
7. Products appear in table rows with ability to:
   - Edit (inline modal) - change qty, discount
   - Delete (confirm dialog) - remove from bundle
8. Can add multiple products
9. Clicks "Next Step" (table shows subtotal)

**Step 3 - Bundle Discount:**
1. Selects bundle discount type:
   - No Discount (sell at sum)
   - Fixed Price (enter price)
   - % Discount (enter percentage)
2. Sees real-time preview with final price and savings
3. Optionally enables and sets schedule
4. Clicks "Next Step"

**Steps 4-5:** Same preview and confirmation as BOGO

---

### Editing a Bundle

**Trigger:** User clicks edit icon (✎) on a bundle row

1. Opens create flow with pre-filled data
2. User can modify any field
3. Step navigation shows current values
4. Can skip to specific step with sidebar
5. On save: Shows "Bundle updated successfully!" toast
6. Stays on listing page (refreshes bundle row)

---

### Bundle Management Actions

**Toggle Status:**
- User clicks toggle switch in Status column
- Immediately updates: Show loading state, then checkmark
- Toast: "[Bundle Name] activated/deactivated"

**Duplicate Bundle:**
- User clicks menu (⋮) → "Duplicate Bundle"
- New bundle created with name "Copy of [original]"
- Duplicated with all same settings
- Optional: Opens dialog to rename first
- Toast: "Bundle duplicated successfully!"
- New bundle appears in table

**Archive Bundle:**
- User clicks menu (⋮) → "Archive Bundle"
- Confirm dialog: "Archive this bundle? It will no longer appear to customers."
- Bundle status changes to ARCHIVED
- Removed from listing unless "Show archived" filter applied
- Toast: "[Bundle Name] archived"

**Delete Bundle:**
- User clicks menu (⋮) → "Delete Bundle"
- Confirm dialog: "Permanently delete this bundle? This cannot be undone."
- Bundle completely removed from DB
- Toast: "[Bundle Name] deleted"
- Removed from table

---

## Mobile & Responsive Considerations

### Desktop (1920px and above)
- Full table display with all columns
- Horizontal filter bar
- Spacious card layouts

### Tablet (1024px - 1919px)
- Table columns: ID, Name, Type, Status, Actions
- Hide "Bundle Discount" column (show in detail)
- Collapse some form sections
- Sticky filter bar

### Mobile (< 1024px)
- Card-based layout instead of table
- Swipeable actions
- Full-width forms
- Vertical filter panel
- Stack navigation above content

### Touch-Friendly Elements
- Button minimum: 44px × 44px tap target
- Toggle switches: Increase interactive area
- Modal overlays: Full screen
- Keyboard support for all interactions

---

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading**
   - Load bundles on demand (pagination)
   - Load products only when modal/dropdown opened
   - Virtualize product lists (10,000+ products)

2. **Caching**
   - Cache product list (5 min TTL)
   - Cache bundle list per filter (1 min TTL)
   - Cache filter options (1 hour TTL)

3. **Debouncing**
   - Search input: 500ms debounce
   - Auto-save draft: 2s debounce
   - Resize events: 300ms debounce

4. **Server-Side Processing**
   - Sorting: Server-side (indexed columns)
   - Filtering: Server-side (use DB indexes)
   - Search: Server-side full-text search

5. **Pagination**
   - Default: 10 items per page
   - Max: 100 items per page
   - Load only current page data

---

## Accessibility (WCAG 2.1 AA)

### Keyboard Navigation
- ✓ Tab order: Left to right, top to bottom
- ✓ Enter/Space to activate buttons
- ✓ Arrow keys for dropdowns and date pickers
- ✓ Escape to close modals
- ✓ Focus management (outline visible)

### Screen Readers
- ✓ Semantic HTML (buttons, labels, fieldsets)
- ✓ ARIA labels for toggles, modals
- ✓ Form field associations
- ✓ Error message announcements
- ✓ Loading states announced

### Visual
- ✓ Contrast ratio ≥ 4.5:1 for text
- ✓ Color not sole means of information
- ✓ Resize text to 200% without layout break
- ✓ Focus indicators clearly visible

### Motor Control
- ✓ No click-only interactions
- ✓ Touchscreen-friendly tap targets (≥ 44px)
- ✓ Avoid rapid/timed interactions
- ✓ Drag-and-drop alternatives

---

## Testing Strategies

### Unit Testing
- Component rendering with various props
- Form validation logic
- Calculation functions (pricing, discounts)
- Error handling

### Integration Testing
- Multi-step form navigation
- Filter interactions
- Search functionality
- CRUD operations on bundles

### E2E Testing (Cypress/Playwright)
- Complete BOGO creation flow
- Complete Product Bundle creation flow
- Edit bundle flow
- Bundle listing and filtering
- Mobile responsiveness

### Performance Testing
- Bundle list load time < 2s (100 items)
- Product search < 500ms
- Create bundle API < 1s
- Form validation < 50ms

### User Testing
- Merchant feedback on flow clarity
- Error message comprehensibility
- Mobile usability
- Pricing calculation visibility

---

## Success Metrics

### Adoption
- % of merchants using bundle feature
- Bundles created per week
- Bundles per store (average)

### Engagement
- Bundle view-to-cart conversion
- Bundle add-to-cart rate
- Bundle purchase rate

### Performance
- Bundle creation time (average steps taken)
- Form completion rate (% that finish)
- Edit frequency (# edits per bundle)

### Customer Impact
- Bundle revenue % of total
- Average order value (bundled vs non-bundled)
- Inventory turnover improvement

---

## Rollout Plan

### Phase 1: Closed Beta (Week 1-2)
- 10-20 beta merchants
- Collect feedback
- Fix critical bugs

### Phase 2: Limited Release (Week 3-4)
- 100 merchants
- Monitor performance
- Gather usage data

### Phase 3: General Availability (Week 5+)
- All merchants
- Full support
- Analytics dashboard

### Rollback Plan
- If critical issues: Feature flag to disable
- Data migration not required (backward compatible)
- Old bundles remain intact

---

## Future Enhancements

### Quick Wins (Priority 1)
- [ ] Bundle priority/ordering on storefront
- [ ] Bulk edit (multiple bundles at once)
- [ ] Bundle templates (start from existing)
- [ ] Email notifications when bundles active/expire

### Medium Term (Priority 2)
- [ ] Advanced analytics dashboard
- [ ] A/B testing bundles
- [ ] Recommendation engine
- [ ] Customer segment targeting

### Long Term (Priority 3)
- [ ] Dynamic pricing (AI-powered discounts)
- [ ] Bundle inventory management
- [ ] Cross-store bundle sharing
- [ ] Mobile app support
- [ ] Webhook events for bundle actions

---

## Summary

The Product Bundling Feature provides Universell merchants with a powerful tool to create flexible promotions and product groupings. By supporting two distinct bundle types (BOGO and Product Bundle) with a clear, multi-step wizard flow, merchants can easily configure discounts, pricing, and scheduling. The feature integrates seamlessly with existing Universell admin patterns and provides real-time pricing visibility for both merchants and customers.

---

## Document Navigation

| Document | Purpose |
|----------|---------|
| [01-BUNDLE-LISTING-PAGE.md](01-BUNDLE-LISTING-PAGE.md) | Listing page design with filters, table, pagination |
| [02-BOGO-CREATION-FLOW.md](02-BOGO-CREATION-FLOW.md) | BOGO bundle creation (5 steps) |
| [03-PRODUCT-BUNDLE-FLOW.md](03-PRODUCT-BUNDLE-FLOW.md) | Product bundle creation (5 steps) |
| [05-COMPONENT-BREAKDOWN.md](05-COMPONENT-BREAKDOWN.md) | All reusable components and architecture |
| [06-DATA-MODEL.md](06-DATA-MODEL.md) | Database schema, API contracts, data types |
| [07-EDGE-CASES.md](07-EDGE-CASES.md) | Validation rules, error scenarios, boundary conditions |

---

**Version:** 1.0  
**Last Updated:** March 5, 2026  
**Status:** Design Complete - Ready for Development
