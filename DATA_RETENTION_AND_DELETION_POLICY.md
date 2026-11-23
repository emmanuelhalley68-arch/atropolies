# Data Retention and Deletion Policy — INTERNAL DRAFT

Do not invent a universal retention period. The company must approve a schedule
based on purpose, legal duties, dispute needs, provider limits and risk.

Complete this table before production:

| Data category | Purpose | System/location | Retention trigger/period | Deletion method | Owner |
|---|---|---|---|---|---|
| Account/profile | Account operation | Supabase | [decide] | Delete/anonymize | [owner] |
| Authentication/security logs | Security and abuse investigation | Supabase/provider logs | [decide/provider limit] | Provider retention/expiry | [owner] |
| Business listings | Platform services | Supabase | [decide] | Delete/export | [owner] |
| Uploaded files | User service | Storage | [decide] | Delete objects | [owner] |
| Payment references | Reconciliation/legal duties | Payment provider/database | [legal review] | Retain minimal records | [owner] |
| Support/privacy requests | Resolve requests | [system] | [decide] | Delete/archive | [owner] |
| Backups | Recovery | Provider/offsite | [plan limit] | Expire/securely destroy | [owner] |

Deletion requests must be verified, assessed for legal retention exceptions,
propagated to processors where required, and documented. Explain that backup
copies may expire on a separate schedule where immediate selective deletion is
not technically available. Restrict processing while a request is assessed
where appropriate.
