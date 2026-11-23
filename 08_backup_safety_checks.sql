-- ATROPOLIES Stage 2.8: read-only backup safety checks
-- Optional diagnostic queries. Run in Supabase SQL Editor.
-- These queries do NOT create backups, enable PITR, or perform restores.

-- 1. List public tables and whether RLS is enabled.
select
  schemaname,
  tablename,
  rowsecurity as rls_enabled
from pg_tables
where schemaname = 'public'
order by tablename;

-- 2. List public tables with RLS disabled (review every returned row).
select
  schemaname,
  tablename
from pg_tables
where schemaname = 'public'
  and rowsecurity = false
order by tablename;

-- 3. Show approximate row counts for public tables.
-- Estimates only; not a precise backup integrity check.
select
  relname as table_name,
  n_live_tup as estimated_rows
from pg_stat_user_tables
where schemaname = 'public'
order by relname;
