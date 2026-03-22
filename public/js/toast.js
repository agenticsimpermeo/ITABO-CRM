// ==================== ITABO CRM — Toast Notification System ====================
// Lightweight toast notifications for user feedback.

let _container = null;

function getContainer() {
  if (_container) return _container;
  _container = document.createElement('div');
  _container.id = 'toast-container';
  _container.style.cssText = `
    position:fixed; top:80px; right:20px; z-index:9999;
    display:flex; flex-direction:column; gap:8px;
    pointer-events:none;
  `;
  document.body.appendChild(_container);
  return _container;
}

/**
 * Show a toast notification.
 * @param {string} message - Text to display
 * @param {'success'|'error'|'warning'|'info'} type - Toast type
 * @param {number} duration - Auto-dismiss in ms (default 3000)
 */
export function showToast(message, type = 'info', duration = 3000) {
  const container = getContainer();

  const colors = {
    success: { bg: 'rgba(76,175,80,0.95)', border: '#4CAF50' },
    error:   { bg: 'rgba(244,67,54,0.95)', border: '#f44336' },
    warning: { bg: 'rgba(255,152,0,0.95)', border: '#FF9800' },
    info:    { bg: 'rgba(33,150,243,0.95)', border: '#2196F3' },
  };
  const c = colors[type] || colors.info;

  const icons = { success: '\u2713', error: '\u2717', warning: '\u26A0', info: '\u2139' };

  const toast = document.createElement('div');
  toast.style.cssText = `
    background:${c.bg}; border:1px solid ${c.border}; border-radius:8px;
    padding:12px 20px; color:#fff; font-size:14px; font-weight:500;
    box-shadow:0 4px 12px rgba(0,0,0,0.4); pointer-events:auto;
    display:flex; align-items:center; gap:8px; cursor:pointer;
    opacity:0; transform:translateX(40px); transition:all 0.3s ease;
    max-width:380px;
  `;
  toast.innerHTML = `<span style="font-size:18px;">${icons[type] || ''}</span><span>${escapeHtml(message)}</span>`;
  toast.onclick = () => dismiss(toast);

  container.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0)';
  });

  // Auto dismiss
  if (duration > 0) {
    setTimeout(() => dismiss(toast), duration);
  }

  return toast;
}

function dismiss(toast) {
  toast.style.opacity = '0';
  toast.style.transform = 'translateX(40px)';
  setTimeout(() => toast.remove(), 300);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
