window.showAuthMessage = (message, isError = false) => {
  const target = document.getElementById('authMessage');
  if (!target) return;
  // Never parse user/provider text as HTML. textContent prevents HTML execution.
  target.textContent = String(message ?? '').slice(0, 500);
  target.dataset.state = isError ? 'error' : 'success';
};

window.requireAuthConfiguration = () => {
  if (window.ATROPOLIES_AUTH_CONFIGURED && window.atropoliesSupabase) return true;
  window.showAuthMessage(
    'Account services are not connected yet. Complete the Supabase setup in SETUP_STAGE_2_2.txt.',
    true
  );
  return false;
};
