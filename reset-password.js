const form = document.getElementById('resetForm');

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!window.requireAuthConfiguration()) return;

  const password = document.getElementById('password').value;
  const confirmation = document.getElementById('confirmPassword').value;
  const button = form.querySelector('button[type="submit"]');

  if (!window.ATROPOLIES_INPUT.validPassword(password) || password !== confirmation) {
    window.showAuthMessage('Passwords must match and contain 12–128 characters.', true);
    return;
  }

  button.disabled = true;
  window.showAuthMessage('Updating your password…');

  try {
    const { data: { session } } = await window.atropoliesSupabase.auth.getSession();
    if (!session) throw new Error('Recovery session missing');
    const { error } = await window.atropoliesSupabase.auth.updateUser({ password });
    if (error) throw error;
    form.reset();
    window.showAuthMessage('Password updated. You can now sign in with your new password.');
  } catch (error) {
    window.showAuthMessage('The recovery link may have expired. Request a new password reset link.', true);
  } finally {
    button.disabled = false;
  }
});
