// ==================== ITABO CRM — Authentication UI ====================
import { checkSession, signIn, signOut, getCurrentUser, isSupabaseAvailable } from './supabase-client.js';
import { showToast } from './toast.js';

/**
 * Check auth and show login or CRM.
 * Returns true if authenticated, false if login screen shown.
 */
export async function requireAuth() {
  if (!isSupabaseAvailable()) {
    // No Supabase = no auth, show CRM directly
    hideSplash();
    return true;
  }

  const user = await checkSession();
  if (user) {
    hideSplash();
    showUserBadge(user);
    return true;
  }

  // Show login screen
  showLoginScreen();
  return false;
}

function showLoginScreen() {
  // Hide CRM content
  document.querySelectorAll('.header, .filters, .country-bar, .main, .mobile-export-bar').forEach(el => {
    el.style.display = 'none';
  });

  // Remove existing login screen if any
  document.getElementById('loginScreen')?.remove();

  const login = document.createElement('div');
  login.id = 'loginScreen';
  login.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--dark);">
      <div style="background:#1a1a1a;border:1px solid var(--gold);border-radius:16px;padding:40px;width:380px;max-width:90vw;text-align:center;">
        <h1 style="color:var(--gold);font-size:32px;letter-spacing:3px;margin-bottom:4px;">ITABO</h1>
        <div style="color:#888;font-size:13px;margin-bottom:32px;">Wine Export CRM</div>

        <div id="loginError" style="display:none;background:rgba(244,67,54,0.15);border:1px solid var(--red);border-radius:8px;padding:10px;margin-bottom:16px;color:var(--red);font-size:13px;"></div>

        <div style="margin-bottom:16px;">
          <input type="email" id="loginEmail" placeholder="Email"
            style="width:100%;padding:12px 16px;background:#2a2a2a;border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:15px;outline:none;">
        </div>
        <div style="margin-bottom:24px;">
          <input type="password" id="loginPassword" placeholder="Password"
            style="width:100%;padding:12px 16px;background:#2a2a2a;border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:15px;outline:none;">
        </div>
        <button id="loginBtn" onclick="window._doLogin()"
          style="width:100%;padding:14px;background:var(--gold);color:var(--dark);border:none;border-radius:8px;font-size:16px;font-weight:700;cursor:pointer;letter-spacing:1px;transition:all 0.2s;">
          ACCEDI
        </button>
      </div>
    </div>
  `;
  document.body.prepend(login);

  // Focus email field
  setTimeout(() => document.getElementById('loginEmail')?.focus(), 100);

  // Enter key to submit
  login.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') window._doLogin();
  });
}

// Global login handler
window._doLogin = async function() {
  const email = document.getElementById('loginEmail')?.value?.trim();
  const password = document.getElementById('loginPassword')?.value;
  const errorEl = document.getElementById('loginError');
  const btn = document.getElementById('loginBtn');

  if (!email || !password) {
    errorEl.textContent = 'Inserisci email e password';
    errorEl.style.display = 'block';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Accesso in corso...';
  errorEl.style.display = 'none';

  const { user, error } = await signIn(email, password);

  if (error) {
    errorEl.textContent = error === 'Invalid login credentials'
      ? 'Email o password non validi'
      : error;
    errorEl.style.display = 'block';
    btn.disabled = false;
    btn.textContent = 'ACCEDI';
    return;
  }

  // Success — reload to start the app with auth
  showToast('Accesso effettuato', 'success', 1500);
  setTimeout(() => location.reload(), 500);
};

function hideSplash() {
  document.getElementById('loginScreen')?.remove();
  // Show CRM content
  document.querySelectorAll('.header, .filters, .country-bar, .main, .mobile-export-bar').forEach(el => {
    el.style.display = '';
  });
}

function showUserBadge(user) {
  const header = document.querySelector('.header');
  if (!header) return;

  // Remove existing badge
  document.getElementById('userBadge')?.remove();

  const badge = document.createElement('div');
  badge.id = 'userBadge';
  badge.style.cssText = 'display:flex;align-items:center;gap:10px;';
  badge.innerHTML = `
    <span style="font-size:12px;color:#888;">${escHtml(user.email)}</span>
    <button onclick="window._doLogout()"
      style="padding:5px 12px;background:transparent;border:1px solid var(--border);border-radius:6px;color:#888;font-size:12px;cursor:pointer;">
      Logout
    </button>
  `;
  header.appendChild(badge);
}

window._doLogout = async function() {
  await signOut();
  showToast('Disconnesso', 'info', 1500);
  setTimeout(() => location.reload(), 500);
};

function escHtml(s) {
  const d = document.createElement('div');
  d.textContent = s || '';
  return d.innerHTML;
}
