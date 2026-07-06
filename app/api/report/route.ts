import { NextResponse } from "next/server";
import { createReport } from "@/lib/db";
import { sanitizeText } from "@/lib/moderation";
import { allowRequest, getClientIp } from "@/lib/rateLimit";

export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (!allowRequest(ip, "report", 20, 10 * 60_000)) {
    return NextResponse.json({ error: "操作が多すぎます。" }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "不正なリクエストです。" }, { status: 400 });
  }
  const { targetType, targetId, reason } = (json ?? {}) as {
    targetType?: string;
    targetId?: number;
    reason?: string;
  };

  if (targetType !== "post" && targetType !== "comment") {
    return NextResponse.json({ error: "不正な対象です。" }, { status: 400 });
  }
  const idNum = Number(targetId);
  if (!Number.isInteger(idNum) || idNum <= 0) {
    return NextResponse.json({ error: "不正なIDです。" }, { status: 400 });
  }

  createReport({
    targetType,
    targetId: idNum,
    reason: sanitizeText(String(reason ?? "")).slice(0, 200),
  });
  return NextResponse.json({ ok: true });
}
