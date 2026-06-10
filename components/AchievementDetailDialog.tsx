"use client";

import { Copy, Pencil, Plus, Trash2 } from "lucide-react";

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
  completions: AchievementCompletion[];
  open: boolean;
  onAddCompletion: (achievement: Achievement) => void;
  onCopySeed: (seed: string) => void;
  onDeleteCompletion: (achievementSlug: string, completionId: string) => void;
  onEditCompletion: (
    achievement: Achievement,
    completion: AchievementCompletion,
  ) => void;
  onOpenChange: (open: boolean) => void;
  onReset: (achievementSlug: string) => void;
};

function formatCompletedAt(completedAt: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(completedAt));
}

function getBestCompletion(completions: AchievementCompletion[]) {
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

export function AchievementDetailDialog({
  achievement,
  completions,
  open,
  onAddCompletion,
  onCopySeed,
  onDeleteCompletion,
  onEditCompletion,
  onOpenChange,
  onReset,
}: AchievementDetailDialogProps) {
  if (!achievement || !completions.length) {
    return null;
  }

  const bestCompletion = getBestCompletion(completions);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{achievement.title}</DialogTitle>
          <DialogDescription>{achievement.description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-5">
          <div className="flex flex-col gap-4 rounded-card border border-antiqueGold/35 bg-pitch/45 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div
                aria-hidden="true"
                className="locked-emblem unlocked-emblem text-parchment"
              >
                <span className="emblem-crop">
                  <img
                    alt=""
                    className="achievement-emblem-image achievement-emblem-unlocked"
                    src={achievement.emblemSrc}
                  />
                </span>
              </div>
              <div className="grid gap-2">
                <p className="text-xs font-black uppercase tracking-ritual text-emberBright">
                  Best Completion
                </p>
                <p className="text-sm font-semibold text-bone">
                  Ascension {bestCompletion.ascensionLevel} ·{" "}
                  {formatCompletedAt(bestCompletion.completedAt)}
                </p>
              </div>
            </div>
            <Button type="button" onClick={() => onAddCompletion(achievement)}>
              <Plus className="size-4" />
              Add Another
            </Button>
          </div>

          <div className="grid gap-3">
            <p className="text-sm font-black uppercase tracking-title text-brass">
              Completions
            </p>

            {completions.map((completion, index) => (
              <article
                className="grid gap-3 rounded-card border border-brass/25 bg-soot/70 p-4"
                key={completion.id}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="grid gap-1">
                    <p className="text-xs font-black uppercase tracking-ritual text-emberBright">
                      Completion {index + 1}
                    </p>
                    <p className="text-sm font-semibold text-bone">
                      Ascension {completion.ascensionLevel} ·{" "}
                      {formatCompletedAt(completion.completedAt)}
                    </p>
                    {completion.seed ? (
                      <p className="break-all font-mono text-sm text-parchment">
                        Seed: {completion.seed}
                      </p>
                    ) : (
                      <p className="text-sm font-semibold text-bone/70">
                        No seed saved.
                      </p>
                    )}
                    {completion.notes ? (
                      <p className="text-sm text-bone">{completion.notes}</p>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {completion.seed ? (
                      <Button
                        size="sm"
                        type="button"
                        onClick={() => onCopySeed(completion.seed ?? "")}
                      >
                        <Copy className="size-4" />
                        Copy Seed
                      </Button>
                    ) : null}
                    <Button
                      size="sm"
                      type="button"
                      variant="ghost"
                      onClick={() => onEditCompletion(achievement, completion)}
                    >
                      <Pencil className="size-4" />
                      Edit
                    </Button>
                    <Button
                      className="text-emberBright hover:bg-blood/35"
                      size="sm"
                      type="button"
                      variant="ghost"
                      onClick={() =>
                        onDeleteCompletion(achievement.slug, completion.id)
                      }
                    >
                      <Trash2 className="size-4" />
                      Delete
                    </Button>
                  </div>
                </div>

                <div className="overflow-hidden rounded-card border border-brass/30 bg-black/35 p-2 shadow-card">
                  {completion.proofImageDataUrl ? (
                    <img
                      alt={`Proof screenshot for ${achievement.title}`}
                      className="max-h-[48vh] w-full rounded-card object-contain"
                      src={completion.proofImageDataUrl}
                    />
                  ) : (
                    <p className="p-4 text-sm font-semibold text-bone">
                      Proof screenshot will appear here once uploaded.
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-brass/25 pt-4 sm:flex-row sm:justify-between">
            <Button
              className="border-ember/45 text-emberBright hover:bg-blood/35"
              type="button"
              variant="ghost"
              onClick={() => onReset(achievement.slug)}
            >
              <Trash2 className="size-4" />
              Delete All
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
