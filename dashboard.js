async function loadPrivateDashboard() {
  if (!window.requireAuthConfiguration()) return;

  const welcome = document.getElementById('welcomeMessage');
  const emailNode = document.getElementById('accountEmail');
  const nameNode = document.getElementById('displayName');
  const roleNode = document.getElementById('accountRole');

  try {
    const { data: { user }, error: userError } = await window.atropoliesSupabase.auth.getUser();
    if (userError || !user) {
      window.location.replace('/login.html');
      return;
    }

    // Read only this authenticated user's own profile. RLS enforces ownership.
    const { data: profile, error: profileError } = await window.atropoliesSupabase
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) throw profileError;

    // This is display-only. Supabase RLS remains the actual authorization boundary.
    const { data: roleRows, error: roleError } = await window.atropoliesSupabase
      .from('user_roles')
      .select('role');
    if (roleError) throw roleError;
    const roleNames = (roleRows || []).map(row => row.role);
    const roleLabels = { customer: 'Customer', teacher: 'Teacher', business_owner: 'Business owner', administrator: 'Administrator', super_administrator: 'Super administrator' };

    welcome.textContent = 'You are signed in to ATROPOLIES.';
    emailNode.textContent = user.email || 'Not available';
    nameNode.textContent = profile?.display_name || 'ATROPOLIES member';
    roleNode.textContent = roleNames.map(role => roleLabels[role] || 'Member').join(', ') || 'Customer';
  } catch (error) {
    welcome.textContent = 'Your account information could not be loaded.';
    window.showAuthMessage('Please refresh the page or sign in again.', true);
  }
}

document.getElementById('logoutButton')?.addEventListener('click', async () => {
  if (!window.requireAuthConfiguration()) return;
  const button = document.getElementById('logoutButton');
  button.disabled = true;
  const { error } = await window.atropoliesSupabase.auth.signOut({ scope: 'global' });
  if (error) {
    window.showAuthMessage('Sign-out failed. Please try again.', true);
    button.disabled = false;
    return;
  }
  window.location.replace('/login.html');
});

loadPrivateDashboard();
