"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";

const BODY_MAX = 500;
const NICKNAME_MAX = 20;
const IMAGE_MAX_MB = 5;

export default function PostForm() {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [body, setBody] = useState("");
  const [nickname, setNickname] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].slug);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setError(null);
    if (preview) URL.revokeObjectURL(preview);
    if (!file) {
      setImage(null);
      setPreview(null);
      return;
    }
    if (file.size > IMAGE_MAX_MB * 1024 * 1024) {
      setError(`画像は${IMAGE_MAX_MB}MB以内にしてください。`);
      setImage(null);
      setPreview(null);
      if (fileInput.current) fileInput.current.value = "";
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  function clearImage() {
    if (preview) URL.revokeObjectURL(preview);
    setImage(null);
    setPreview(null);
    if (fileInput.current) fileInput.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    setDone(false);
    try {
      const form = new FormData();
      form.set("body", body);
      form.set("nickname", nickname);
      form.set("category", category);
      if (image) form.set("image", image);
      const res = await fetch("/api/posts", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "投稿に失敗しました。");
        return;
      }
      setBody("");
      setNickname("");
      clearImage();
      setDone(true);
      router.refresh();
    } catch {
      setError("通信エラーが発生しました。時間をおいて再度お試しください。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      id="post-form"
      onSubmit={handleSubmit}
      className="space-y-3 rounded-2xl border border-edge bg-card p-4 shadow-lg shadow-black/30"
    >
      <h2 className="text-sm font-bold text-mute">いま、どんな本音を抱えていますか?</h2>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        maxLength={BODY_MAX}
        rows={3}
        required
        placeholder="ここには本名も肩書きもいりません。誰にも言えない本音をどうぞ。"
        className="w-full resize-y rounded-xl border border-edge bg-base p-3 text-sm text-ink placeholder:text-mute/60 outline-none focus:border-accent"
      />

      {preview && (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="添付画像のプレビュー"
            className="max-h-48 rounded-xl border border-edge object-contain"
          />
          <button
            type="button"
            onClick={clearImage}
            aria-label="画像を削除"
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white shadow hover:bg-rose-400"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-edge bg-base px-2 py-1.5 text-sm text-ink"
          aria-label="カテゴリ"
        >
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.emoji} {c.label}
            </option>
          ))}
        </select>
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={NICKNAME_MAX}
          placeholder="ニックネーム(省略可)"
          className="w-44 rounded-lg border border-edge bg-base px-2 py-1.5 text-sm text-ink placeholder:text-mute/60"
        />
        <label className="cursor-pointer rounded-lg border border-edge bg-base px-3 py-1.5 text-sm text-mute hover:border-accent hover:text-accent">
          📷 写真
          <input
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
        <span className="ml-auto text-xs text-mute">
          {body.length}/{BODY_MAX}
        </span>
        <button
          type="submit"
          disabled={submitting || body.trim().length === 0}
          className="rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 px-5 py-1.5 text-sm font-semibold text-white shadow-lg shadow-pink-500/25 hover:opacity-90 disabled:opacity-40"
        >
          {submitting ? "投稿中…" : "匿名で投稿"}
        </button>
      </div>
      {error && <p className="text-sm text-rose-400">{error}</p>}
      {done && <p className="text-sm text-emerald-400">投稿しました。ちょっとスッキリしましたか?</p>}
    </form>
  );
}
