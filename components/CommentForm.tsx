"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const BODY_MAX = 300;
const NICKNAME_MAX = 20;

export default function CommentForm({ postId }: { postId: number }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [nickname, setNickname] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, nickname }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "コメントの投稿に失敗しました。");
        return;
      }
      setBody("");
      setNickname("");
      router.refresh();
    } catch {
      setError("通信エラーが発生しました。時間をおいて再度お試しください。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        maxLength={BODY_MAX}
        rows={2}
        required
        placeholder="そっと寄り添うコメントをどうぞ(匿名)"
        className="w-full resize-y rounded-xl border border-edge bg-card p-3 text-sm text-ink placeholder:text-mute/60 outline-none focus:border-accent"
      />
      <div className="flex items-center gap-2">
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={NICKNAME_MAX}
          placeholder="ニックネーム(省略可)"
          className="w-44 rounded-lg border border-edge bg-card px-2 py-1.5 text-sm text-ink placeholder:text-mute/60"
        />
        <span className="ml-auto text-xs text-mute">
          {body.length}/{BODY_MAX}
        </span>
        <button
          type="submit"
          disabled={submitting || body.trim().length === 0}
          className="rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-4 py-1.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 hover:opacity-90 disabled:opacity-40"
        >
          {submitting ? "送信中…" : "コメントする"}
        </button>
      </div>
      {error && <p className="text-sm text-rose-400">{error}</p>}
    </form>
  );
}
