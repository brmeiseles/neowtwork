"use client";

import { useEffect, useState, type ClipboardEvent, type FormEvent } from "react";
import { ImagePlus, Upload } from "lucide-react";

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

type AchievementCompletionDialogProps = {
  achievement: Achievement | null;
  completion?: AchievementCompletion | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (completion: AchievementCompletion) => Promise<boolean> | boolean;
};

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read proof image."));
    reader.readAsDataURL(file);
  });
}

function createLocalId() {
  return globalThis.crypto?.randomUUID?.() ?? `local-${Date.now()}`;
}

export function AchievementCompletionDialog({
  achievement,
  completion,
  open,
  onOpenChange,
  onComplete,
}: AchievementCompletionDialogProps) {
  const [proofImageDataUrl, setProofImageDataUrl] = useState("");
  const [seed, setSeed] = useState("");
  const [ascensionLevel, setAscensionLevel] = useState("0");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const isEditing = Boolean(completion);

  useEffect(() => {
    if (!open) {
      setProofImageDataUrl("");
      setSeed("");
      setAscensionLevel("0");
      setNotes("");
      setError("");
      setIsSaving(false);
      return;
    }

    setProofImageDataUrl(completion?.proofImageDataUrl ?? "");
    setSeed(completion?.seed ?? "");
    setAscensionLevel(String(completion?.ascensionLevel ?? 0));
    setNotes(completion?.notes ?? "");
    setError("");
    setIsSaving(false);
  }, [completion, open]);

  async function handleFile(file: File | undefined) {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Proof needs to be an image file.");
      return;
    }

    setError("");
    setProofImageDataUrl(await fileToDataUrl(file));
  }

  async function handlePaste(event: ClipboardEvent<HTMLDivElement>) {
    const imageFile = Array.from(event.clipboardData.files).find((file) =>
      file.type.startsWith("image/"),
    );

    if (imageFile) {
      event.preventDefault();
      await handleFile(imageFile);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!achievement) {
      return;
    }

    setError("");
    setIsSaving(true);

    try {
      const proof = proofImageDataUrl;
      const parsedAscension = Number(ascensionLevel);

      if (!proof) {
        throw new Error("Add proof by uploading or pasting an image.");
      }

      if (
        !Number.isInteger(parsedAscension) ||
        parsedAscension < 0 ||
        parsedAscension > 10
      ) {
        throw new Error("Ascension should be a whole number from 0 to 10.");
      }

      const now = new Date().toISOString();

      const didSave = await onComplete({
        id: completion?.id ?? createLocalId(),
        achievementSlug: achievement.slug,
        proofImageDataUrl: proof,
        seed: seed.trim(),
        ascensionLevel: parsedAscension,
        notes: notes.trim(),
        completedAt: completion?.completedAt ?? now,
        createdAt: completion?.createdAt ?? now,
        updatedAt: now,
      });

      if (!didSave) {
        throw new Error("Could not save completion. Try again.");
      }

      onOpenChange(false);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Could not save achievement proof.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onPaste={handlePaste}>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Completion" : "Complete Achievement"}
          </DialogTitle>
          <DialogDescription>
            {achievement
              ? `Attach proof for ${achievement.title}. The badge stays canonical; screenshots live here as proof.`
              : "Attach proof for this achievement."}
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-5" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-bold uppercase tracking-title text-brass">
            Proof image
            <span className="flex min-h-44 items-center justify-center overflow-hidden rounded-card border-2 border-dashed border-brass/35 bg-pitch/55 p-3 text-center text-sm normal-case tracking-normal text-bone">
              {proofImageDataUrl ? (
                <img
                  alt="Selected proof preview"
                  className="max-h-72 rounded-card object-contain shadow-card"
                  src={proofImageDataUrl}
                />
              ) : (
                <span className="flex flex-col items-center gap-2">
                  <ImagePlus className="size-8 text-emberBright" />
                  Upload an image or paste one here.
                </span>
              )}
            </span>
            <span className="relative inline-flex">
              <input
                accept="image/*"
                className="absolute inset-0 cursor-pointer opacity-0"
                type="file"
                onChange={(event) => handleFile(event.target.files?.[0])}
              />
              <span className="inline-flex h-10 items-center justify-center gap-2 rounded-card border border-brass/35 bg-soot px-4 text-sm text-parchment hover:border-ember/70 hover:bg-cardHover">
                <Upload className="size-4" />
                Choose proof image
              </span>
            </span>
          </label>

          <div className="grid gap-4 sm:grid-cols-[1fr_10rem]">
            <label className="grid gap-2 text-sm font-bold uppercase tracking-title text-brass">
              Seed Optional
              <input
                className="h-11 rounded-card border border-brass/25 bg-pitch/60 px-3 text-base normal-case tracking-normal text-parchment outline-none placeholder:text-bone/50 focus:border-ember"
                placeholder="Run seed"
                value={seed}
                onChange={(event) => setSeed(event.target.value)}
              />
            </label>

            <label className="grid gap-2 text-sm font-bold uppercase tracking-title text-brass">
              Ascension
              <input
                className="h-11 rounded-card border border-brass/25 bg-pitch/60 px-3 text-base normal-case tracking-normal text-parchment outline-none focus:border-ember"
                max="10"
                min="0"
                type="number"
                value={ascensionLevel}
                onChange={(event) => setAscensionLevel(event.target.value)}
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm font-bold uppercase tracking-title text-brass">
            Notes Optional
            <textarea
              className="min-h-20 rounded-card border border-brass/25 bg-pitch/60 px-3 py-2 text-base normal-case tracking-normal text-parchment outline-none placeholder:text-bone/50 focus:border-ember"
              placeholder="Tiny run note, relic memory, or proof context"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </label>

          {error ? (
            <p className="rounded-card border border-ember/45 bg-blood/35 p-3 text-sm font-semibold text-parchment">
              {error}
            </p>
          ) : null}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button disabled={isSaving} type="submit">
              {isSaving
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Complete Achievement"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
