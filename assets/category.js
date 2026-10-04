
const params=new URLSearchParams(location.search), cat=params.get('cat')||'東京23区マンション市況';
document.getElementById('pageTitle').textContent=cat;
const list=(window.ARTICLES||[]).filter(a=>a.category===cat);
document.getElementById('list').innerHTML=list.length?list.map(a=>`<a class="article-card" href="article.html?id=${a.id}"><img src="${a.image}" alt=""><div class="pad"><div class="date">${a.date}</div><h3>${a.title}</h3><p>${a.excerpt}</p></div></a>`).join(''):'<p>記事はこれから追加されます。</p>';
