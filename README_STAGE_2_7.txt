ATROPOLIES — STAGE 2.7
SECURITY MONITORING, THREAT DETECTION & INCIDENT RESPONSE

PURPOSE
This is an add-on package for monitoring and responding to security events.
It does not automatically detect every attack, send alerts, or make the website
enterprise-grade. It prepares a restricted database view and gives you a
practical monitoring and incident-response procedure.

IMPORTANT PREREQUISITES
- Your Supabase project must exist.
- Stage 2.5 database-security SQL should already have been applied.
- Stage 2.4 role SQL should already have been applied if you use has_role().
- Back up your project before running SQL.
- Do not put service_role keys, database passwords, or secret keys in website JS.

INSTALLATION
1. Open your Supabase project.
2. Open SQL Editor and create a new query.
3. Copy the contents of supabase/07_security_monitoring.sql into it.
4. Run it and review any errors.
5. Confirm the security_audit_log table exists and RLS is enabled.
6. Sign in as an administrator and verify that the view is accessible only to
   authorized administrators.
7. Test with a normal customer account: it must not be able to read audit logs.

MONITORING
Use Supabase Dashboard logs for Auth, API, and Postgres events where available
on your plan. Review failed sign-ins, unusual account activity, permission
errors, unexpected database changes, and storage access anomalies.
Set up provider-supported alerts where available. Alert availability and log
retention depend on your Supabase plan and configuration.

LIMITATIONS
- A database audit log is not an immutable external SIEM.
- A database owner or privileged operator may be able to alter or delete logs.
- Repeated failed sign-ins should be monitored using Supabase Auth logs and
  provider-side controls; do not trust a browser-only counter.
- This package has not been run against your live Supabase project.
- Do not use real customer data until you have configured and tested access.
