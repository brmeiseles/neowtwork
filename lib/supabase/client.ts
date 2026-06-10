"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getPublicEnv, hasSupabaseEnv } from "@/lib/env";
import type { Database } from "@/types/database";

export function isSupabaseConfigured() {
  return hasSupabaseEnv();
}

export function createSupabaseBrowserClient() {
  const env = getPublicEnv();

  if (!hasSupabaseEnv(env)) {
    return null;
  }

  return createBrowserClient<Database>(
    env.supabaseUrl,
    env.supabaseAnonKey,
  );
}
