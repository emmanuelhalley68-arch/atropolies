ATROPOLIES — STAGE 2.8
BACKUP, DISASTER RECOVERY & BUSINESS CONTINUITY

WHAT THIS PACKAGE DOES
Provides a practical backup and recovery plan for Supabase, GitHub and Netlify.
It does not automatically create backups or configure provider retention.
You must enable and verify provider backup features in their dashboards.

BEFORE STARTING
- Confirm you can sign in to the Supabase project owner account.
- Enable MFA for project owners.
- Keep recovery codes and emergency credentials offline in a safe place.
- Never store service_role keys, database passwords, or payment secrets in GitHub.
- Do not rely on a single copy of important backups.

SUPABASE DATABASE BACKUPS
1. Open the Supabase project dashboard.
2. Find the project's Database / Backups area (dashboard labels can change).
3. Review the backup options available on your current plan.
4. Enable the most suitable scheduled backup/PITR option if available and needed.
5. Check the displayed retention period and recovery point limitations.
6. Confirm the last successful backup time.
7. Export/download a backup when supported and store it securely outside the
   project. Encrypt sensitive backup files and restrict access.
8. Record who is authorized to restore production data.

Important: Supabase backup availability, frequency, retention, PITR and restore
options depend on plan and current provider terms. Check the dashboard before
relying on a particular recovery point.

GITHUB CODE RECOVERY
- Keep the production website source in a private repository where appropriate.
- Commit changes in small, meaningful steps.
- Review commit history before reverting.
- Protect the production branch and restrict collaborators where supported.
- Do not commit .env files, secrets, private keys, or customer exports.

NETLIFY RECOVERY
- Review deploy history to identify the last known-good deployment.
- Use the provider's rollback/publish-previous-deploy feature if available.
- Check environment variables and domain/HTTPS settings after recovery.
- Test the homepage, login, password reset, and important user flows.

RESTORE TESTING
Never test a restore by overwriting production data.
Use a separate test project or isolated environment.
Restore a recent backup there, then verify tables, row counts, user access,
RLS policies, storage objects, and key application workflows.
Document the date, backup used, result, and any missing data.

RECOVERY PRIORITIES
1. Secure administrator access and stop ongoing compromise.
2. Preserve logs and evidence.
3. Restore website code from a known-good Git commit/deploy.
4. Restore database only from a verified backup if required.
5. Re-check RLS, roles, storage permissions, MFA and secrets.
6. Test core journeys before reopening the service.

LIMITATIONS
This package is a plan and checklist, not a configured backup service.
A database backup may not include all storage objects, edge functions, secrets,
provider settings, or third-party payment records. Inventory these separately.
