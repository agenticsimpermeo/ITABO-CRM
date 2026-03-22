// ==================== ITABO CRM — Data Store ====================
// Manages lead data with Supabase as primary and localStorage as fallback.
// Provides a unified API regardless of the backend.

import { PAGE_SIZE } from './config.js';
import { getClient, isSupabaseAvailable } from './supabase-client.js';
import { showToast } from './toast.js';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
let ALL_LEADS = [];
let filteredLeads = [];
let selectedLead = null;
let currentPage = 0;
let activeCountry = '';
let totalCount = 0;
let isLoading = false;

// ---------------------------------------------------------------------------
// Getters
// ---------------------------------------------------------------------------
export function getLeads() { return ALL_LEADS; }
export function getFilteredLeads() { return filteredLeads; }
export function getSelectedLead() { return selectedLead; }
export function getCurrentPage() { return currentPage; }
export function getActiveCountry() { return activeCountry; }
export function getTotalCount() { return totalCount; }
export function getIsLoading() { return isLoading; }

// ---------------------------------------------------------------------------
// Setters
// ---------------------------------------------------------------------------
export function setCurrentPage(p) { currentPage = p; }
export function setActiveCountry(c) { activeCountry = c; currentPage = 0; }
export function setSelectedLead(lead) { selectedLead = lead; }

// ---------------------------------------------------------------------------
// Load leads
// ---------------------------------------------------------------------------

/**
 * Load all leads. Uses Supabase if available, else localStorage/embedded data.
 */
export async function loadLeads(embeddedLeads) {
  isLoading = true;

  if (isSupabaseAvailable()) {
    try {
      await loadFromSupabase();
      showToast('Leads loaded from database', 'success', 2000);
    } catch (err) {
      console.error('[ITABO] Supabase load failed, falling back to localStorage:', err);
      showToast('Database unavailable — using local data', 'warning', 4000);
      loadFromLocalStorage(embeddedLeads);
    }
  } else {
    loadFromLocalStorage(embeddedLeads);
  }

  isLoading = false;
  return ALL_LEADS;
}

async function loadFromSupabase() {
  const client = getClient();
  const all = [];
  let offset = 0;
  const batchSize = 1000;

  while (true) {
    const { data, error } = await client
      .from('leads')
      .select('*')
      .range(offset, offset + batchSize - 1)
      .order('country')
      .order('company_name');

    if (error) throw error;
    if (!data || data.length === 0) break;

    all.push(...data);
    if (data.length < batchSize) break;
    offset += batchSize;
  }

  // Map Supabase columns to frontend format for backward compatibility
  ALL_LEADS = all.map((row, i) => mapDbToFrontend(row, i));
  totalCount = ALL_LEADS.length;
}

function loadFromLocalStorage(embeddedLeads) {
  const saved = localStorage.getItem('itabo_crm_leads');
  if (saved) {
    try {
      ALL_LEADS = JSON.parse(saved);
    } catch {
      ALL_LEADS = embeddedLeads || [];
    }
  } else {
    ALL_LEADS = embeddedLeads || [];
  }
  ALL_LEADS.forEach((l, i) => {
    l.id = l.id ?? i;
    l.status = l.status || 'new';
    l.notes = l.notes || '';
    l.lastContact = l.lastContact || '';
  });
  totalCount = ALL_LEADS.length;
  saveToDB();
}

// ---------------------------------------------------------------------------
// Map DB row to frontend format
// ---------------------------------------------------------------------------
function mapDbToFrontend(row, index) {
  return {
    id: row.id || index,
    _uuid: row.id,  // Keep UUID for Supabase operations
    paese: row.country || '',
    citta: row.city || '',
    azienda: row.company_name || '',
    indirizzo: row.address || '',
    telefono: row.phone || '',
    email1: row.email1 || '',
    email2: row.email2 || '',
    email3: row.email3 || '',
    nEmail: [row.email1, row.email2, row.email3].filter(Boolean).length,
    sito: row.website || '',
    maps: row.google_maps_url || '',
    rating: row.google_rating || null,
    recensioni: row.google_reviews || 0,
    tipologia: row.business_type || 'other',
    lingua: '', // Not in DB, derived from country
    dazio: '',
    fob: 3.8,
    prezzoFinale: 0,
    status: row.status || 'new',
    notes: row.notes || '',
    lastContact: row.last_contact_at ? row.last_contact_at.split('T')[0] : '',
    followUpDate: row.next_follow_up_at ? row.next_follow_up_at.split('T')[0] : '',
    activities: [],
    contacts: [],
    tracking: row.sample_tracking || {},
    social: row.social_links || {},
    lead_score: row.lead_score || 0,
    tags: row.tags || [],
  };
}

// ---------------------------------------------------------------------------
// Save (localStorage fallback)
// ---------------------------------------------------------------------------
export function saveToDB() {
  if (!isSupabaseAvailable()) {
    try {
      localStorage.setItem('itabo_crm_leads', JSON.stringify(ALL_LEADS));
    } catch (err) {
      console.warn('[ITABO] localStorage save failed (quota?):', err.message);
      showToast('Warning: local storage full — some changes may not persist', 'warning', 5000);
    }
  }
}

// ---------------------------------------------------------------------------
// Update lead (Supabase + localStorage)
// ---------------------------------------------------------------------------

/**
 * Update a single field on a lead.
 */
export async function updateLead(leadId, updates) {
  // Apply locally first (optimistic update)
  const lead = findLeadById(leadId);
  if (!lead) return;

  Object.assign(lead, updates);
  saveToDB();

  // Sync to Supabase
  if (isSupabaseAvailable() && lead._uuid) {
    try {
      const dbUpdates = mapFrontendToDb(updates);
      const { error } = await getClient()
        .from('leads')
        .update(dbUpdates)
        .eq('id', lead._uuid);
      if (error) throw error;
    } catch (err) {
      console.error('[ITABO] Supabase update failed:', err);
      showToast('Failed to sync change to database', 'error');
    }
  }
}

function mapFrontendToDb(updates) {
  const map = {
    status: 'status',
    notes: 'notes',
    lastContact: 'last_contact_at',
    followUpDate: 'next_follow_up_at',
    tracking: 'sample_tracking',
    social: 'social_links',
  };
  const result = {};
  for (const [key, val] of Object.entries(updates)) {
    const dbKey = map[key];
    if (dbKey) {
      result[dbKey] = val || null;
    }
  }
  return result;
}

// ---------------------------------------------------------------------------
// Add activity
// ---------------------------------------------------------------------------
export async function addLeadActivity(leadId, activity) {
  const lead = findLeadById(leadId);
  if (!lead) return;

  if (!lead.activities) lead.activities = [];
  lead.activities.push(activity);
  lead.lastContact = activity.date;
  saveToDB();

  // Sync to Supabase
  if (isSupabaseAvailable() && lead._uuid) {
    try {
      const { error } = await getClient()
        .from('lead_activities')
        .insert({
          lead_id: lead._uuid,
          type: activity.action || 'note',
          subject: activity.note?.substring(0, 100) || '',
          body: activity.note || '',
        });
      if (error) throw error;
    } catch (err) {
      console.error('[ITABO] Failed to log activity to Supabase:', err);
    }
  }
}

// ---------------------------------------------------------------------------
// Filtering
// ---------------------------------------------------------------------------

export function applyFilters(filters = {}) {
  const { search, type, status, email, rating, country } = filters;
  const c = country ?? activeCountry;

  filteredLeads = ALL_LEADS.filter(l => {
    if (c && l.paese !== c) return false;
    if (type && l.tipologia !== type) return false;
    if (status && l.status !== status) return false;
    if (email === 'yes' && !l.email1) return false;
    if (email === 'no' && l.email1) return false;
    if (rating && (!l.rating || l.rating < parseFloat(rating))) return false;
    if (search) {
      const q = search.toLowerCase();
      const hay = `${l.azienda} ${l.citta} ${l.paese} ${l.email1} ${l.telefono} ${l.notes}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  return filteredLeads;
}

/**
 * Get leads for the current page.
 */
export function getPageLeads() {
  const start = currentPage * PAGE_SIZE;
  return filteredLeads.slice(start, start + PAGE_SIZE);
}

export function getTotalPages() {
  return Math.ceil(filteredLeads.length / PAGE_SIZE) || 1;
}

// ---------------------------------------------------------------------------
// Country stats
// ---------------------------------------------------------------------------
export function getCountryCounts() {
  const counts = {};
  ALL_LEADS.forEach(l => { counts[l.paese] = (counts[l.paese] || 0) + 1; });
  return counts;
}

export function getStats() {
  return {
    total: ALL_LEADS.length,
    withEmail: ALL_LEADS.filter(l => l.email1).length,
    contacted: ALL_LEADS.filter(l => l.status !== 'new').length,
    interested: ALL_LEADS.filter(l =>
      ['interested', 'address-confirmed', 'proforma-sent', 'sample-shipped',
       'sample-delivered', 'receipt-confirmed', 'tasting-scheduled', 'tasting-done',
       'post-tasting-followup', 'negotiating', 'first-order', 'deal'].includes(l.status)
    ).length,
    filtered: filteredLeads.length,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function findLeadById(id) {
  return ALL_LEADS.find(l => l.id === id) || ALL_LEADS[id];
}

export function findLead(id) {
  return findLeadById(id);
}
