"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { LogOut, ScrollText, Shield, UserRound, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FriendsPanel } from "@/components/FriendsPanel";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { getPublicEnvStatus, type PublicEnv } from "@/lib/env";
import {
  appendUsernameSlugSuffix,
  createUsernameSlugFromText,
} from "@/lib/username";
import { getProfileDisplayName } from "@/lib/profile-display";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

type AuthPanelProps = {
  publicEnv: PublicEnv;
};

type AuthStatus = "loading" | "profile-loading" | "ready";
type UserMetadata = Record<string, unknown>;

export function AuthPanel({ publicEnv }: AuthPanelProps) {
  const envStatus = getPublicEnvStatus(publicEnv);
  const pathname = usePathname();
  const supabase = useMemo(
    () => createSupabaseBrowserClient(publicEnv),
    [publicEnv],
  );
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [status, setStatus] = useState<AuthStatus>(supabase ? "loading" : "ready");
  const [message, setMessage] = useState("");
  const [isFriendsOpen, setIsFriendsOpen] = useState(false);
  const accountPanelRef = useRef<HTMLDivElement | null>(null);
  const closeFriendsTimeoutRef = useRef<number | null>(null);
  const profileRef = useRef<Profile | null>(null);
  const ownBoardPath = profile ? `/u/${profile.username}` : "";
  const shouldShowMyBoard = Boolean(profile && pathname !== ownBoardPath);

  function getMetadataString(metadata: UserMetadata, keys: string[]) {
    for (const key of keys) {
      const value = metadata[key];

      if (typeof value === "string" && value.trim()) {
        return value.trim();
      }
    }

    return "";
  }

  function getDiscordDisplayName(currentUser: User) {
    const metadata = currentUser.user_metadata as UserMetadata;

    return (
      getMetadataString(metadata, [
        "global_name",
        "full_name",
        "name",
        "preferred_username",
        "user_name",
        "username",
      ]) ||
      currentUser.email?.split("@")[0] ||
      "Unknown Slayer"
    );
  }

  function getDiscordSlugBase(currentUser: User) {
    const metadata = currentUser.user_metadata as UserMetadata;

    return (
      getMetadataString(metadata, [
        "preferred_username",
        "user_name",
        "username",
        "global_name",
        "name",
        "full_name",
      ]) ||
      currentUser.email?.split("@")[0] ||
      `player-${currentUser.id.slice(0, 8)}`
    );
  }

  function getDiscordAvatarUrl(currentUser: User) {
    const metadata = currentUser.user_metadata as UserMetadata;

    return (
      getMetadataString(metadata, ["avatar_url", "picture"]) ||
      null
    );
  }

  function clearCloseFriendsTimeout() {
    if (closeFriendsTimeoutRef.current) {
      window.clearTimeout(closeFriendsTimeoutRef.current);
      closeFriendsTimeoutRef.current = null;
    }
  }

  function openFriends() {
    clearCloseFriendsTimeout();
    setIsFriendsOpen(true);
  }

  function scheduleCloseFriends() {
    clearCloseFriendsTimeout();
    closeFriendsTimeoutRef.current = window.setTimeout(() => {
      setIsFriendsOpen(false);
    }, 180);
  }

  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  useEffect(() => {
    return () => {
      clearCloseFriendsTimeout();
    };
  }, []);

  useEffect(() => {
    if (!isFriendsOpen) {
      return;
    }

    function handlePointerDown(event: Event) {
      if (
        accountPanelRef.current &&
        event.target instanceof Node &&
        !accountPanelRef.current.contains(event.target)
      ) {
        setIsFriendsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown, true);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
    };
  }, [isFriendsOpen]);

  useEffect(() => {
    if (!supabase) {
      setMessage("Supabase env is missing. Add .env.local to enable Discord login.");
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
      setStatus(session?.user ? "profile-loading" : "ready");
    }

    loadSession();

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;

      setUser((currentUser) => {
        if (!nextUser) {
          setProfile(null);
          setIsFriendsOpen(false);
          setStatus("ready");
          return null;
        }

        if (currentUser?.id !== nextUser.id) {
          setProfile(null);
          setStatus("profile-loading");
          return nextUser;
        } else if (!profileRef.current) {
          setStatus("profile-loading");
          return nextUser;
        }

        return currentUser;
      });
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!supabase || !user) {
      setProfile(null);
      return;
    }

    const supabaseClient = supabase;
    const currentUser = user;
    let isMounted = true;

    async function loadProfile() {
      setStatus("profile-loading");

      const { data, error } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (!isMounted) {
        return;
      }

      if (error) {
        setMessage("Could not load profile yet. Check Supabase setup.");
        setStatus("ready");
        return;
      }

      if (!data) {
        const displayName = getDiscordDisplayName(currentUser);
        const avatarUrl = getDiscordAvatarUrl(currentUser);
        const slugBase = createUsernameSlugFromText(
          getDiscordSlugBase(currentUser),
          `player-${currentUser.id.slice(0, 8)}`,
        );
        const slugCandidates = [
          slugBase,
          appendUsernameSlugSuffix(slugBase, currentUser.id),
          appendUsernameSlugSuffix(slugBase, `${Date.now()}`),
        ];

        for (const slugCandidate of slugCandidates) {
          const { data: createdProfile, error: createError } =
            await supabaseClient
              .from("profiles")
              .insert({
                id: currentUser.id,
                username: slugCandidate,
                display_name: displayName,
                avatar_url: avatarUrl,
              })
              .select("*")
              .single();

          if (!isMounted) {
            return;
          }

          if (!createError && createdProfile) {
            setProfile(createdProfile);
            setStatus("ready");
            return;
          }

          if (createError?.code !== "23505") {
            setMessage("Could not create your Discord profile yet. Try refreshing.");
            setStatus("ready");
            return;
          }
        }

        setMessage("Could not claim a Discord board slug yet. Try refreshing.");
        setStatus("ready");
        return;
      }

      const displayName = getDiscordDisplayName(currentUser);
      const avatarUrl = getDiscordAvatarUrl(currentUser);

      if (data.display_name !== displayName || data.avatar_url !== avatarUrl) {
        const { data: updatedProfile } = await supabaseClient
          .from("profiles")
          .update({
            display_name: displayName,
            avatar_url: avatarUrl,
          })
          .eq("id", currentUser.id)
          .select("*")
          .single();

        if (!isMounted) {
          return;
        }

        setProfile(updatedProfile ?? data);
        setStatus("ready");
        return;
      }

      setProfile(data);
      setStatus("ready");
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [supabase, user]);

  async function handleSignIn() {
    if (!supabase) {
      return;
    }

    setMessage("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage(error.message);
    }
  }

  async function handleSignOut() {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setIsFriendsOpen(false);
  }

  if (status === "loading" || status === "profile-loading") {
    return (
      <div className="min-h-[4.25rem] min-w-72 rounded-card border border-brass/25 bg-pitch/55 p-3 text-sm text-bone shadow-card">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 font-bold text-parchment">
            <UserRound className="size-4 text-emberBright" />
            Checking Discord session...
          </span>
        </div>
      </div>
    );
  }

  if (!supabase) {
    return (
      <div className="max-w-md rounded-card border border-brass/25 bg-pitch/55 px-3 py-2 text-xs font-bold uppercase tracking-title text-brass">
        Backend dormant: add Supabase env vars to enable Discord login.
        <span className="mt-1 block text-bone/70">
          URL: {envStatus.hasSupabaseUrl ? "configured" : "missing"} · Key:{" "}
          {envStatus.hasSupabaseAnonKey ? "configured" : "missing"}
        </span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-start gap-2 sm:items-end">
        <Button type="button" onClick={handleSignIn}>
          <Shield className="size-4" />
          Sign in with Discord
        </Button>
        {message ? <p className="text-xs text-emberBright">{message}</p> : null}
      </div>
    );
  }

  return (
    <div
      className="relative grid min-h-[4.25rem] min-w-72 gap-2 rounded-card border border-brass/25 bg-pitch/55 p-3 text-sm text-bone shadow-card"
      ref={accountPanelRef}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 font-bold text-parchment">
          <UserRound className="size-4 text-emberBright" />
          {profile ? getProfileDisplayName(profile) : "Preparing Discord profile..."}
        </span>
        <div className="flex items-center gap-1.5">
          {profile ? (
            <>
              {shouldShowMyBoard ? (
                <Button asChild size="sm" variant="ghost">
                  <Link href={ownBoardPath}>
                    <ScrollText className="size-4" />
                    My Board
                  </Link>
                </Button>
              ) : null}
              <Button
                aria-expanded={isFriendsOpen}
                size="sm"
                type="button"
                variant="ghost"
                onMouseEnter={openFriends}
                onMouseLeave={scheduleCloseFriends}
                onFocus={openFriends}
                onClick={openFriends}
              >
                <Users className="size-4" />
                Friends
              </Button>
            </>
          ) : null}
          <Button size="sm" type="button" variant="ghost" onClick={handleSignOut}>
            <LogOut className="size-4" />
            Sign out
          </Button>
        </div>
      </div>

      {message ? <p className="text-xs text-emberBright">{message}</p> : null}

      {profile && isFriendsOpen ? (
        <div
          className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-[min(92vw,25rem)] rounded-card border border-brass/35 bg-pitch/95 p-3 shadow-card backdrop-blur"
          onMouseEnter={openFriends}
          onMouseLeave={scheduleCloseFriends}
        >
          <FriendsPanel
            isOpen={isFriendsOpen}
            profile={profile}
            supabase={supabase}
            user={user}
          />
        </div>
      ) : null}
    </div>
  );
}
