
const params=new URLSearchParams(location.search), initial=params.get('q')||'';
const q=document.getElementById('q'); q.value=initial;
function run(){
  const s=q.value.trim().toLowerCase();
  if(s) history.replaceState(null,'','search.html?q='+encodeURIComponent(q.value.trim()));
  const list=(window.ARTICLES||[]).filter(a=>!s || [a.title,a.category,a.excerpt,...a.tags].join(' ').toLowerCase().includes(s));
  document.getElementById('pageTitle').textContent=s?`「${q.value.trim()}」の検索結果`:'すべての記事';
  document.getElementById('list').innerHTML=list.length?list.map(a=>`<a class="article-card" href="article.html?id=${a.id}"><img src="${a.image}" alt=""><div class="pad"><span class="pill">${a.category}</span><div class="date">${a.date}</div><h3>${a.title}</h3><p>${a.excerpt}</p></div></a>`).join(''):'<p>該当する記事がありません。</p>';
}
document.getElementById('go').onclick=run; q.addEventListener('keydown',e=>{if(e.key==='Enter')run()}); run();
