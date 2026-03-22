// ==================== ITABO CRM — Configuration ====================
// All constants, maps, and environment config in one place.
// Secrets are loaded from env vars injected by Vercel, NOT hardcoded.

// ---------------------------------------------------------------------------
// Supabase
// ---------------------------------------------------------------------------
// These are injected at build time by Vercel env vars.
// For local dev, set them in CRM/.env or use the fallback values below.
// The anon key is safe to expose in the frontend (it's public by design).
export const SUPABASE_URL = window.__ENV__?.SUPABASE_URL
  || 'https://hwzbcasvdafnpatbadyz.supabase.co';
export const SUPABASE_ANON_KEY = window.__ENV__?.SUPABASE_ANON_KEY
  || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3emJjYXN2ZGFmbnBhdGJhZHl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MzM4NjMsImV4cCI6MjA4OTQwOTg2M30.rAKrLymAMeKSdA9dsfg0xNmJX-3RO0tRYJ2p-Gqi8zY';

// ---------------------------------------------------------------------------
// Gmail Apps Script proxy
// ---------------------------------------------------------------------------
export const GMAIL_SCRIPT_URL = window.__ENV__?.GMAIL_SCRIPT_URL
  || '';
export const GMAIL_SECRET = window.__ENV__?.GMAIL_SECRET
  || '';

// ---------------------------------------------------------------------------
// Website links
// ---------------------------------------------------------------------------
export const SITE = 'https://itaboitalianwine.com';
export const LINKS = {
  wines: `${SITE}/#wines`,
  catalogo: `${SITE}/catalogo`,
  listino: `${SITE}/listino_prezzi`,
  about: `${SITE}/#why-itabo`,
  contact: `${SITE}/#contact`,
};

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------
export const PAGE_SIZE = 50;

// ---------------------------------------------------------------------------
// Nation strategy order
// ---------------------------------------------------------------------------
export const NATION_ORDER = [
  'Nigeria','Ghana','Russia','Kazakhstan','South Korea','Ivory Coast',
  'Senegal','Kenya','South Africa','Hong Kong','Singapore','Philippines',
  'Thailand','Vietnam','Taiwan','UAE','Israel','Mexico','Colombia',
  'Peru','Dominican Republic','Panama','Costa Rica',
];

// ---------------------------------------------------------------------------
// Preferred communication app per country
// ---------------------------------------------------------------------------
export const APP_MAP = {
  'Nigeria': ['whatsapp','email','sms'],
  'Ghana': ['whatsapp','email','sms'],
  'Ivory Coast': ['whatsapp','email','sms'],
  'Senegal': ['whatsapp','email','sms'],
  'Kenya': ['whatsapp','email','sms'],
  'South Africa': ['whatsapp','email','sms'],
  'Mexico': ['whatsapp','email','sms'],
  'Colombia': ['whatsapp','email','sms'],
  'Peru': ['whatsapp','email','sms'],
  'Dominican Republic': ['whatsapp','email','sms'],
  'Panama': ['whatsapp','email','sms'],
  'Costa Rica': ['whatsapp','email','sms'],
  'UAE': ['whatsapp','email','telegram'],
  'Israel': ['whatsapp','email','sms'],
  'Philippines': ['whatsapp','email','sms'],
  'Thailand': ['whatsapp','email','sms'],
  'Vietnam': ['whatsapp','email','sms'],
  'Taiwan': ['whatsapp','email','sms'],
  'Hong Kong': ['whatsapp','email','sms'],
  'Singapore': ['whatsapp','email','sms'],
  'South Korea': ['kakao','whatsapp','email'],
  'Kazakhstan': ['whatsapp','telegram','email'],
  'Russia': ['telegram','whatsapp','email'],
};

// ---------------------------------------------------------------------------
// Language map (from lead lingua field)
// ---------------------------------------------------------------------------
export const LANG_MAP = {
  'English': 'en', 'English / Afrikaans': 'en', 'English / Arabic': 'en',
  'English / Cantonese': 'en', 'English / Filipino': 'en', 'English / Swahili': 'en',
  'Français': 'fr', 'Spanish': 'es', 'Hebrew / English': 'en',
  'Kazakh / Russian': 'en', 'Korean': 'en', 'Mandarin': 'en',
  'Thai': 'en', 'Vietnamese': 'en',
};

// ---------------------------------------------------------------------------
// Status pipeline (frontend display names)
// ---------------------------------------------------------------------------
export const STATUS_OPTIONS = [
  { value: 'new', label: '1. New' },
  { value: 'wa-called', label: '2. WA Called' },
  { value: 'wa-no-answer', label: '2b. WA No Answer' },
  { value: 'wa-messaged', label: '3. WA Messaged' },
  { value: 'emailed', label: '4. Emailed' },
  { value: 'social-sent', label: '5. Social Sent' },
  { value: 'follow-up', label: '6. Follow-up' },
  { value: 'interested', label: '7. Interested' },
  { value: 'address-confirmed', label: '8. Address Confirmed' },
  { value: 'proforma-sent', label: '9. Proforma Invoice' },
  { value: 'sample-shipped', label: '10. Sample Shipped' },
  { value: 'sample-delivered', label: '11. Delivered' },
  { value: 'receipt-confirmed', label: '12. Receipt Confirmed' },
  { value: 'tasting-scheduled', label: '13. Tasting Booked' },
  { value: 'tasting-done', label: '14. Tasting Done' },
  { value: 'post-tasting-followup', label: '15. Post-Tasting Follow-up' },
  { value: 'negotiating', label: '16. Negotiating' },
  { value: 'first-order', label: '17. First Order' },
  { value: 'deal', label: '18. Deal Closed!' },
  { value: 'not-interested', label: 'X. Not Interested' },
];

// Map frontend status values to Supabase enum values
// The Supabase schema uses a different set of statuses (lead_status enum),
// so we map on read/write. For new leads stored only in localStorage (legacy),
// we use the frontend values directly.
export const STATUS_TO_DB = {
  'new': 'new',
  'wa-called': 'contacted',
  'wa-no-answer': 'contacted',
  'wa-messaged': 'contacted',
  'emailed': 'contacted',
  'social-sent': 'contacted',
  'follow-up': 'contacted',
  'interested': 'interested',
  'address-confirmed': 'interested',
  'proforma-sent': 'quote_sent',
  'sample-shipped': 'sample_sent',
  'sample-delivered': 'sample_received',
  'receipt-confirmed': 'sample_received',
  'tasting-scheduled': 'negotiation',
  'tasting-done': 'negotiation',
  'post-tasting-followup': 'negotiation',
  'negotiating': 'negotiation',
  'first-order': 'deal_closed',
  'deal': 'deal_closed',
  'not-interested': 'lost',
};
