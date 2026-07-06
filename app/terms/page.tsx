import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約",
};

export default function TermsPage() {
  return (
    <article className="prose-sm max-w-none space-y-4 rounded-2xl border border-edge bg-card p-6">
      <h1 className="text-xl font-bold">利用規約</h1>
      <p className="text-sm leading-relaxed">
        本規約は、匿名掲示板「ほんね」(以下「本サービス」)の利用条件を定めるものです。利用者は本サービスを利用することで、本規約に同意したものとみなします。
      </p>
      <h2 className="text-base font-bold">1. 禁止事項</h2>
      <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed">
        <li>特定の個人・団体への誹謗中傷、脅迫、差別的表現</li>
        <li>氏名・住所・電話番号・メールアドレス等の個人情報の投稿</li>
        <li>法令または公序良俗に違反する内容の投稿</li>
        <li>宣伝・スパム・出会い目的の投稿</li>
        <li>本サービスの運営を妨害する行為</li>
      </ul>
      <h2 className="text-base font-bold">2. 投稿の取り扱い</h2>
      <p className="text-sm leading-relaxed">
        投稿は匿名で公開されます。運営は、禁止事項に該当する投稿や通報が多数寄せられた投稿を、予告なく非表示・削除できるものとします。
      </p>
      <h2 className="text-base font-bold">3. 広告の掲載</h2>
      <p className="text-sm leading-relaxed">
        本サービスは広告収入により無料で運営されており、ページ内に第三者配信の広告が掲載されます。
      </p>
      <h2 className="text-base font-bold">4. 免責事項</h2>
      <p className="text-sm leading-relaxed">
        投稿内容は利用者個人の見解であり、運営はその正確性・適法性について責任を負いません。本サービスの利用により生じた損害について、運営は一切の責任を負わないものとします。
      </p>
      <h2 className="text-base font-bold">5. 規約の変更</h2>
      <p className="text-sm leading-relaxed">
        運営は必要に応じて本規約を変更できるものとし、変更後の規約は本ページに掲載した時点で効力を生じます。
      </p>
    </article>
  );
}
