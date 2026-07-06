import { readImage } from "@/lib/images";

export async function GET(_req: Request, ctx: { params: Promise<{ name: string }> }) {
  const { name } = await ctx.params;
  const image = readImage(name);
  if (!image) {
    return new Response("Not Found", { status: 404 });
  }
  return new Response(new Uint8Array(image.buf), {
    headers: {
      "Content-Type": image.mime,
      // ファイル名がUUIDで内容が変わらないため長期キャッシュできる
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
