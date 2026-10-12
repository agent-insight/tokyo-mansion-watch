window.TMW_SITE_META = {
  version: "50",
  updatedAt: "2026-10-11",
  updatedLabel: "2026年10月11日"
};

(() => {
  const meta = window.TMW_SITE_META || {};
  document.querySelectorAll('[data-site-updated]').forEach(el => {
    el.textContent = meta.updatedLabel || meta.updatedAt || '';
  });
  document.querySelectorAll('[data-site-version]').forEach(el => {
    el.textContent = meta.version ? 'Ver.' + meta.version : '';
  });
})();