(() => {
  function shareUrl(el){
    const explicit=el?.dataset?.shareUrl;
    if(explicit) return new URL(explicit, location.href).href;
    return location.href;
  }
  function shareTitle(el){
    return el?.dataset?.shareTitle || document.title.replace(/\s*｜.*$/,'');
  }
  async function copyUrl(el){
    const url=shareUrl(el);
    try{
      await navigator.clipboard.writeText(url);
      return true;
    }catch(e){
      const ta=document.createElement('textarea');
      ta.value=url; ta.setAttribute('readonly','');
      ta.style.position='absolute'; ta.style.left='-9999px';
      document.body.appendChild(ta); ta.select();
      let ok=false;
      try{ ok=document.execCommand('copy'); }catch(err){}
      ta.remove(); return ok;
    }
  }
  function flash(btn,text){
    const old=btn.textContent;
    btn.textContent=text;
    btn.classList.add('is-done');
    setTimeout(()=>{btn.textContent=old;btn.classList.remove('is-done');},1400);
  }
  document.addEventListener('click',async e=>{
    const copy=e.target.closest('[data-copy-page-url]');
    if(copy){
      e.preventDefault();
      const ok=await copyUrl(copy);
      flash(copy,ok?'コピーしました':'コピーできませんでした');
      if(typeof gtag==='function') gtag('event','share_url_copy',{page_location:shareUrl(copy)});
      return;
    }
    const x=e.target.closest('[data-share-x]');
    if(x){
      e.preventDefault();
      const url=shareUrl(x), title=shareTitle(x);
      const intent='https://twitter.com/intent/tweet?text='+encodeURIComponent(title)+'&url='+encodeURIComponent(url);
      window.open(intent,'_blank','noopener,noreferrer');
      if(typeof gtag==='function') gtag('event','share_x_click',{page_location:url});
    }
  });
})();