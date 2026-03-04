# Active Context: CFS Terminal Operating System

## Current State

**Application Status**: ✅ Fully Built & Deployed

The application is a complete CFS (Container Freight Station) Terminal Operating System for Indian port terminals, built on Next.js 16 with TypeScript and Tailwind CSS 4.

## Recently Completed

- [x] Full CFS TOS implementation from scratch
- [x] Dashboard with live stats, charts (recharts), yard occupancy trends
- [x] Yard Map with SVG visualization, block occupancy bars, container slot dots
- [x] Container Tracking with full details drawer, demurrage alerts, sorting/filtering
- [x] Gate Management with QR scanner simulation, entry/exit control, pending trucks
- [x] Truck Token System with token issuance form, QR display, truck queue
- [x] Weighbridge Integration with live weight display, slip generation, bar charts
- [x] TAX Invoice with GST compliance (CGST/SGST/IGST), line items, bank details
- [x] ICEGATE/CBIC Compliance with BE tracking, examination orders, OOC status, compliance checklist
- [x] Shared UI: Badge component with status variants, Sidebar navigation, TopBar with live IST clock
- [x] Type definitions for all entities (Container, Truck, Token, Gate, Weighbridge, Invoice, IceGate)
- [x] Mock data for all modules with realistic Indian port data
- [x] Build passing, TypeScript clean, ESLint clean
- [x] Delivery Order (DO) Management module — DO lifecycle, document checklist, approval/release workflow

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Dashboard | ✅ Ready |
| `src/app/yard-map/page.tsx` | Yard Map Visualization | ✅ Ready |
| `src/app/containers/page.tsx` | Container Tracking | ✅ Ready |
| `src/app/gate/page.tsx` | Gate QR Scanning | ✅ Ready |
| `src/app/tokens/page.tsx` | Truck Token System | ✅ Ready |
| `src/app/weighbridge/page.tsx` | Weighbridge Integration | ✅ Ready |
| `src/app/invoices/page.tsx` | TAX Invoice (GST) | ✅ Ready |
| `src/app/icegate/page.tsx` | ICEGATE/CBIC Compliance | ✅ Ready |
| `src/app/delivery-orders/page.tsx` | Delivery Order Management | ✅ Ready |
| `src/components/layout/Sidebar.tsx` | Navigation sidebar | ✅ Ready |
| `src/components/layout/TopBar.tsx` | Top bar with IST clock | ✅ Ready |
| `src/components/ui/Badge.tsx` | Status badge component | ✅ Ready |
| `src/lib/types.ts` | TypeScript type definitions | ✅ Ready |
| `src/lib/mock-data.ts` | Mock data for all modules | ✅ Ready |

## Tech Stack Additions

- `lucide-react` — Icons
- `recharts` — Charts (bar, pie, line)
- `date-fns` — Date utilities

## CFS TOS Features Implemented

### 1. Dashboard
- 8 stat cards (containers, trucks, gate in/out, invoices)
- Weekly truck traffic bar chart
- Container status pie chart
- Yard occupancy line chart
- Recent containers table
- Recent gate activity table
- Demurrage alert banner

### 2. Yard Map
- SVG-based yard layout with 6 blocks (Import A/B, Reefer R, Hazmat H, Export E, Empty MT)
- Color-coded blocks by type
- Occupancy progress bars per block
- Container slot dots (color by status)
- Zoom in/out controls
- Block selection with container list
- Container detail modal

### 3. Container Tracking
- Full table with sorting, filtering by status/type
- Search by container no, BL, consignee, vessel
- Side drawer with complete container details
- Demurrage warning for overdue containers
- Reefer temperature and Hazmat IMO class display

### 4. Gate Management
- 4 gate cards (GATE-1 to GATE-4) with status
- QR scanner simulation with camera frame animation
- Manual token input with validation
- Success/error/warning scan results
- Gate IN / Gate OUT action buttons
- All gate entries table
- Pending trucks list

### 5. Truck Token System
- Token cards with status badges
- Issue new token modal form
- Token detail modal with QR code display
- Print token button
- Truck queue panel

### 6. Weighbridge
- Live weight display (gross/tare/net)
- Current vehicle info panel
- Weight bar chart
- Records table with all weighings
- Weighbridge slip detail modal
- New entry form

### 7. TAX Invoice (GST)
- Invoice list with status filter
- Full invoice preview with:
  - Bill From / Bill To with GSTIN, PAN
  - Line items with SAC codes
  - CGST/SGST/IGST breakdown
  - Bank details
  - Mark as Paid / Send Reminder actions

### 8. ICEGATE / CBIC
- ICEGATE connection status banner
- BE (Bill of Entry) table with status
- BE detail panel with full customs info
- CBIC notices panel
- Compliance checklist tab
- Duty summary
- Regulatory agencies status
- Reports download tab

## Session History

| Date | Changes |
|------|---------|
| 2024-03-04 | Complete CFS TOS built from scratch with all 8 modules |
| 2026-03-04 | Added Delivery Order (DO) Management module (9th module) |
