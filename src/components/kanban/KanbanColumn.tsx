"use client";

import React from "react";
import type { Inquiry, InquiryPhase } from "@/types/inquiry";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import KanbanCard from "./KanbanCard";

type Props = {
  id: InquiryPhase;
  title: string;
  items: Inquiry[];
  count: number;
  totalCHF: number;
  isDraggingAny?: boolean;
  onOpen?: (item: Inquiry) => void;
  updatingIds?: Record<string, boolean>;
  updateError?: Record<string, string | undefined>;
};

export default function KanbanColumn({
  id,
  title,
  items,
  count,
  totalCHF,
  onOpen,
  updatingIds,
  updateError,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <section className="flex min-h-0 min-w-85 max-w-85 flex-col">
      <header className="mb-2">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-xs text-gray-500">
          {count} inquiries · CHF {totalCHF.toLocaleString()}
        </p>
      </header>

      <div
        ref={setNodeRef}
        className={[
          "kanban-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto rounded-xl border bg-white p-3 transition",
          isOver ? "bg-gray-50" : "",
        ].join(" ")}
        data-dropzone={id}
      >
        <SortableContext
          items={items.map((x) => x.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item) => (
            <KanbanCard
              key={item.id}
              item={item}
              onOpen={onOpen}
              isSaving={!!updatingIds?.[item.id]}
              errorText={updateError?.[item.id]}
            />
          ))}
        </SortableContext>

        {items.length === 0 && (
          <div className="rounded-lg border border-dashed p-3 text-sm text-gray-500">
            Drop inquiries here
          </div>
        )}
      </div>
    </section>
  );
}
