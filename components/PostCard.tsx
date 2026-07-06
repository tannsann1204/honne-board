import Link from "next/link";
import type { Post } from "@/lib/db";
import { findCategory } from "@/lib/categories";
import { timeAgo } from "@/lib/format";
import EmpathyButton from "./EmpathyButton";

export default function PostCard({ post, clamp = true }: { post: Post; clamp?: boolean }) {
  const category = findCategory(post.category);
  return (
    <article className="rounded-2xl border border-edge bg-card p-4 shadow-lg shadow-black/30 transition hover:border-edge/80">
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
      <Link href={`/post/${post.id}`} className="block">
        <p
          className={`whitespace-pre-wrap text-[15px] leading-relaxed text-ink ${
            clamp ? "line-clamp-4" : ""
          }`}
        >
          {post.body}
        </p>
        {post.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/uploads/${post.image}`}
            alt=""
            loading="lazy"
            className={`mt-3 w-full rounded-xl border border-edge ${
              clamp ? "max-h-80 object-cover" : "object-contain"
            }`}
          />
        )}
      </Link>
      <div className="mt-3 flex items-center gap-3">
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
