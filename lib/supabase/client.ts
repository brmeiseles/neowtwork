"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getPublicEnv, hasSupabaseEnv } from "@/lib/env";
import type { Database } from "@/types/database";
import type { PublicEnv } from "@/lib/env";

export function isSupabaseConfigured() {
  return hasSupabaseEnv();
}

export function createSupabaseBrowserClient(publicEnv?: PublicEnv) {
  const env = publicEnv ?? getPublicEnv();

  if (!hasSupabaseEnv(env)) {
    return null;
  }

  return createBrowserClient<Database>(
    env.supabaseUrl,
    env.supabaseAnonKey,
  );
}
