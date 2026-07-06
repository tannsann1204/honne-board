import Link from "next/link";
import type { Post } from "@/lib/db";
import { findCategory } from "@/lib/categories";
import { timeAgo } from "@/lib/format";
import EmpathyButton from "./EmpathyButton";

/* 写真なし投稿に自動で割り当てる背景グラデーション。
   投稿IDから決定するため、同じ投稿は常に同じ背景になる */
const AUTO_BACKGROUNDS = [
  "bg-gradient-to-br from-pink-500 via-rose-500 to-orange-400",
  "bg-gradient-to-br from-sky-500 via-blue-600 to-violet-600",
  "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500",
  "bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-500",
  "bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500",
  "bg-gradient-to-br from-indigo-500 via-blue-500 to-teal-400",
  "bg-gradient-to-br from-fuchsia-500 via-pink-500 to-amber-400",
  "bg-gradient-to-br from-rose-600 via-red-500 to-amber-400",
];

export default function PostCard({ post, clamp = true }: { post: Post; clamp?: boolean }) {
  const category = findCategory(post.category);
  const autoBg = AUTO_BACKGROUNDS[post.id % AUTO_BACKGROUNDS.length];

  return (
    <article className="flex h-full flex-col rounded-2xl border border-edge bg-card p-4 shadow-lg shadow-black/30 transition hover:border-edge/80">
      <div className="mb-2 flex items-center gap-2 text-xs text-mute">
        {category && (
          <Link
            href={`/?category=${category.slug}`}
            className={`rounded-full px-2 py-0.5 font-semibold hover:opacity-80 ${category.chip}`}
          >
            {category.emoji} {category.label}
          </Link>
        )}
        <span className="font-medium text-ink/70">{post.nickname}</span>
        <span>・</span>
        <time>{timeAgo(post.created_at)}</time>
      </div>

      {/* 本文は写真があれば写真の上に、なければ自動選択のグラデーション背景の上に
         中央配置で重ねる。本文を通常フローに置き背景を absolute で広げているため、
         長文でも文字がはみ出さない */}
      <Link
        href={`/post/${post.id}`}
        className={`relative flex min-h-64 flex-1 flex-col items-center justify-center overflow-hidden rounded-xl border border-edge ${
          post.image ? "" : autoBg
        }`}
      >
        {post.image && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/uploads/${post.image}`}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/45" aria-hidden="true" />
          </>
        )}
        <p
          className={`relative max-w-prose p-5 text-center text-[15px] font-medium leading-relaxed text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] whitespace-pre-wrap ${
            clamp ? "line-clamp-4" : ""
          }`}
        >
          {post.body}
        </p>
      </Link>

      <div className="mt-auto flex items-center gap-3 pt-3">
        <EmpathyButton postId={post.id} initialCount={post.empathy_count} />
        <Link
          href={`/post/${post.id}`}
          className="inline-flex items-center gap-1 rounded-full border border-edge bg-base px-3 py-1 text-xs font-semibold text-mute hover:border-sky-400/50 hover:text-sky-300"
        >
          💬 コメント {post.comment_count}
        </Link>
      </div>
    </article>
  );
}
