create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_format check (username ~ '^[a-z0-9][a-z0-9_-]{2,29}$')
);

create table if not exists public.achievements (
  id text primary key,
  slug text unique not null,
  title text not null,
  description text not null,
  sort_order integer not null,
  category text,
  icon_path text
);

create table if not exists public.completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  achievement_id text not null references public.achievements(id) on delete cascade,
  proof_image_url text,
  seed text,
  ascension integer not null,
  notes text,
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint completions_ascension_range check (ascension between 0 and 10)
);

create table if not exists public.friends (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  friend_user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, friend_user_id),
  constraint friends_no_self_follow check (user_id <> friend_user_id)
);

create index if not exists completions_user_id_idx on public.completions(user_id);
create index if not exists completions_achievement_id_idx on public.completions(achievement_id);
create index if not exists completions_user_achievement_idx on public.completions(user_id, achievement_id);
create index if not exists friends_user_id_idx on public.friends(user_id);
create index if not exists friends_friend_user_id_idx on public.friends(friend_user_id);
create index if not exists profiles_username_idx on public.profiles(username);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists completions_set_updated_at on public.completions;
create trigger completions_set_updated_at
before update on public.completions
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.achievements enable row level security;
alter table public.completions enable row level security;
alter table public.friends enable row level security;

drop policy if exists "Public profiles are readable" on public.profiles;
create policy "Public profiles are readable"
on public.profiles for select
using (true);

drop policy if exists "Users insert own profile" on public.profiles;
create policy "Users insert own profile"
on public.profiles for insert
with check (auth.uid() = id);

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Achievements are public readable" on public.achievements;
create policy "Achievements are public readable"
on public.achievements for select
using (true);

drop policy if exists "Completions are public readable" on public.completions;
create policy "Completions are public readable"
on public.completions for select
using (true);

drop policy if exists "Users insert own completions" on public.completions;
create policy "Users insert own completions"
on public.completions for insert
with check (auth.uid() = user_id);

drop policy if exists "Users update own completions" on public.completions;
create policy "Users update own completions"
on public.completions for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users delete own completions" on public.completions;
create policy "Users delete own completions"
on public.completions for delete
using (auth.uid() = user_id);

drop policy if exists "Users read own friends" on public.friends;
create policy "Users read own friends"
on public.friends for select
using (auth.uid() = user_id);

drop policy if exists "Users add own friends" on public.friends;
create policy "Users add own friends"
on public.friends for insert
with check (auth.uid() = user_id);

drop policy if exists "Users remove own friends" on public.friends;
create policy "Users remove own friends"
on public.friends for delete
using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('proofs', 'proofs', true)
on conflict (id) do nothing;

drop policy if exists "Proofs are public readable" on storage.objects;
create policy "Proofs are public readable"
on storage.objects for select
using (bucket_id = 'proofs');

drop policy if exists "Users upload own proofs" on storage.objects;
create policy "Users upload own proofs"
on storage.objects for insert
with check (
  bucket_id = 'proofs'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "Users update own proofs" on storage.objects;
create policy "Users update own proofs"
on storage.objects for update
using (
  bucket_id = 'proofs'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'proofs'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "Users delete own proofs" on storage.objects;
create policy "Users delete own proofs"
on storage.objects for delete
using (
  bucket_id = 'proofs'
  and auth.uid()::text = (storage.foldername(name))[1]
);
