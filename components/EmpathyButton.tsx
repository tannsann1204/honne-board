"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "honne-empathized";

function loadEmpathized(): number[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export default function EmpathyButton({
  postId,
  initialCount,
}: {
  postId: number;
  initialCount: number;
}) {
  const [count, setCount] = useState(initialCount);
  const [empathized, setEmpathized] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setEmpathized(loadEmpathized().includes(postId));
  }, [postId]);

  async function handleClick(e: React.MouseEvent) {
    // カード全体がリンクの場合でも遷移させない
    e.preventDefault();
    e.stopPropagation();
    if (empathized || busy) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/posts/${postId}/empathy`, { method: "POST" });
      if (!res.ok) return;
      const data = await res.json();
      setCount(data.count);
      setEmpathized(true);
      const ids = loadEmpathized();
      ids.push(postId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // 失敗時は何もしない(押し直し可能)
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={empathized}
      aria-label="共感する"
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition ${
        empathized
          ? "bg-pink-500/20 text-pink-300 ring-1 ring-inset ring-pink-400/60"
          : "bg-base text-mute ring-1 ring-inset ring-edge hover:text-pink-300 hover:ring-pink-400/50"
      }`}
    >
      <span>🫂</span>
      <span>わかる</span>
      <span>{count}</span>
    </button>
  );
}
