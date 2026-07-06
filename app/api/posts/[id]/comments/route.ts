import { NextResponse } from "next/server";
import { createComment } from "@/lib/db";
import { moderateText, sanitizeText } from "@/lib/moderation";
import { allowRequest, getClientIp } from "@/lib/rateLimit";

const BODY_MAX = 300;
const NICKNAME_MAX = 20;

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const ip = getClientIp(req);
  if (!allowRequest(ip, "comment", 10, 10 * 60_000)) {
    return NextResponse.json(
      { error: "コメントが続きすぎています。少し時間をおいてください。" },
      { status: 429 }
    );
  }

  const { id } = await ctx.params;
  const postId = Number(id);
  if (!Number.isInteger(postId) || postId <= 0) {
    return NextResponse.json({ error: "不正なIDです。" }, { status: 400 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "不正なリクエストです。" }, { status: 400 });
  }
  const { body, nickname } = (json ?? {}) as { body?: string; nickname?: string };

  const cleanBody = sanitizeText(String(body ?? ""));
  const cleanNickname = sanitizeText(String(nickname ?? "")).slice(0, NICKNAME_MAX) || "匿名さん";

  if (cleanBody.length === 0) {
    return NextResponse.json({ error: "コメントを入力してください。" }, { status: 400 });
  }
  if (cleanBody.length > BODY_MAX) {
    return NextResponse.json({ error: `コメントは${BODY_MAX}文字以内です。` }, { status: 400 });
  }
  const moderated = moderateText(`${cleanBody}\n${cleanNickname}`);
  if (!moderated.ok) {
    return NextResponse.json({ error: moderated.error }, { status: 422 });
  }

  const commentId = createComment({ postId, body: cleanBody, nickname: cleanNickname });
  if (commentId === undefined) {
    return NextResponse.json({ error: "投稿が見つかりません。" }, { status: 404 });
  }
  return NextResponse.json({ id: commentId }, { status: 201 });
}
