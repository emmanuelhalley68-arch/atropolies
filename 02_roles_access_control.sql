-- ATROPOLIES Stage 2.4: role-based access control foundation.
-- Run AFTER 01_profiles.sql in the Supabase SQL Editor.
-- Role assignment is deliberately unavailable to browser users.

create table if not exists public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('customer','teacher','business_owner','administrator','super_administrator')),
  assigned_at timestamptz not null default now(),
  assigned_by uuid references auth.users(id) on delete set null,
  primary key (user_id, role)
);

alter table public.user_roles enable row level security;
alter table public.user_roles force row level security;
revoke all on table public.user_roles from anon, authenticated;
grant select on table public.user_roles to authenticated;

-- Users may see their own role names, but cannot grant, change or delete roles.
drop policy if exists "Read own roles" on public.user_roles;
create policy "Read own roles"
on public.user_roles for select to authenticated
using ((select auth.uid()) = user_id);

-- Safe role-check helper: it always checks the currently authenticated user.
create or replace function public.has_role(required_role text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select exists (
    select 1
    from public.user_roles ur
    where ur.user_id = (select auth.uid())
      and ur.role = required_role
  );
$function$;

revoke all on function public.has_role(text) from public, anon;
grant execute on function public.has_role(text) to authenticated;

-- Example business-profile table. Business owners can access only their own row;
-- administrators can review all rows. Add further columns only as requirements mature.
create table if not exists public.business_profiles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  business_name text not null check (char_length(business_name) between 2 and 120),
  description text not null default '' check (char_length(description) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.business_profiles enable row level security;
alter table public.business_profiles force row level security;
revoke all on table public.business_profiles from anon, authenticated;
grant select, insert, update, delete on table public.business_profiles to authenticated;

drop policy if exists "Business owners read own business" on public.business_profiles;
create policy "Business owners read own business"
on public.business_profiles for select to authenticated
using (owner_id = (select auth.uid()) and (select public.has_role('business_owner')));

drop policy if exists "Administrators read all businesses" on public.business_profiles;
create policy "Administrators read all businesses"
on public.business_profiles for select to authenticated
using ((select public.has_role('administrator')) or (select public.has_role('super_administrator')));

drop policy if exists "Business owners create own business" on public.business_profiles;
create policy "Business owners create own business"
on public.business_profiles for insert to authenticated
with check (owner_id = (select auth.uid()) and (select public.has_role('business_owner')));

drop policy if exists "Business owners update own business" on public.business_profiles;
create policy "Business owners update own business"
on public.business_profiles for update to authenticated
using (owner_id = (select auth.uid()) and (select public.has_role('business_owner')))
with check (owner_id = (select auth.uid()) and (select public.has_role('business_owner')));

drop policy if exists "Business owners delete own business" on public.business_profiles;
create policy "Business owners delete own business"
on public.business_profiles for delete to authenticated
using (owner_id = (select auth.uid()) and (select public.has_role('business_owner')));

-- Assign the default customer role to every new account. No browser can promote itself.
create or replace function public.assign_default_customer_role()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
begin
  insert into public.user_roles (user_id, role) values (new.id, 'customer')
  on conflict (user_id, role) do nothing;
  return new;
end;
$function$;

revoke all on function public.assign_default_customer_role() from public, anon, authenticated;
drop trigger if exists on_auth_user_created_default_role on auth.users;
create trigger on_auth_user_created_default_role
after insert on auth.users
for each row execute procedure public.assign_default_customer_role();

-- IMPORTANT: grant elevated roles only from the Supabase SQL Editor after verifying identity.
-- Replace the UUID with the intended account's auth.users.id.
-- insert into public.user_roles (user_id, role)
-- values ('REPLACE-WITH-VERIFIED-USER-UUID', 'business_owner');
-- Never grant administrator or super_administrator from frontend JavaScript.
