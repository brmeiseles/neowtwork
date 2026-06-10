"use client";

import { useEffect, useMemo, useState } from "react";
import type { Achievement } from "@/types/achievement";
import type { AchievementCompletion } from "@/types/completion";
import { AchievementCard } from "@/components/AchievementCard";
import { AchievementCompletionDialog } from "@/components/AchievementCompletionDialog";
import { AchievementDetailDialog } from "@/components/AchievementDetailDialog";

type AchievementBoardProps = {
  achievements: Achievement[];
};

const COMPLETIONS_STORAGE_KEY = "neowtwork-achievement-completions";

function readStoredCompletions() {
  try {
    const stored = window.localStorage.getItem(COMPLETIONS_STORAGE_KEY);

    if (!stored) {
      return {};
    }

    return JSON.parse(stored) as Record<string, AchievementCompletion>;
  } catch {
    return {};
  }
}

export function AchievementBoard({ achievements }: AchievementBoardProps) {
  const sortedAchievements = useMemo(
    () =>
      [...achievements].sort(
        (first, second) => first.sortOrder - second.sortOrder,
      ),
    [achievements],
  );
  const [completions, setCompletions] = useState<
    Record<string, AchievementCompletion>
  >({});
  const [hasLoadedCompletions, setHasLoadedCompletions] = useState(false);
  const [completionTarget, setCompletionTarget] = useState<Achievement | null>(
    null,
  );
  const [detailTarget, setDetailTarget] = useState<Achievement | null>(null);

  useEffect(() => {
    setCompletions(readStoredCompletions());
    setHasLoadedCompletions(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedCompletions) {
      return;
    }

    window.localStorage.setItem(
      COMPLETIONS_STORAGE_KEY,
      JSON.stringify(completions),
    );
  }, [completions, hasLoadedCompletions]);

  function handleComplete(completion: AchievementCompletion) {
    setCompletions((currentCompletions) => ({
      ...currentCompletions,
      [completion.achievementSlug]: completion,
    }));
  }

  function handleReset(achievementSlug: string) {
    setCompletions((currentCompletions) => {
      const nextCompletions = { ...currentCompletions };
      delete nextCompletions[achievementSlug];
      return nextCompletions;
    });
    setDetailTarget(null);
  }

  async function handleCopySeed(seed: string) {
    await navigator.clipboard.writeText(seed);
  }

  const detailCompletion = detailTarget ? completions[detailTarget.slug] : null;

  return (
    <>
      <div className="codex-board">
        <section
          aria-label="Achievement board"
          className="relative grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5"
        >
          {sortedAchievements.map((achievement) => (
            <AchievementCard
              achievement={achievement}
              completion={completions[achievement.slug]}
              key={achievement.slug}
              onComplete={() => setCompletionTarget(achievement)}
              onCopySeed={handleCopySeed}
              onView={() => setDetailTarget(achievement)}
            />
          ))}
        </section>
      </div>

      <AchievementCompletionDialog
        achievement={completionTarget}
        open={Boolean(completionTarget)}
        onComplete={handleComplete}
        onOpenChange={(open) => {
          if (!open) {
            setCompletionTarget(null);
          }
        }}
      />

      <AchievementDetailDialog
        achievement={detailTarget}
        completion={detailCompletion}
        open={Boolean(detailTarget && detailCompletion)}
        onCopySeed={handleCopySeed}
        onOpenChange={(open) => {
          if (!open) {
            setDetailTarget(null);
          }
        }}
        onReset={handleReset}
      />
    </>
  );
}
