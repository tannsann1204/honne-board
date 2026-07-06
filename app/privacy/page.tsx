import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
};

export default function PrivacyPage() {
  return (
    <article className="prose-sm max-w-none space-y-4 rounded-2xl border border-stone-200 bg-white p-6">
      <h1 className="text-xl font-bold">プライバシーポリシー</h1>
      <p className="text-sm leading-relaxed">
        匿名掲示板「ほんね」(以下「本サービス」)は、利用者のプライバシーを尊重し、個人情報の取り扱いについて以下のとおり定めます。
      </p>
      <h2 className="text-base font-bold">1. 収集する情報</h2>
      <p className="text-sm leading-relaxed">
        本サービスは会員登録を必要とせず、氏名やメールアドレスの入力を求めません。不正利用防止のため、アクセス元IPアドレス等の技術的情報を一時的に利用する場合があります。
      </p>
      <h2 className="text-base font-bold">2. 広告について</h2>
      <p className="text-sm leading-relaxed">
        本サービスは第三者配信の広告サービス(Google AdSense
        等)を利用しています。広告配信事業者は、利用者の興味に応じた広告を表示するために Cookie
        を使用することがあります。Cookie を無効にする方法や Google AdSense
        に関する詳細は「広告 – ポリシーと規約 – Google」をご確認ください。
      </p>
      <h2 className="text-base font-bold">3. アクセス解析</h2>
      <p className="text-sm leading-relaxed">
        サービス改善のためにアクセス解析ツールを利用する場合があります。これらのツールはトラフィックデータの収集のために
        Cookie を使用することがありますが、個人を特定するものではありません。
      </p>
      <h2 className="text-base font-bold">4. 投稿データ</h2>
      <p className="text-sm leading-relaxed">
        投稿・コメントは匿名で保存・公開されます。通報等に基づき、運営が非表示・削除する場合があります。
      </p>
      <h2 className="text-base font-bold">5. お問い合わせ</h2>
      <p className="text-sm leading-relaxed">
        本ポリシーに関するお問い合わせは、運営者までご連絡ください。
      </p>
    </article>
  );
}
