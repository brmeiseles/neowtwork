export type PublicEnv = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  posthogKey: string;
  posthogHost: string;
};

export function getPublicEnv(): PublicEnv {
  return {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "",
    posthogHost: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "",
  };
}

export function hasSupabaseEnv(env = getPublicEnv()) {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}

export function getPublicEnvStatus(env = getPublicEnv()) {
  return {
    hasSupabaseUrl: Boolean(env.supabaseUrl),
    hasSupabaseAnonKey: Boolean(env.supabaseAnonKey),
    hasPosthogKey: Boolean(env.posthogKey),
    hasPosthogHost: Boolean(env.posthogHost),
    isSupabaseConfigured: hasSupabaseEnv(env),
    isPosthogConfigured: Boolean(env.posthogKey && env.posthogHost),
  };
}
