import React, { useEffect, useMemo, useState } from "react";
import type { Inquiry, InquiryPhase } from "@/types/inquiry";

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import KanbanColumn from "./KanbanColumn";

type Props = {
  inquiries: Inquiry[];
  onPhaseChange?: (args: {
    inquiryId: string;
    from: InquiryPhase;
    to: InquiryPhase;
  }) => Promise<void> | void;
  onOpenInquiry: (inquiry: Inquiry) => void;
};

export const KANBAN_PHASES: { key: InquiryPhase; title: string }[] = [
  { key: "new", title: "New" },
  { key: "sent_to_hotels", title: "Sent to Hotels" },
  { key: "offers_received", title: "Offers Received" },
  { key: "completed", title: "Completed" },
];

function isPhaseId(id: string): id is InquiryPhase {
  return KANBAN_PHASES.some((p) => p.key === id);
}

export default function KanbanBoard({
  inquiries,
  onPhaseChange,
  onOpenInquiry,
}: Props) {
  const [local, setLocal] = useState<Inquiry[]>(inquiries);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [updatingIds, setUpdatingIds] = useState<Record<string, boolean>>({});
  const [updateError, setUpdateError] = useState<
    Record<string, string | undefined>
  >({});

  const setUpdating = (id: string, v: boolean) =>
    setUpdatingIds((s) => ({ ...s, [id]: v }));

  const setCardError = (id: string, msg?: string) =>
    setUpdateError((s) => ({ ...s, [id]: msg }));

  useEffect(() => setLocal(inquiries), [inquiries]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const phaseById = useMemo(() => {
    const map: Record<string, InquiryPhase> = {};
    for (const it of local) map[it.id] = it.phase;
    return map;
  }, [local]);

  const byPhase = useMemo(() => {
    const res: Record<InquiryPhase, Inquiry[]> = {
      new: [],
      sent_to_hotels: [],
      offers_received: [],
      completed: [],
    };
    for (const it of local) res[it.phase].push(it);
    return res;
  }, [local]);

  const moveToPhase = (cardId: string, to: InquiryPhase) => {
    setLocal((prev) =>
      prev.map((it) => (it.id === cardId ? { ...it, phase: to } : it))
    );
  };

  const onDragStart = (e: DragStartEvent) => {
    setActiveId(String(e.active.id));
  };

  const onDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const from = phaseById[activeId];
    if (!from) return;

    // hovering a column
    if (isPhaseId(overId)) {
      if (from !== overId) moveToPhase(activeId, overId);
      return;
    }

    // hovering a card -> move to that card's phase
    const to = phaseById[overId];
    if (!to) return;

    if (from !== to) moveToPhase(activeId, to);
  };

  const onDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveId(null);
    if (!over) return;

    const activeCardId = String(active.id);
    const overId = String(over.id);

    const from = phaseById[activeCardId];
    const to: InquiryPhase | null = isPhaseId(overId)
      ? overId
      : phaseById[overId] ?? null;

    if (!from || !to) return;
    if (from === to) return;

    // UI is already moved optimistically via onDragOver, but ensure final state:
    moveToPhase(activeCardId, to);

    // mark saving + clear old error
    setUpdating(activeCardId, true);
    setCardError(activeCardId, undefined);

    try {
      await onPhaseChange?.({ inquiryId: activeCardId, from, to });
      // success
    } catch (err: any) {
      // rollback
      moveToPhase(activeCardId, from);
      setCardError(activeCardId, err?.message ?? "Failed to update phase");
    } finally {
      setUpdating(activeCardId, false);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="mt-3 flex min-h-0 flex-1 min-w-0 gap-4 overflow-x-auto overflow-y-hidden kanban-scrollbar">
        {KANBAN_PHASES.map((phase) => {
          const items = byPhase[phase.key];
          const totalCHF = items.reduce((sum, i) => sum + i.potentialValue, 0);

          return (
            <KanbanColumn
              key={phase.key}
              id={phase.key}
              title={phase.title}
              items={items}
              count={items.length}
              totalCHF={totalCHF}
              isDraggingAny={!!activeId}
              onOpen={onOpenInquiry}
              updatingIds={updatingIds}
              updateError={updateError}
            />
          );
        })}
      </div>
    </DndContext>
  );
}
