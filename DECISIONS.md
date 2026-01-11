---

# 📄 `DECISIONS.md`

```md
# Technical Decisions — Inquiry Kanban Board

This document explains key technical and architectural decisions made during development.

---

## Drag-and-Drop Library Choice

**Library:** `@dnd-kit`

### Why?

- Headless and highly composable
- Excellent TypeScript support
- Works well with controlled state
- Better performance and flexibility than react-beautiful-dnd
- Supports sortable lists and custom drag handles

### Trade-offs

- Slightly more setup compared to higher-level libraries
- Requires manual handling of optimistic state

---

## State Management Strategy

### Why Zustand?

- Minimal boilerplate
- Simple global store without React Context nesting
- Excellent TypeScript inference
- Easy to combine global and local state

### How state is structured

- **Filters**: global Zustand store
- **Board items**: local state in KanbanBoard for smooth drag UX
- **Optimistic updates**: local board state + rollback on API failure

This hybrid approach keeps UI responsive while avoiding unnecessary global complexity.

---

## Optimistic Updates Design

- Card phase updates immediately on drag
- API request triggered on drag end
- If API fails:
  - Card reverts to original phase
  - Error message shown on the card
- While updating:
  - Dragging disabled
  - “Saving…” indicator shown

This provides fast feedback while maintaining correctness.

---

## Filter Persistence in URL

Filters are synchronized with URL query params to:

- Enable sharing filtered views
- Preserve state on refresh
- Improve usability for internal users

Implementation:

- URL → Store hydration on mount
- Store → URL synchronization on change
- Debounced updates to avoid history spam

---

## API Design (Mock)

### Why API routes?

- Mimics real backend integration
- Keeps UI logic realistic
- Enables optimistic update testing

### Implementation details

- In-memory data store (persisted via `globalThis`)
- Artificial 500ms delay to surface loading states
- Proper error handling and status codes

---

## UX Decisions

- Horizontal scroll instead of stacking columns on tablet
- Subtle visual feedback instead of heavy animations
- Inline error messages on cards instead of global toasts
- Detail panel instead of navigation for better context retention

---

## What I Would Improve With More Time

- Persist column ordering
- Skeleton loaders instead of text loading
- Keyboard drag-and-drop support
- Multi-user conflict resolution
- Permission-based actions
- Accessibility audit (ARIA roles)

---

## Final Notes

This project prioritizes:

- Clarity of data flow
- Predictable state transitions
- Maintainable component structure
- Realistic production patterns

The architecture is intentionally simple but extensible.
