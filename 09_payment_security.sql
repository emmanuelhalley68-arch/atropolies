-- ATROPOLIES Stage 2.9: Payment security starter schema
-- Review for naming conflicts and back up your database before running.
-- Do not store card numbers, CVVs, mobile-money PINs, or bank credentials.

create table if not exists public.payment_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  order_reference text not null,
  provider text not null,
  provider_reference text,
  amount_minor bigint not null check (amount_minor > 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded')),
  idempotency_key text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  paid_at timestamptz,
  constraint payment_provider_reference_unique unique (provider, provider_reference)
);

create index if not exists payment_transactions_user_created_idx
  on public.payment_transactions (user_id, created_at desc);

create index if not exists payment_transactions_order_reference_idx
  on public.payment_transactions (order_reference);

alter table public.payment_transactions enable row level security;
alter table public.payment_transactions force row level security;

-- Remove common permissive policies if this table existed previously.
drop policy if exists "Users can view own payments" on public.payment_transactions;
drop policy if exists "Customers can read their own payment transactions" on public.payment_transactions;

create policy "Customers can read their own payment transactions"
on public.payment_transactions
for select
to authenticated
using (auth.uid() = user_id);

-- Browser users may read their own records only. No client-side writes.
revoke all on table public.payment_transactions from anon, authenticated;
grant select on table public.payment_transactions to authenticated;

-- Provider webhook event deduplication table.
-- Only trusted server-side code should write to this table.
create table if not exists public.payment_webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_event_id text not null,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  processing_result text,
  constraint payment_webhook_event_unique unique (provider, provider_event_id)
);

alter table public.payment_webhook_events enable row level security;
alter table public.payment_webhook_events force row level security;

revoke all on table public.payment_webhook_events from anon, authenticated;

-- IMPORTANT:
-- A trusted Edge Function using a server-side secret/service role may perform
-- controlled writes. Never expose that secret to browser code.
-- Add a least-privilege server-side database role/RPC design before production.
-- The service_role bypasses RLS; protect it as a high-value secret.
