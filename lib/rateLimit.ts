// IP単位のシンプルなインメモリレート制限。
// 単一プロセス前提。複数インスタンス構成では Redis 等に置き換えること。

const buckets = new Map<string, number[]>();

export function allowRequest(
  ip: string,
  action: string,
  limit: number,
  windowMs: number
): boolean {
  const key = `${action}:${ip}`;
  const now = Date.now();
  const timestamps = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (timestamps.length >= limit) {
    buckets.set(key, timestamps);
    return false;
  }
  timestamps.push(now);
  buckets.set(key, timestamps);

  // 古いキーが溜まりすぎないように軽く掃除する
  if (buckets.size > 10_000) {
    for (const [k, v] of buckets) {
      if (v.every((t) => now - t >= windowMs)) buckets.delete(k);
    }
  }
  return true;
}

export function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
