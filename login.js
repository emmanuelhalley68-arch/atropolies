const form = document.getElementById('loginForm');
let mfaChallenge = null;

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!window.requireAuthConfiguration()) return;

  const button = document.getElementById('loginSubmit');
  button.disabled = true;

  try {
    if (!mfaChallenge) {
      const email = window.ATROPOLIES_INPUT.normalizeEmail(document.getElementById('email').value);
      const password = document.getElementById('password').value;
      if (!window.ATROPOLIES_INPUT.validEmail(email) || !password || password.length > 128) throw new Error('Enter a valid email and password.');
      if (!window.ATROPOLIES_INPUT.allowSubmit('login')) throw new Error('Please wait a moment before trying again.');
      window.showAuthMessage('Checking your sign-in…');

      const { error } = await window.atropoliesSupabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const { data: assurance, error: assuranceError } = await window.atropoliesSupabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (assuranceError) throw assuranceError;

      if (assurance?.nextLevel === 'aal2' && assurance?.currentLevel !== 'aal2') {
        const { data: factors, error: factorsError } = await window.atropoliesSupabase.auth.mfa.listFactors();
        if (factorsError) throw factorsError;
        const factor = factors?.totp?.find(item => item.status === 'verified');
        if (!factor) throw new Error('MFA is required but no verified authenticator is available. Contact support.');

        const { data: challenge, error: challengeError } = await window.atropoliesSupabase.auth.mfa.challenge({ factorId: factor.id });
        if (challengeError) throw challengeError;
        mfaChallenge = { factorId: factor.id, challengeId: challenge.id };
        document.getElementById('mfaStep').hidden = false;
        document.getElementById('mfaCode').required = true;
        document.querySelector('label[for="password"]').hidden = true;
        document.getElementById('password').hidden = true;
        document.querySelector('label[for="email"]').hidden = true;
        document.getElementById('email').hidden = true;
        button.textContent = 'Verify code';
        window.showAuthMessage('Two-factor authentication is enabled. Enter your authenticator code.');
        return;
      }

      window.location.replace('/dashboard.html');
      return;
    }

    const code = document.getElementById('mfaCode').value.trim();
    if (!/^\d{6}$/.test(code)) throw new Error('Enter the six-digit code from your authenticator app.');
    window.showAuthMessage('Verifying your code…');
    const { error } = await window.atropoliesSupabase.auth.mfa.verify({
      factorId: mfaChallenge.factorId,
      challengeId: mfaChallenge.challengeId,
      code
    });
    if (error) throw error;
    window.location.replace('/dashboard.html');
  } catch (error) {
    window.showAuthMessage('Sign-in unsuccessful. Check your details or try again later.', true);
  } finally {
    button.disabled = false;
  }
});
