// ATROPOLIES Stage 2.9 — provider-neutral webhook TEMPLATE
// NOT production-ready. It intentionally rejects all requests until you
// implement the selected provider's documented verification process.
//
// Never put provider secrets in browser JavaScript or commit them to GitHub.
// Store secrets in Supabase Edge Function secrets / secure server environment.

Deno.serve(async (_req: Request) => {
  return new Response(
    JSON.stringify({
      error: "Payment webhook is not configured",
      message:
        "Implement and test provider-specific signature/authentication verification, " +
        "transaction status verification, amount/currency/order matching, and " +
        "idempotent processing before enabling live payments."
    }),
    {
      status: 503,
      headers: { "content-type": "application/json" }
    }
  );
});

/*
PRODUCTION IMPLEMENTATION MUST:
1. Read the raw request body if the provider's signature scheme requires it.
2. Verify the callback exactly as the provider documents.
3. Reject invalid signatures/authentication.
4. Verify the transaction status with the provider where required.
5. Match provider reference, internal order reference, expected amount,
   currency, and customer/account.
6. Deduplicate provider event IDs and payment references.
7. Apply an allowed status transition exactly once in a database transaction.
8. Record a minimal audit event; avoid storing unnecessary personal data.
9. Return the provider's required acknowledgement only after safe processing.

Do not invent a generic HMAC check: providers have different callback protocols.
For example, a provider may require a server-to-server status query rather than
a signed callback. Implement the chosen provider's official specification.
*/
