"use client";

import { motion } from "framer-motion";
import { Check, Copy, LockKeyhole } from "lucide-react";
import type { KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import type { Achievement } from "@/types/achievement";
import type { AchievementCompletion } from "@/types/completion";

type AchievementCardProps = {
  achievement: Achievement;
  completion?: AchievementCompletion;
  onComplete: () => void;
  onCopySeed: (seed: string) => void;
  onView: () => void;
};

export function AchievementCard({
  achievement,
  completion,
  onComplete,
  onCopySeed,
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
      whileHover={{ y: -5, scale: 1.012 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={handleCardAction}
      onKeyDown={handleCardKeyDown}
    >
      <div className="relative z-10 flex h-full w-full items-start gap-5 text-left">
        <span
          aria-hidden="true"
          className={`locked-emblem transition duration-200 group-hover:scale-110 group-hover:text-parchment ${isCompleted ? "unlocked-emblem" : ""}`}
        >
          <img
            alt=""
            className={`size-full rounded-badge object-contain p-1 transition duration-200 ${isCompleted ? "achievement-emblem-unlocked" : "achievement-emblem-locked"}`}
            src={achievement.emblemSrc}
          />
          {!isCompleted ? (
            <LockKeyhole className="absolute size-5 text-emberBright drop-shadow-[0_2px_0_rgba(0,0,0,0.85)]" />
          ) : null}
        </span>

        <span className="min-w-0 flex-1 pb-8">
          <span className="achievement-title block text-xl font-black uppercase leading-tight tracking-title sm:text-2xl">
            {achievement.title}
          </span>
          <span className="mt-2 block h-0.5 w-28 bg-gradient-to-r from-emberBright via-antiqueGold/70 to-transparent shadow-ember" />
          <span className="mt-3 block text-sm font-medium leading-6 text-bone sm:text-base">
            {achievement.description}
          </span>
        </span>
      </div>

      {completion ? (
        <div className="absolute inset-x-5 bottom-4 z-10 flex flex-wrap items-center justify-between gap-2 rounded-card border border-antiqueGold/35 bg-pitch/70 px-3 py-2 text-xs text-bone shadow-card">
          <div className="flex min-w-0 flex-wrap items-center gap-2 font-black uppercase tracking-title text-emberBright">
            <Check className="size-4 shrink-0" />
            <span>Ascension {completion.ascensionLevel}</span>
            <span className="break-all font-mono text-parchment">
              {completion.seed}
            </span>
          </div>
          <Button
            className="shrink-0"
            size="sm"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onCopySeed(completion.seed);
            }}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <Copy className="size-4" />
            Copy Seed
          </Button>
        </div>
      ) : null}
    </motion.article>
  );
}
