# ほんね — 匿名本音掲示板

名前を出せない本音を、そっと吐き出す匿名掲示板アプリです。会員登録なしで投稿・コメント・「わかる」(共感)ができます。収益は**広告収入(Google AdSense)をメイン**に設計しています。

## 技術スタック

- [Next.js](https://nextjs.org/) (App Router) + TypeScript — SSR で広告収益に直結する SEO を確保
- Tailwind CSS v4
- SQLite (better-sqlite3) — 単一ファイルDBで運用が軽い。スケール時は Turso / PostgreSQL への移行を想定

## 起動方法

```bash
npm install
npm run seed   # (任意) サンプル投稿を投入
npm run dev    # http://localhost:3000
```

本番:

```bash
npm run build
npm start
```

DB は `data/honne.db` に自動作成されます(gitignore 済み)。

## 機能

- 匿名投稿(ニックネーム任意・カテゴリ8種: 仕事/恋愛/家族/友人/お金/学校/健康/雑談)
- 「わかる」共感ボタン(localStorage で二重押し防止)+ 匿名コメント
- 新着順 / 共感順の並び替え、カテゴリ絞り込み、ページネーション
- モデレーション: NGワード・個人情報(電話番号/メール)ブロック、IP レート制限、通報5件で自動非表示
- SEO: SSR、投稿ごとの meta、`sitemap.xml` / `robots.txt` 自動生成
- 利用規約・プライバシーポリシー(AdSense 審査に必要な広告掲載の明記込み)

## 広告(収益化)の設定

AdSense 未設定の間は、広告枠の位置に点線のプレースホルダーが表示されます。承認後に環境変数を設定するだけで実広告に切り替わります。

`.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=https://example.com
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_TOP=1111111111      # トップページ上部
NEXT_PUBLIC_ADSENSE_SLOT_INFEED=2222222222   # フィード内(5投稿ごと)
NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE=3333333333  # 投稿詳細の記事下
NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM=4444444444   # 各ページ最下部
```

あわせて `public/ads.txt` を自分のサイト運営者IDに書き換えてください。

### 広告配置の設計意図

| 枠 | 位置 | 狙い |
| --- | --- | --- |
| TOP | 投稿フォーム直下 | ファーストビュー内のインプレッション |
| INFEED | フィード5投稿ごと | スクロール量が多い掲示板と相性が良い、視認性が高い |
| ARTICLE | 投稿詳細の本文直下 | 検索流入の着地点。読了直後で最もクリックされやすい |
| BOTTOM | ページ最下部 | 追加インプレッション |

検索流入(悩み系キーワード)→ 投稿詳細ページ → 記事下広告、が収益の主動線です。投稿詳細ページは1投稿=1URLで SSR されるため、投稿が増えるほどインデックスされるページが増えます。

## 今後の拡張候補

- 人気投稿のまとめページ(SEO 流入の受け皿を増やす)
- Google Analytics / Search Console 連携
- 運営用モデレーション画面(通報一覧・非表示の手動操作)
- スケール時: DB を Turso/PostgreSQL に、レート制限を Redis に移行
