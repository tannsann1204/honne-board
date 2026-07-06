import { NextResponse } from "next/server";
import { createPost } from "@/lib/db";
import { findCategory } from "@/lib/categories";
import { moderateText, sanitizeText } from "@/lib/moderation";
import { allowRequest, getClientIp } from "@/lib/rateLimit";

const BODY_MAX = 500;
const NICKNAME_MAX = 20;

export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (!allowRequest(ip, "post", 5, 10 * 60_000)) {
    return NextResponse.json(
      { error: "投稿が続きすぎています。少し時間をおいてください。" },
      { status: 429 }
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "不正なリクエストです。" }, { status: 400 });
  }
  const { body, nickname, category } = (json ?? {}) as {
    body?: string;
    nickname?: string;
    category?: string;
  };

  const cleanBody = sanitizeText(String(body ?? ""));
  const cleanNickname = sanitizeText(String(nickname ?? "")).slice(0, NICKNAME_MAX) || "匿名さん";

  if (cleanBody.length === 0) {
    return NextResponse.json({ error: "本文を入力してください。" }, { status: 400 });
  }
  if (cleanBody.length > BODY_MAX) {
    return NextResponse.json({ error: `本文は${BODY_MAX}文字以内です。` }, { status: 400 });
  }
  const cat = findCategory(category);
  if (!cat) {
    return NextResponse.json({ error: "カテゴリが不正です。" }, { status: 400 });
  }
  const moderated = moderateText(`${cleanBody}\n${cleanNickname}`);
  if (!moderated.ok) {
    return NextResponse.json({ error: moderated.error }, { status: 422 });
  }

  const id = createPost({ body: cleanBody, nickname: cleanNickname, category: cat.slug });
  return NextResponse.json({ id }, { status: 201 });
}
