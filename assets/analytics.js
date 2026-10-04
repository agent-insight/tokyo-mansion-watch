(function(){
  const GA_ID='G-HZMQ3B6MT1';
  if(typeof window.gtag !== 'function'){
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ dataLayer.push(arguments); };
    const ga=document.createElement('script');
    ga.async=true;
    ga.src='https://www.googletagmanager.com/gtag/js?id='+GA_ID;
    document.head.appendChild(ga);
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
  }



  function send(name, params){
    if(typeof window.gtag === 'function'){
      window.gtag('event', name, params || {});
    }
  }

  document.addEventListener('click', function(e){
    const a=e.target.closest('a');
    if(!a) return;
    const href=a.getAttribute('href')||'';
    const text=(a.textContent||'').trim().slice(0,80);

    if(a.dataset && a.dataset.officialSource){
      send('official_source_click',{source:a.dataset.officialSource,link_url:href,page_location:location.href});
    }else if(href.includes('tools/mortgage-calculator/')){
      send('mortgage_tool_click',{link_text:text,link_url:href,page_location:location.href});
    }else if(href.includes('line.me/')){
      send('line_contact_click',{link_text:text,page_location:location.href});
    }else if(href==='contact.html' || href.endsWith('/contact.html')){
      send('contact_page_click',{link_text:text,page_location:location.href});
    }else if(href.startsWith('article.html')){
      send('article_click',{link_text:text,link_url:href,page_location:location.href});
    }else if(href.startsWith('category.html')){
      send('category_click',{link_text:text,link_url:href});
    }else if(href.startsWith('area-')){
      send('area_hub_click',{link_text:text,link_url:href});
    }
  });

  window.trackSearch=function(term){
    send('site_search',{search_term:term,page_location:location.href});
  };
})();
