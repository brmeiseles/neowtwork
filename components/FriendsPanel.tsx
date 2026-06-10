"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { UserPlus, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  isValidUsername,
  normalizeUsername,
} from "@/lib/username";
import { captureAnalyticsEvent } from "@/lib/analytics";
import { getProfileDisplayName } from "@/lib/profile-display";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type FriendRow = Pick<
  Database["public"]["Tables"]["friends"]["Row"],
  "id" | "friend_user_id" | "created_at"
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
  const [friends, setFriends] = useState<Friend[]>([]);
  const [username, setUsername] = useState("");
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

      const { data: friendRows, error: friendsError } = await supabase
        .from("friends")
        .select("id, friend_user_id, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!isMounted) {
        return;
      }

      if (friendsError) {
        setError("Could not load your friends yet.");
        setStatus("ready");
        return;
      }

      const rows = friendRows ?? [];
      const friendIds = rows.map((friend) => friend.friend_user_id);

      if (!friendIds.length) {
        setFriends([]);
        setStatus("ready");
        return;
      }

      const { data: profileRows, error: friendProfilesError } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url")
        .in("id", friendIds);

      if (!isMounted) {
        return;
      }

      if (friendProfilesError) {
        setError("Could not load friend profiles yet.");
        setStatus("ready");
        return;
      }

      const profilesById = new Map(
        (profileRows ?? []).map((friendProfile) => [
          friendProfile.id,
          friendProfile,
        ]),
      );

      setFriends(
        rows
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
      setStatus("ready");
    }

    loadFriends();

    return () => {
      isMounted = false;
    };
  }, [isOpen, status, supabase, user.id]);

  async function handleAddFriend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextUsername = normalizeUsername(username);
    setMessage("");
    setError("");

    if (!isValidUsername(nextUsername)) {
      setError("Use the board-link slug from your guildmate's public board.");
      return;
    }

    if (nextUsername === profile.username) {
      setError("You cannot add yourself. The mirror refuses.");
      return;
    }

    if (friends.some((friend) => friend.profile.username === nextUsername)) {
      setError("That friend is already in your codex.");
      return;
    }

    setIsSaving(true);

    const { data: targetProfile, error: targetError } = await supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url")
      .eq("username", nextUsername)
      .maybeSingle();

    if (targetError) {
      setError("Could not look up that guildmate.");
      setIsSaving(false);
      return;
    }

    if (!targetProfile) {
      setError("No guildmate found with that board slug.");
      setIsSaving(false);
      return;
    }

    if (targetProfile.id === user.id) {
      setError("You cannot add yourself. The mirror refuses.");
      setIsSaving(false);
      return;
    }

    const { data: friendRow, error: insertError } = await supabase
      .from("friends")
      .insert({
        user_id: user.id,
        friend_user_id: targetProfile.id,
      })
      .select("id, friend_user_id, created_at")
      .single();

    setIsSaving(false);

    if (insertError) {
      setError(
        insertError.code === "23505"
          ? "That friend is already in your codex."
          : "Could not add that friend yet.",
      );
      return;
    }

    setFriends((currentFriends) =>
      [
        ...currentFriends,
        {
          ...friendRow,
          profile: targetProfile,
        },
      ].sort(sortFriends),
    );
    setUsername("");
    captureAnalyticsEvent("friend_added", {
      is_logged_in: true,
      source: "topbar",
    });
    setMessage(
      `Added ${getProfileDisplayName(targetProfile)}. Seeds are now legally suspicious.`,
    );
  }

  return (
    <div className="grid gap-3" aria-label="Friends">
      <form className="grid gap-2" onSubmit={handleAddFriend}>
        <label className="grid gap-1 text-xs font-bold uppercase tracking-title text-brass">
          Add Friend
          <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
            <input
              className="h-10 min-w-0 rounded-card border border-brass/25 bg-pitch/70 px-3 text-sm normal-case tracking-normal text-parchment outline-none placeholder:text-bone/50 focus:border-ember"
              disabled={isSaving}
              placeholder="discord-name-slug"
              value={username}
              onChange={(event) =>
                setUsername(normalizeUsername(event.target.value))
              }
            />
            <Button disabled={isSaving} size="sm" type="submit">
              <UserPlus className="size-4" />
              {isSaving ? "Adding..." : "Add Friend"}
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
          Checking the friend ledger...
        </p>
      ) : friends.length ? (
        <div className="grid max-h-72 gap-2 overflow-y-auto pr-1">
          {friends.map((friend) => (
            <Link
              className="flex items-center justify-between gap-3 rounded-card border border-brass/25 bg-soot/65 p-2.5 text-left shadow-card transition hover:border-ember/70 hover:bg-cardHover focus:outline-none focus:ring-2 focus:ring-ember focus:ring-offset-2 focus:ring-offset-pitch"
              href={`/u/${friend.profile.username}`}
              key={friend.id}
            >
              <div className="flex min-w-0 items-center gap-2">
                {friend.profile.avatar_url ? (
                  <img
                    alt=""
                    className="size-8 rounded-full border border-antiqueGold/40 object-cover shadow-card"
                    src={friend.profile.avatar_url}
                  />
                ) : (
                  <span className="flex size-8 items-center justify-center rounded-full border border-antiqueGold/40 bg-pitch text-emberBright shadow-card">
                    <Users className="size-4" />
                  </span>
                )}
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
          No friends yet. Add a guildmate to start stealing seeds.
        </p>
      )}
    </div>
  );
}
