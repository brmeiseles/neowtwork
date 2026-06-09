import type { Achievement } from "@/types/achievement";
import { AchievementCard } from "@/components/AchievementCard";

type AchievementBoardProps = {
  achievements: Achievement[];
};

export function AchievementBoard({ achievements }: AchievementBoardProps) {
  return (
    <section
      aria-label="Achievement board"
      className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5"
    >
      {achievements.map((achievement) => (
        <AchievementCard key={achievement.title} achievement={achievement} />
      ))}
    </section>
  );
}
