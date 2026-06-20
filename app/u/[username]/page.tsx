import { notFound } from "next/navigation";
import { AchievementBoard } from "@/components/AchievementBoard";
import { AppHero } from "@/components/AppHero";
import { AppShell } from "@/components/AppShell";
import { ProfileViewAnalytics } from "@/components/ProfileViewAnalytics";
import { PublicAchievementBoard } from "@/components/PublicAchievementBoard";
import { achievements as localAchievements } from "@/data/achievements";
import { getPublicEnv, hasSupabaseEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { normalizeUsername } from "@/lib/username";
import type { Achievement } from "@/types/achievement";
import type { AchievementCompletion } from "@/types/completion";

type PublicProfilePageProps = {
  params: Promise<{
    username: string;
  }>;
};

function mapCompletionRows(
  rows: Array<{
    id: string;
    achievement_id: string;
    proof_image_url: string | null;
    seed: string | null;
    ascension: number;
    notes: string | null;
    completed_at: string;
    created_at: string;
    updated_at: string;
  }>,
) {
  return rows.reduce<Record<string, AchievementCompletion[]>>(
    (completionsByAchievement, row) => {
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

      completionsByAchievement[row.achievement_id] = [
        ...(completionsByAchievement[row.achievement_id] ?? []),
        completion,
      ];

      return completionsByAchievement;
    },
    {},
  );
}

function mapAchievementRows(
  rows: Array<{
    id: string;
    slug: string;
    title: string;
    description: string;
    sort_order: number;
    category: string | null;
    icon_path: string | null;
  }>,
): Achievement[] {
  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    sortOrder: row.sort_order,
    title: row.title,
    description: row.description,
    emblemSrc: row.icon_path ?? `/achievement-emblems/${row.slug}.png`,
    category: row.category as Achievement["category"],
  }));
}

export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  const { username: rawUsername } = await params;
  const username = normalizeUsername(rawUsername);

  if (!hasSupabaseEnv()) {
    return (
      <AppShell>
        <div className="flex flex-col gap-4 sm:gap-5">
          <AppHero />
          <p className="px-1 text-xs font-black uppercase tracking-ritual text-brass/80">
            Viewing {username} · backend dormant
          </p>
          <PublicAchievementBoard
            achievements={localAchievements}
            completionsByAchievement={{}}
          />
        </div>
      </AppShell>
    );
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    notFound();
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url")
    .eq("username", username)
    .maybeSingle();

  if (!profile) {
    notFound();
  }

  const [{ data: achievementRows }, { data: completionRows }] =
    await Promise.all([
      supabase
        .from("achievements")
        .select("id, slug, title, description, sort_order, category, icon_path")
        .order("sort_order", { ascending: true }),
      supabase
        .from("completions")
        .select(
          "id, achievement_id, proof_image_url, seed, ascension, notes, completed_at, created_at, updated_at",
        )
        .eq("user_id", profile.id),
    ]);

  const boardAchievements = achievementRows?.length
    ? mapAchievementRows(achievementRows)
    : localAchievements;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isOwnBoard = user?.id === profile.id;
  const { data: friendRow } =
    user && !isOwnBoard
      ? await supabase
          .from("friends")
          .select("id")
          .eq("user_id", user.id)
          .eq("friend_user_id", profile.id)
          .maybeSingle()
      : { data: null };
  const viewedProfileType = isOwnBoard ? "own" : friendRow ? "friend" : "public";
  const visibleBoardName = profile.display_name?.trim() || profile.username;

  return (
    <AppShell>
      <ProfileViewAnalytics
        completionCount={completionRows?.length ?? 0}
        isLoggedIn={Boolean(user)}
        viewedProfileType={viewedProfileType}
      />
      <div className="flex flex-col gap-4 sm:gap-5">
        <AppHero />
        {!isOwnBoard ? (
          <p className="px-1 text-xs font-black uppercase tracking-ritual text-brass/80">
            Viewing {visibleBoardName}&apos;s board
          </p>
        ) : null}
        {isOwnBoard ? (
          <AchievementBoard
            achievements={boardAchievements}
            publicEnv={getPublicEnv()}
          />
        ) : (
          <PublicAchievementBoard
            achievements={boardAchievements}
            completionsByAchievement={mapCompletionRows(completionRows ?? [])}
            isLoggedIn={Boolean(user)}
          />
        )}
      </div>
    </AppShell>
  );
}
