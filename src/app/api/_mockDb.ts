import type { Inquiry, InquiryPhase } from "@/types/inquiry";
import { INITIAL_DATA } from "@/data/inquiries";

const DELAY_MS = 500;

export async function delay(ms = DELAY_MS) {
  await new Promise((res) => setTimeout(res, ms));
}

type Db = { inquiries: Inquiry[] };

function initDb(): Db {
  // clone so we don't mutate INITIAL_DATA directly
  return { inquiries: structuredClone(INITIAL_DATA) as Inquiry[] };
}

// Persist in dev across hot reloads
const KEY = "__KANBAN_MOCK_DB__";

export function getDb(): Db {
  const g = globalThis as any;
  if (!g[KEY]) g[KEY] = initDb();
  return g[KEY] as Db;
}

export function isInquiryPhase(v: any): v is InquiryPhase {
  return (
    v === "new" ||
    v === "sent_to_hotels" ||
    v === "offers_received" ||
    v === "completed"
  );
}
