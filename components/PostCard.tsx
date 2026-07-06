import Link from "next/link";
import type { Post } from "@/lib/db";
import { findCategory } from "@/lib/categories";
import { timeAgo } from "@/lib/format";
import EmpathyButton from "./EmpathyButton";

export default function PostCard({ post, clamp = true }: { post: Post; clamp?: boolean }) {
  const category = findCategory(post.category);
  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-xs text-stone-400">
        {category && (
          <Link
            href={`/?category=${category.slug}`}
            className="rounded-full bg-accent-soft px-2 py-0.5 font-semibold text-accent hover:opacity-80"
          >
            {category.emoji} {category.label}
          </Link>
        )}
        <span className="font-medium text-stone-500">{post.nickname}</span>
        <span>・</span>
        <time>{timeAgo(post.created_at)}</time>
      </div>
      <Link href={`/post/${post.id}`} className="block">
        <p
          className={`whitespace-pre-wrap text-[15px] leading-relaxed ${
            clamp ? "line-clamp-4" : ""
          }`}
        >
          {post.body}
        </p>
      </Link>
      <div className="mt-3 flex items-center gap-3">
        <EmpathyButton postId={post.id} initialCount={post.empathy_count} />
        <Link
          href={`/post/${post.id}`}
          className="inline-flex items-center gap-1 rounded-full border border-stone-200 px-3 py-1 text-xs font-semibold text-stone-500 hover:border-accent hover:text-accent"
        >
          💬 コメント {post.comment_count}
        </Link>
      </div>
    </article>
  );
}
