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
    <div className="codex-board">
      <section
        aria-label="Achievement board"
        className="relative grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5"
      >
        {sortedAchievements.map((achievement) => (
          <AchievementCard key={achievement.slug} achievement={achievement} />
        ))}
      </section>
    </div>
  );
}
