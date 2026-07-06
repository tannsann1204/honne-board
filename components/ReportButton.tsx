"use client";

import { useState } from "react";

export default function ReportButton({
  targetType,
  targetId,
}: {
  targetType: "post" | "comment";
  targetId: number;
}) {
  const [reported, setReported] = useState(false);

  async function handleClick() {
    if (reported) return;
    const reason = window.prompt("通報の理由を教えてください(任意)") ?? "";
    if (reason === null) return;
    try {
      await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType, targetId, reason }),
      });
      setReported(true);
    } catch {
      // 通報の失敗は静かに握りつぶす
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={reported}
      className="text-xs text-stone-400 hover:text-red-500 disabled:text-stone-300"
    >
      {reported ? "通報済み" : "通報する"}
    </button>
  );
}
