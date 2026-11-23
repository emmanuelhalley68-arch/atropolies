ATROPOLIES — STAGE 2.9
PAYMENT SECURITY

PURPOSE
This package lays out a safer payment architecture and provides a database
starter schema plus a deliberately incomplete webhook template. It does not
connect a live payment provider or move real money.

CORE RULES
- Never collect or store card numbers, CVVs, mobile-money PINs, or banking
  passwords in ATROPOLIES HTML/JavaScript/database.
- Use a reputable payment provider's hosted checkout or approved SDK.
- Initiate payments from a trusted server-side function.
- Keep provider secrets only in server-side environment secrets.
- Never trust a browser redirect or client-submitted "paid" status.
- Verify provider callbacks using that provider's documented mechanism.
- Query the provider's transaction-status API where required/supported.
- Check order reference, amount, currency, account, and final status.
- Process callbacks idempotently so retries cannot credit twice.

FILES
- supabase/09_payment_security.sql: payment tables and restrictive RLS.
- supabase/functions/payment-webhook/index.ts: safe webhook design template.
- docs/PAYMENT_FLOW.txt: recommended payment flow.
- docs/PROVIDER_SETUP_CHECKLIST.txt: provider configuration checklist.
- docs/TEST_CASES.txt: tests before accepting live payments.

DATABASE INSTALLATION
1. Back up your Supabase project.
2. Open Supabase SQL Editor.
3. Review supabase/09_payment_security.sql.
4. Run it only after checking your current schema for name conflicts.
5. Confirm ordinary users can SELECT only their own payment records.
6. Confirm browser clients cannot INSERT/UPDATE/DELETE payment records.
7. Test using separate customer accounts.

IMPORTANT WEBHOOK TEMPLATE WARNING
The TypeScript file is a template, not a working provider integration. It
intentionally rejects requests until you implement the chosen provider's exact
signature/authentication verification and transaction-status verification.
Do not deploy it as a live payment endpoint in its current form.

KENYAN PAYMENT PROVIDER
Before selecting M-Pesa Daraja or an aggregator, confirm current merchant
onboarding, API requirements, callback verification, settlement, fees,
refund/dispute handling, and production credentials directly with the provider.
Do not paste credentials into chat or GitHub.

NO LIVE PAYMENT TESTING
Use provider sandbox/test mode first. Never test by charging real customers.
This package has not been connected to your Supabase project or provider.
