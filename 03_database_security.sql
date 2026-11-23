-- ATROPOLIES Stage 2.5: database hardening, private file storage and audit trail.
-- Prerequisites: run 01_profiles.sql and 02_roles_access_control.sql first.
-- Review bucket MIME/size requirements before production. Never put secrets in browser code.

-- 1) Private audit log. Browser roles receive read-only access subject to admin RLS;
-- no client role is granted INSERT/UPDATE/DELETE on this table.
create table if not exists public.security_audit_log (
  id bigint generated always as identity primary key,
  actor_user_id uuid references auth.users(id) on delete set null,
  event_action text not null check (event_action in ('INSERT','UPDATE','DELETE')),
  table_name text not null check (table_name in ('profiles','business_profiles')),
  record_id text,
  occurred_at timestamptz not null default now()
);

alter table public.security_audit_log enable row level security;
alter table public.security_audit_log force row level security;
revoke all on table public.security_audit_log from anon, authenticated;
grant select on table public.security_audit_log to authenticated;

drop policy if exists "Administrators read security audit log" on public.security_audit_log;
create policy "Administrators read security audit log"
on public.security_audit_log for select to authenticated
using (
  (select public.has_role('administrator'))
  or (select public.has_role('super_administrator'))
);

-- Trigger-only audit writer. Captures metadata only, never profile fields or document contents.
create or replace function public.write_security_audit_log()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_record_id text;
begin
  if tg_op = 'DELETE' then
    v_record_id := to_jsonb(old) ->> case when tg_table_name = 'profiles' then 'id' else 'id' end;
  else
    v_record_id := to_jsonb(new) ->> 'id';
  end if;

  insert into public.security_audit_log (actor_user_id, event_action, table_name, record_id)
  values (auth.uid(), tg_op, tg_table_name, v_record_id);

  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$function$;
revoke all on function public.write_security_audit_log() from public, anon, authenticated;

drop trigger if exists audit_profile_changes on public.profiles;
create trigger audit_profile_changes
after insert or update or delete on public.profiles
for each row execute procedure public.write_security_audit_log();

drop trigger if exists audit_business_profile_changes on public.business_profiles;
create trigger audit_business_profile_changes
after insert or update or delete on public.business_profiles
for each row execute procedure public.write_security_audit_log();

-- 2) Private user file bucket. Objects must be stored under a first-level folder
-- equal to the authenticated user's UUID, e.g. <user-uuid>/avatar.png.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'atropolies-private',
  'atropolies-private',
  false,
  10485760,
  array['image/jpeg','image/png','image/webp','application/pdf']
)
on conflict (id) do update set
  public = false,
  file_size_limit = 10485760,
  allowed_mime_types = excluded.allowed_mime_types;

-- Users can list/download only their own files.
drop policy if exists "Users read own private files" on storage.objects;
create policy "Users read own private files"
on storage.objects for select to authenticated
using (
  bucket_id = 'atropolies-private'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

-- Users can upload only into their own UUID folder.
drop policy if exists "Users upload own private files" on storage.objects;
create policy "Users upload own private files"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'atropolies-private'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

-- Users can replace/delete only objects in their own UUID folder.
drop policy if exists "Users update own private files" on storage.objects;
create policy "Users update own private files"
on storage.objects for update to authenticated
using (
  bucket_id = 'atropolies-private'
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'atropolies-private'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Users delete own private files" on storage.objects;
create policy "Users delete own private files"
on storage.objects for delete to authenticated
using (
  bucket_id = 'atropolies-private'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

-- 3) Explicitly document database ownership boundaries.
-- Supabase manages encryption at rest and TLS for hosted projects; do not invent
-- client-side encryption keys or store secrets in the website. Configure backups,
-- PITR (if available on the chosen plan), MFA for project owners and least-privilege
-- dashboard access in the Supabase project settings.
