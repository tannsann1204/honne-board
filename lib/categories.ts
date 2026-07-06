export type Category = {
  slug: string;
  label: string;
  emoji: string;
};

export const CATEGORIES: Category[] = [
  { slug: "work", label: "仕事", emoji: "💼" },
  { slug: "love", label: "恋愛", emoji: "💔" },
  { slug: "family", label: "家族", emoji: "🏠" },
  { slug: "friends", label: "友人", emoji: "👥" },
  { slug: "money", label: "お金", emoji: "💸" },
  { slug: "school", label: "学校", emoji: "🎓" },
  { slug: "health", label: "健康", emoji: "🩺" },
  { slug: "other", label: "雑談", emoji: "💭" },
];

export function findCategory(slug: string | undefined | null): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
