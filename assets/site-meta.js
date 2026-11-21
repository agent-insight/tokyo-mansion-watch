window.TMW_SITE_META = {
  version: "90",
  updatedAt: "2026-11-22",
  updatedLabel: "2026年11月22日"
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