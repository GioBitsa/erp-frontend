import { NextResponse } from "next/server";
import type { Inquiry } from "@/types/inquiry";
import { delay, getDb } from "@/app/api/_mockDb";

function toNum(v: string | null, fallback = 0) {
  if (!v) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export async function GET(req: Request) {
  await delay(500);

  const { searchParams } = new URL(req.url);

  const q = (searchParams.get("q") ?? "").trim().toLowerCase();
  const from = (searchParams.get("from") ?? "").trim(); // YYYY-MM-DD
  const to = (searchParams.get("to") ?? "").trim(); // YYYY-MM-DD
  const min = toNum(searchParams.get("min"), 0);

  const { inquiries } = getDb();
  let filtered: Inquiry[] = inquiries;

  if (q) {
    filtered = filtered.filter((x) => x.clientName.toLowerCase().includes(q));
  }

  // compare on date portion (your eventDate is YYYY-MM-DD already)
  if (from) filtered = filtered.filter((x) => x.eventDate >= from);
  if (to) filtered = filtered.filter((x) => x.eventDate <= to);

  if (min > 0) {
    filtered = filtered.filter((x) => x.potentialValue >= min);
  }

  return NextResponse.json(filtered, {
    headers: { "Cache-Control": "no-store" },
  });
}
