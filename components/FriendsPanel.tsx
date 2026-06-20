"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { UserPlus, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { captureAnalyticsEvent } from "@/lib/analytics";
import { getProfileDisplayName } from "@/lib/profile-display";
import { isValidUsername, normalizeUsername } from "@/lib/username";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type FriendRow = Pick<
  Database["public"]["Tables"]["friends"]["Row"],
  "id" | "user_id" | "friend_user_id" | "created_at"
>;
type FriendProfile = Pick<
  Profile,
  "id" | "username" | "display_name" | "avatar_url"
>;
type Friend = FriendRow & {
  profile: FriendProfile;
};

type FriendsPanelProps = {
  isOpen: boolean;
  profile: Profile;
  supabase: SupabaseClient<Database>;
  user: User;
};

function sortFriends(first: Friend, second: Friend) {
  return getProfileDisplayName(first.profile).localeCompare(
    getProfileDisplayName(second.profile),
  );
}

export function FriendsPanel({
  isOpen,
  profile,
  supabase,
  user,
}: FriendsPanelProps) {
  const [following, setFollowing] = useState<Friend[]>([]);
  const [followers, setFollowers] = useState<Friend[]>([]);
  const [boardLink, setBoardLink] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ready">("idle");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || status === "ready") {
      return;
    }

    let isMounted = true;

    async function loadFriends() {
      setStatus("loading");
      setError("");

      const [
        { data: followingRows, error: followingError },
        { data: followerRows, error: followersError },
      ] = await Promise.all([
        supabase
          .from("friends")
          .select("id, user_id, friend_user_id, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("friends")
          .select("id, user_id, friend_user_id, created_at")
          .eq("friend_user_id", user.id)
          .order("created_at", { ascending: false }),
      ]);

      if (!isMounted) {
        return;
      }

      if (followingError || followersError) {
        setError("Could not load the guild roster yet.");
        setStatus("ready");
        return;
      }

      const followRows = followingRows ?? [];
      const followerRosterRows = followerRows ?? [];
      const profileIds = Array.from(
        new Set([
          ...followRows.map((friend) => friend.friend_user_id),
          ...followerRosterRows.map((friend) => friend.user_id),
        ]),
      );

      if (!profileIds.length) {
        setFollowing([]);
        setFollowers([]);
        setStatus("ready");
        return;
      }

      const { data: profileRows, error: profileError } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url")
        .in("id", profileIds);

      if (!isMounted) {
        return;
      }

      if (profileError) {
        setError("Could not load board profiles yet.");
        setStatus("ready");
        return;
      }

      const profilesById = new Map(
        (profileRows ?? []).map((friendProfile) => [
          friendProfile.id,
          friendProfile,
        ]),
      );

      setFollowing(
        followRows
          .map((friendRow) => {
            const friendProfile = profilesById.get(friendRow.friend_user_id);

            if (!friendProfile) {
              return null;
            }

            return {
              ...friendRow,
              profile: friendProfile,
            };
          })
          .filter((friend): friend is Friend => Boolean(friend))
          .sort(sortFriends),
      );
      setFollowers(
        followerRosterRows
          .map((friendRow) => {
            const followerProfile = profilesById.get(friendRow.user_id);

            if (!followerProfile) {
              return null;
            }

            return {
              ...friendRow,
              profile: followerProfile,
            };
          })
          .filter((friend): friend is Friend => Boolean(friend))
          .sort(sortFriends),
      );
      setStatus("ready");
    }

    loadFriends();

    return () => {
      isMounted = false;
    };
  }, [isOpen, status, supabase, user.id]);

  async function handleAddFriend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const boardSlug = getBoardSlugFromInput(boardLink);
    setMessage("");
    setError("");

    if (!boardSlug || !isValidUsername(boardSlug)) {
      setError("Paste a valid board link.");
      return;
    }

    if (boardSlug === profile.username) {
      setError("That is your own board.");
      return;
    }

    if (following.some((friend) => friend.profile.username === boardSlug)) {
      setError("Already following that board.");
      return;
    }

    setIsSaving(true);

    const { data: targetProfile, error: targetError } = await supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url")
      .eq("username", boardSlug)
      .maybeSingle();

    if (targetError) {
      setError("Could not check that board yet.");
      setIsSaving(false);
      return;
    }

    if (!targetProfile) {
      setError("No board found for that link.");
      setIsSaving(false);
      return;
    }

    if (targetProfile.id === user.id) {
      setError("That is your own board.");
      setIsSaving(false);
      return;
    }

    const { data: friendRow, error: insertError } = await supabase
      .from("friends")
      .insert({
        user_id: user.id,
        friend_user_id: targetProfile.id,
      })
      .select("id, user_id, friend_user_id, created_at")
      .single();

    setIsSaving(false);

    if (insertError) {
      setError(
        insertError.code === "23505"
          ? "Already following that board."
          : "Could not follow that board yet.",
      );
      return;
    }

    setFollowing((currentFriends) =>
      [
        ...currentFriends,
        {
          ...friendRow,
          profile: targetProfile,
        },
      ].sort(sortFriends),
    );
    setBoardLink("");
    captureAnalyticsEvent("board_followed", {
      is_logged_in: true,
      source: "topbar",
    });
    setMessage(
      `Following ${getProfileDisplayName(targetProfile)}. Seeds are now legally suspicious.`,
    );
  }

  async function handleFollowBack(targetProfile: FriendProfile) {
    setMessage("");
    setError("");

    if (following.some((friend) => friend.profile.id === targetProfile.id)) {
      setMessage(`Already following ${getProfileDisplayName(targetProfile)}.`);
      return;
    }

    setIsSaving(true);

    const { data: friendRow, error: insertError } = await supabase
      .from("friends")
      .insert({
        user_id: user.id,
        friend_user_id: targetProfile.id,
      })
      .select("id, user_id, friend_user_id, created_at")
      .single();

    setIsSaving(false);

    if (insertError) {
      setError(
        insertError.code === "23505"
          ? "Already following that board."
          : "Could not follow back yet.",
      );
      return;
    }

    setFollowing((currentFriends) =>
      [
        ...currentFriends,
        {
          ...friendRow,
          profile: targetProfile,
        },
      ].sort(sortFriends),
    );
    captureAnalyticsEvent("follow_back_clicked", {
      is_logged_in: true,
      source: "followers_panel",
    });
    setMessage(`Following back ${getProfileDisplayName(targetProfile)}.`);
  }

  const followingProfileIds = new Set(
    following.map((friend) => friend.profile.id),
  );

  return (
    <div className="grid gap-3" aria-label="Friends">
      <form className="grid gap-2" onSubmit={handleAddFriend}>
        <label className="grid gap-1 text-xs font-bold uppercase tracking-title text-brass">
          Add Friend
          <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
            <input
              className="h-10 min-w-0 rounded-card border border-brass/25 bg-pitch/70 px-3 text-sm normal-case tracking-normal text-parchment outline-none placeholder:text-bone/50 focus:border-ember"
              disabled={isSaving}
              placeholder="Paste a friend's board link"
              value={boardLink}
              onChange={(event) => setBoardLink(event.target.value)}
            />
            <Button disabled={isSaving} size="sm" type="submit">
              <UserPlus className="size-4" />
              {isSaving ? "Following..." : "Add Friend"}
            </Button>
          </div>
        </label>
      </form>

      {message ? (
        <p className="rounded-card border border-antiqueGold/30 bg-pitch/60 px-3 py-2 text-sm font-semibold text-parchment">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-card border border-ember/45 bg-blood/35 px-3 py-2 text-sm font-semibold text-parchment">
          {error}
        </p>
      ) : null}

      {status !== "ready" ? (
        <p className="min-h-12 rounded-card border border-brass/20 bg-pitch/55 px-3 py-3 text-sm font-semibold text-bone">
          Checking the guild roster...
        </p>
      ) : (
        <div className="grid max-h-96 gap-3 overflow-y-auto pr-1">
          <RosterSection
            emptyCopy="Not following any boards yet. Paste a board link to start stealing seeds."
            roster={following}
            title="Following"
          />

          <section className="grid gap-2">
            <h3 className="text-xs font-black uppercase tracking-title text-antiqueGold">
              Followers
            </h3>
            {followers.length ? (
              <div className="grid gap-2">
                {followers.map((follower) => {
                  const isFollowingBack = followingProfileIds.has(
                    follower.profile.id,
                  );

                  return (
                    <div
                      className="flex items-center justify-between gap-3 rounded-card border border-brass/25 bg-soot/65 p-2.5 text-left shadow-card"
                      key={follower.id}
                    >
                      <Link
                        className="flex min-w-0 flex-1 items-center gap-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-ember"
                        href={`/u/${follower.profile.username}`}
                      >
                        <ProfileAvatar profile={follower.profile} />
                        <p className="truncate text-xs font-black uppercase tracking-title text-parchment">
                          {getProfileDisplayName(follower.profile)}
                        </p>
                      </Link>
                      {isFollowingBack ? (
                        <span className="shrink-0 text-[0.65rem] font-black uppercase tracking-title text-brass">
                          Following
                        </span>
                      ) : (
                        <Button
                          disabled={isSaving}
                          size="sm"
                          type="button"
                          onClick={() => handleFollowBack(follower.profile)}
                        >
                          Follow Back
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="min-h-12 rounded-card border border-brass/20 bg-pitch/55 px-3 py-3 text-sm font-semibold text-bone">
                No followers yet. Share your board and summon the guild.
              </p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

function RosterSection({
  emptyCopy,
  roster,
  title,
}: {
  emptyCopy: string;
  roster: Friend[];
  title: string;
}) {
  return (
    <section className="grid gap-2">
      <h3 className="text-xs font-black uppercase tracking-title text-antiqueGold">
        {title}
      </h3>
      {roster.length ? (
        <div className="grid gap-2">
          {roster.map((friend) => (
            <Link
              className="flex items-center justify-between gap-3 rounded-card border border-brass/25 bg-soot/65 p-2.5 text-left shadow-card transition hover:border-ember/70 hover:bg-cardHover focus:outline-none focus:ring-2 focus:ring-ember focus:ring-offset-2 focus:ring-offset-pitch"
              href={`/u/${friend.profile.username}`}
              key={friend.id}
            >
              <div className="flex min-w-0 items-center gap-2">
                <ProfileAvatar profile={friend.profile} />
                <div className="min-w-0">
                  <p className="truncate text-xs font-black uppercase tracking-title text-parchment">
                    {getProfileDisplayName(friend.profile)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="min-h-12 rounded-card border border-brass/20 bg-pitch/55 px-3 py-3 text-sm font-semibold text-bone">
          {emptyCopy}
        </p>
      )}
    </section>
  );
}

function ProfileAvatar({ profile }: { profile: FriendProfile }) {
  return profile.avatar_url ? (
    <img
      alt=""
      className="size-8 rounded-full border border-antiqueGold/40 object-cover shadow-card"
      src={profile.avatar_url}
    />
  ) : (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-antiqueGold/40 bg-pitch text-emberBright shadow-card">
      <Users className="size-4" />
    </span>
  );
}

function getBoardSlugFromInput(input: string) {
  const trimmedInput = input.trim();

  if (!trimmedInput) {
    return null;
  }

  if (!trimmedInput.includes("/") && !trimmedInput.includes(".")) {
    return normalizeUsername(trimmedInput);
  }

  try {
    const boardUrl = new URL(trimmedInput, window.location.origin);
    const [routePrefix, boardSlug] = boardUrl.pathname
      .split("/")
      .filter(Boolean);

    if (routePrefix !== "u" || !boardSlug) {
      return null;
    }

    return normalizeUsername(decodeURIComponent(boardSlug));
  } catch {
    return null;
  }
}
