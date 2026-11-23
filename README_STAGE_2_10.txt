ATROPOLIES — STAGE 2.10
FINAL SECURITY TESTING & LAUNCH READINESS

PURPOSE
This package helps you test the security work prepared in Stages 2.1–2.9.
It does not certify ATROPOLIES as secure, perform penetration testing, or
automatically configure Supabase, GitHub, Netlify, or a payment provider.

IMPORTANT
A package being prepared is not proof it has been installed.
A SQL script being run is not proof its policies work.
A passing checklist is not a substitute for independent security review.

HOW TO USE
1. Keep the website in a staging/test environment, not production.
2. Confirm each earlier stage was actually installed and configured.
3. Use at least two separate test customer accounts and one administrator
   account. Never test by attacking real customer accounts/data.
4. Run the tests in docs/SECURITY_TEST_CHECKLIST.txt.
5. Record each result in docs/TEST_RESULTS_RECORD.txt.
6. Fix all critical/high failures and retest.
7. Complete docs/LAUNCH_GO_NO_GO.txt before accepting real users/payments.

NEVER
- Put service_role keys, database passwords, payment secrets, or recovery codes
  in HTML, browser JavaScript, GitHub, screenshots, or public messages.
- Use real card data, mobile-money PINs, or real customer data for testing.
- Claim compliance or enterprise-grade security based only on this checklist.
- Enable live payments before provider-specific callback/status verification,
  idempotency, refund and failure tests have passed.

PAYMENT STATUS
Stage 2.9 is only a starter architecture/schema/template. A payment provider
has not been selected or integrated. Mark payment tests NOT READY until that
work is complete in sandbox and reviewed.
