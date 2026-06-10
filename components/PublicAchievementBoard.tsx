import type { Achievement } from "@/types/achievement";
import type { AchievementCompletion } from "@/types/completion";

type PublicAchievementBoardProps = {
  achievements: Achievement[];
  completionsByAchievement: Record<string, AchievementCompletion[]>;
};

function getBestCompletion(completions: AchievementCompletion[] | undefined) {
  if (!completions?.length) {
    return null;
  }

  return [...completions].sort(
    (first, second) => second.ascensionLevel - first.ascensionLevel,
  )[0];
}

export function PublicAchievementBoard({
  achievements,
  completionsByAchievement,
}: PublicAchievementBoardProps) {
  const sortedAchievements = [...achievements].sort(
    (first, second) => first.sortOrder - second.sortOrder,
  );

  return (
    <div className="codex-board">
      <section
        aria-label="Public achievement board"
        className="relative grid grid-cols-1 gap-3 md:grid-cols-2 lg:gap-4"
      >
        {sortedAchievements.map((achievement) => {
          const bestCompletion = getBestCompletion(
            completionsByAchievement[achievement.slug],
          );
          const isCompleted = Boolean(bestCompletion);

          return (
            <article
              className={`achievement-card ${isCompleted ? "achievement-card-completed" : ""}`}
              key={achievement.slug}
            >
              <div className="relative z-10 flex h-full w-full items-start gap-4 text-left sm:gap-5">
                <span
                  aria-hidden="true"
                  className={`locked-emblem ${isCompleted ? "unlocked-emblem" : ""}`}
                >
                  <span className="emblem-crop">
                    <img
                      alt=""
                      className={`achievement-emblem-image ${isCompleted ? "achievement-emblem-unlocked" : "achievement-emblem-locked"}`}
                      src={achievement.emblemSrc}
                    />
                  </span>
                </span>

                <span className="min-w-0 flex-1 pb-7">
                  <span className="achievement-title block text-lg font-black uppercase leading-[1.05] tracking-title sm:text-xl lg:text-[1.38rem]">
                    {achievement.title}
                  </span>
                  <span className="mt-1.5 block h-0.5 w-24 bg-gradient-to-r from-emberBright via-antiqueGold/70 to-transparent shadow-ember" />
                  <span className="mt-2 block text-sm font-medium leading-5 text-bone sm:text-[0.95rem]">
                    {achievement.description}
                  </span>
                </span>
              </div>

              {bestCompletion ? (
                <div className="absolute inset-x-4 bottom-3 z-10 inline-flex w-fit max-w-[calc(100%-2rem)] items-center rounded-card border border-antiqueGold/40 bg-pitch/75 px-2.5 py-1.5 text-[0.7rem] font-black uppercase tracking-title text-emberBright shadow-card">
                  Ascension {bestCompletion.ascensionLevel}
                </div>
              ) : null}
            </article>
          );
        })}
      </section>
    </div>
  );
}
