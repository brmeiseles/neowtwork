export type AchievementRarity = "common" | "uncommon" | "rare" | "legendary";

export type AchievementCategory =
  | "combat"
  | "deckbuilding"
  | "economy"
  | "challenge"
  | "secret";

export type Achievement = {
  id: string;
  slug: string;
  sortOrder: number;
  title: string;
  description: string;
  rarity?: AchievementRarity;
  category?: AchievementCategory;
};
