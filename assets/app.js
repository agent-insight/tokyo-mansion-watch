
const A = window.ARTICLES || [];
function card(a){
  return `<a class="article-card" href="article.html?id=${encodeURIComponent(a.id)}">
    <img src="${a.image}" alt="">
    <div class="pad">
      <span class="pill">${a.category}</span>
      <div class="date">${a.date}</div>
      <h3>${a.title}</h3>
      <p>${a.excerpt}</p>
    </div>
  </a>`;
}
const featured = document.getElementById('featuredGrid');
if(featured) featured.innerHTML = A.slice(0,4).map(card).join('');
function go(q){ location.href = q.trim() ? 'search.html?q='+encodeURIComponent(q.trim()) : 'search.html'; }
document.getElementById('searchButton')?.addEventListener('click',()=>go(document.getElementById('searchInput').value));
document.getElementById('searchInput')?.addEventListener('keydown',e=>{if(e.key==='Enter')go(e.target.value)});
document.getElementById('sideSearchButton')?.addEventListener('click',()=>go(document.getElementById('sideSearch').value));
document.getElementById('sideSearch')?.addEventListener('keydown',e=>{if(e.key==='Enter')go(e.target.value)});
