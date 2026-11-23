const client = window.atropoliesSupabase;
let pendingFactorId = null;
let activeFactor = null;

function message(text, isError = false) {
  window.showAuthMessage(text, isError);
}

async function requireSignedInUser() {
  if (!window.requireAuthConfiguration()) return null;
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) {
    window.location.replace('/login.html');
    return null;
  }
  return data.user;
}

async function refreshMfaStatus() {
  const { data, error } = await client.auth.mfa.listFactors();
  if (error) throw error;
  activeFactor = data.totp?.find(factor => factor.status === 'verified') || null;
  const status = document.getElementById('mfaStatus');
  const enrol = document.getElementById('enrolPanel');
  const disable = document.getElementById('disablePanel');
  status.textContent = activeFactor ? 'Authenticator protection is enabled.' : 'Authenticator protection is not enabled.';
  enrol.hidden = Boolean(activeFactor);
  disable.hidden = !activeFactor;
}

async function beginMfaEnrollment() {
  const button = document.getElementById('startMfa');
  button.disabled = true;
  try {
    const { data, error } = await client.auth.mfa.enroll({ factorType: 'totp', friendlyName: 'ATROPOLIES authenticator' });
    if (error) throw error;
    pendingFactorId = data.id;
    document.getElementById('mfaQr').src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(data.totp.qr_code)}`;
    document.getElementById('mfaSecret').textContent = data.totp.secret;
    document.getElementById('verifyPanel').hidden = false;
    document.getElementById('enrolPanel').hidden = true;
    message('Scan the QR code, then enter the current six-digit code to finish setup.');
  } catch (error) {
    message(error.message || 'Could not start authenticator setup.', true);
    button.disabled = false;
  }
}

async function verifyMfaEnrollment() {
  const code = document.getElementById('enrolCode').value.trim();
  if (!/^\\d{6}$/.test(code) || !pendingFactorId) {
    message('Enter the six-digit code from your authenticator app.', true);
    return;
  }
  const button = document.getElementById('verifyMfa');
  button.disabled = true;
  try {
    const { data: challenge, error: challengeError } = await client.auth.mfa.challenge({ factorId: pendingFactorId });
    if (challengeError) throw challengeError;
    const { error } = await client.auth.mfa.verify({ factorId: pendingFactorId, challengeId: challenge.id, code });
    if (error) throw error;
    pendingFactorId = null;
    document.getElementById('verifyPanel').hidden = true;
    document.getElementById('enrolCode').value = '';
    await refreshMfaStatus();
    message('Two-factor authentication is now enabled for this account.');
  } catch (error) {
    message(error.message || 'The code could not be verified. Try the latest code.', true);
  } finally {
    button.disabled = false;
  }
}

async function cancelMfaEnrollment() {
  if (pendingFactorId) {
    const { error } = await client.auth.mfa.unenroll({ factorId: pendingFactorId });
    if (error) {
      message('Could not cancel setup. Try again.', true);
      return;
    }
  }
  pendingFactorId = null;
  document.getElementById('verifyPanel').hidden = true;
  document.getElementById('enrolPanel').hidden = false;
  document.getElementById('startMfa').disabled = false;
  message('Authenticator setup cancelled.');
}

async function removeMfa() {
  if (!activeFactor) return;
  const code = document.getElementById('disableCode').value.trim();
  if (!/^\\d{6}$/.test(code)) {
    message('Enter a current six-digit authenticator code first.', true);
    return;
  }
  const button = document.getElementById('disableMfa');
  button.disabled = true;
  try {
    const { data: challenge, error: challengeError } = await client.auth.mfa.challenge({ factorId: activeFactor.id });
    if (challengeError) throw challengeError;
    const { error: verifyError } = await client.auth.mfa.verify({ factorId: activeFactor.id, challengeId: challenge.id, code });
    if (verifyError) throw verifyError;
    const { error: removeError } = await client.auth.mfa.unenroll({ factorId: activeFactor.id });
    if (removeError) throw removeError;
    document.getElementById('disableCode').value = '';
    await refreshMfaStatus();
    message('Authenticator removed. Consider enabling it again to protect your account.');
  } catch (error) {
    message(error.message || 'Could not remove authenticator.', true);
  } finally {
    button.disabled = false;
  }
}

async function signOutEverywhere() {
  const button = document.getElementById('signOutAll');
  if (!confirm('Sign out of all ATROPOLIES sessions, including this device?')) return;
  button.disabled = true;
  const { error } = await client.auth.signOut({ scope: 'global' });
  if (error) {
    message('Could not sign out everywhere. Please try again.', true);
    button.disabled = false;
    return;
  }
  window.location.replace('/login.html');
}

document.getElementById('startMfa')?.addEventListener('click', beginMfaEnrollment);
document.getElementById('verifyMfa')?.addEventListener('click', verifyMfaEnrollment);
document.getElementById('cancelMfa')?.addEventListener('click', cancelMfaEnrollment);
document.getElementById('disableMfa')?.addEventListener('click', removeMfa);
document.getElementById('signOutAll')?.addEventListener('click', signOutEverywhere);

(async () => {
  const user = await requireSignedInUser();
  if (!user) return;
  try {
    await refreshMfaStatus();
  } catch (error) {
    message('Could not load security settings. Refresh and try again.', true);
  }
})();
