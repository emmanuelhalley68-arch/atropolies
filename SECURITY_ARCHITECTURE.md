# ATROPOLIES — Complete Security Architecture

## Security objectives
Protect customer accounts, personal information, business records, payments,
company credentials, website availability, and the integrity of platform code.

## Layer 1 — Network and edge security
- HTTPS only; redirect HTTP to HTTPS.
- Put the custom website domain behind a reputable edge provider such as
  Cloudflare when configured and tested.
- Enable provider-managed DDoS protections and managed WAF rules.
- Apply rate limiting to sensitive paths and APIs where supported.
- Restrict origin exposure and protect DNS/registrar accounts with MFA.
- Do not proxy Supabase project endpoints through the website's Cloudflare
  zone unless the Supabase provider explicitly supports that architecture.
- Keep Netlify security headers enabled and verify them on the deployed domain.

## Layer 2 — Application security
- Keep user input as text; do not inject untrusted values with innerHTML.
- Validate and authorize on trusted server-side code; browser validation is UX.
- Use parameterized database access and reviewed RPC/Edge Function logic.
- Enforce role permissions in RLS/server code, not by hiding buttons.
- Protect authentication, account recovery, session revocation and MFA.
- Use provider-side rate limits and abuse controls.
- Validate uploaded file size/type and use private storage.
- Use dependency updates, code review, and staging before production.

## Layer 3 — Data security
- Minimize collected personal data.
- Enable RLS on every private table and test with separate users.
- Use private storage and user-scoped object paths.
- Keep secrets only in server-side secret stores.
- Confirm provider encryption, backups, retention and data-location terms.
- Use a data inventory and documented retention/deletion schedule.
- Do not store card data, CVV, M-Pesa PINs, or banking passwords.

## Layer 4 — Monitoring and response
- Review Auth, API, database, hosting, DNS and deployment logs.
- Restrict audit log access and preserve evidence during incidents.
- Assign an incident owner and maintain an incident-response runbook.
- Test backups and restores; monitor unusual admin/role changes.
- Set provider-supported alerts; log retention and alert availability depend
  on the selected provider and plan.

## Layer 5 — Privacy, compliance and governance
- Identify controller/processor roles and registration obligations.
- Document processing purposes, lawful bases, recipients and transfers.
- Publish accurate privacy, terms, cookie and acceptable-use notices.
- Provide a verified route for access, correction, objection, deletion and
  portability requests where applicable.
- Assess children/minors, sensitive data, profiling and high-risk processing.
- Complete a DPIA where legally required or risk warrants it.
- Maintain processor contracts, breach records, staff access rules and training.

## Assurance statement
This architecture is a control plan, not a certification or guarantee. A control
is not considered implemented until configured in the real provider account,
tested with evidence, and assigned an owner. Independent security and legal
reviews are required before high-risk or large-scale production use.
