import { NextResponse } from "next/server";
import { addEmpathy } from "@/lib/db";
import { allowRequest, getClientIp } from "@/lib/rateLimit";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const ip = getClientIp(req);
  if (!allowRequest(ip, "empathy", 60, 10 * 60_000)) {
    return NextResponse.json({ error: "操作が多すぎます。" }, { status: 429 });
  }

  const { id } = await ctx.params;
  const postId = Number(id);
  if (!Number.isInteger(postId) || postId <= 0) {
    return NextResponse.json({ error: "不正なIDです。" }, { status: 400 });
  }

  const count = addEmpathy(postId);
  if (count === undefined) {
    return NextResponse.json({ error: "投稿が見つかりません。" }, { status: 404 });
  }
  return NextResponse.json({ count });
}
