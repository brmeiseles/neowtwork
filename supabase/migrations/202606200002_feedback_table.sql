create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  feedback_type text not null check (
    feedback_type in ('bug', 'idea', 'confusion', 'praise')
  ),
  message text not null check (char_length(message) between 3 and 2000),
  page_path text,
  app_version text,
  created_at timestamptz not null default now()
);

create index if not exists feedback_created_at_idx
on public.feedback(created_at desc);

create index if not exists feedback_user_id_idx
on public.feedback(user_id);

alter table public.feedback enable row level security;

drop policy if exists "Anyone can submit feedback" on public.feedback;
create policy "Anyone can submit feedback"
on public.feedback for insert
with check (
  user_id is null
  or auth.uid() = user_id
);
