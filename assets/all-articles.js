
const all = (window.ARTICLES||[]).slice().sort((a,b)=>b.date.localeCompare(a.date));
const box=document.getElementById('allArticlesList');
let current='all';

function render(){
  const rows=all.filter(a=>current==='all'||a.category===current);
  box.innerHTML=rows.map(a=>`
    <a class="all-article-row" href="article.html?id=${encodeURIComponent(a.id)}">
      <img src="${a.image||'assets/thumb-market.jpg'}" alt="${a.category||'記事画像'}" onerror="this.src='assets/thumb-market.jpg'">
      <div class="all-article-copy">
        <div class="all-article-meta">
          <span>${a.category}</span>
          <time>${a.date}</time>
          ${a.sourceType?`<b>${a.sourceType}</b>`:''}
        </div>
        <h2>${a.title}</h2>
        <p>${a.excerpt}</p>
        <div class="mini-tags">${(a.tags||[]).slice(0,4).map(t=>`<i>${t}</i>`).join('')}</div>
      </div>
      <div class="all-arrow">→</div>
    </a>`).join('');
}
document.querySelectorAll('.filter-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.filter-btn').forEach(x=>x.classList.remove('active'));
    btn.classList.add('active');
    current=btn.dataset.cat;
    render();
  });
});
render();
