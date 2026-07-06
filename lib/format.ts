// SQLite の datetime('now') は UTC の "YYYY-MM-DD HH:MM:SS" 形式で保存される
export function parseDbDate(value: string): Date {
  return new Date(value.replace(" ", "T") + "Z");
}

export function timeAgo(value: string): string {
  const date = parseDbDate(value);
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "たった今";
  if (minutes < 60) return `${minutes}分前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}時間前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}日前`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}ヶ月前`;
  return `${Math.floor(months / 12)}年前`;
}
