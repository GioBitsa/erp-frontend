// src/store/kanbanFilters.store.ts
import { create } from "zustand";

export type KanbanFilters = {
  uiSearch: string; // what user types
  search: string; // debounced value used for filtering / URL
  dateFrom: string;
  dateTo: string;
  minValue: number;
};

const DEFAULTS: KanbanFilters = {
  uiSearch: "",
  search: "",
  dateFrom: "",
  dateTo: "",
  minValue: 0,
};

type FiltersStore = KanbanFilters & {
  setFilters: (patch: Partial<KanbanFilters>) => void;
  clearFilters: () => void;

  // convenience setters
  setUiSearch: (v: string) => void;
  commitSearch: () => void; // set search = uiSearch.trim()
};

export const useKanbanFiltersStore = create<FiltersStore>((set, get) => ({
  ...DEFAULTS,

  setFilters: (patch) => set((s) => ({ ...s, ...patch })),

  clearFilters: () => set(DEFAULTS),

  setUiSearch: (v) => set({ uiSearch: v }),

  commitSearch: () => {
    const next = get().uiSearch.trim();
    set({ search: next });
  },
}));
