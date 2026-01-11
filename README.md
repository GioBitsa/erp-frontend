# Inquiry Kanban Board — smti ERP System

This project is a frontend-focused Next.js application implementing an **Inquiry Kanban Board** for a B2B event management ERP system.

The board allows internal staff to track hotel inquiries across multiple phases, update their status via drag-and-drop, filter inquiries, and inspect full inquiry details.

---

## 🚀 Tech Stack

- **Next.js 14 (App Router)**
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Zustand** (state management)
- **@dnd-kit** (drag-and-drop)

---

## 📦 Features

### Kanban Board

- 4 inquiry phases:
  - New
  - Sent to Hotels
  - Offers Received
  - Completed
- Drag-and-drop between columns
- Optimistic UI updates with rollback on error
- Column headers show:
  - Inquiry count
  - Total potential value (CHF)
- Responsive horizontal layout (tablet-friendly)

### Inquiry Cards

- Compact overview:
  - Client name
  - Event date (relative format)
  - Guest count
  - Potential value (CHF)
- High-value indicator for inquiries over CHF 50,000
- Clickable to open detailed view

### Filter Panel

- Search by client name (debounced)
- Date range filter
- Minimum value slider / input
- Active filter counter
- Clear all filters
- Filter state persisted in URL query params

### Detail Panel

- Full inquiry information
- Associated hotels list
- Notes
- Phase change dropdown (alternative to drag-and-drop)
- Created / updated timestamps

### API (Mock)

- Implemented using Next.js App Router API routes
- `GET /api/inquiries` with filters
- `PATCH /api/inquiries/:id` for phase updates
- Simulated 500ms network delay

---

## 🧠 State Management

- **Zustand** is used for:
  - Filter state
  - URL synchronization
- Kanban board uses **local optimistic state** for smooth drag-and-drop UX
- Rollback logic restores previous state if API update fails
- Loading and error states handled at the Shell level

---

## ▶️ Running the Project

npm install
npm run dev
