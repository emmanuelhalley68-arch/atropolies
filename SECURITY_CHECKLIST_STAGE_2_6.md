# ATROPOLIES Stage 2.6 — Security checklist

## Browser application
- [x] Use `textContent` for status and profile text; do not render untrusted values with `innerHTML`.
- [x] Validate and normalize form values for usability.
- [x] Avoid exposing raw login-provider errors in the UI.
- [x] Add a short duplicate-submit cooldown for accidental repeated clicks.
- [ ] Review every future page for unsafe DOM sinks (`innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `eval`, `new Function`).
- [ ] Add a Content Security Policy report/monitoring workflow before expanding third-party scripts.

## Supabase / API
- [ ] RLS enabled and tested on every exposed table and storage bucket.
- [ ] Public Auth rate limits and bot/CAPTCHA protection configured and tested.
- [ ] Only exact production redirect URLs allowed.
- [ ] No secret/service_role key or database password in browser files.
- [ ] Privileged actions use trusted server/Edge Functions and verify authorization on every request.
- [ ] Database queries use typed/parameterized APIs; no SQL string concatenation from user input.
- [ ] MFA assurance level is enforced in database policies or trusted server code for sensitive operations.

## CSRF and sessions
- [ ] Current app uses SDK bearer-token auth, not a custom cookie session.
- [ ] If cookie sessions are introduced, add SameSite, Secure, HttpOnly cookies, Origin/Referer validation and appropriate anti-CSRF tokens.
- [ ] Never put payment provider secrets or webhook secrets in frontend JavaScript.

## Verification
- [ ] Test with two separate customer accounts.
- [ ] Test unauthorized direct API calls, not only the visible UI.
- [ ] Test XSS-like strings and verify they appear as plain text.
- [ ] Review deployed response headers and browser console.
- [ ] Perform an independent security review before accepting payments or storing sensitive customer information.
