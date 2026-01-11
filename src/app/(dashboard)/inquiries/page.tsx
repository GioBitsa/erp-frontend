import KanbanFilters from "@/components/kanban/KanbanFilters";
import { INITIAL_DATA } from "@/data/inquiries";
import KanbanShell from "@/components/kanban/KanbanShell";

export default function InquiriesPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <KanbanFilters />

      {/* This MUST be min-h-0 so the board can shrink and allow inner scrolling */}
      <div className="flex min-h-0 flex-1 min-w-0">
        <KanbanShell inquiries={INITIAL_DATA} />
      </div>
    </div>
  );
}
