// ==================== ITABO CRM — Main Application ====================
// Initializes all modules and wires up the UI.

import { PAGE_SIZE, NATION_ORDER, APP_MAP, LANG_MAP, STATUS_OPTIONS, GMAIL_SCRIPT_URL, GMAIL_SECRET } from './config.js';
import { initSupabase } from './supabase-client.js';
import { requireAuth } from './auth.js';
import { showToast } from './toast.js';
import {
  loadLeads, getLeads, getFilteredLeads, getSelectedLead, setSelectedLead,
  getCurrentPage, setCurrentPage, getActiveCountry, setActiveCountry,
  applyFilters, getPageLeads, getTotalPages, getCountryCounts, getStats,
  findLead, updateLead, addLeadActivity, saveToDB,
} from './store.js';
import {
  TEMPLATES, TEMPLATE_TYPES, TEMPLATE_TYPE_LABELS, LINKEDIN_TEMPLATES,
  getTemplate, getEmailSubject, fillTemplate,
} from './templates.js';

// ---------------------------------------------------------------------------
// Globals for template modal
// ---------------------------------------------------------------------------
let currentChannel = '';
let currentModalUrl = '';
let currentTemplateType = 'first';
let currentEmailAddr = '';

// ---------------------------------------------------------------------------
// Utility: escape HTML
// ---------------------------------------------------------------------------
function esc(s) {
  if (!s) return '';
  const div = document.createElement('div');
  div.textContent = String(s);
  return div.innerHTML;
}

// Make functions globally available for inline onclick handlers
window.esc = esc;

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------
async function init() {
  // Initialize Supabase client
  initSupabase();

  // Require authentication before loading CRM
  const authenticated = await requireAuth();
  if (!authenticated) return; // Login screen shown, will reload on success

  const listEl = document.getElementById('listCount');
  if (listEl) listEl.textContent = 'Loading leads...';

  // Defer heavy work so UI paints first on mobile
  await new Promise(r => setTimeout(r, 50));

  // Load data — EMBEDDED_LEADS is defined in index.html as fallback
  const embedded = window.EMBEDDED_LEADS || [];
  await loadLeads(embedded);

  buildCountryBar();
  applyAndRender();
  updateStats();

  // Set Nigeria as default
  setCountryFilter('Nigeria');

  setupEventListeners();
  showToast('CRM loaded', 'success', 1500);
}

// ---------------------------------------------------------------------------
// Event listeners
// ---------------------------------------------------------------------------
function setupEventListeners() {
  // Filters
  document.getElementById('searchBox')?.addEventListener('input', debounce(applyAndRender, 250));
  document.getElementById('filterType')?.addEventListener('change', applyAndRender);
  document.getElementById('filterStatus')?.addEventListener('change', applyAndRender);
  document.getElementById('filterEmail')?.addEventListener('change', applyAndRender);
  document.getElementById('filterRating')?.addEventListener('change', applyAndRender);

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(); closeScript(); }
    if (e.key === '/' && !e.target.matches('input,textarea,select')) {
      e.preventDefault();
      document.getElementById('searchBox')?.focus();
    }
    if (e.key === 's' && !e.target.matches('input,textarea,select')) {
      const lead = getSelectedLead();
      if (lead) {
        const panel = document.getElementById('scriptPanel');
        if (panel?.classList.contains('show')) closeScript();
        else openScript(lead.id);
      }
    }
  });
}

function debounce(fn, ms) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
}

// ---------------------------------------------------------------------------
// Filter & render
// ---------------------------------------------------------------------------
function getFilterValues() {
  return {
    search: document.getElementById('searchBox')?.value || '',
    type: document.getElementById('filterType')?.value || '',
    status: document.getElementById('filterStatus')?.value || '',
    email: document.getElementById('filterEmail')?.value || '',
    rating: document.getElementById('filterRating')?.value || '',
  };
}

function applyAndRender() {
  applyFilters(getFilterValues());
  setCurrentPage(0);
  renderList();
  updateStats();
}

function updateStats() {
  const s = getStats();
  const el = (id) => document.getElementById(id);
  if (el('totalLeads')) el('totalLeads').textContent = s.total;
  if (el('withEmail')) el('withEmail').textContent = s.withEmail;
  if (el('contacted')) el('contacted').textContent = s.contacted;
  if (el('interested')) el('interested').textContent = s.interested;
  if (el('filteredCount')) el('filteredCount').textContent = s.filtered;
}

// ---------------------------------------------------------------------------
// Country bar
// ---------------------------------------------------------------------------
function buildCountryBar() {
  const bar = document.getElementById('countryBar');
  if (!bar) return;
  const counts = getCountryCounts();
  const all = getLeads();

  bar.innerHTML = `<div class="chip active" onclick="window.setCountryFilter('')">ALL <span class="count">(${all.length})</span></div>`;
  NATION_ORDER.forEach(nation => {
    if (!counts[nation]) return;
    const isPriority = NATION_ORDER.indexOf(nation) < 5;
    bar.innerHTML += `<div class="chip ${isPriority ? 'priority' : ''}" onclick="window.setCountryFilter('${esc(nation)}')">${esc(nation)} <span class="count">(${counts[nation]})</span></div>`;
  });
  // Add remaining countries not in NATION_ORDER
  Object.keys(counts).sort().forEach(nation => {
    if (NATION_ORDER.includes(nation)) return;
    bar.innerHTML += `<div class="chip" onclick="window.setCountryFilter('${esc(nation)}')">${esc(nation)} <span class="count">(${counts[nation]})</span></div>`;
  });
}

function setCountryFilter(country) {
  setActiveCountry(country);
  // Update chip states
  document.querySelectorAll('.country-bar .chip').forEach(chip => {
    const isAll = chip.textContent.startsWith('ALL');
    const isMatch = chip.textContent.includes(country);
    chip.classList.toggle('active', country ? isMatch : isAll);
  });
  // Update mobile label
  const mobileLabel = document.getElementById('mobileCountryLabel');
  if (mobileLabel) mobileLabel.textContent = country || 'All';
  applyAndRender();
}
window.setCountryFilter = setCountryFilter;

// ---------------------------------------------------------------------------
// Render lead list
// ---------------------------------------------------------------------------
function renderList() {
  const page = getPageLeads();
  const filtered = getFilteredLeads();
  const cp = getCurrentPage();
  const tp = getTotalPages();
  const active = getActiveCountry();
  const selected = getSelectedLead();
  const list = document.getElementById('leadsList');

  document.getElementById('listCount').textContent =
    `${filtered.length} leads${active ? ' in ' + active : ''} (page ${cp + 1}/${tp})`;

  list.innerHTML = page.map(l => `
    <div class="lead-card ${selected?.id === l.id ? 'selected' : ''}" onclick="window.selectLead(${typeof l.id === 'string' ? "'" + l.id + "'" : l.id})">
      <div class="card-top">
        <div>
          <div class="card-company">${esc(l.azienda)}</div>
          <div class="card-location">${esc(l.citta)}, ${esc(l.paese)}</div>
        </div>
        <div style="text-align:right;">
          <div class="card-type">${esc(l.tipologia)}</div>
          <div class="card-status status-${l.status}" style="margin-top:4px;">${l.status.replace(/-/g, ' ')}</div>
        </div>
      </div>
      <div class="card-contact">
        ${l.email1 ? `<span>\u2709 ${esc(l.email1)}</span>` : '<span style="color:#555;">No email</span>'}
        ${l.telefono ? `<span>\u260e ${esc(l.telefono)}</span>` : ''}
        ${l.rating ? `<span class="card-rating">\u2605 ${l.rating}</span>` : ''}
        ${l.recensioni ? `<span style="color:#666;">(${l.recensioni} reviews)</span>` : ''}
      </div>
      ${l.telefono ? `<a href="https://wa.me/${esc(l.telefono).replace(/[^0-9]/g, '')}" class="mobile-call-btn" style="display:none;align-items:center;justify-content:center;width:48px;height:48px;border-radius:50%;background:var(--whatsapp);color:#fff;font-size:22px;text-decoration:none;flex-shrink:0;" onclick="event.stopPropagation();">\u260e</a>` : ''}
    </div>
  `).join('');

  // Pagination
  const pag = document.getElementById('pagination');
  if (tp <= 1) { pag.innerHTML = ''; return; }
  let html = '';
  if (cp > 0) html += `<button class="btn btn-sm btn-outline" onclick="window.goPage(${cp - 1})">\u25c0</button>`;
  for (let i = Math.max(0, cp - 2); i < Math.min(tp, cp + 3); i++) {
    html += `<button class="btn btn-sm ${i === cp ? 'btn-gold' : 'btn-outline'}" onclick="window.goPage(${i})">${i + 1}</button>`;
  }
  if (cp < tp - 1) html += `<button class="btn btn-sm btn-outline" onclick="window.goPage(${cp + 1})">\u25b6</button>`;
  pag.innerHTML = html;
}

function goPage(p) {
  setCurrentPage(p);
  renderList();
  document.getElementById('listPanel')?.scrollTo(0, 0);
}
window.goPage = goPage;

// ---------------------------------------------------------------------------
// Select lead — render detail panel
// ---------------------------------------------------------------------------
function selectLead(id) {
  const l = findLead(id);
  if (!l) return;
  setSelectedLead(l);
  renderList();

  const panel = document.getElementById('detailPanel');
  const lang = LANG_MAP[l.lingua] || 'en';
  const apps = APP_MAP[l.paese] || ['whatsapp', 'email', 'sms'];
  const phone = (l.telefono || '').replace(/[\s\-\(\)]/g, '');
  const lid = l.id; // lead id for onclick handlers
  const lidStr = typeof lid === 'string' ? `'${lid}'` : lid;

  const statusOptions = STATUS_OPTIONS.map(s =>
    `<option value="${s.value}" ${l.status === s.value ? 'selected' : ''}>${s.label}</option>`
  ).join('');

  panel.innerHTML = `
    <div class="detail-header">
      <div class="detail-company">${esc(l.azienda)}</div>
      <div class="detail-sub">${esc(l.citta)}, ${esc(l.paese)} &bull; ${esc(l.tipologia)}</div>
    </div>

    <!-- STATUS + FOLLOW-UP -->
    <div class="detail-section">
      <h3>Status</h3>
      <select class="status-select" onchange="window.updateStatus(${lidStr}, this.value)">${statusOptions}</select>
      <div style="display:flex;gap:8px;margin-top:8px;align-items:center;">
        <label style="font-size:12px;color:#888;white-space:nowrap;">Follow-up:</label>
        <input type="date" style="flex:1;background:#2a2a2a;border:1px solid #333;color:#e0e0e0;padding:5px 8px;border-radius:4px;font-size:12px;"
          value="${l.followUpDate || ''}" onchange="window.updateFollowUp(${lidStr}, this.value)">
        <span style="font-size:11px;color:${l.followUpDate && new Date(l.followUpDate) <= new Date() ? 'var(--red)' : '#666'};">
          ${l.followUpDate ? (new Date(l.followUpDate) <= new Date() ? 'OVERDUE!' : l.followUpDate) : 'Not set'}
        </span>
      </div>
    </div>

    <!-- ACTIVITY LOG -->
    <div class="detail-section">
      <h3>Activity Log</h3>
      <div style="max-height:150px;overflow-y:auto;margin-bottom:8px;">
        ${(l.activities || []).slice().reverse().map(a => `
          <div style="padding:4px 0;border-bottom:1px solid #222;font-size:12px;">
            <span style="color:var(--gold);">${a.date}</span>
            <span style="color:#888;margin:0 4px;">|</span>
            <span style="color:#fff;">${esc(a.action)}</span>
            ${a.note ? `<span style="color:#666;"> — ${esc(a.note)}</span>` : ''}
          </div>
        `).join('') || '<div style="color:#555;font-size:12px;">No activity yet</div>'}
      </div>
      <div style="display:flex;gap:6px;">
        <select id="actType_${lid}" style="background:#2a2a2a;border:1px solid #333;color:#e0e0e0;padding:5px;border-radius:4px;font-size:12px;">
          <option value="WA Call">WA Call</option>
          <option value="WA Call - No Answer">WA Call - No Answer</option>
          <option value="WA Message Sent">WA Message Sent</option>
          <option value="Email Sent">Email Sent</option>
          <option value="LinkedIn Connect">LinkedIn Connect</option>
          <option value="LinkedIn Message">LinkedIn Message</option>
          <option value="IG Follow">IG Follow</option>
          <option value="FB Follow">FB Follow</option>
          <option value="Reply Received">Reply Received</option>
          <option value="Address Confirmed">Address Confirmed</option>
          <option value="Sample Shipped">Sample Shipped</option>
          <option value="Sample Delivered">Sample Delivered</option>
          <option value="Tasting Scheduled">Tasting Scheduled</option>
          <option value="Tasting Done">Tasting Done</option>
          <option value="Proforma Sent">Proforma Sent</option>
          <option value="Payment Received">Payment Received</option>
          <option value="Note">Note</option>
        </select>
        <input type="text" id="actNote_${lid}" placeholder="Details..." style="flex:1;background:#2a2a2a;border:1px solid #333;color:#e0e0e0;padding:5px 8px;border-radius:4px;font-size:12px;">
        <button class="btn btn-sm btn-gold" onclick="window.logActivity(${lidStr})">Log</button>
      </div>
    </div>

    <!-- SAMPLE TRACKING -->
    <div class="detail-section">
      <h3>Sample Tracking</h3>
      <div style="display:flex;flex-direction:column;gap:4px;">
        <div style="display:flex;gap:6px;">
          <input type="text" placeholder="Tracking number" value="${esc(l.tracking?.number || '')}"
            style="flex:1;background:#2a2a2a;border:1px solid #333;color:#e0e0e0;padding:5px 8px;border-radius:4px;font-size:12px;"
            onchange="window.saveTracking(${lidStr},'number',this.value)">
          <input type="text" placeholder="Carrier (DHL, FedEx...)" value="${esc(l.tracking?.carrier || '')}"
            style="flex:1;background:#2a2a2a;border:1px solid #333;color:#e0e0e0;padding:5px 8px;border-radius:4px;font-size:12px;"
            onchange="window.saveTracking(${lidStr},'carrier',this.value)">
        </div>
        <div style="display:flex;gap:6px;">
          <input type="date" value="${l.tracking?.shipped || ''}"
            style="flex:1;background:#2a2a2a;border:1px solid #333;color:#e0e0e0;padding:5px 8px;border-radius:4px;font-size:12px;"
            onchange="window.saveTracking(${lidStr},'shipped',this.value)">
          <input type="date" value="${l.tracking?.delivery || ''}"
            style="flex:1;background:#2a2a2a;border:1px solid #333;color:#e0e0e0;padding:5px 8px;border-radius:4px;font-size:12px;"
            onchange="window.saveTracking(${lidStr},'delivery',this.value)">
        </div>
        <div style="font-size:11px;color:#666;">Shipped date | Expected delivery</div>
      </div>
    </div>

    <!-- DECISION MAKER -->
    <div class="detail-section">
      <h3>Decision Maker ${l.contacts?.length ? '(' + l.contacts.length + ')' : '<span style="color:#666;">- Add via Apollo</span>'}</h3>
      <div>
        ${(l.contacts || []).map((c, ci) => `
          <div style="background:#222;border:1px solid #333;border-radius:8px;padding:10px;margin-bottom:8px;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <div>
                <div style="font-weight:700;color:#fff;">${esc(c.name)}</div>
                <div style="font-size:12px;color:var(--gold);">${esc(c.title)}</div>
              </div>
              <button class="btn btn-sm btn-outline" onclick="window.removeContact(${lidStr},${ci})" style="color:var(--red);border-color:var(--red);">x</button>
            </div>
            <div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap;">
              ${c.email ? `<button class="action-btn btn-email" style="padding:4px 8px;font-size:11px;" onclick="window.openTemplate('email',${lidStr})">Email</button>` : ''}
              ${c.phone ? `<a href="https://wa.me/${c.phone.replace(/[^0-9]/g, '')}" target="_blank" class="action-btn btn-whatsapp" style="padding:4px 8px;font-size:11px;text-decoration:none;">WhatsApp</a>` : ''}
              ${c.linkedin ? `<a href="${c.linkedin}" target="_blank" class="action-btn" style="padding:4px 8px;font-size:11px;background:#0A66C2;color:#fff;text-decoration:none;">LinkedIn</a>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
      <div style="display:flex;gap:6px;margin-top:8px;">
        <input type="text" id="dm_name_${lid}" placeholder="Name" style="flex:1;background:#2a2a2a;border:1px solid #333;color:#e0e0e0;padding:6px 8px;border-radius:4px;font-size:12px;">
        <input type="text" id="dm_title_${lid}" placeholder="Job Title" style="flex:1;background:#2a2a2a;border:1px solid #333;color:#e0e0e0;padding:6px 8px;border-radius:4px;font-size:12px;">
      </div>
      <div style="display:flex;gap:6px;margin-top:4px;">
        <input type="text" id="dm_email_${lid}" placeholder="Email" style="flex:1;background:#2a2a2a;border:1px solid #333;color:#e0e0e0;padding:6px 8px;border-radius:4px;font-size:12px;">
        <input type="text" id="dm_phone_${lid}" placeholder="Phone" style="flex:1;background:#2a2a2a;border:1px solid #333;color:#e0e0e0;padding:6px 8px;border-radius:4px;font-size:12px;">
      </div>
      <div style="display:flex;gap:6px;margin-top:4px;">
        <input type="text" id="dm_linkedin_${lid}" placeholder="LinkedIn URL" style="flex:2;background:#2a2a2a;border:1px solid #333;color:#e0e0e0;padding:6px 8px;border-radius:4px;font-size:12px;">
        <button class="btn btn-sm btn-gold" onclick="window.addContact(${lidStr})">+ Add</button>
      </div>
    </div>

    <!-- MESSAGING ACTIONS -->
    <div class="detail-section">
      <h3>Message (${apps.join(' / ').toUpperCase()})</h3>
      <div class="actions">
        ${apps.includes('whatsapp') && phone ? `
          <button class="action-btn btn-whatsapp" onclick="window.openTemplate('whatsapp',${lidStr})">WhatsApp</button>
          <a class="action-btn btn-whatsapp-call" href="https://wa.me/${phone.replace('+', '')}" target="_blank" style="text-decoration:none;">WA Call</a>
          <a class="action-btn" style="background:#00BFA5;color:#fff;text-decoration:none;" href="https://wa.me/${phone.replace('+', '')}" target="_blank">WA Video</a>
        ` : ''}
        ${apps.includes('telegram') && phone ? `
          <button class="action-btn btn-telegram" onclick="window.openTemplate('telegram',${lidStr})">Telegram</button>
        ` : ''}
        ${apps.includes('kakao') ? `
          <a class="action-btn btn-kakao" href="https://open.kakao.com/" target="_blank" style="text-decoration:none;">KakaoTalk</a>
        ` : ''}
        ${l.email1 ? `
          <button class="action-btn btn-email" onclick="window.openTemplate('email',${lidStr})">Email</button>
        ` : ''}
        ${phone ? `
          <button class="action-btn btn-sms" onclick="window.openTemplate('sms',${lidStr})">SMS</button>
        ` : ''}
        <a class="action-btn" style="background:#00897B;color:#fff;text-decoration:none;" href="https://meet.google.com/new" target="_blank">Google Meet</a>
        <a class="action-btn" style="background:#2D8CFF;color:#fff;text-decoration:none;" href="https://zoom.us/start/videomeeting" target="_blank">Zoom</a>
        <button class="action-btn btn-script" onclick="window.openScript(${lidStr})">CALL SCRIPT</button>
      </div>
    </div>

    <!-- SOCIAL MEDIA -->
    <div class="detail-section">
      <h3>Social Media</h3>
      <div class="actions">
        <a href="${l.social?.linkedin || 'https://www.linkedin.com/search/results/companies/?keywords=' + encodeURIComponent(l.azienda)}" target="_blank"
           class="action-btn" style="background:#0A66C2;color:#fff;text-decoration:none;padding:8px 14px;">
          ${l.social?.linkedin ? 'LinkedIn' : 'LI Search'}
        </a>
        <a href="${l.social?.instagram || 'https://www.instagram.com/explore/search/keyword/?q=' + encodeURIComponent(l.azienda)}" target="_blank"
           class="action-btn" style="background:linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888);color:#fff;text-decoration:none;padding:8px 14px;">
          ${l.social?.instagram ? 'Instagram' : 'IG Search'}
        </a>
        <a href="${l.social?.facebook || 'https://www.facebook.com/search/pages/?q=' + encodeURIComponent(l.azienda)}" target="_blank"
           class="action-btn" style="background:#1877F2;color:#fff;text-decoration:none;padding:8px 14px;">
          ${l.social?.facebook ? 'Facebook' : 'FB Search'}
        </a>
        ${l.maps ? `<a href="${esc(l.maps)}" target="_blank" class="action-btn btn-maps" style="text-decoration:none;">Maps</a>` : ''}
        ${l.sito ? `<a href="${esc(l.sito)}" target="_blank" class="action-btn btn-web" style="text-decoration:none;">Web</a>` : ''}
      </div>
      <div style="margin-top:10px;display:flex;flex-direction:column;gap:4px;">
        <div style="display:flex;gap:6px;align-items:center;">
          <span style="width:24px;text-align:center;color:#0A66C2;font-weight:bold;font-size:12px;">in</span>
          <input type="text" placeholder="LinkedIn URL" value="${esc(l.social?.linkedin || '')}"
            style="flex:1;background:#2a2a2a;border:1px solid #333;color:#e0e0e0;padding:5px 8px;border-radius:4px;font-size:12px;"
            onchange="window.saveSocial(${lidStr},'linkedin',this.value)">
        </div>
        <div style="display:flex;gap:6px;align-items:center;">
          <span style="width:24px;text-align:center;color:#E4405F;font-weight:bold;font-size:12px;">IG</span>
          <input type="text" placeholder="Instagram URL" value="${esc(l.social?.instagram || '')}"
            style="flex:1;background:#2a2a2a;border:1px solid #333;color:#e0e0e0;padding:5px 8px;border-radius:4px;font-size:12px;"
            onchange="window.saveSocial(${lidStr},'instagram',this.value)">
        </div>
        <div style="display:flex;gap:6px;align-items:center;">
          <span style="width:24px;text-align:center;color:#1877F2;font-weight:bold;font-size:12px;">fb</span>
          <input type="text" placeholder="Facebook URL" value="${esc(l.social?.facebook || '')}"
            style="flex:1;background:#2a2a2a;border:1px solid #333;color:#e0e0e0;padding:5px 8px;border-radius:4px;font-size:12px;"
            onchange="window.saveSocial(${lidStr},'facebook',this.value)">
        </div>
      </div>
    </div>

    <!-- COMPANY INFO -->
    <div class="detail-section">
      <h3>Company Info</h3>
      <div class="detail-row"><span class="label">Phone</span><span class="value">${esc(l.telefono) || 'N/A'}</span></div>
      <div class="detail-row"><span class="label">Email 1</span><span class="value">${l.email1 ? `<span style="color:var(--gold);cursor:pointer;" onclick="window.openTemplate('email',${lidStr})">${esc(l.email1)}</span>` : 'N/A'}</span></div>
      ${l.email2 ? `<div class="detail-row"><span class="label">Email 2</span><span class="value"><span style="color:var(--gold);">${esc(l.email2)}</span></span></div>` : ''}
      ${l.email3 ? `<div class="detail-row"><span class="label">Email 3</span><span class="value"><span style="color:var(--gold);">${esc(l.email3)}</span></span></div>` : ''}
      <div class="detail-row"><span class="label">Address</span><span class="value">${esc(l.indirizzo) || 'N/A'}</span></div>
      <div class="detail-row"><span class="label">Website</span><span class="value">${l.sito ? `<a href="${esc(l.sito)}" target="_blank">${esc(l.sito)}</a>` : 'N/A'}</span></div>
      <div class="detail-row"><span class="label">Type</span><span class="value">${esc(l.tipologia)}</span></div>
      <div class="detail-row"><span class="label">Rating</span><span class="value">${l.rating ? '\u2605 ' + l.rating + ' (' + l.recensioni + ' reviews)' : 'N/A'}</span></div>
      <div class="detail-row"><span class="label">FOB Price</span><span class="value">\u20ac${l.fob || 3.8}</span></div>
      <div class="detail-row"><span class="label">Final Price</span><span class="value">\u20ac${l.prezzoFinale || ''}</span></div>
    </div>

    <!-- NOTES -->
    <div class="detail-section">
      <h3>Notes</h3>
      <textarea class="notes-area" placeholder="Add notes about this contact..." onchange="window.updateNotes(${lidStr}, this.value)">${esc(l.notes)}</textarea>
    </div>

    <!-- LAST CONTACT -->
    <div class="detail-section">
      <h3>Last Contact</h3>
      <input type="date" class="status-select" value="${l.lastContact || ''}" onchange="window.updateLastContact(${lidStr}, this.value)">
    </div>
  `;
}
window.selectLead = selectLead;

// ---------------------------------------------------------------------------
// Lead update functions
// ---------------------------------------------------------------------------
async function updateStatusFn(id, status) {
  const updates = { status };
  if (['wa-called', 'wa-messaged', 'emailed', 'interested', 'deal'].includes(status)) {
    updates.lastContact = new Date().toISOString().split('T')[0];
  }
  await updateLead(id, updates);
  updateStats();
  selectLead(id);
  renderList();
  showToast(`Status updated to ${status}`, 'info', 1500);
}
window.updateStatus = updateStatusFn;

async function updateNotesFn(id, notes) {
  await updateLead(id, { notes });
}
window.updateNotes = updateNotesFn;

async function updateFollowUpFn(id, date) {
  await updateLead(id, { followUpDate: date });
  selectLead(id);
  showToast(`Follow-up set for ${date}`, 'info', 1500);
}
window.updateFollowUp = updateFollowUpFn;

async function logActivityFn(leadId) {
  const actionEl = document.getElementById(`actType_${leadId}`);
  const noteEl = document.getElementById(`actNote_${leadId}`);
  if (!actionEl || !noteEl) return;

  const activity = {
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    action: actionEl.value,
    note: noteEl.value.trim(),
  };
  await addLeadActivity(leadId, activity);
  selectLead(leadId);
  showToast('Activity logged', 'success', 1500);
}
window.logActivity = logActivityFn;

async function updateLastContactFn(id, date) {
  await updateLead(id, { lastContact: date });
  selectLead(id);
}
window.updateLastContact = updateLastContactFn;

async function saveTrackingFn(leadId, field, value) {
  const lead = findLead(leadId);
  if (!lead) return;
  if (!lead.tracking) lead.tracking = {};
  lead.tracking[field] = value;
  await updateLead(leadId, { tracking: lead.tracking });
}
window.saveTracking = saveTrackingFn;

async function saveSocialFn(leadId, platform, url) {
  const lead = findLead(leadId);
  if (!lead) return;
  if (!lead.social) lead.social = {};
  lead.social[platform] = url.trim();
  await updateLead(leadId, { social: lead.social });
  selectLead(leadId);
}
window.saveSocial = saveSocialFn;

async function addContactFn(leadId) {
  const lead = findLead(leadId);
  if (!lead) return;
  const name = document.getElementById(`dm_name_${leadId}`)?.value?.trim();
  const title = document.getElementById(`dm_title_${leadId}`)?.value?.trim();
  const email = document.getElementById(`dm_email_${leadId}`)?.value?.trim();
  const phone = document.getElementById(`dm_phone_${leadId}`)?.value?.trim();
  const linkedin = document.getElementById(`dm_linkedin_${leadId}`)?.value?.trim();
  if (!name) { showToast('Name is required', 'warning'); return; }
  if (!lead.contacts) lead.contacts = [];
  lead.contacts.push({ name, title, email, phone, linkedin });
  saveToDB();
  selectLead(leadId);
  showToast('Contact added', 'success', 1500);
}
window.addContact = addContactFn;

function removeContactFn(leadId, contactIdx) {
  if (!confirm('Remove this contact?')) return;
  const lead = findLead(leadId);
  if (!lead || !lead.contacts) return;
  lead.contacts.splice(contactIdx, 1);
  saveToDB();
  selectLead(leadId);
  showToast('Contact removed', 'info', 1500);
}
window.removeContact = removeContactFn;

// ---------------------------------------------------------------------------
// Template modal
// ---------------------------------------------------------------------------
function openTemplate(channel, leadId) {
  const lead = findLead(leadId);
  if (!lead) return;
  setSelectedLead(lead);
  currentChannel = channel;
  currentTemplateType = 'first';

  const lang = LANG_MAP[lead.lingua] || 'en';
  const tpl = getTemplate(channel, 'first', lang);
  const filled = fillTemplate(tpl, lead);

  document.getElementById('modalTitle').textContent = `${channel.charAt(0).toUpperCase() + channel.slice(1)} Template`;

  // Template type tabs
  const typeTabs = document.getElementById('templateTypeTabs');
  typeTabs.innerHTML = TEMPLATE_TYPES.map(t =>
    `<button class="tab ${t === 'first' ? 'active' : ''}" onclick="window.switchTemplateType('${t}')">${TEMPLATE_TYPE_LABELS[t]}</button>`
  ).join('');

  // Language tabs
  const langTabs = document.getElementById('templateTabs');
  langTabs.innerHTML = ['en', 'es', 'fr'].map(l =>
    `<button class="tab ${l === lang ? 'active' : ''}" onclick="window.switchTemplateLang('${l}')">${l.toUpperCase()}</button>`
  ).join('');

  document.getElementById('templateText').value = filled;

  // Build URL
  if (channel === 'whatsapp') {
    const phone = (lead.telefono || '').replace(/[^0-9]/g, '');
    currentModalUrl = `https://wa.me/${phone}?text=${encodeURIComponent(filled)}`;
  } else if (channel === 'email') {
    currentEmailAddr = lead.email1 || '';
    const subject = fillTemplate(getEmailSubject('first', lang), lead);
    currentModalUrl = `mailto:${lead.email1}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(filled)}`;
  } else if (channel === 'sms') {
    const phone = (lead.telefono || '').replace(/[^0-9]/g, '');
    currentModalUrl = `sms:${phone}?body=${encodeURIComponent(filled)}`;
  } else if (channel === 'telegram') {
    currentModalUrl = `https://t.me/share/url?text=${encodeURIComponent(filled)}`;
  }

  document.getElementById('sendBtn').style.display = '';
  document.getElementById('sendBtn').textContent = channel === 'email' ? 'Send via Gmail' : 'Open App';
  document.getElementById('templateModal').classList.add('show');
}
window.openTemplate = openTemplate;

function switchTemplateType(type) {
  currentTemplateType = type;
  const lead = getSelectedLead();
  if (!lead) return;
  const lang = LANG_MAP[lead.lingua] || 'en';
  const tpl = getTemplate(currentChannel, type, lang);
  document.getElementById('templateText').value = fillTemplate(tpl, lead);

  document.querySelectorAll('#templateTypeTabs .tab').forEach(t => t.classList.remove('active'));
  event?.target?.classList?.add('active');
}
window.switchTemplateType = switchTemplateType;

function switchTemplateLang(lang) {
  const lead = getSelectedLead();
  if (!lead) return;
  const tpl = getTemplate(currentChannel, currentTemplateType, lang);
  document.getElementById('templateText').value = fillTemplate(tpl, lead);

  document.querySelectorAll('#templateTabs .tab').forEach(t => t.classList.remove('active'));
  event?.target?.classList?.add('active');
}
window.switchTemplateLang = switchTemplateLang;

function copyTemplate() {
  const text = document.getElementById('templateText').value;
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copied to clipboard', 'success', 1500);
  }).catch(() => {
    showToast('Copy failed — select and copy manually', 'warning');
  });
}
window.copyTemplate = copyTemplate;

async function sendTemplate() {
  const lead = getSelectedLead();

  // Email via Gmail Apps Script
  if (currentChannel === 'email' && GMAIL_SCRIPT_URL && GMAIL_SECRET) {
    const sendBtn = document.getElementById('sendBtn');
    const statusEl = document.getElementById('sendStatus');
    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending...';
    statusEl.style.display = 'inline';
    statusEl.style.color = '#888';
    statusEl.textContent = 'Sending via Gmail...';

    const body = document.getElementById('templateText').value;
    const subject = fillTemplate(
      getEmailSubject(currentTemplateType, LANG_MAP[lead?.lingua] || 'en'),
      lead
    );

    try {
      const res = await fetch(GMAIL_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: GMAIL_SECRET,
          to: currentEmailAddr || lead?.email1,
          subject,
          body,
        }),
      });
      const result = await res.json();

      if (result.success) {
        statusEl.style.color = 'var(--green)';
        statusEl.textContent = 'Sent from itabo.srl@gmail.com';
        sendBtn.textContent = 'Sent!';
        showToast('Email sent successfully', 'success');

        if (lead) {
          await addLeadActivity(lead.id, {
            date: new Date().toISOString().split('T')[0],
            time: new Date().toTimeString().slice(0, 5),
            action: 'email',
            note: `Email sent to ${currentEmailAddr} — ${subject}`,
          });
          if (lead.status === 'new') {
            await updateLead(lead.id, { status: 'emailed' });
          }
          selectLead(lead.id);
        }
        setTimeout(() => closeModal(), 1500);
      } else {
        throw new Error(result.error || 'Send failed');
      }
    } catch (err) {
      statusEl.style.color = 'var(--red)';
      statusEl.textContent = err.message;
      sendBtn.textContent = 'Retry';
      sendBtn.disabled = false;
      showToast(`Email failed: ${err.message}`, 'error');
    }
    return;
  }

  // For other channels: open app
  if (currentModalUrl && !currentModalUrl.startsWith('mailto:')) {
    window.open(currentModalUrl, '_blank');
    if (lead && lead.status === 'new') {
      await updateLead(lead.id, { status: 'wa-messaged' });
      selectLead(lead.id);
    }
  }
}
window.sendTemplate = sendTemplate;

function closeModal() {
  document.getElementById('templateModal')?.classList.remove('show');
  const statusEl = document.getElementById('sendStatus');
  if (statusEl) statusEl.style.display = 'none';
  const sendBtn = document.getElementById('sendBtn');
  if (sendBtn) { sendBtn.disabled = false; sendBtn.textContent = 'Open App'; }
}
window.closeModal = closeModal;

// ---------------------------------------------------------------------------
// Call Script panel
// ---------------------------------------------------------------------------
function openScript(leadId) {
  const l = findLead(leadId);
  if (!l) return;
  setSelectedLead(l);

  const country = l.paese || 'your country';
  const landedCost = (l.prezzoFinale || (l.fob + 1.5) || 5.3).toFixed(1);

  document.getElementById('scriptLeadName')?.setAttribute('textContent', l.azienda);
  if (document.getElementById('scriptLeadName'))
    document.getElementById('scriptLeadName').textContent = l.azienda;

  // Render the call script content (simplified — key sections)
  const content = document.getElementById('scriptContent');
  if (content) {
    content.innerHTML = buildScriptHTML(l, country, landedCost);
  }
  document.getElementById('scriptPanel')?.classList.add('show');
}
window.openScript = openScript;

function buildScriptHTML(l, country, landedCost) {
  return `
    <div class="script-step" id="step-prep">
      <h4>Prep — Before You Call</h4>
      <div class="quick-ref">
        <div class="quick-ref-item"><div class="qr-label">Company</div><div class="qr-value" style="font-size:14px;">${esc(l.azienda)}</div></div>
        <div class="quick-ref-item"><div class="qr-label">Country</div><div class="qr-value" style="font-size:14px;">${esc(l.paese)}</div></div>
        <div class="quick-ref-item"><div class="qr-label">Type</div><div class="qr-value" style="font-size:14px;">${esc(l.tipologia)}</div></div>
        <div class="quick-ref-item"><div class="qr-label">Rating</div><div class="qr-value">${l.rating ? '\u2605 ' + l.rating : 'N/A'}</div></div>
      </div>
    </div>

    <div class="script-step" id="step-open">
      <h4>Step 1 — Opening (10 sec)</h4>
      <div class="script-say">"Hi, this is Alessandro from ITABO in Italy.\nI'm calling because we export Italian wines\nat three-eighty per bottle.\nDo you have two minutes?"</div>
    </div>

    <div class="script-step" id="step-questions">
      <h4>Step 2 — Questions (30 sec)</h4>
      <div class="script-note">DON'T TALK. ASK. Write notes in CRM.</div>
      <div class="script-say">"Great! Quick questions:\n\n1. Do you currently import wines?\n2. Do you carry any Italian wines?\n3. What price range do your wines sell at?"</div>
    </div>

    <div class="script-step" id="step-pitch">
      <h4>Step 3 — Pitch (60 sec)</h4>
      <div class="script-say">"In ${esc(country)}, Italian wine is either too expensive\nor hard to find.\n\nITABO solves that. 8 certified wines\n— Prosecco, Primitivo, Negroamaro, Lambrusco,\nSangiovese — from three Italian producers.\n\nPrice: three-eighty per bottle. Flat.\nLanded cost in ${esc(l.citta || country)}: around ${landedCost} euro.\nYou sell at 10-15 euro = 50% margin minimum."</div>
    </div>

    <div class="script-step" id="step-sample">
      <h4>Step 4 — Sample Offer</h4>
      <div class="script-say">"I send you a free carton of 6 bottles.\nWe do a 30-minute video call tasting.\nYou decide. No cost. No obligation."</div>
    </div>

    <div class="script-step" id="step-close">
      <h4>Step 5 — Close</h4>
      <div class="script-say">"What's the best email to send you the details?\nAnd which day works for the tasting?"</div>
    </div>

    <div class="script-step" id="step-objections">
      <h4>Objection Handling</h4>
      <button class="objection-toggle" onclick="this.nextElementSibling.classList.toggle('open');this.style.borderColor=this.nextElementSibling.classList.contains('open')?'var(--gold)':''">"Not interested"</button>
      <div class="objection-answer"><div class="script-say">"If you could add certified Italian wine with 50% margin, would that be interesting? Can I send you the details just to have on file?"</div></div>
      <button class="objection-toggle" onclick="this.nextElementSibling.classList.toggle('open');this.style.borderColor=this.nextElementSibling.classList.contains('open')?'var(--gold)':''">"We already have suppliers"</button>
      <div class="objection-answer"><div class="script-say">"What are you paying? If more than 5 euro, we're saving you 25%. Worth a look?"</div></div>
      <button class="objection-toggle" onclick="this.nextElementSibling.classList.toggle('open');this.style.borderColor=this.nextElementSibling.classList.contains('open')?'var(--gold)':''">"Just send me an email"</button>
      <div class="objection-answer"><div class="script-say">"Absolutely. What's the best email? I'll include the free sample offer."</div><div class="script-note">This is NOT a rejection. 30% buy later.</div></div>
    </div>

    <div class="script-step" id="step-numbers">
      <h4>Key Numbers</h4>
      <div class="quick-ref">
        <div class="quick-ref-item"><div class="qr-label">FOB Price</div><div class="qr-value">&euro;3.80</div></div>
        <div class="quick-ref-item"><div class="qr-label">Per Carton (6)</div><div class="qr-value">&euro;22.80</div></div>
        <div class="quick-ref-item"><div class="qr-label">MOQ</div><div class="qr-value">1 pallet</div></div>
        <div class="quick-ref-item"><div class="qr-label">Pallet</div><div class="qr-value">756 bott.</div></div>
        <div class="quick-ref-item"><div class="qr-label">Pallet Value</div><div class="qr-value">~&euro;2,900</div></div>
        <div class="quick-ref-item"><div class="qr-label">Landed ${esc(country)}</div><div class="qr-value">&euro;${landedCost}</div></div>
        <div class="quick-ref-item"><div class="qr-label">Retail</div><div class="qr-value">&euro;10-15</div></div>
        <div class="quick-ref-item"><div class="qr-label">Margin</div><div class="qr-value">40-60%</div></div>
      </div>
    </div>
  `;
}

function closeScript() {
  document.getElementById('scriptPanel')?.classList.remove('show');
}
window.closeScript = closeScript;

function scrollToStep(step) {
  document.getElementById('scriptPanel')?.classList.add('show');
  const el = document.getElementById('step-' + step);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.querySelectorAll('.script-nav-btn').forEach(b => b.classList.remove('active'));
    event?.target?.classList?.add('active');
    el.classList.add('highlight');
    setTimeout(() => el.classList.remove('highlight'), 2000);
  }
}
window.scrollToStep = scrollToStep;

// ---------------------------------------------------------------------------
// Export functions
// ---------------------------------------------------------------------------
function exportFiltered() {
  const leads = getFilteredLeads();
  if (!leads.length) { showToast('No leads to export', 'warning'); return; }

  const headers = ['Company', 'Country', 'City', 'Phone', 'Email', 'Type', 'Status', 'Rating', 'Website', 'Notes'];
  const rows = leads.map(l => [l.azienda, l.paese, l.citta, l.telefono, l.email1, l.tipologia, l.status, l.rating || '', l.sito, l.notes || '']);
  const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');

  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `ITABO_leads_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  showToast(`Exported ${leads.length} leads`, 'success');
}
window.exportFiltered = exportFiltered;

function exportVCF() {
  const leads = getFilteredLeads().filter(l => l.telefono);
  if (!leads.length) { showToast('No contacts to export', 'warning'); return; }

  const vcards = leads.map(l => {
    const name = l.azienda || 'Unknown';
    return `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nORG:${name}\nTEL;TYPE=WORK:${l.telefono}\n${l.email1 ? 'EMAIL:' + l.email1 + '\n' : ''}${l.sito ? 'URL:' + l.sito + '\n' : ''}NOTE:${l.paese} - ${l.tipologia}\nEND:VCARD`;
  }).join('\n');

  const blob = new Blob([vcards], { type: 'text/vcard' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `ITABO_contacts_${getActiveCountry() || 'all'}.vcf`;
  a.click();
  showToast(`Exported ${leads.length} contacts`, 'success');
}
window.exportVCF = exportVCF;

// ---------------------------------------------------------------------------
// Reset
// ---------------------------------------------------------------------------
function resetData() {
  if (confirm('Reset all statuses and notes? This reloads fresh data.')) {
    localStorage.removeItem('itabo_crm_leads');
    location.reload();
  }
}
window.resetData = resetData;

// ---------------------------------------------------------------------------
// Toggle country bar
// ---------------------------------------------------------------------------
let countriesVisible = true;
function toggleCountries() {
  const bar = document.getElementById('countryBar');
  const btn = document.getElementById('toggleCountryBar');
  countriesVisible = !countriesVisible;
  bar.style.display = countriesVisible ? '' : 'none';
  btn.innerHTML = countriesVisible ? '&#9650;' : '&#9660;';
  btn.title = countriesVisible ? 'Hide countries' : 'Show countries';
}
window.toggleCountries = toggleCountries;

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
init();
