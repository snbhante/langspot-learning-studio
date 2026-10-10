
begin;

-- 1. Ensure the profile fields exist.
alter table public.profiles
  add column if not exists username text not null default '',
  add column if not exists bio text not null default '',
  add column if not exists preferences jsonb not null default '{}'::jsonb,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

-- 2. Enable row-level security.
alter table public.profiles enable row level security;

-- 3. Allow signed-in users to access only their own profile.
drop policy if exists "Users can view own profile"
  on public.profiles;

create policy "Users can view own profile"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "Users can insert own profile"
  on public.profiles;

create policy "Users can insert own profile"
  on public.profiles
  for insert
  to authenticated
  with check ((select auth.uid()) = id);

drop policy if exists "Users can update own profile"
  on public.profiles;

create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- 4. Ensure authenticated users have the necessary table privileges.
grant select, insert, update
  on public.profiles to authenticated;

-- 5. Create a profile automatically for new Auth users.
create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (
    id,
    username,
    bio,
    preferences
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', ''),
    '',
    '{}'::jsonb
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- 6. Attach the trigger to Supabase Auth.
drop trigger if exists on_auth_user_created_profile
  on auth.users;

create trigger on_auth_user_created_profile
  after insert on auth.users
  for each row
  execute function public.handle_new_user_profile();

-- 7. Backfill profiles for existing Auth accounts.
-- Existing profile rows and their data remain untouched.
insert into public.profiles (
  id,
  username,
  bio,
  preferences
)
select
  u.id,
  coalesce(u.raw_user_meta_data ->> 'username', ''),
  '',
  '{}'::jsonb
from auth.users u
on conflict (id) do nothing;

commit;
