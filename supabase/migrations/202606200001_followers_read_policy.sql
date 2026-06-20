drop policy if exists "Users read own friends" on public.friends;

create policy "Users read own friends"
on public.friends for select
using (
  auth.uid() = user_id
  or auth.uid() = friend_user_id
);
