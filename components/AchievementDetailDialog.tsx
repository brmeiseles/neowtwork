"use client";

import { Copy, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Achievement } from "@/types/achievement";
import type { AchievementCompletion } from "@/types/completion";

type AchievementDetailDialogProps = {
  achievement: Achievement | null;
  completion: AchievementCompletion | null;
  open: boolean;
  onCopySeed: (seed: string) => void;
  onOpenChange: (open: boolean) => void;
  onReset: (achievementSlug: string) => void;
};

function formatCompletedAt(completedAt: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(completedAt));
}

export function AchievementDetailDialog({
  achievement,
  completion,
  open,
  onCopySeed,
  onOpenChange,
  onReset,
}: AchievementDetailDialogProps) {
  if (!achievement || !completion) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{achievement.title}</DialogTitle>
          <DialogDescription>{achievement.description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-5">
          <div className="flex flex-col gap-4 rounded-card border border-antiqueGold/35 bg-pitch/45 p-4 sm:flex-row sm:items-center">
            <div
              aria-hidden="true"
              className="locked-emblem unlocked-emblem text-parchment"
            >
              <img
                alt=""
                className="achievement-emblem-unlocked size-full rounded-badge object-contain p-1"
                src={achievement.emblemSrc}
              />
            </div>
            <div className="grid gap-2">
              <p className="text-xs font-black uppercase tracking-ritual text-emberBright">
                Completed
              </p>
              <p className="text-sm font-semibold text-bone">
                {formatCompletedAt(completion.completedAt)}
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            <p className="text-sm font-black uppercase tracking-title text-brass">
              Proof Screenshot
            </p>
            <div className="overflow-hidden rounded-card border border-brass/30 bg-black/35 p-2 shadow-card">
              <img
                alt={`Proof screenshot for ${achievement.title}`}
                className="max-h-[55vh] w-full rounded-card object-contain"
                src={completion.proofImageDataUrl}
              />
            </div>
          </div>

          <div className="grid gap-3 rounded-card border border-brass/25 bg-soot/70 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="grid gap-2">
              <p className="text-xs font-black uppercase tracking-ritual text-brass">
                Run Metadata
              </p>
              <p className="text-sm font-semibold text-bone">
                Ascension {completion.ascensionLevel}
              </p>
              <p className="break-all font-mono text-sm text-parchment">
                {completion.seed}
              </p>
            </div>
            <Button
              className="w-full sm:w-auto"
              type="button"
              onClick={() => onCopySeed(completion.seed)}
            >
              <Copy className="size-4" />
              Copy Seed
            </Button>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-brass/25 pt-4 sm:flex-row sm:justify-between">
            <Button
              className="border-ember/45 text-emberBright hover:bg-blood/35"
              type="button"
              variant="ghost"
              onClick={() => onReset(achievement.slug)}
            >
              <RotateCcw className="size-4" />
              Reset Completion
            </Button>
            <Button type="button" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
