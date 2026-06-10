"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import type { User } from "@supabase/supabase-js";
import { LogOut, ScrollText, Shield, UserRound, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FriendsPanel } from "@/components/FriendsPanel";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { getPublicEnvStatus, type PublicEnv } from "@/lib/env";
import {
  getUsernameHelpText,
  isValidUsername,
  normalizeUsername,
} from "@/lib/username";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

type AuthPanelProps = {
  publicEnv: PublicEnv;
};

type AuthStatus = "loading" | "profile-loading" | "ready" | "saving";

export function AuthPanel({ publicEnv }: AuthPanelProps) {
  const envStatus = getPublicEnvStatus(publicEnv);
  const supabase = useMemo(
    () => createSupabaseBrowserClient(publicEnv),
    [publicEnv],
  );
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<AuthStatus>(supabase ? "loading" : "ready");
  const [message, setMessage] = useState("");
  const [isFriendsOpen, setIsFriendsOpen] = useState(false);
  const accountPanelRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<Profile | null>(null);

  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

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
          setUsername("");
          setIsFriendsOpen(false);
          setStatus("ready");
          return null;
        }

        if (currentUser?.id !== nextUser.id) {
          setProfile(null);
          setUsername("");
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

      setProfile(data);
      setUsername(data?.username ?? "");
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

  async function handleClaimUsername(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !user) {
      return;
    }

    const currentUser = user;
    const nextUsername = normalizeUsername(username);

    if (!isValidUsername(nextUsername)) {
      setMessage(getUsernameHelpText());
      return;
    }

    setStatus("saving");
    setMessage("");

    const { data, error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: currentUser.id,
          username: nextUsername,
          display_name:
            currentUser.user_metadata.full_name ??
            currentUser.user_metadata.name ??
            currentUser.email ??
            null,
          avatar_url: currentUser.user_metadata.avatar_url ?? null,
        },
        { onConflict: "id" },
      )
      .select("*")
      .single();

    setStatus("ready");

    if (error) {
      setMessage(
        error.code === "23505"
          ? "That username is already claimed. Try another relic name."
          : error.message,
      );
      return;
    }

    setProfile(data);
    setUsername(data.username);
    setMessage("Username claimed. The codex knows your name.");
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
          {profile ? `@${profile.username}` : "Choose your codex name"}
        </span>
        <div className="flex items-center gap-1.5">
          {profile ? (
            <>
              <Button asChild size="sm" variant="ghost">
                <Link href={`/u/${profile.username}`}>
                  <ScrollText className="size-4" />
                  My Board
                </Link>
              </Button>
              <Button
                aria-expanded={isFriendsOpen}
                size="sm"
                type="button"
                variant="ghost"
                onClick={() => setIsFriendsOpen((isOpen) => !isOpen)}
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

      {!profile ? (
        <form className="grid gap-2 sm:grid-cols-[1fr_auto]" onSubmit={handleClaimUsername}>
          <label className="grid gap-1 text-xs font-bold uppercase tracking-title text-brass">
            Public Username
            <input
              className="h-10 rounded-card border border-brass/25 bg-pitch/75 px-3 text-sm normal-case tracking-normal text-parchment outline-none placeholder:text-bone/50 focus:border-ember"
              placeholder="neow-slayer"
              value={username}
              onChange={(event) => setUsername(normalizeUsername(event.target.value))}
            />
          </label>
          <Button className="self-end" disabled={status === "saving"} type="submit">
            {status === "saving" ? "Claiming..." : "Claim"}
          </Button>
        </form>
      ) : null}

      {message ? <p className="text-xs text-emberBright">{message}</p> : null}

      {profile && isFriendsOpen ? (
        <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-[min(92vw,25rem)] rounded-card border border-brass/35 bg-pitch/95 p-3 shadow-card backdrop-blur">
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
