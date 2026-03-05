# Bundle Listing Page - Design Specification

## Overview
The Bundle Listing Page displays all product bundles (both BOGO and Product Bundles) in a searchable, filterable table format. This page serves as the main hub for managing all bundling activities.

## Page Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ Manage Build & Buy Catcher > Manage Product Bundles            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ Filters Row:                                                     │
│ ┌──────────────────┐ ┌──────────────────┐                      │
│ │ Select Date      │ │ Select Status    │                      │
│ └──────────────────┘ └──────────────────┘                      │
│                                  [+ Add New Product Bundle] ──► │
│                                                                  │
│ Show ▼ 10 entries    Search field  [Search]  [+ Filter]        │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ ID │ Bundle Name │ Bundle Type │ Discount │ Created On │   │ │
│ ├────────────────────────────────────────────────────────────┤ │
│ │ 328 │ Testing Payment │ BOGO │ 10% │ 15.10.2023 │ 🔘 │ 👁 │ │
│ │ 369 │ New Test │ Bundle │ 5% │ 15.10.2023 │ 🔘 │ 👁 │ │
│ │ 743 │ Inventory Variables │ BOGO │ 5% │ 15.10.2023 │ 🔘 │ 👁 │ │
│ ├────────────────────────────────────────────────────────────┤ │
│ Showing 1 to 10 of 19,420 entries                              │
│ ◄ 1 2 3 ... 47 ►                                               │
└─────────────────────────────────────────────────────────────────┘
```

## Column Specifications

| Column | Type | Width | Content | Sortable | Actions |
|--------|------|-------|---------|----------|---------|
| **ID** | Number | 60px | Bundle ID (clickable to view detail) | Yes | - |
| **Bundle Name** | Text | 250px | Name/title of the bundle | Yes | - |
| **Bundle Type** | Badge | 120px | "BOGO" (orange) or "Bundle" (gray) | Yes | - |
| **Bundle Discount** | Text | 120px | Discount value (10%, $50, Free, etc.) | Yes | - |
| **Created On** | DateTime | 200px | Date + Time + Creator name | Yes | - |
| **Status** | Toggle | 80px | On/Off toggle switch (orange when active) | No | - |
| **Actions** | Icons | 120px | View (👁), Edit (✎), Menu (⋮) | No | Yes |

## Filters

### Top Filter Bar (Persistent)
```
┌─────────────────────────────────────┬──────────────────────┐
│ [Select Date ▼]                     │ [Select Status ▼]    │
│ • Date range picker (calendar)       │ • Active             │
│ • Presets: Today/Week/Month          │ • Inactive           │
│ • Custom range                       │ • All (default)      │
└─────────────────────────────────────┴──────────────────────┘
```

### Additional Filters (Via Filter Button/Panel)
- **Bundle Type Filter**
  - BOGO
  - Product Bundle
  - All (default)

- **Search Field**
  - Real-time search on: Bundle Name, Bundle ID, Creator
  - Debounced (500ms) for performance

## Action Icons & Behaviors

| Icon | Label | Action | Page |
|------|-------|--------|------|
| 👁 | View | Open bundle details (read-only) | Bundle Detail Page |
| ✎ | Edit | Open edit flow | Edit Bundle Flow |
| ⋮ | Menu | Show dropdown with: Duplicate, Archive, Delete | Inline Menu |

### Menu Dropdown Options
```
┌──────────────────────┐
│ Duplicate Bundle     │ → Creates copy of bundle (all fields, "Copy of" prefix)
│ Archive Bundle       │ → Soft delete (moves to "Inactive" status)
│ Delete Bundle        │ → Permanent delete with confirmation
│ View Analytics       │ → Opens usage stats (future feature)
└──────────────────────┘
```

## Pagination

- Default rows per page: 10
- Options: 10, 25, 50, 100
- Total entries count: "Showing X to Y of Z entries"
- Pagination controls: Previous, numbered pages (1, 2, 3...), ellipsis, Next

## Button States & Styling

### "Add New Product Bundle" Button
- **Position:** Top right corner
- **Style:** Orange background (#FF6B35 or similar), white text
- **State:** 
  - Default: Solid orange
  - Hover: Darker orange
  - Active: Pressed state
- **Icon:** Plus (+)
- **Text:** "Add New Product Bundle"

### Toggle Switch (Status)
- **Color when ON:** Orange (#FF6B35)
- **Color when OFF:** Gray (#999999)
- **Size:** Standard toggle (20x36px)
- **Behavior:** Click to toggle, shows confirmation toast

## Empty State

When no bundles exist:
```
┌─────────────────────────────────────┐
│                                     │
│   📦 No bundles yet                 │
│                                     │
│   Create your first bundle to get   │
│   started with BOGO or Product      │
│   bundling strategies.              │
│                                     │
│   [+ Add New Product Bundle]        │
│                                     │
└─────────────────────────────────────┘
```

## Responsive Behavior

- **Desktop (1920px+):** Full table with all columns visible
- **Tablet (1024px):** Hide "Created On", "Actions" in menu
- **Mobile:** Table transforms to card layout, actions in menu

## Search & Filter Interactions

1. **Search:** Real-time filtering as user types
2. **Date Filter:** Opens calendar picker, filters results
3. **Status Filter:** Dropdown selection, immediate filter
4. **Bundle Type:** Checkbox options (if using filter panel)
5. **Filters can be combined** for AND logic

## Data Validation

- Date filter: Must be valid date range
- Search: Minimum 1 character to search (max 100 characters)
- All filters default to "show all" state

## Sort Behavior

Clickable column headers toggle: ↑ (ascending) / ↓ (descending) / no sort

Default sort: Created On (newest first)

---

## Related Pages
- [BOGO Creation Flow](02-BOGO-CREATION-FLOW.md)
- [Product Bundle Creation Flow](03-PRODUCT-BUNDLE-FLOW.md)
- [Bundle Detail/View Page](04-BUNDLE-DETAIL-PAGE.md)
- [Components Breakdown](05-COMPONENT-BREAKDOWN.md)
