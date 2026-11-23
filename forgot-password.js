const form = document.getElementById('recoveryForm');

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!window.requireAuthConfiguration()) return;

  const button = form.querySelector('button[type="submit"]');
  const email = window.ATROPOLIES_INPUT.normalizeEmail(document.getElementById('email').value);
  if (!window.ATROPOLIES_INPUT.validEmail(email)) { window.showAuthMessage('Enter a valid email address.', true); return; }
  if (!window.ATROPOLIES_INPUT.allowSubmit('password-recovery', 10000)) { window.showAuthMessage('Please wait before requesting another recovery email.', true); return; }
  button.disabled = true;
  window.showAuthMessage('Requesting a recovery email…');

  try {
    const { error } = await window.atropoliesSupabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password.html`
    });
    if (error) throw error;
    window.showAuthMessage('If an account matches that address, a password recovery link will be sent.');
    form.reset();
  } catch (error) {
    window.showAuthMessage('We could not process that request. Please try again later.', true);
  } finally {
    button.disabled = false;
  }
});
