ATROPOLIES STAGE 2.4 — ROLE-BASED ACCESS CONTROL

This package builds on Stage 2.2 authentication and Stage 2.3 account security.
Run supabase/02_roles_access_control.sql after supabase/01_profiles.sql.
Read SETUP_STAGE_2_4.txt before deploying. Elevated roles are assigned only
through the Supabase SQL Editor after identity verification. Never trust a
role label or hidden frontend page as authorization; enforce access with RLS.
