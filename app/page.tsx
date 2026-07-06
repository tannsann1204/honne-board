import Link from "next/link";
import { Fragment } from "react";
import { listPosts, type Sort } from "@/lib/db";
import { CATEGORIES, findCategory } from "@/lib/categories";
import PostForm from "@/components/PostForm";
import PostCard from "@/components/PostCard";
import AdSlot from "@/components/AdSlot";

const PER_PAGE = 20;
// フィード内広告を挟む間隔(投稿N件ごと)
const AD_INTERVAL = 5;

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ category?: string; sort?: string; page?: string }>;

function buildQuery(params: { category?: string; sort?: string; page?: number }): string {
  const q = new URLSearchParams();
  if (params.category) q.set("category", params.category);
  if (params.sort && params.sort !== "new") q.set("sort", params.sort);
  if (params.page && params.page > 1) q.set("page", String(params.page));
  const s = q.toString();
  return s ? `/?${s}` : "/";
}

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const category = findCategory(params.category)?.slug;
  const sort: Sort = params.sort === "popular" ? "popular" : "new";
  const page = Math.max(1, Number(params.page) || 1);

  const { posts, total } = listPosts({ category, sort, page, perPage: PER_PAGE });
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <div className="space-y-6">
      <PostForm />

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP} label="トップ広告" />

      {/* カテゴリ切り替え */}
      <nav className="flex flex-wrap gap-2 text-sm" aria-label="カテゴリ">
        <Link
          href={buildQuery({ sort })}
          className={`rounded-full px-3 py-1 font-semibold ${
            !category ? "bg-accent text-white" : "bg-white text-stone-500 border border-stone-200"
          }`}
        >
          すべて
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={buildQuery({ category: c.slug, sort })}
            className={`rounded-full px-3 py-1 font-semibold ${
              category === c.slug
                ? "bg-accent text-white"
                : "bg-white text-stone-500 border border-stone-200"
            }`}
          >
            {c.emoji} {c.label}
          </Link>
        ))}
      </nav>

      {/* 並び替えタブ */}
      <div className="flex gap-4 border-b border-stone-200 text-sm font-semibold">
        {(
          [
            { key: "new", label: "新着" },
            { key: "popular", label: "共感順" },
          ] as const
        ).map((tab) => (
          <Link
            key={tab.key}
            href={buildQuery({ category, sort: tab.key })}
            className={`-mb-px border-b-2 px-1 pb-2 ${
              sort === tab.key
                ? "border-accent text-accent"
                : "border-transparent text-stone-400 hover:text-stone-600"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* 投稿フィード(N件ごとにインフィード広告) */}
      {posts.length === 0 ? (
        <p className="py-12 text-center text-sm text-stone-400">
          まだ投稿がありません。最初の本音を書いてみませんか?
        </p>
      ) : (
        <div className="space-y-4">
          {posts.map((post, i) => (
            <Fragment key={post.id}>
              <PostCard post={post} />
              {(i + 1) % AD_INTERVAL === 0 && i + 1 < posts.length && (
                <AdSlot
                  slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_INFEED}
                  format="fluid"
                  label="インフィード広告"
                />
              )}
            </Fragment>
          ))}
        </div>
      )}

      {/* ページネーション */}
      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-4 text-sm" aria-label="ページ送り">
          {page > 1 && (
            <Link
              href={buildQuery({ category, sort, page: page - 1 })}
              className="rounded-full border border-stone-200 bg-white px-4 py-1.5 font-semibold text-stone-600 hover:border-accent"
            >
              ← 前へ
            </Link>
          )}
          <span className="text-stone-400">
            {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={buildQuery({ category, sort, page: page + 1 })}
              className="rounded-full border border-stone-200 bg-white px-4 py-1.5 font-semibold text-stone-600 hover:border-accent"
            >
              次へ →
            </Link>
          )}
        </nav>
      )}

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM} label="フッター広告" />
    </div>
  );
}
