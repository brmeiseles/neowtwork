"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { User } from "@supabase/supabase-js";
import { LogOut, Shield, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  getUsernameHelpText,
  isValidUsername,
  normalizeUsername,
} from "@/lib/username";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export function AuthPanel() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<"loading" | "ready" | "saving">(
    supabase ? "loading" : "ready",
  );
  const [message, setMessage] = useState("");

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
      setStatus("ready");
    }

    loadSession();

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setProfile(null);
      setStatus("ready");
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
        return;
      }

      setProfile(data);
      setUsername(data?.username ?? "");
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

  if (status === "loading") {
    return (
      <div className="rounded-card border border-brass/25 bg-pitch/55 px-3 py-2 text-xs font-bold uppercase tracking-title text-bone">
        Checking Discord session...
      </div>
    );
  }

  if (!supabase) {
    return (
      <div className="max-w-md rounded-card border border-brass/25 bg-pitch/55 px-3 py-2 text-xs font-bold uppercase tracking-title text-brass">
        Backend dormant: add Supabase env vars to enable Discord login.
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
    <div className="grid gap-2 rounded-card border border-brass/25 bg-pitch/55 p-3 text-sm text-bone shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 font-bold text-parchment">
          <UserRound className="size-4 text-emberBright" />
          {profile ? `@${profile.username}` : "Choose your codex name"}
        </span>
        <Button size="sm" type="button" variant="ghost" onClick={handleSignOut}>
          <LogOut className="size-4" />
          Sign out
        </Button>
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
    </div>
  );
}
