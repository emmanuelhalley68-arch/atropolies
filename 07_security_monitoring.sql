-- ATROPOLIES Stage 2.7: Security monitoring support
-- Compatible with the Stage 2.5 security_audit_log schema.
-- Prerequisites: run 01_profiles.sql, 02_roles_access_control.sql,
-- and 03_database_security.sql first.

-- Keep the Stage 2.5 column names if the table already exists.
-- If missing, create the same compatible structure.
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

create index if not exists security_audit_log_occurred_at_idx
  on public.security_audit_log (occurred_at desc);

create index if not exists security_audit_log_actor_occurred_idx
  on public.security_audit_log (actor_user_id, occurred_at desc);

-- Remove any earlier policies that could accidentally allow broader access.
drop policy if exists "Users can read audit logs" on public.security_audit_log;
drop policy if exists "Admins can read security audit log" on public.security_audit_log;
drop policy if exists "Administrators read security audit log" on public.security_audit_log;

create policy "Administrators read security audit log"
on public.security_audit_log
for select
to authenticated
using (
  coalesce(public.has_role('administrator'), false)
  or coalesce(public.has_role('super_administrator'), false)
);

-- Browser clients can read only through the administrator RLS policy.
-- No client INSERT/UPDATE/DELETE permissions are granted.
revoke all on table public.security_audit_log from anon, authenticated;
grant select on table public.security_audit_log to authenticated;

-- The Stage 2.5 trigger function remains the only intended application writer.
-- Project owners/privileged database operators can still alter database data;
-- this is not an immutable external SIEM.
