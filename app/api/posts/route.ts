import { NextResponse } from "next/server";
import { createPost } from "@/lib/db";
import { findCategory } from "@/lib/categories";
import { moderateText, sanitizeText } from "@/lib/moderation";
import { allowRequest, getClientIp } from "@/lib/rateLimit";
import { IMAGE_MAX_BYTES, saveImage } from "@/lib/images";

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

  let body = "";
  let nickname = "";
  let category = "";
  let imageFile: File | null = null;

  const contentType = req.headers.get("content-type") ?? "";
  try {
    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      body = String(form.get("body") ?? "");
      nickname = String(form.get("nickname") ?? "");
      category = String(form.get("category") ?? "");
      const file = form.get("image");
      if (file instanceof File && file.size > 0) imageFile = file;
    } else {
      const json = (await req.json()) as { body?: string; nickname?: string; category?: string };
      body = String(json?.body ?? "");
      nickname = String(json?.nickname ?? "");
      category = String(json?.category ?? "");
    }
  } catch {
    return NextResponse.json({ error: "不正なリクエストです。" }, { status: 400 });
  }

  const cleanBody = sanitizeText(body);
  const cleanNickname = sanitizeText(nickname).slice(0, NICKNAME_MAX) || "匿名さん";

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

  let image: string | null = null;
  if (imageFile) {
    if (imageFile.size > IMAGE_MAX_BYTES) {
      return NextResponse.json({ error: "画像は5MB以内にしてください。" }, { status: 413 });
    }
    const saved = saveImage(Buffer.from(await imageFile.arrayBuffer()));
    if (!saved.ok) {
      return NextResponse.json({ error: saved.error }, { status: 422 });
    }
    image = saved.filename;
  }

  const id = createPost({ body: cleanBody, nickname: cleanNickname, category: cat.slug, image });
  return NextResponse.json({ id }, { status: 201 });
}
