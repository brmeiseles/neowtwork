"use client";

import { useState, type KeyboardEvent } from "react";
import type { Achievement } from "@/types/achievement";
import type { AchievementCompletion } from "@/types/completion";
import { LockKeyhole } from "lucide-react";
import { AchievementDetailDialog } from "@/components/AchievementDetailDialog";
import { captureAnalyticsEvent } from "@/lib/analytics";

type PublicAchievementBoardProps = {
  achievements: Achievement[];
  completionsByAchievement: Record<string, AchievementCompletion[]>;
  isLoggedIn?: boolean;
  source?: "profile";
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
  isLoggedIn = false,
  source = "profile",
}: PublicAchievementBoardProps) {
  const [detailTarget, setDetailTarget] = useState<Achievement | null>(null);
  const sortedAchievements = [...achievements].sort(
    (first, second) => first.sortOrder - second.sortOrder,
  );
  const detailCompletions = detailTarget
    ? completionsByAchievement[detailTarget.slug] ?? []
    : [];

  function captureAchievementViewed(achievement: Achievement) {
    captureAnalyticsEvent("achievement_viewed", {
      achievement_id: achievement.slug,
      achievement_name: achievement.title,
      completion_count: completionsByAchievement[achievement.slug]?.length ?? 0,
      is_logged_in: isLoggedIn,
      source,
    });
  }

  function captureSeedCopied(completion: AchievementCompletion) {
    const achievement = sortedAchievements.find(
      (currentAchievement) => currentAchievement.slug === completion.achievementSlug,
    );

    captureAnalyticsEvent("seed_copied", {
      achievement_id: completion.achievementSlug,
      achievement_name: achievement?.title,
      ascension: completion.ascensionLevel,
      has_proof: Boolean(completion.proofImageDataUrl),
      has_seed: Boolean(completion.seed?.trim()),
      is_logged_in: isLoggedIn,
      source,
    });
  }

  async function handleCopySeed(
    seed: string,
    completion: AchievementCompletion,
  ) {
    if (!seed) {
      return;
    }

    await navigator.clipboard.writeText(seed);
    captureSeedCopied(completion);
  }

  return (
    <>
      <div className="codex-board">
        <section
          aria-label="Public achievement board"
          className="relative grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:gap-3"
        >
          {sortedAchievements.map((achievement) => {
            const bestCompletion = getBestCompletion(
              completionsByAchievement[achievement.slug],
            );
            const isCompleted = Boolean(bestCompletion);
            const actionLabel = isCompleted
              ? `View completed achievement: ${achievement.title}`
              : `Locked achievement: ${achievement.title}`;

            function handleCardKeyDown(event: KeyboardEvent<HTMLElement>) {
              if (!isCompleted || (event.key !== "Enter" && event.key !== " ")) {
                return;
              }

              event.preventDefault();
              captureAchievementViewed(achievement);
              setDetailTarget(achievement);
            }

            return (
              <article
                aria-label={actionLabel}
                className={`achievement-card ${isCompleted ? "achievement-card-completed cursor-pointer focus:outline-none focus:ring-2 focus:ring-ember focus:ring-offset-2 focus:ring-offset-pitch" : ""}`}
                key={achievement.slug}
                role={isCompleted ? "button" : undefined}
                tabIndex={isCompleted ? 0 : undefined}
                onClick={() => {
                  if (isCompleted) {
                    captureAchievementViewed(achievement);
                    setDetailTarget(achievement);
                  }
                }}
                onKeyDown={handleCardKeyDown}
              >
                <div className="relative z-10 flex h-full w-full items-start gap-4 text-left sm:gap-5">
                  <span
                    aria-hidden="true"
                    className={`locked-emblem ${isCompleted ? "unlocked-emblem" : ""}`}
                  >
                    {isCompleted ? (
                      <span className="emblem-crop">
                        <img
                          alt=""
                          className={`achievement-emblem-image achievement-emblem-unlocked achievement-emblem-${achievement.slug}`}
                          src={achievement.emblemSrc}
                        />
                      </span>
                    ) : (
                      <LockKeyhole className="absolute size-5 text-emberBright drop-shadow-[0_2px_0_rgba(0,0,0,0.85)]" />
                    )}
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

      <AchievementDetailDialog
        achievement={detailTarget}
        completions={detailCompletions}
        isReadOnly
        open={Boolean(detailTarget)}
        onCopySeed={handleCopySeed}
        onOpenChange={(open) => {
          if (!open) {
            setDetailTarget(null);
          }
        }}
      />
    </>
  );
}
