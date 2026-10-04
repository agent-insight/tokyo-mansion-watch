(() => {
  const KEY='tmw_last_seen_v1';
  const now=new Date();
  const current=now.toISOString();
  let previous=null;
  try{ previous=localStorage.getItem(KEY); }catch(e){}

  window.TMW_VISIT = {
    previous,
    firstVisit: !previous,
    isNew(dateStr){
      if(!dateStr) return false;
      if(!previous) return false;
      const d=new Date(dateStr+'T23:59:59+09:00');
      const p=new Date(previous);
      return d>p;
    }
  };

  const status=document.querySelector('[data-visit-status]');
  if(status){
    if(!previous){
      status.innerHTML='<strong>はじめての方へ</strong><span>まずは「3分ウォッチ」からどうぞ。</span>';
    }else{
      const p=new Date(previous);
      const fmt=new Intl.DateTimeFormat('ja-JP',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'});
      status.innerHTML='<strong>前回訪問 '+fmt.format(p)+'</strong><span>それ以降の更新をNEW表示します。</span>';
    }
  }

  document.querySelectorAll('[data-update-date]').forEach(el=>{
    const d=el.getAttribute('data-update-date');
    if(window.TMW_VISIT.isNew(d)){
      el.classList.add('is-new-since-visit');
      if(!el.querySelector('.visit-new-badge')){
        const b=document.createElement('span');
        b.className='visit-new-badge';
        b.textContent='NEW';
        el.prepend(b);
      }
    }
  });

  // Do not mark seen immediately: allow a meaningful visit.
  setTimeout(()=>{
    try{ localStorage.setItem(KEY,current); }catch(e){}
  },8000);
})();