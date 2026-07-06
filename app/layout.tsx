import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import "./globals.css";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ほんね | 匿名で本音を吐き出せる掲示板",
    template: "%s | ほんね",
  },
  description:
    "名前を出せない本音を、そっと吐き出す匿名掲示板。仕事・恋愛・家族・お金の悩みや愚痴を匿名で投稿して、「わかる」で共感し合える場所です。",
  openGraph: {
    siteName: "ほんね",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="dark">
      <head>
        {ADSENSE_CLIENT && (
          <Script
            id="adsense"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="min-h-screen antialiased">
        <header className="sticky top-0 z-10 border-b border-edge bg-base/80 backdrop-blur">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-baseline gap-2">
              <span className="bg-gradient-to-r from-pink-400 via-amber-300 to-sky-400 bg-clip-text text-2xl font-bold tracking-wide text-transparent">
                ほんね
              </span>
              <span className="hidden text-xs text-mute sm:inline">
                名前を出せない本音を、そっと吐き出す場所
              </span>
            </Link>
            <Link
              href="/#post-form"
              className="rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 px-4 py-1.5 text-sm font-semibold text-white shadow-lg shadow-pink-500/25 hover:opacity-90"
            >
              投稿する
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-4 py-6">{children}</main>

        <footer className="mt-12 border-t border-edge bg-card/60">
          <div className="mx-auto max-w-4xl space-y-3 px-4 py-8 text-sm text-mute">
            <p className="bg-gradient-to-r from-pink-400 to-amber-300 bg-clip-text font-semibold text-transparent">
              ほんね
            </p>
            <p>
              匿名だからこそ言える本音を共有する掲示板です。誹謗中傷や個人情報の書き込みは禁止です。
            </p>
            <nav className="flex gap-4">
              <Link href="/terms" className="hover:text-ink hover:underline">
                利用規約
              </Link>
              <Link href="/privacy" className="hover:text-ink hover:underline">
                プライバシーポリシー
              </Link>
            </nav>
            <p className="text-xs text-mute/70">
              本サービスは広告収入により無料で運営されています。
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
