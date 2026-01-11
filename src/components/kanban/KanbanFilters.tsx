// src/components/kanban/KanbanFilters.tsx
"use client";

import { useKanbanFiltersStore } from "@/store/kanban.store";
import React, { useEffect, useMemo } from "react";

const MIN_VALUE_MIN = 0;
const MIN_VALUE_MAX = 200_000;
const MIN_VALUE_STEP = 500;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function KanbanFilters() {
  const {
    uiSearch,
    search,
    dateFrom,
    dateTo,
    minValue,
    setFilters,
    setUiSearch,
    commitSearch,
    clearFilters,
  } = useKanbanFiltersStore();

  // debounce uiSearch -> search
  useEffect(() => {
    const t = window.setTimeout(() => commitSearch(), 300);
    return () => window.clearTimeout(t);
  }, [uiSearch, commitSearch]);

  const handleDateFromChange = (nextFrom: string) => {
    setFilters({
      dateFrom: nextFrom,
      dateTo: nextFrom && dateTo && nextFrom > dateTo ? nextFrom : dateTo,
    });
  };

  const handleDateToChange = (nextTo: string) => {
    setFilters({
      dateTo: nextTo,
      dateFrom: nextTo && dateFrom && nextTo < dateFrom ? nextTo : dateFrom,
    });
  };

  const handleMinValue = (next: number) => {
    const safe = Number.isFinite(next) ? next : 0;
    setFilters({ minValue: clamp(safe, MIN_VALUE_MIN, MIN_VALUE_MAX) });
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (search.trim()) count += 1;
    if (dateFrom) count += 1;
    if (dateTo) count += 1;
    if (minValue > MIN_VALUE_MIN) count += 1;
    return count;
  }, [search, dateFrom, dateTo, minValue]);

  return (
    <section className="w-full rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
          <input
            type="search"
            placeholder="Search by client name"
            value={uiSearch}
            onChange={(e) => setUiSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
            <span className="text-gray-500">Active filters</span>
            <span className="rounded-full bg-gray-900 px-2 py-0.5 text-xs text-white">
              {activeFilterCount}
            </span>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
          >
            Clear all
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-gray-500">Date range</label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => handleDateFromChange(e.target.value)}
              max={dateTo || undefined}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => handleDateToChange(e.target.value)}
              min={dateFrom || undefined}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs text-gray-500">
            Minimum value
          </label>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min={MIN_VALUE_MIN}
              max={MIN_VALUE_MAX}
              step={MIN_VALUE_STEP}
              value={minValue}
              onChange={(e) => handleMinValue(Number(e.target.value))}
              className="w-full"
            />

            <input
              type="number"
              min={MIN_VALUE_MIN}
              max={MIN_VALUE_MAX}
              step={MIN_VALUE_STEP}
              value={minValue}
              onChange={(e) => handleMinValue(Number(e.target.value))}
              className="w-28 rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>

          <p className="mt-1 text-xs text-gray-500">
            CHF {minValue.toLocaleString()}+
          </p>
        </div>
      </div>
    </section>
  );
}
