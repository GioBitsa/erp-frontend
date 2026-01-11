// src/components/kanban/FiltersUrlHydrate.tsx
"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useKanbanFiltersStore } from "@/store/kanban.store";

const toNum = (v: string | null, fallback = 0) => {
  if (!v) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

export default function FiltersUrlHydrate() {
  const sp = useSearchParams();
  const setFilters = useKanbanFiltersStore((s) => s.setFilters);

  useEffect(() => {
    const q = sp.get("q") ?? "";
    setFilters({
      uiSearch: q, // keep input in sync
      search: q.trim(), // keep debounced value in sync too
      dateFrom: sp.get("from") ?? "",
      dateTo: sp.get("to") ?? "",
      minValue: toNum(sp.get("min"), 0),
    });
  }, [sp, setFilters]);

  return null;
}
