// src/components/kanban/FiltersUrlSync.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useKanbanFiltersStore } from "@/store/kanban.store";

export default function FiltersUrlSync() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const { search, dateFrom, dateTo, minValue } = useKanbanFiltersStore();

  useEffect(() => {
    const params = new URLSearchParams();

    if (search) params.set("q", search);
    if (dateFrom) params.set("from", dateFrom);
    if (dateTo) params.set("to", dateTo);
    if (minValue > 0) params.set("min", String(minValue));

    const next = params.toString();
    const current = sp.toString();

    if (next === current) return;

    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  }, [search, dateFrom, dateTo, minValue, router, pathname, sp]);

  return null;
}
