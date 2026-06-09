import type { Achievement } from "@/types/achievement";
import { AchievementCard } from "@/components/AchievementCard";

type AchievementBoardProps = {
  achievements: Achievement[];
};

export function AchievementBoard({ achievements }: AchievementBoardProps) {
  const sortedAchievements = [...achievements].sort(
    (first, second) => first.sortOrder - second.sortOrder,
  );

  return (
    <section
      aria-label="Achievement board"
      className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5"
    >
      {sortedAchievements.map((achievement) => (
        <AchievementCard key={achievement.slug} achievement={achievement} />
      ))}
    </section>
  );
}
