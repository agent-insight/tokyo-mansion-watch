
const params=new URLSearchParams(location.search), id=params.get('id');
const a=(window.ARTICLES||[]).find(x=>x.id===id)||(window.ARTICLES||[])[0];
document.title=a.title+'｜東京マンションウォッチ';
const sections=a.body.map(([t,v])=>{
  if(t==='h2') return `<h2>${v}</h2>`;
  if(t==='view') return `<div class="author-view"><strong>山口の見解</strong><p>${v}</p></div>`;
  return `<p>${v}</p>`;
}).join('');
document.getElementById('articleBody').innerHTML=`
  <div class="meta"><span>${a.category}</span><time>${a.date}</time></div>
  <h1>${a.title}</h1>
  <p class="lead">${a.excerpt}</p>
  <div class="pointbox"><strong>この記事のポイント</strong><ul>${a.points.map(x=>`<li>${x}</li>`).join('')}</ul></div>
  ${sections}
  <h2>この記事が関係する人</h2><div class="audience">${a.audience.map(x=>`<span>${x}</span>`).join('')}</div>
  <h2>関連記事</h2>
  <div class="card-grid">${(window.ARTICLES||[]).filter(x=>x.id!==a.id).slice(0,3).map(x=>`<a class="article-card" href="article.html?id=${x.id}"><img src="${x.image}" alt=""><div class="pad"><span class="pill">${x.category}</span><h3>${x.title}</h3></div></a>`).join('')}</div>
`;

// SEO metadata for each article
if (a) {
  const canonical = 'https://agent-insight.github.io/tokyo-mansion-watch/article.html?id=' + encodeURIComponent(a.id);
  document.title = a.title + '｜東京マンションウォッチ';
  let d = document.querySelector('meta[name="description"]');
  if(d) d.setAttribute('content', a.excerpt);
  let c = document.querySelector('link[rel="canonical"]');
  if(c) c.setAttribute('href', canonical);
  const ogt=document.querySelector('meta[property="og:title"]'); if(ogt) ogt.setAttribute('content',a.title);
  const ogd=document.querySelector('meta[property="og:description"]'); if(ogd) ogd.setAttribute('content',a.excerpt);
  const ogu=document.querySelector('meta[property="og:url"]'); if(ogu) ogu.setAttribute('content',canonical);
  const ld=document.createElement('script'); ld.type='application/ld+json';
  ld.textContent=JSON.stringify({
    "@context":"https://schema.org","@type":"Article","headline":a.title,"datePublished":a.date,
    "author":{"@type":"Person","name":"山口 功記"},
    "publisher":{"@type":"Organization","name":"東京マンションウォッチ"},
    "mainEntityOfPage":canonical,"description":a.excerpt
  });
  document.head.appendChild(ld);
}
