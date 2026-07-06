"use client";

import { useEffect, useRef } from "react";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

type Props = {
  /** AdSense の広告ユニットID(data-ad-slot)。未設定時はプレースホルダー表示 */
  slot?: string;
  format?: string;
  className?: string;
  /** プレースホルダーに表示する枠の名前(配置検討用) */
  label?: string;
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdSlot({ slot, format = "auto", className = "", label = "広告" }: Props) {
  const pushed = useRef(false);

  useEffect(() => {
    if (!ADSENSE_CLIENT || !slot || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense スクリプト未ロード時は無視
    }
  }, [slot]);

  if (!ADSENSE_CLIENT || !slot) {
    // 広告未設定の間は配置が分かるプレースホルダーを出す
    return (
      <div
        className={`flex h-24 items-center justify-center rounded-xl border border-dashed border-edge bg-card/50 text-xs text-mute/70 ${className}`}
        aria-hidden="true"
      >
        {label}スペース(AdSense 設定後に表示)
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
