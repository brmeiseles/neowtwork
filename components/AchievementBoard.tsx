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

type StoredCompletions = Record<string, AchievementCompletion[]>;

const COMPLETIONS_STORAGE_KEY = "neowtwork-achievement-completions";

function createLocalId() {
  return globalThis.crypto?.randomUUID?.() ?? `local-${Date.now()}`;
}

function normalizeCompletion(
  achievementSlug: string,
  completion: Partial<AchievementCompletion>,
): AchievementCompletion {
  const now = new Date().toISOString();

  return {
    id: completion.id ?? createLocalId(),
    achievementSlug: completion.achievementSlug ?? achievementSlug,
    proofImageDataUrl: completion.proofImageDataUrl ?? "",
    seed: completion.seed ?? "",
    ascensionLevel: completion.ascensionLevel ?? 0,
    notes: completion.notes ?? "",
    completedAt: completion.completedAt ?? now,
    createdAt: completion.createdAt ?? now,
    updatedAt: completion.updatedAt ?? now,
  };
}

function readStoredCompletions(): StoredCompletions {
  try {
    const stored = window.localStorage.getItem(COMPLETIONS_STORAGE_KEY);

    if (!stored) {
      return {};
    }

    const parsed = JSON.parse(stored) as Record<
      string,
      AchievementCompletion | AchievementCompletion[]
    >;

    return Object.fromEntries(
      Object.entries(parsed).map(([achievementSlug, completionOrList]) => {
        const completions = Array.isArray(completionOrList)
          ? completionOrList
          : [completionOrList];

        return [
          achievementSlug,
          completions.map((completion) =>
            normalizeCompletion(achievementSlug, completion),
          ),
        ];
      }),
    );
  } catch {
    return {};
  }
}

function getBestCompletion(completions: AchievementCompletion[] | undefined) {
  if (!completions?.length) {
    return undefined;
  }

  return [...completions].sort((first, second) => {
    if (second.ascensionLevel !== first.ascensionLevel) {
      return second.ascensionLevel - first.ascensionLevel;
    }

    return (
      new Date(second.completedAt).getTime() -
      new Date(first.completedAt).getTime()
    );
  })[0];
}

export function AchievementBoard({ achievements }: AchievementBoardProps) {
  const sortedAchievements = useMemo(
    () =>
      [...achievements].sort(
        (first, second) => first.sortOrder - second.sortOrder,
      ),
    [achievements],
  );
  const [completions, setCompletions] = useState<StoredCompletions>({});
  const [hasLoadedCompletions, setHasLoadedCompletions] = useState(false);
  const [completionTarget, setCompletionTarget] = useState<Achievement | null>(
    null,
  );
  const [editingCompletion, setEditingCompletion] =
    useState<AchievementCompletion | null>(null);
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
    setCompletions((currentCompletions) => {
      const achievementCompletions =
        currentCompletions[completion.achievementSlug] ?? [];
      const existingIndex = achievementCompletions.findIndex(
        (currentCompletion) => currentCompletion.id === completion.id,
      );
      const nextCompletion = {
        ...completion,
        updatedAt: new Date().toISOString(),
      };

      if (existingIndex >= 0) {
        return {
          ...currentCompletions,
          [completion.achievementSlug]: achievementCompletions.map(
            (currentCompletion) =>
              currentCompletion.id === completion.id
                ? nextCompletion
                : currentCompletion,
          ),
        };
      }

      return {
        ...currentCompletions,
        [completion.achievementSlug]: [
          ...achievementCompletions,
          nextCompletion,
        ],
      };
    });
    setEditingCompletion(null);
  }

  function handleDeleteCompletion(
    achievementSlug: string,
    completionId: string,
  ) {
    setCompletions((currentCompletions) => {
      const nextAchievementCompletions = (
        currentCompletions[achievementSlug] ?? []
      ).filter((completion) => completion.id !== completionId);
      const nextCompletions = { ...currentCompletions };

      if (nextAchievementCompletions.length) {
        nextCompletions[achievementSlug] = nextAchievementCompletions;
      } else {
        delete nextCompletions[achievementSlug];
        setDetailTarget(null);
      }

      return nextCompletions;
    });
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
    if (!seed) {
      return;
    }

    await navigator.clipboard.writeText(seed);
  }

  const detailCompletions = detailTarget
    ? completions[detailTarget.slug] ?? []
    : [];

  return (
    <>
      <div className="codex-board">
        <section
          aria-label="Achievement board"
          className="relative grid grid-cols-1 gap-3 md:grid-cols-2 lg:gap-4"
        >
          {sortedAchievements.map((achievement) => (
            <AchievementCard
              achievement={achievement}
              completion={getBestCompletion(completions[achievement.slug])}
              key={achievement.slug}
              onComplete={() => setCompletionTarget(achievement)}
              onView={() => setDetailTarget(achievement)}
            />
          ))}
        </section>
      </div>

      <AchievementCompletionDialog
        achievement={completionTarget}
        completion={editingCompletion}
        open={Boolean(completionTarget)}
        onComplete={handleComplete}
        onOpenChange={(open) => {
          if (!open) {
            setCompletionTarget(null);
            setEditingCompletion(null);
          }
        }}
      />

      <AchievementDetailDialog
        achievement={detailTarget}
        completions={detailCompletions}
        open={Boolean(detailTarget && detailCompletions.length)}
        onAddCompletion={(achievement) => {
          setCompletionTarget(achievement);
          setEditingCompletion(null);
        }}
        onCopySeed={handleCopySeed}
        onDeleteCompletion={handleDeleteCompletion}
        onEditCompletion={(achievement, completion) => {
          setCompletionTarget(achievement);
          setEditingCompletion(completion);
        }}
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
