"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { User } from "@supabase/supabase-js";
import { ExternalLink, UserPlus, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { PublicEnv } from "@/lib/env";
import {
  getUsernameHelpText,
  isValidUsername,
  normalizeUsername,
} from "@/lib/username";
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
  publicEnv: PublicEnv;
};

function sortFriends(first: Friend, second: Friend) {
  return first.profile.username.localeCompare(second.profile.username);
}

export function FriendsPanel({ publicEnv }: FriendsPanelProps) {
  const supabase = useMemo(
    () => createSupabaseBrowserClient(publicEnv),
    [publicEnv],
  );
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(Boolean(supabase));
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
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

      setUser(session?.user ?? null);
      setIsLoading(false);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!supabase || !user) {
      setProfile(null);
      setFriends([]);
      return;
    }

    const supabaseClient = supabase;
    const currentUser = user;
    let isMounted = true;

    async function loadProfileAndFriends() {
      setIsLoading(true);
      setError("");

      const { data: profileData, error: profileError } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (!isMounted) {
        return;
      }

      if (profileError) {
        setError("Could not load your profile yet.");
        setIsLoading(false);
        return;
      }

      setProfile(profileData);

      const { data: friendRows, error: friendsError } = await supabaseClient
        .from("friends")
        .select("id, friend_user_id, created_at")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false });

      if (!isMounted) {
        return;
      }

      if (friendsError) {
        setError("Could not load your friends yet.");
        setIsLoading(false);
        return;
      }

      const rows = friendRows ?? [];
      const friendIds = rows.map((friend) => friend.friend_user_id);

      if (!friendIds.length) {
        setFriends([]);
        setIsLoading(false);
        return;
      }

      const { data: profileRows, error: friendProfilesError } =
        await supabaseClient
          .from("profiles")
          .select("id, username, display_name, avatar_url")
          .in("id", friendIds);

      if (!isMounted) {
        return;
      }

      if (friendProfilesError) {
        setError("Could not load friend profiles yet.");
        setIsLoading(false);
        return;
      }

      const profilesById = new Map(
        (profileRows ?? []).map((friendProfile) => [
          friendProfile.id,
          friendProfile,
        ]),
      );
      const nextFriends = rows
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
        .sort(sortFriends);

      setFriends(nextFriends);
      setIsLoading(false);
    }

    loadProfileAndFriends();

    return () => {
      isMounted = false;
    };
  }, [supabase, user]);

  async function handleAddFriend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !user) {
      setError("Sign in before adding friends.");
      return;
    }

    if (!profile) {
      setError("Choose your own username before adding friends.");
      return;
    }

    const nextUsername = normalizeUsername(username);
    setMessage("");
    setError("");

    if (!isValidUsername(nextUsername)) {
      setError(getUsernameHelpText());
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
      setError("Could not look up that username.");
      setIsSaving(false);
      return;
    }

    if (!targetProfile) {
      setError("No Neowtwork user found with that username.");
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
    setMessage(`Added @${targetProfile.username}. Seeds are now legally suspicious.`);
  }

  return (
    <section className="codex-panel grid gap-3" aria-label="Friends">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.7rem] font-black uppercase tracking-ritual text-emberBright">
            Friends
          </p>
          <h2 className="text-2xl font-black uppercase leading-none tracking-title text-parchment">
            Seed Thieves
          </h2>
        </div>
        <form
          className="grid gap-2 sm:grid-cols-[minmax(12rem,18rem)_auto]"
          onSubmit={handleAddFriend}
        >
          <label className="sr-only" htmlFor="friend-username">
            Friend username
          </label>
          <input
            className="h-10 rounded-card border border-brass/25 bg-pitch/70 px-3 text-sm normal-case tracking-normal text-parchment outline-none placeholder:text-bone/50 focus:border-ember"
            disabled={!supabase || !user || !profile || isSaving}
            id="friend-username"
            placeholder="friend_username"
            value={username}
            onChange={(event) => setUsername(normalizeUsername(event.target.value))}
          />
          <Button disabled={!supabase || !user || !profile || isSaving} type="submit">
            <UserPlus className="size-4" />
            {isSaving ? "Adding..." : "Add Friend"}
          </Button>
        </form>
      </div>

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

      {!supabase ? (
        <p className="text-sm font-semibold text-bone">
          Backend is dormant. Add Supabase env vars to enable friends.
        </p>
      ) : isLoading ? (
        <p className="text-sm font-semibold text-bone">Checking the friend ledger...</p>
      ) : !user ? (
        <p className="text-sm font-semibold text-bone">
          Sign in with Discord to add friends and steal seeds.
        </p>
      ) : !profile ? (
        <p className="text-sm font-semibold text-bone">
          Choose your codex name before adding friends.
        </p>
      ) : friends.length ? (
        <div className="grid gap-2">
          {friends.map((friend) => (
            <div
              className="flex flex-col gap-3 rounded-card border border-brass/25 bg-soot/65 p-3 shadow-card sm:flex-row sm:items-center sm:justify-between"
              key={friend.id}
            >
              <div className="flex min-w-0 items-center gap-3">
                {friend.profile.avatar_url ? (
                  <img
                    alt=""
                    className="size-10 rounded-full border border-antiqueGold/40 object-cover shadow-card"
                    src={friend.profile.avatar_url}
                  />
                ) : (
                  <span className="flex size-10 items-center justify-center rounded-full border border-antiqueGold/40 bg-pitch text-emberBright shadow-card">
                    <Users className="size-5" />
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-black uppercase tracking-title text-parchment">
                    @{friend.profile.username}
                  </p>
                  {friend.profile.display_name ? (
                    <p className="truncate text-sm font-semibold text-bone">
                      {friend.profile.display_name}
                    </p>
                  ) : null}
                </div>
              </div>
              <Button asChild size="sm" type="button">
                <Link href={`/u/${friend.profile.username}`}>
                  <ExternalLink className="size-4" />
                  View Board
                </Link>
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-card border border-brass/20 bg-pitch/55 px-3 py-3 text-sm font-semibold text-bone">
          No friends yet. Add a username to start stealing seeds.
        </p>
      )}
    </section>
  );
}
