
const params=new URLSearchParams(location.search), id=params.get('id');
const all=window.ARTICLES||[];
const a=all.find(x=>x.id===id)||all[0];
document.title=a.title+'｜東京マンションウォッチ';

const sections=a.body.map(([t,v])=>{
  if(t==='h2') return `<h2>${v}</h2>`;
  if(t==='view') return `<div class="author-view"><strong>山口の見解</strong><p>${v}</p></div>`;
  return `<p>${v}</p>`;
}).join('');

const sourceBadge = a.sourceType || (a.sourceUrl ? "外部情報" : "実務解説");
const source = a.sourceUrl
  ? `<div class="source-box">
       <div class="source-head"><span class="trust-badge">${sourceBadge}</span><span class="checked">確認日 ${a.checkedAt||a.date}</span></div>
       <strong>情報源</strong>
       <a href="${a.sourceUrl}" target="_blank" rel="noopener">${a.sourceName} ↗</a>
       <span>事実関係は上記情報源を確認し、住宅購入・売却への影響は山口が独自に整理しています。</span>
     </div>`
  : `<div class="source-box"><div class="source-head"><span class="trust-badge">${sourceBadge}</span></div><strong>解説</strong><span>${a.sourceName}</span></div>`;

const related = all
  .filter(x=>x.id!==a.id)
  .sort((x,y)=>{
    const xc=x.category===a.category?2:0;
    const yc=y.category===a.category?2:0;
    const xt=x.tags.some(t=>a.tags.includes(t))?1:0;
    const yt=y.tags.some(t=>a.tags.includes(t))?1:0;
    return (yc+yt)-(xc+xt);
  }).slice(0,3);

document.getElementById('articleBody').innerHTML=`
  <div class="meta"><span>${a.category}</span><time>${a.date}</time></div>
  <div class="article-trust-line"><span>✓ 出典確認</span><span>✓ 山口の見解を分離</span><a href="policy.html">編集方針を見る →</a></div>
  <h1>${a.title}</h1>
  <p class="lead">${a.excerpt}</p>
  <div class="pointbox"><strong>この記事のポイント</strong><ul>${a.points.map(x=>`<li>${x}</li>`).join('')}</ul></div>
  ${sections}
  ${source}
  <h2>この記事が関係する人</h2>
  <div class="audience">${a.audience.map(x=>`<span>${x}</span>`).join('')}</div>
  <h2>関連記事</h2>
  <div class="card-grid">${related.map(x=>`<a class="article-card" href="article.html?id=${x.id}"><img src="${x.image}" alt=""><div class="pad"><span class="pill">${x.category}</span><h3>${x.title}</h3></div></a>`).join('')}</div>
`;

const canonical='https://agent-insight.github.io/tokyo-mansion-watch/article.html?id='+encodeURIComponent(a.id);
let d=document.querySelector('meta[name="description"]'); if(d)d.setAttribute('content',a.excerpt);
let c=document.querySelector('link[rel="canonical"]'); if(c)c.setAttribute('href',canonical);
