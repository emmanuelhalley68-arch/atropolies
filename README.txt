ATROPOLIES - Stage 2 starter package

CONTENTS
- index.html: recovered website version with official contacts
- _headers: baseline security response headers for Netlify

DEPLOYMENT
1. Upload the contents of this folder to the root of your GitHub repository.
2. In Netlify, import that GitHub repository as a new site (or connect the existing site).
3. Set the publish directory to the repository root. No build command is needed for this static HTML site.
4. Deploy, then verify the response headers in the browser's developer tools or an online HTTP header checker.

IMPORTANT SECURITY NOTES
- These headers are a baseline, not enterprise-grade security by themselves.
- Content-Security-Policy is intentionally not included yet because the recovered HTML contains inline CSS/JavaScript and a restrictive policy could break the site. We should implement and test CSP using hashes/nonces or externalized scripts/styles.
- Client-side HTML cannot securely implement customer accounts, payment processing, authorization, or database protection by itself. Those require a backend such as Supabase, correctly configured Row Level Security (RLS), server-side secrets, and verified payment webhooks.
- HSTS should be used only after the site is served exclusively over HTTPS and all intended subdomains support HTTPS.
- Review contact details and all placeholders in index.html before public deployment.

This package is a deployment starter based on the recovered HTML file, not a claim that all Stage 2 security features are complete or integrated.
