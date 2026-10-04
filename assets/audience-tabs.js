(() => {
  const buttons=[...document.querySelectorAll('[data-audience-tab]')];
  const panels=[...document.querySelectorAll('[data-audience-panel]')];
  if(!buttons.length) return;

  function show(key){
    buttons.forEach(b=>b.classList.toggle('active',b.dataset.audienceTab===key));
    panels.forEach(p=>p.classList.toggle('active',p.dataset.audiencePanel===key));
    try{ localStorage.setItem('tmw_audience',key); }catch(e){}
    if(typeof gtag==='function') gtag('event','audience_dashboard_select',{audience:key});
  }
  buttons.forEach(b=>b.addEventListener('click',()=>show(b.dataset.audienceTab)));

  try{
    const saved=localStorage.getItem('tmw_audience');
    if(saved && buttons.some(b=>b.dataset.audienceTab===saved)) show(saved);
  }catch(e){}
})();