export type PublicEnv = {
  supabaseUrl: string;
  supabaseAnonKey: string;
};

export function getPublicEnv(): PublicEnv {
  return {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  };
}

export function hasSupabaseEnv(env = getPublicEnv()) {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}

export function getPublicEnvStatus(env = getPublicEnv()) {
  return {
    hasSupabaseUrl: Boolean(env.supabaseUrl),
    hasSupabaseAnonKey: Boolean(env.supabaseAnonKey),
    isSupabaseConfigured: hasSupabaseEnv(env),
  };
}
