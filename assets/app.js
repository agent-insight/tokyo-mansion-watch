
const A = window.ARTICLES || [];
function card(a){
  return `<a class="article-card" href="article.html?id=${encodeURIComponent(a.id)}">
    <img loading="lazy" decoding="async" src="${a.image||'assets/thumb-market.jpg'}" alt="${a.category||'記事画像'}" onerror="this.src='assets/thumb-market.jpg'">
    <div class="pad">
      <div class="card-meta-line">
        <span class="pill">${a.category}</span>
        ${a.date>='2026.10.04'?'<span class="new-badge">NEW</span>':''}
      </div>
      <div class="date">${a.date}</div>
      <h3>${a.title}</h3>
      <p>${a.excerpt}</p>
    </div>
  </a>`;
}
const featured = document.getElementById('featuredGrid');
if(featured){
  const priorityIds=(window.TMW_RANKING&&window.TMW_RANKING.featured)||['single-50year-invest','loan-variable-vs-fixed','budget-8000-oimachi-vs-osaki','area-kachidoki-vs-harumi'];
  const featuredItems=priorityIds.map(id=>A.find(x=>x.id===id)).filter(Boolean);
  featured.innerHTML=featuredItems.map(card).join('');
}

const news = document.getElementById('latestNewsGrid');
if(news){
  const latestItems=[...A].sort((a,b)=>{
    const da=String(a.date||'').replaceAll('.','-');
    const db=String(b.date||'').replaceAll('.','-');
    return db.localeCompare(da);
  }).slice(0,6);
  news.innerHTML = latestItems.map(a=>`
  <a class="news-row" href="article.html?id=${encodeURIComponent(a.id)}">
    <div class="news-date">${a.date}</div>
    <div class="news-cat">${a.category}</div>
    <div class="news-title">${a.title}</div>
    <div class="news-arrow">→</div>
  </a>`).join('');
}

function go(q){ const term=q.trim(); if(term&&window.trackSearch) window.trackSearch(term); location.href = term ? 'search.html?q='+encodeURIComponent(term) : 'search.html'; }
document.getElementById('searchButton')?.addEventListener('click',()=>go(document.getElementById('searchInput').value));
document.getElementById('searchInput')?.addEventListener('keydown',e=>{if(e.key==='Enter')go(e.target.value)});
document.getElementById('sideSearchButton')?.addEventListener('click',()=>go(document.getElementById('sideSearch').value));
document.getElementById('sideSearch')?.addEventListener('keydown',e=>{if(e.key==='Enter')go(e.target.value)});

const ranking=document.getElementById('rankingGrid');
if(ranking){
  const picks=[
    A.find(x=>x.id==='boj-125-mortgage'),
    A.find(x=>x.id==='loan-50'),
    A.find(x=>x.id==='oi-west-e-2026'),
    A.find(x=>x.id==='second-opinion'),
    A.find(x=>x.id==='tokyo23-used-price-rent-aug')
  ].filter(Boolean);
  ranking.innerHTML=picks.map((a,i)=>`
    <a class="ranking-card" href="article.html?id=${a.id}">
      <span class="rank-no">${i+1}</span>
      <div><small>${a.category}</small><strong>${a.title}</strong></div>
      <b>→</b>
    </a>`).join('');
}
