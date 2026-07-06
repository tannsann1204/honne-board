import fs from "fs";
import path from "path";
import crypto from "crypto";

export const IMAGE_MAX_BYTES = 5 * 1024 * 1024; // 5MB

const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

// マジックバイトで実体が画像かを確認する(Content-Type の詐称対策)
function sniffImage(buf: Buffer): string | undefined {
  if (buf.length < 12) return undefined;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])))
    return "image/png";
  if (buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP")
    return "image/webp";
  if (buf.subarray(0, 6).toString("ascii") === "GIF87a" || buf.subarray(0, 6).toString("ascii") === "GIF89a")
    return "image/gif";
  return undefined;
}

export type SaveImageResult = { ok: true; filename: string } | { ok: false; error: string };

export function saveImage(buf: Buffer): SaveImageResult {
  if (buf.length > IMAGE_MAX_BYTES) {
    return { ok: false, error: "画像は5MB以内にしてください。" };
  }
  const mime = sniffImage(buf);
  if (!mime) {
    return { ok: false, error: "画像は JPEG / PNG / WebP / GIF のみ投稿できます。" };
  }
  const filename = `${crypto.randomUUID()}.${EXT_BY_MIME[mime]}`;
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  fs.writeFileSync(path.join(UPLOAD_DIR, filename), buf);
  return { ok: true, filename };
}

export function readImage(filename: string): { buf: Buffer; mime: string } | undefined {
  // パストラバーサル防止: UUID.ext 形式のみ許可
  const m = /^([0-9a-f-]{36})\.(jpg|png|webp|gif)$/.exec(filename);
  if (!m) return undefined;
  try {
    const buf = fs.readFileSync(path.join(UPLOAD_DIR, filename));
    return { buf, mime: MIME_BY_EXT[m[2]] };
  } catch {
    return undefined;
  }
}
