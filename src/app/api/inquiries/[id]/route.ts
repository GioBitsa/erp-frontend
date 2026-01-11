import { NextResponse } from "next/server";
import { delay, getDb, isInquiryPhase } from "@/app/api/_mockDb";

export async function PATCH(req: Request, ctx: { params: { id: string } }) {
  await delay(500);

  const id = ctx.params.id;

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const nextPhase = body?.phase;
  if (!isInquiryPhase(nextPhase)) {
    return NextResponse.json({ message: "Invalid phase" }, { status: 400 });
  }

  const db = getDb();
  const idx = db.inquiries.findIndex((x) => x.id === id);

  if (idx === -1) {
    return NextResponse.json({ message: "Inquiry not found" }, { status: 404 });
  }

  db.inquiries[idx] = {
    ...db.inquiries[idx],
    phase: nextPhase,
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json(db.inquiries[idx], {
    headers: { "Cache-Control": "no-store" },
  });
}
