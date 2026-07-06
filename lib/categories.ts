export type Category = {
  slug: string;
  label: string;
  emoji: string;
  /** カテゴリチップの配色(ダークUI向けネオンカラー) */
  chip: string;
  /** カテゴリ選択(アクティブ時)の配色 */
  active: string;
};

export const CATEGORIES: Category[] = [
  {
    slug: "work",
    label: "仕事",
    emoji: "💼",
    chip: "bg-sky-400/10 text-sky-300 ring-1 ring-inset ring-sky-400/30",
    active: "bg-sky-400/20 text-sky-200 ring-1 ring-inset ring-sky-400/60",
  },
  {
    slug: "love",
    label: "恋愛",
    emoji: "💔",
    chip: "bg-rose-400/10 text-rose-300 ring-1 ring-inset ring-rose-400/30",
    active: "bg-rose-400/20 text-rose-200 ring-1 ring-inset ring-rose-400/60",
  },
  {
    slug: "family",
    label: "家族",
    emoji: "🏠",
    chip: "bg-amber-400/10 text-amber-300 ring-1 ring-inset ring-amber-400/30",
    active: "bg-amber-400/20 text-amber-200 ring-1 ring-inset ring-amber-400/60",
  },
  {
    slug: "friends",
    label: "友人",
    emoji: "👥",
    chip: "bg-violet-400/10 text-violet-300 ring-1 ring-inset ring-violet-400/30",
    active: "bg-violet-400/20 text-violet-200 ring-1 ring-inset ring-violet-400/60",
  },
  {
    slug: "money",
    label: "お金",
    emoji: "💸",
    chip: "bg-emerald-400/10 text-emerald-300 ring-1 ring-inset ring-emerald-400/30",
    active: "bg-emerald-400/20 text-emerald-200 ring-1 ring-inset ring-emerald-400/60",
  },
  {
    slug: "school",
    label: "学校",
    emoji: "🎓",
    chip: "bg-indigo-400/10 text-indigo-300 ring-1 ring-inset ring-indigo-400/30",
    active: "bg-indigo-400/20 text-indigo-200 ring-1 ring-inset ring-indigo-400/60",
  },
  {
    slug: "health",
    label: "健康",
    emoji: "🩺",
    chip: "bg-teal-400/10 text-teal-300 ring-1 ring-inset ring-teal-400/30",
    active: "bg-teal-400/20 text-teal-200 ring-1 ring-inset ring-teal-400/60",
  },
  {
    slug: "other",
    label: "雑談",
    emoji: "💭",
    chip: "bg-fuchsia-400/10 text-fuchsia-300 ring-1 ring-inset ring-fuchsia-400/30",
    active: "bg-fuchsia-400/20 text-fuchsia-200 ring-1 ring-inset ring-fuchsia-400/60",
  },
];

export function findCategory(slug: string | undefined | null): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
