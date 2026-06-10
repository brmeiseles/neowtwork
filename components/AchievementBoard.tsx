"use client";

import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import type { Achievement } from "@/types/achievement";
import type { AchievementCompletion } from "@/types/completion";
import { AchievementCard } from "@/components/AchievementCard";
import { AchievementCompletionDialog } from "@/components/AchievementCompletionDialog";
import { AchievementDetailDialog } from "@/components/AchievementDetailDialog";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { PublicEnv } from "@/lib/env";

type AchievementBoardProps = {
  achievements: Achievement[];
  publicEnv: PublicEnv;
};

type StoredCompletions = Record<string, AchievementCompletion[]>;

const COMPLETIONS_STORAGE_KEY = "neowtwork-achievement-completions";
const PROOF_BUCKET = "proofs";

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

function dataUrlToFile(dataUrl: string, filename: string) {
  const [metadata, base64Data] = dataUrl.split(",");
  const mimeType = metadata.match(/data:(.*);base64/)?.[1] ?? "image/png";
  const binary = atob(base64Data);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new File([bytes], filename, { type: mimeType });
}

function getProofExtension(dataUrl: string) {
  const mimeType = dataUrl.match(/^data:(.*);base64/)?.[1] ?? "image/png";

  if (mimeType.includes("jpeg")) {
    return "jpg";
  }

  if (mimeType.includes("webp")) {
    return "webp";
  }

  return "png";
}

function isRemoteProofUrl(proof: string) {
  return proof.startsWith("http://") || proof.startsWith("https://");
}

function groupCompletion(completion: AchievementCompletion) {
  return completion.achievementSlug;
}

export function AchievementBoard({
  achievements,
  publicEnv,
}: AchievementBoardProps) {
  const supabase = useMemo(
    () => createSupabaseBrowserClient(publicEnv),
    [publicEnv],
  );
  const sortedAchievements = useMemo(
    () =>
      [...achievements].sort(
        (first, second) => first.sortOrder - second.sortOrder,
      ),
    [achievements],
  );
  const [completions, setCompletions] = useState<StoredCompletions>({});
  const [hasLoadedCompletions, setHasLoadedCompletions] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isBackendLoading, setIsBackendLoading] = useState(false);
  const [backendError, setBackendError] = useState("");
  const [completionTarget, setCompletionTarget] = useState<Achievement | null>(
    null,
  );
  const [editingCompletion, setEditingCompletion] =
    useState<AchievementCompletion | null>(null);
  const [detailTarget, setDetailTarget] = useState<Achievement | null>(null);

  useEffect(() => {
    if (!supabase) {
      setCompletions(readStoredCompletions());
      setHasLoadedCompletions(true);
      return;
    }

    const supabaseClient = supabase;
    let isMounted = true;

    async function loadSession() {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      if (!isMounted) {
        return;
      }

      setCurrentUser(session?.user ?? null);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!supabase || !currentUser) {
      setCompletions(readStoredCompletions());
      setHasLoadedCompletions(true);
      return;
    }

    const supabaseClient = supabase;
    const user = currentUser;
    let isMounted = true;

    async function loadBackendCompletions() {
      setIsBackendLoading(true);
      setBackendError("");

      const { data, error } = await supabaseClient
        .from("completions")
        .select(
          "id, achievement_id, proof_image_url, seed, ascension, notes, completed_at, created_at, updated_at",
        )
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false });

      if (!isMounted) {
        return;
      }

      setIsBackendLoading(false);

      if (error) {
        setBackendError("Could not load saved completions from Supabase.");
        setCompletions({});
        setHasLoadedCompletions(true);
        return;
      }

      const nextCompletions = (data ?? []).reduce<StoredCompletions>(
        (groupedCompletions, row) => {
          const completion: AchievementCompletion = {
            id: row.id,
            achievementSlug: row.achievement_id,
            proofImageDataUrl: row.proof_image_url ?? "",
            seed: row.seed ?? "",
            ascensionLevel: row.ascension,
            notes: row.notes ?? "",
            completedAt: row.completed_at,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          };
          const achievementSlug = groupCompletion(completion);

          groupedCompletions[achievementSlug] = [
            ...(groupedCompletions[achievementSlug] ?? []),
            completion,
          ];

          return groupedCompletions;
        },
        {},
      );

      setCompletions(nextCompletions);
      setHasLoadedCompletions(true);
    }

    loadBackendCompletions();

    return () => {
      isMounted = false;
    };
  }, [currentUser, supabase]);

  useEffect(() => {
    if (!hasLoadedCompletions || currentUser) {
      return;
    }

    window.localStorage.setItem(
      COMPLETIONS_STORAGE_KEY,
      JSON.stringify(completions),
    );
  }, [completions, currentUser, hasLoadedCompletions]);

  async function uploadProof(completion: AchievementCompletion) {
    if (!supabase || !currentUser) {
      return completion.proofImageDataUrl;
    }

    if (isRemoteProofUrl(completion.proofImageDataUrl)) {
      return completion.proofImageDataUrl;
    }

    const extension = getProofExtension(completion.proofImageDataUrl);
    const proofPath = `${currentUser.id}/${completion.achievementSlug}/${completion.id}-${Date.now()}.${extension}`;
    const proofFile = dataUrlToFile(
      completion.proofImageDataUrl,
      `${completion.achievementSlug}.${extension}`,
    );
    const { error } = await supabase.storage
      .from(PROOF_BUCKET)
      .upload(proofPath, proofFile, {
        contentType: proofFile.type,
        upsert: false,
      });

    if (error) {
      throw new Error("Proof upload failed. Completion was not saved.");
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(PROOF_BUCKET).getPublicUrl(proofPath);

    return publicUrl;
  }

  function storeLocalCompletion(completion: AchievementCompletion) {
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

  async function handleComplete(completion: AchievementCompletion) {
    if (!currentUser || !supabase) {
      storeLocalCompletion(completion);
      return true;
    }

    setIsBackendLoading(true);
    setBackendError("");

    try {
      const proofImageUrl = await uploadProof(completion);
      const completionPayload = {
        user_id: currentUser.id,
        achievement_id: completion.achievementSlug,
        proof_image_url: proofImageUrl,
        seed: completion.seed?.trim() ? completion.seed.trim() : null,
        ascension: completion.ascensionLevel,
        notes: completion.notes?.trim() ? completion.notes.trim() : null,
        completed_at: completion.completedAt,
      };

      if (editingCompletion) {
        const { data, error } = await supabase
          .from("completions")
          .update(completionPayload)
          .eq("id", editingCompletion.id)
          .eq("user_id", currentUser.id)
          .select(
            "id, achievement_id, proof_image_url, seed, ascension, notes, completed_at, created_at, updated_at",
          )
          .single();

        if (error) {
          throw new Error("Could not update completion in Supabase.");
        }

        storeLocalCompletion({
          id: data.id,
          achievementSlug: data.achievement_id,
          proofImageDataUrl: data.proof_image_url ?? "",
          seed: data.seed ?? "",
          ascensionLevel: data.ascension,
          notes: data.notes ?? "",
          completedAt: data.completed_at,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        });
        return true;
      }

      const { data, error } = await supabase
        .from("completions")
        .insert(completionPayload)
        .select(
          "id, achievement_id, proof_image_url, seed, ascension, notes, completed_at, created_at, updated_at",
        )
        .single();

      if (error) {
        throw new Error("Could not save completion in Supabase.");
      }

      storeLocalCompletion({
        id: data.id,
        achievementSlug: data.achievement_id,
        proofImageDataUrl: data.proof_image_url ?? "",
        seed: data.seed ?? "",
        ascensionLevel: data.ascension,
        notes: data.notes ?? "",
        completedAt: data.completed_at,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      });
      return true;
    } catch (saveError) {
      setBackendError(
        saveError instanceof Error
          ? saveError.message
          : "Could not save completion.",
      );
      return false;
    } finally {
      setIsBackendLoading(false);
    }
  }

  async function handleDeleteCompletion(
    achievementSlug: string,
    completionId: string,
  ) {
    if (currentUser && supabase) {
      setIsBackendLoading(true);
      setBackendError("");

      const { error } = await supabase
        .from("completions")
        .delete()
        .eq("id", completionId)
        .eq("user_id", currentUser.id);

      setIsBackendLoading(false);

      if (error) {
        setBackendError("Could not delete completion from Supabase.");
        return;
      }
    }

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

  async function handleReset(achievementSlug: string) {
    if (currentUser && supabase) {
      setIsBackendLoading(true);
      setBackendError("");

      const { error } = await supabase
        .from("completions")
        .delete()
        .eq("achievement_id", achievementSlug)
        .eq("user_id", currentUser.id);

      setIsBackendLoading(false);

      if (error) {
        setBackendError("Could not delete completions from Supabase.");
        return;
      }
    }

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
      {backendError ? (
        <div className="rounded-card border border-brass/25 bg-pitch/65 px-3 py-2 text-sm font-bold text-bone shadow-card">
          {backendError}
        </div>
      ) : null}

      <div className="codex-board">
        <section
          aria-label="Achievement board"
          className="relative grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:gap-3"
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
