/*
 * ATROPOLIES public Supabase configuration.
 * The publishable/anon key is designed for browser use when RLS is enabled.
 * NEVER put a secret key, service_role key, database password, or payment secret here.
 */
(() => {
  const SUPABASE_URL = 'PASTE_YOUR_SUPABASE_PROJECT_URL_HERE';
  const SUPABASE_PUBLISHABLE_KEY = 'PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY_HERE';

  const isConfigured =
    SUPABASE_URL.startsWith('https://') &&
    !SUPABASE_URL.includes('_HERE') &&
    SUPABASE_PUBLISHABLE_KEY.length > 20 &&
    !SUPABASE_PUBLISHABLE_KEY.includes('_HERE');

  window.ATROPOLIES_AUTH_CONFIGURED = isConfigured;
  window.atropoliesSupabase = null;

  if (isConfigured && window.supabase?.createClient) {
    window.atropoliesSupabase = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          flowType: 'pkce'
        }
      }
    );
  }
})();
