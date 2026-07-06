import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPost, listComments } from "@/lib/db";
import { findCategory } from "@/lib/categories";
import { timeAgo } from "@/lib/format";
import PostCard from "@/components/PostCard";
import CommentForm from "@/components/CommentForm";
import ReportButton from "@/components/ReportButton";
import AdSlot from "@/components/AdSlot";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const post = getPost(Number(id));
  if (!post) return { title: "投稿が見つかりません" };
  const category = findCategory(post.category);
  const excerpt = post.body.replace(/\s+/g, " ").slice(0, 60);
  return {
    title: `${excerpt}${post.body.length > 60 ? "…" : ""}`,
    description: `${category?.label ?? ""}の本音: ${post.body.slice(0, 120)}`,
  };
}

export default async function PostPage({ params }: { params: Params }) {
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId) || postId <= 0) notFound();

  const post = getPost(postId);
  if (!post) notFound();
  const comments = listComments(postId);

  return (
    <div className="space-y-6">
      <Link href="/" className="text-sm text-mute hover:text-pink-300">
        ← 一覧へ戻る
      </Link>

      <div className="space-y-2">
        <PostCard post={post} clamp={false} />
        <div className="flex justify-end px-1">
          <ReportButton targetType="post" targetId={post.id} />
        </div>
      </div>

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE} label="記事下広告" />

      <section className="space-y-4">
        <h2 className="text-sm font-bold text-ink/80">コメント({comments.length})</h2>
        {comments.length === 0 ? (
          <p className="text-sm text-mute">
            まだコメントはありません。最初のひとことを寄せてみませんか?
          </p>
        ) : (
          <ul className="space-y-3">
            {comments.map((comment) => (
              <li
                key={comment.id}
                className="rounded-xl border border-edge bg-card p-3 text-sm shadow shadow-black/20"
              >
                <div className="mb-1 flex items-center gap-2 text-xs text-mute">
                  <span className="font-medium text-ink/70">{comment.nickname}</span>
                  <span>・</span>
                  <time>{timeAgo(comment.created_at)}</time>
                  <span className="ml-auto">
                    <ReportButton targetType="comment" targetId={comment.id} />
                  </span>
                </div>
                <p className="whitespace-pre-wrap leading-relaxed text-ink">{comment.body}</p>
              </li>
            ))}
          </ul>
        )}
        <CommentForm postId={post.id} />
      </section>

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM} label="フッター広告" />
    </div>
  );
}
