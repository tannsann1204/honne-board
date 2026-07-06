// 投稿・コメントの簡易モデレーション。
// 本格運用ではモデレーションAPIや人力レビューへの置き換えを想定。

const NG_WORDS = [
  "死ね",
  "殺す",
  "殺せ",
  "自殺しろ",
  "消えろ",
  "きもい死",
  "ぶっ殺",
];

// 電話番号・メールアドレスらしき文字列(個人情報の書き込み防止)
const CONTACT_PATTERNS = [/\b0\d{1,4}-?\d{1,4}-?\d{3,4}\b/, /[\w.+-]+@[\w-]+\.[\w.]+/];

export type ModerationResult = { ok: true } | { ok: false; error: string };

export function moderateText(text: string): ModerationResult {
  for (const word of NG_WORDS) {
    if (text.includes(word)) {
      return { ok: false, error: "攻撃的な表現が含まれているため投稿できません。" };
    }
  }
  for (const pattern of CONTACT_PATTERNS) {
    if (pattern.test(text)) {
      return {
        ok: false,
        error: "電話番号やメールアドレスなどの個人情報は投稿できません。",
      };
    }
  }
  return { ok: true };
}

export function sanitizeText(text: string): string {
  // 制御文字(改行・タブ以外)を除去し、連続しすぎる改行を詰める
  return text
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}
