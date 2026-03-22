// ==================== ITABO CRM — Supabase Client ====================
// Initializes the Supabase JS client and handles authentication.

import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

let _client = null;
let _available = false;
let _currentUser = null;

/**
 * Initialize the Supabase client.
 * Returns true if connected, false if falling back to localStorage.
 */
export function initSupabase() {
  if (_client) return _available;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('[ITABO] Supabase credentials not set — using localStorage fallback.');
    return false;
  }

  try {
    if (typeof window.supabase?.createClient !== 'function') {
      console.warn('[ITABO] Supabase JS library not loaded — using localStorage fallback.');
      return false;
    }
    _client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    _available = true;
    console.info('[ITABO] Supabase client initialized.');
    return true;
  } catch (err) {
    console.error('[ITABO] Failed to initialize Supabase:', err);
    return false;
  }
}

/** Get the Supabase client instance. */
export function getClient() {
  return _client;
}

/** Whether Supabase is available for use. */
export function isSupabaseAvailable() {
  return _available;
}

/** Get current authenticated user. */
export function getCurrentUser() {
  return _currentUser;
}

// ---------------------------------------------------------------------------
// Authentication
// ---------------------------------------------------------------------------

/**
 * Check if user is already logged in (has a session).
 * Returns the user object or null.
 */
export async function checkSession() {
  if (!_client) return null;
  try {
    const { data: { session } } = await _client.auth.getSession();
    if (session?.user) {
      _currentUser = session.user;
      return session.user;
    }
  } catch (err) {
    console.error('[ITABO] Session check failed:', err);
  }
  return null;
}

/**
 * Sign in with email and password.
 * Returns { user, error }.
 */
export async function signIn(email, password) {
  if (!_client) return { user: null, error: 'Supabase not available' };
  try {
    const { data, error } = await _client.auth.signInWithPassword({ email, password });
    if (error) return { user: null, error: error.message };
    _currentUser = data.user;
    return { user: data.user, error: null };
  } catch (err) {
    return { user: null, error: err.message };
  }
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  if (!_client) return;
  try {
    await _client.auth.signOut();
    _currentUser = null;
  } catch (err) {
    console.error('[ITABO] Sign out failed:', err);
  }
}

/**
 * Listen for auth state changes.
 */
export function onAuthChange(callback) {
  if (!_client) return;
  _client.auth.onAuthStateChange((event, session) => {
    _currentUser = session?.user || null;
    callback(event, session);
  });
}
