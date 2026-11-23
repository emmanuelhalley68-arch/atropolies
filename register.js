const form = document.getElementById('registerForm');

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!window.requireAuthConfiguration()) return;

  const button = form.querySelector('button[type="submit"]');
  const displayName = window.ATROPOLIES_INPUT.cleanText(document.getElementById('displayName').value, 80);
  const email = window.ATROPOLIES_INPUT.normalizeEmail(document.getElementById('email').value);
  const password = document.getElementById('password').value;

  if (!window.ATROPOLIES_INPUT.validDisplayName(displayName) || !window.ATROPOLIES_INPUT.validEmail(email) || !window.ATROPOLIES_INPUT.validPassword(password)) {
    window.showAuthMessage('Check your name and email. Passwords must contain 12–128 characters.', true);
    return;
  }

  if (!window.ATROPOLIES_INPUT.allowSubmit('register')) { window.showAuthMessage('Please wait a moment before trying again.', true); return; }
  button.disabled = true;
  window.showAuthMessage('Creating your account…');

  try {
    const { error } = await window.atropoliesSupabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
        emailRedirectTo: `${window.location.origin}/login.html`
      }
    });

    if (error) throw error;
    form.reset();
    window.showAuthMessage('If registration is accepted, check your email for a verification link before signing in.');
  } catch (error) {
    // Avoid displaying raw provider errors or account-enumeration details.
    window.showAuthMessage('We could not complete registration. Check your details or try again later.', true);
  } finally {
    button.disabled = false;
  }
});
