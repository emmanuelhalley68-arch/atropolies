-- ATROPOLIES privacy governance foundation
-- Run after 02_roles_access_control.sql in Supabase SQL Editor.
-- This creates a request/consent record store. It does not provide a UI,
-- verify identities, send emails, or complete legal requests automatically.

create table if not exists public.privacy_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  request_type text not null check (
    request_type in ('access','correction','objection','erasure','restriction','portability','other')
  ),
  request_note text not null default '' check (char_length(request_note) <= 1000),
  status text not null default 'received' check (
    status in ('received','identity_check','in_review','actioned','declined','closed')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.privacy_requests enable row level security;
alter table public.privacy_requests force row level security;

revoke all on table public.privacy_requests from anon, authenticated;
grant select, insert on table public.privacy_requests to authenticated;

drop policy if exists "Users submit own privacy requests" on public.privacy_requests;
create policy "Users submit own privacy requests"
on public.privacy_requests for insert to authenticated
with check (user_id = (select auth.uid()));

drop policy if exists "Users view own privacy requests" on public.privacy_requests;
create policy "Users view own privacy requests"
on public.privacy_requests for select to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "Administrators view privacy requests" on public.privacy_requests;
create policy "Administrators view privacy requests"
on public.privacy_requests for select to authenticated
using (
  (select public.has_role('administrator'))
  or (select public.has_role('super_administrator'))
);

-- Consent history: append-only from browser perspective. Withdrawal is a new
-- record with granted=false, not an UPDATE of an old record.
create table if not exists public.privacy_consent_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  notice_version text not null check (char_length(notice_version) between 1 and 40),
  purpose_code text not null check (char_length(purpose_code) between 1 and 80),
  granted boolean not null,
  recorded_at timestamptz not null default now()
);

alter table public.privacy_consent_records enable row level security;
alter table public.privacy_consent_records force row level security;

revoke all on table public.privacy_consent_records from anon, authenticated;
grant select, insert on table public.privacy_consent_records to authenticated;

drop policy if exists "Users view own consent records" on public.privacy_consent_records;
create policy "Users view own consent records"
on public.privacy_consent_records for select to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "Users record own consent choices" on public.privacy_consent_records;
create policy "Users record own consent choices"
on public.privacy_consent_records for insert to authenticated
with check (user_id = (select auth.uid()));

drop policy if exists "Administrators view consent records" on public.privacy_consent_records;
create policy "Administrators view consent records"
on public.privacy_consent_records for select to authenticated
using (
  (select public.has_role('administrator'))
  or (select public.has_role('super_administrator'))
);

create index if not exists privacy_requests_user_created_idx
  on public.privacy_requests (user_id, created_at desc);

create index if not exists privacy_consent_user_recorded_idx
  on public.privacy_consent_records (user_id, recorded_at desc);

-- No browser UPDATE/DELETE rights are granted. A trusted, audited administrative
-- workflow is still needed to process requests and apply status changes.
