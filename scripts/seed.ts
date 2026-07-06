// 開発用のサンプルデータ投入スクリプト: npm run seed
import { createComment, createPost, getDb } from "../lib/db";

const SAMPLES: { body: string; category: string; nickname?: string; empathy: number; comments: string[] }[] = [
  {
    body: "上司の「若いうちは苦労しろ」が口癖。あなたの若い頃と時代が違うんだよなあ…と思いながら今日も残業してる。",
    category: "work",
    empathy: 24,
    comments: ["それ言う人ほど自分は定時で帰るんですよね", "わかりすぎる。転職も視野に入れていいと思う"],
  },
  {
    body: "彼氏のことは好きだけど、結婚の話になると急に冷める自分がいる。これって好きじゃないのかな。",
    category: "love",
    nickname: "ぽんかん",
    empathy: 18,
    comments: ["好きと結婚は別物だと思う。冷めるのは普通"],
  },
  {
    body: "実家に帰るたびに「まだ結婚しないの?」って聞かれるのが憂鬱。帰省の頻度、減らしてもいいかな。",
    category: "family",
    empathy: 31,
    comments: ["減らしていい!自分のペースが一番", "うちも同じです。正月だけにしました"],
  },
  {
    body: "友達の結婚式のご祝儀3万円、正直きつい。おめでたいのは本当なんだけど、家計は正直。",
    category: "money",
    empathy: 42,
    comments: ["わかる。祝う気持ちと財布は別問題"],
  },
  {
    body: "テスト勉強しなきゃいけないのに、部屋の掃除を始めてしまった。なんでテスト前って掃除したくなるんだろう。",
    category: "school",
    nickname: "受験生A",
    empathy: 15,
    comments: [],
  },
  {
    body: "健康診断の結果が怖くて封筒を3日間開けられていない。今夜こそ開ける。たぶん。",
    category: "health",
    empathy: 9,
    comments: ["開けたら意外と大丈夫だったりしますよ"],
  },
  {
    body: "グループLINEの「了解です!」のスタンプを選ぶのに5分かけてる自分がいる。疲れた。",
    category: "friends",
    empathy: 27,
    comments: ["既読つけるタイミングまで考えちゃう"],
  },
  {
    body: "今日、コンビニの店員さんに「お疲れ様です」って言われただけで泣きそうになった。優しさが染みる日もある。",
    category: "other",
    nickname: "しがないOL",
    empathy: 56,
    comments: ["ここに書いてくれてありがとう", "その店員さん、いい人だ"],
  },
];

getDb();
for (const s of SAMPLES) {
  const id = createPost({
    body: s.body,
    nickname: s.nickname ?? "匿名さん",
    category: s.category,
  });
  getDb().prepare("UPDATE posts SET empathy_count = ? WHERE id = ?").run(s.empathy, id);
  for (const c of s.comments) {
    createComment({ postId: id, body: c, nickname: "匿名さん" });
  }
}
console.log(`サンプル投稿 ${SAMPLES.length} 件を投入しました。`);
