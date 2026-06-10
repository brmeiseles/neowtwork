"use client";

import { motion } from "framer-motion";
import { Check, LockKeyhole } from "lucide-react";
import type { KeyboardEvent } from "react";
import type { Achievement } from "@/types/achievement";
import type { AchievementCompletion } from "@/types/completion";

type AchievementCardProps = {
  achievement: Achievement;
  completion?: AchievementCompletion;
  onComplete: () => void;
  onView: () => void;
};

export function AchievementCard({
  achievement,
  completion,
  onComplete,
  onView,
}: AchievementCardProps) {
  const isCompleted = Boolean(completion);
  const actionLabel = isCompleted
    ? `View completed achievement: ${achievement.title}`
    : `Complete achievement: ${achievement.title}`;

  function handleCardAction() {
    if (isCompleted) {
      onView();
      return;
    }

    onComplete();
  }

  function handleCardKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    handleCardAction();
  }

  return (
    <motion.article
      aria-label={actionLabel}
      className={`achievement-card group cursor-pointer focus:outline-none focus:ring-2 focus:ring-ember focus:ring-offset-2 focus:ring-offset-pitch ${isCompleted ? "achievement-card-completed" : ""}`}
      role="button"
      tabIndex={0}
      whileHover={{ y: -3, scale: 1.006 }}
      transition={{ duration: 0.16, ease: "easeOut" }}
      onClick={handleCardAction}
      onKeyDown={handleCardKeyDown}
    >
      <div className="relative z-10 flex h-full w-full items-start gap-4 text-left sm:gap-5">
        <span
          aria-hidden="true"
          className={`locked-emblem transition duration-200 group-hover:scale-105 group-hover:text-parchment ${isCompleted ? "unlocked-emblem" : ""}`}
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

      {completion ? (
        <div className="absolute inset-x-4 bottom-3 z-10 inline-flex w-fit max-w-[calc(100%-2rem)] items-center rounded-card border border-antiqueGold/40 bg-pitch/75 px-2.5 py-1.5 text-[0.7rem] text-bone shadow-card">
          <div className="flex min-w-0 items-center gap-1.5 font-black uppercase tracking-title text-emberBright">
            <Check className="size-4 shrink-0" />
            <span>Ascension {completion.ascensionLevel}</span>
          </div>
        </div>
      ) : null}
    </motion.article>
  );
}
