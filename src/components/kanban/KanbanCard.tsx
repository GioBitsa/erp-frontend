"use client";

import React from "react";
import type { Inquiry } from "@/types/inquiry";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { formatRelativeDate } from "@/utils/date";
import clsx from "clsx";

type Props = {
  item: Inquiry;
  onOpen?: (item: Inquiry) => void;
  isSaving?: boolean;
  errorText?: string;
};

export default function KanbanCard({
  item,
  onOpen,
  isSaving,
  errorText,
}: Props) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, disabled: !!isSaving });
  const { relative, exact } = formatRelativeDate(item.eventDate);

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isHighValue = item.potentialValue > 50_000;

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={clsx(
        "rounded-lg border bg-white p-3",
        isHighValue ? "border-amber-400 bg-amber-50/40" : "",
        isSaving ? "opacity-80" : "",
        errorText ? "border-red-300" : ""
      )}
      data-card-id={item.id}
      onClick={() => onOpen?.(item)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen?.(item);
        }
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate font-medium">{item.clientName}</p>

            {isHighValue && (
              <span className="shrink-0 rounded-full border border-amber-400 bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                HIGH
              </span>
            )}

            {isSaving && (
              <span className="shrink-0 rounded-full border border-gray-300 bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                Saving…
              </span>
            )}
          </div>

          <p className="text-xs text-gray-500" title={exact}>
            {relative} · {item.guestCount} guests
          </p>
        </div>

        <button
          type="button"
          aria-label="Drag card"
          className="shrink-0 cursor-grab rounded-md border px-2 py-1 text-sm"
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()} // important later when card becomes clickable
        >
          ⠿
        </button>
      </div>

      <p className="mt-2 text-sm font-semibold">
        CHF {item.potentialValue.toLocaleString()}
      </p>

      {errorText && (
        <p className="mt-2 rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700">
          {errorText}
        </p>
      )}
    </article>
  );
}
