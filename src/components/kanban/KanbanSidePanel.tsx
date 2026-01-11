import React, { useEffect, useMemo, useState } from "react";
import type { Inquiry, InquiryPhase } from "@/types/inquiry";
import { format } from "date-fns";
import { formatDate, formatDateTime } from "@/utils/date";

type Props = {
  inquiry: Inquiry | null;
  onClose: () => void;
  onPhaseChange?: (id: string, phase: InquiryPhase) => void;
};

function FieldRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <p className="text-xs text-gray-500">{label}</p>
      <div className="text-right text-sm font-medium text-gray-900">
        {value}
      </div>
    </div>
  );
}

export default function KanbanSidePanel({
  inquiry,
  onClose,
  onPhaseChange,
}: Props) {
  // ✅ Hooks must run every render (even when inquiry is null)
  const phaseOptions = useMemo<InquiryPhase[]>(
    // Replace with your real phases if different
    () => ["new", "offers_received", "sent_to_hotels", "completed"],
    []
  );

  const [phase, setPhase] = useState<InquiryPhase>("new");

  useEffect(() => {
    if (!inquiry) return;
    setPhase(inquiry.phase);
  }, [inquiry?.id, inquiry?.phase]); // safe deps

  const handlePhaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!inquiry) return;
    const next = e.target.value as InquiryPhase;
    setPhase(next);
    onPhaseChange?.(inquiry.id, next);
  };

  // ✅ now you can early return safely (hooks already ran)
  if (!inquiry) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {/* backdrop */}
      <div
        className="pointer-events-auto absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* panel */}
      <aside className="pointer-events-auto absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          <header className="flex items-start justify-between gap-3 border-b p-4">
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold">
                {inquiry.clientName}
              </p>
              <p className="text-sm text-gray-500">Inquiry {inquiry.id}</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-md border px-3 py-1 text-sm"
              aria-label="Close panel"
            >
              Close
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {/* Overview */}
            <div className="rounded-lg border p-3 space-y-3">
              <p className="text-sm font-semibold">Overview</p>

              <FieldRow label="Client" value={inquiry.clientName} />
              <FieldRow label="Contact person" value={inquiry.contactPerson} />
              <FieldRow label="Event type" value={inquiry.eventType} />
              <FieldRow
                label="Event date"
                value={formatDate(inquiry.eventDate)}
              />
              <FieldRow label="Guests" value={inquiry.guestCount} />
              <FieldRow
                label="Potential value"
                value={`CHF ${inquiry.potentialValue.toLocaleString()}`}
              />

              {/* Phase dropdown */}
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs text-gray-500">Phase</p>

                <select
                  className="rounded-md border bg-white px-2 py-1 text-sm font-medium"
                  value={phase}
                  onChange={handlePhaseChange}
                >
                  {phaseOptions.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Hotels */}
            <div className="rounded-lg border p-3 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">Hotels</p>
                <p className="text-xs text-gray-500">{inquiry.hotels.length}</p>
              </div>

              {inquiry.hotels.length === 0 ? (
                <p className="text-sm text-gray-500">No hotels associated.</p>
              ) : (
                <ul className="space-y-2">
                  {inquiry.hotels.map((name) => (
                    <li
                      key={name}
                      className="rounded-md border px-3 py-2 text-sm font-medium"
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Notes */}
            <div className="rounded-lg border p-3 space-y-2">
              <p className="text-sm font-semibold">Notes</p>
              {inquiry.notes?.trim() ? (
                <p className="whitespace-pre-wrap text-sm text-gray-800">
                  {inquiry.notes}
                </p>
              ) : (
                <p className="text-sm text-gray-500">No notes yet.</p>
              )}
            </div>

            {/* Timestamps */}
            <div className="rounded-lg border p-3 space-y-3">
              <p className="text-sm font-semibold">Timestamps</p>
              <FieldRow
                label="Created"
                value={formatDateTime(inquiry.createdAt)}
              />
              <FieldRow
                label="Last updated"
                value={formatDateTime(inquiry.updatedAt)}
              />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
