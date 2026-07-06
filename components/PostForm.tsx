"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";

const BODY_MAX = 500;
const NICKNAME_MAX = 20;

export default function PostForm() {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [nickname, setNickname] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].slug);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    setDone(false);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, nickname, category }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "投稿に失敗しました。");
        return;
      }
      setBody("");
      setNickname("");
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
      className="space-y-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"
    >
      <h2 className="text-sm font-bold text-stone-600">いま、どんな本音を抱えていますか?</h2>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        maxLength={BODY_MAX}
        rows={3}
        required
        placeholder="ここには本名も肩書きもいりません。誰にも言えない本音をどうぞ。"
        className="w-full resize-y rounded-xl border border-stone-200 bg-paper p-3 text-sm outline-none focus:border-accent"
      />
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-sm"
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
          className="w-44 rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-sm"
        />
        <span className="ml-auto text-xs text-stone-400">
          {body.length}/{BODY_MAX}
        </span>
        <button
          type="submit"
          disabled={submitting || body.trim().length === 0}
          className="rounded-full bg-accent px-5 py-1.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-40"
        >
          {submitting ? "投稿中…" : "匿名で投稿"}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {done && <p className="text-sm text-emerald-600">投稿しました。ちょっとスッキリしましたか?</p>}
    </form>
  );
}
