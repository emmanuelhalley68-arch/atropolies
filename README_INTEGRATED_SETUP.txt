ATROPOLIES — INTEGRATED WEBSITE + SECURITY PACKAGE
Stages 2.2 through 2.10

WHAT THIS PACKAGE IS
This combines the original ATROPOLIS website HTML (the saved version with its
official contact details) with the authentication/account-security code from
Stage 2.2–2.6 and the database, monitoring, backup, payment and testing material
from Stages 2.7–2.10.

THE ORIGINAL WEBSITE IS PRESERVED
- The original homepage content, sections, colours, layout, forms and contacts
  are retained.
- Its original embedded CSS and JavaScript were moved unchanged into:
    assets/site.css
    js/site.js
  This allows a stricter script Content Security Policy without changing the
  visual design or main-site behaviour.
- Two navigation links were added: Sign in and Create account.
- The Stage 2.6 authentication stylesheet is stored separately as
  assets/auth-base.css so it does not overwrite the original site's styling.

FOLDER CONTENTS
- index.html: original homepage with account links.
- login.html, register.html, forgot-password.html, reset-password.html:
  Supabase Auth pages.
- dashboard.html and security.html: account dashboard and MFA/session controls.
- assets/site.css: original homepage CSS.
- assets/auth-base.css and auth.css: authentication page styling.
- js/site.js: original homepage JavaScript.
- js/: authentication, MFA, configuration and input-safety scripts.
- supabase/: SQL scripts for profiles, roles, database security, monitoring,
  backup diagnostics and payment schema.
- supabase/functions/payment-webhook/index.ts: intentionally unconfigured
  webhook template; it rejects requests until provider verification is added.
- docs/: setup, backup, incident response, payment and launch test documents.
- _headers: Netlify security headers adjusted for the original site's external
  resources and Supabase Auth SDK.

INSTALLATION ORDER
1. Keep a backup copy of your current website and GitHub repository.
2. Upload the CONTENTS of this package to the ROOT of your GitHub repository.
   index.html and _headers must be at the root; keep assets/, js/, supabase/,
   and docs/ as folders.
3. Connect/publish through Netlify only after checking the repository contents.
4. Create a Supabase project.
5. Open js/config.js and replace the placeholders with your Supabase Project URL
   and publishable/anon key only. Never use service_role/secret keys here.
6. In Supabase SQL Editor, review and apply scripts in this order:
   01_profiles.sql
   02_roles_access_control.sql
   03_database_security.sql
   07_security_monitoring.sql
   08_backup_safety_checks.sql (diagnostic queries only)
   09_payment_security.sql (schema only; no live payment integration)\n   10_privacy_governance.sql (privacy request/consent records; requires roles SQL)
7. Configure Supabase Auth Site URL and exact redirect URLs for the deployed
   domain. Configure email confirmation, email delivery and provider-side
   rate limits. Enable MFA for project owners and administrators.
8. Test with two ordinary test accounts and an administrator account.
9. Complete the documents in docs/ before any limited launch.

IMPORTANT DATABASE ORDER
Stage 2.7 expects the Stage 2.4 role function/table and Stage 2.5 audit table.
Stage 2.8 SQL is read-only diagnostics; it does not create backups.
Stage 2.9 SQL creates starter payment tables only. It does not connect M-Pesa,
cards or a payment gateway.

SECURITY LIMITATIONS — READ CAREFULLY
- Prepared code is not the same as configured/live security.
- RLS, roles, MFA assurance checks, storage permissions, rate limits, backups,
  monitoring and provider settings must be tested in the actual Supabase project.
- The current Stage 2.3 MFA screens use Supabase Auth TOTP, but sensitive database
  operations still need server/database-side AAL2 enforcement where required.
- Browser-side validation is only a usability layer. It cannot stop a determined
  attacker; server-side authorization and RLS are essential.
- The Stage 2.7 audit table is not an immutable external SIEM.
- Stage 2.8 does not turn on Supabase backups/PITR. Configure them in the
  Supabase dashboard and perform a restore drill.
- Stage 2.9 payment webhook is intentionally a 503 placeholder. Do not deploy
  live payments or mark orders paid until a provider-specific verification
  integration is implemented and sandbox-tested.
- No penetration test, independent security audit, or compliance certification
  has been performed by creating this package.

DO NOT
- Put service_role keys, database passwords, payment secrets, MFA setup keys,
  recovery codes, or customer exports in browser code or GitHub.
- Accept real customer data or payments before the relevant tests pass.
- Assume every security stage is live just because its files are present.


ADDITIONAL COMPLETE SECURITY SUITE DOCUMENTS
See docs/SECURITY_ARCHITECTURE.md, docs/NETWORK_SECURITY_DEPLOYMENT.txt,
docs/PRIVACY_NOTICE_DRAFT.md, docs/TERMS_AND_CONDITIONS_DRAFT.md,
docs/COOKIE_AND_TRACKING_NOTICE_DRAFT.md, docs/INFORMATION_SECURITY_POLICY.md,
docs/DATA_RETENTION_AND_DELETION_POLICY.md, docs/DATA_SUBJECT_REQUEST_PROCESS.md,
docs/VENDOR_AND_PROCESSOR_REVIEW.txt, docs/KENYA_PRIVACY_COMPLIANCE_CHECKLIST.txt,
and docs/SECURITY_FEATURES_STATUS.txt.

These policy documents are drafts. Fill all placeholders and have the actual
operator, data flows, provider locations and legal obligations reviewed before
publishing. Network/WAF protections require provider dashboard/DNS configuration.
