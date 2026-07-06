import type { MetadataRoute } from "next";
import { listRecentPostIds } from "@/lib/db";
import { parseDbDate } from "@/lib/format";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = listRecentPostIds(1000);
  return [
    { url: SITE_URL, changeFrequency: "hourly", priority: 1 },
    { url: `${SITE_URL}/terms`, changeFrequency: "monthly", priority: 0.2 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "monthly", priority: 0.2 },
    ...posts.map((p) => ({
      url: `${SITE_URL}/post/${p.id}`,
      lastModified: parseDbDate(p.created_at),
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
  ];
}
