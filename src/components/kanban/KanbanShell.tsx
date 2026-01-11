"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Inquiry, InquiryPhase } from "@/types/inquiry";
import KanbanSidePanel from "./KanbanSidePanel";
import dynamic from "next/dynamic";
import { useKanbanFiltersStore } from "@/store/kanban.store";

const KanbanBoard = dynamic(() => import("@/components/kanban/KanbanBoard"), {
  ssr: false,
});

type Props = {
  inquiries: Inquiry[]; // fallback/static
};

export default function KanbanShell({ inquiries }: Props) {
  const [selected, setSelected] = useState<Inquiry | null>(null);

  const [items, setItems] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { search, dateFrom, dateTo, minValue } = useKanbanFiltersStore();

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (dateFrom) params.set("from", dateFrom);
    if (dateTo) params.set("to", dateTo);
    if (minValue > 0) params.set("min", String(minValue));
    return params.toString();
  }, [search, dateFrom, dateTo, minValue]);

  const abortRef = useRef<AbortController | null>(null);

  const load = async () => {
    // cancel previous request
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch(
        `/api/inquiries${queryString ? `?${queryString}` : ""}`,
        { cache: "no-store", signal: ac.signal }
      );

      if (!res.ok) {
        const msg = (await res.json().catch(() => null))?.message;
        throw new Error(msg || "Failed to load inquiries");
      }

      const data = (await res.json()) as Inquiry[];
      setItems(data);
    } catch (e: any) {
      // ignore abort errors
      if (e?.name === "AbortError") return;
      setError(e?.message ?? "Something went wrong");
      // optional fallback
      setItems(inquiries);
    } finally {
      setIsLoading(false);
    }
  };

  // debounce load when filters change
  useEffect(() => {
    const t = window.setTimeout(() => load(), 250);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);

  // Phase update API call (KanbanBoard will do optimistic UI + rollback on thrown error)
  const handlePhaseChange = async ({
    inquiryId,
    to,
  }: {
    inquiryId: string;
    from: InquiryPhase;
    to: InquiryPhase;
  }) => {
    const res = await fetch(`/api/inquiries/${inquiryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phase: to }),
    });

    if (!res.ok) {
      const msg = (await res.json().catch(() => null))?.message;
      throw new Error(msg || "Failed to update phase");
    }

    // Optional: keep Shell items in sync with server response
    const updated = (await res.json()) as Inquiry;
    setItems((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
        Loading inquiries…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3">
        <p className="text-sm text-red-600">{error}</p>
        <button
          onClick={load}
          className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <KanbanBoard
        inquiries={items}
        onPhaseChange={handlePhaseChange}
        onOpenInquiry={setSelected}
      />
      <KanbanSidePanel inquiry={selected} onClose={() => setSelected(null)} />
    </>
  );
}
