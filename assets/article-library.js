(() => {
  const A = window.ARTICLES || window.articles || [];
  const grid=document.getElementById('articleLibraryGrid');
  const count=document.getElementById('articleCount');
  const q=document.getElementById('articleQuickSearch');
  const sort=document.getElementById('articleSort');
  let filter='all';

  function typeOf(a){
    const tags=a.tags||[];
    if(tags.includes('比較')) return 'compare';
    if(a.category==='東京23区マンション市況' || tags.includes('REINS')) return 'market';
    if(a.category==='住宅ローン') return 'loan';
    if(tags.includes('単身者向け') || tags.includes('単身')) return 'single';
    if(a.category==='売却・住み替え') return 'sell';
    if(tags.some(t=>['大井町','品川区','目黒区','湾岸','勝どき','晴海','豊洲','大崎','五反田'].includes(t))) return 'area';
    return 'evergreen';
  }
  function labelOf(t){
    return ({compare:'比較',evergreen:'保存版',market:'市況',loan:'ローン',single:'単身',sell:'売却',area:'エリア'})[t]||'記事';
  }
  function freshness(a){
    if(!window.TMW_GOV) return '';
    const f=window.TMW_GOV.freshnessFor(a);
    if(f.type==='fresh') return '<span class="mini-fresh fresh">確認済</span>';
    if(f.type==='review') return '<span class="mini-fresh review">再確認推奨</span>';
    if(f.type==='stale') return '<span class="mini-fresh stale">更新待ち</span>';
    return '';
  }
  function render(){
    const query=(q.value||'').trim().toLowerCase();
    let items=A.filter(a=>{
      const t=typeOf(a);
      const matchFilter=filter==='all'||t===filter;
      const hay=[a.title,a.category,...(a.tags||[])].join(' ').toLowerCase();
      return matchFilter && (!query || hay.includes(query));
    });
    if(sort.value==='title') items.sort((a,b)=>a.title.localeCompare(b.title,'ja'));
    else items.sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));

    count.textContent=items.length;
    grid.innerHTML=items.map(a=>{
      const t=typeOf(a);
      return `<a class="article-library-card" href="article.html?id=${encodeURIComponent(a.id)}">
        <div class="article-library-meta"><span>${labelOf(t)}</span>${freshness(a)}</div>
        <strong>${a.title}</strong>
        <p>${a.excerpt||''}</p>
        <div class="article-library-foot"><span>${a.date||''}</span><b>読む →</b></div>
      </a>`;
    }).join('');
  }

  document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{
    document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));
    filter=b.dataset.filter; render();
    if(typeof gtag==='function') gtag('event','article_library_filter',{filter});
  }));
  q.addEventListener('input',render);
  sort.addEventListener('change',render);
  render();
})();