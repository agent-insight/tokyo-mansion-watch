
const params=new URLSearchParams(location.search), id=params.get('id');
const all=(window.ARTICLES||[]).slice().sort((a,b)=>b.date.localeCompare(a.date));
const a=all.find(x=>x.id===id)||all[0];
document.title=a.title+'｜東京マンションウォッチ';

function escapeHtml(s){ return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

const sections=(a.body||[]).map(([t,v])=>{
  if(t==='h2') return `<h2>${v}</h2>`;
  if(t==='view') return `<div class="author-view"><div class="view-label">YAMAGUCHI VIEW</div><strong>山口の見解</strong><p>${v}</p></div>`;
  return `<p>${v}</p>`;
}).join('');

const sourceBadge=a.sourceType||(a.sourceUrl?"外部情報":"実務解説");
const source=a.sourceUrl
  ? `<div class="source-box">
       <div class="source-head"><span class="trust-badge">${sourceBadge}</span><span class="checked">確認日 ${a.checkedAt||a.date}</span></div>
       <strong>情報源</strong>
       <a href="${a.sourceUrl}" target="_blank" rel="noopener">${a.sourceName} ↗</a>
       <span>事実関係は上記情報源を確認し、住宅購入・売却への影響は山口が独自に整理しています。</span>
     </div>`
  : `<div class="source-box"><div class="source-head"><span class="trust-badge">${sourceBadge}</span></div><strong>解説</strong><span>${a.sourceName}</span></div>`;

const related=all.filter(x=>x.id!==a.id).map(x=>{
  let score=(x.category===a.category?3:0);
  score+=(x.tags||[]).filter(t=>(a.tags||[]).includes(t)).length;
  return {x,score};
}).sort((p,q)=>q.score-p.score || q.x.date.localeCompare(p.x.date)).slice(0,3).map(o=>o.x);

const idx=all.findIndex(x=>x.id===a.id);
const newer=idx>0?all[idx-1]:null;
const older=idx<all.length-1?all[idx+1]:null;

const summary3=(a.summary3||a.points||[]).slice(0,3);
const metrics=a.metrics||[];
const comparison=a.comparison||[];
const updateLog=a.updateLog||[[a.date,"記事公開"]];

const summaryHtml = summary3.length ? `
  <section class="summary3">
    <div class="summary3-title"><span>3</span> この記事を3行で</div>
    <ol>${summary3.map(x=>`<li>${x}</li>`).join('')}</ol>
  </section>` : '';

const metricsHtml = metrics.length ? `
  <section class="number-section">
    <h2>重要な数字</h2>
    <div class="number-grid">
      ${metrics.map(m=>`<div class="number-card"><small>${escapeHtml(m.label)}</small><strong>${escapeHtml(m.value)}</strong><span>${escapeHtml(m.note||'')}</span></div>`).join('')}
    </div>
  </section>` : '';

const comparisonHtml = comparison.length>1 ? `
  <section class="comparison-section">
    <h2>比較して見る</h2>
    <div class="table-wrap"><table class="comparison-table">
      <thead><tr>${comparison[0].map(c=>`<th>${escapeHtml(c)}</th>`).join('')}</tr></thead>
      <tbody>${comparison.slice(1).map(row=>`<tr>${row.map((c,i)=>i===0?`<th>${escapeHtml(c)}</th>`:`<td>${escapeHtml(c)}</td>`).join('')}</tr>`).join('')}</tbody>
    </table></div>
  </section>` : '';

const updatesHtml = `
  <section class="update-section">
    <h2>更新履歴</h2>
    <div class="update-list">${updateLog.map(([d,t])=>`<div><time>${escapeHtml(d)}</time><span>${escapeHtml(t)}</span></div>`).join('')}</div>
  </section>`;

const tagsHtml = `
  <section class="article-tags">
    <h2>関連キーワード</h2>
    <div class="chips">${(a.tags||[]).map(t=>`<a href="search.html?q=${encodeURIComponent(t)}">${escapeHtml(t)}</a>`).join('')}</div>
  </section>`;

document.getElementById('articleBody').innerHTML=`
  <div class="breadcrumb"><a href="index.html">トップ</a><span>›</span><a href="category.html?cat=${encodeURIComponent(a.category)}">${a.category}</a></div>
  <div class="meta"><span>${a.category}</span><time>${a.date}</time></div>
  <h1>${a.title}</h1>
  <div class="article-datebar"><span>公開 ${a.date}</span><span>情報確認 ${a.checkedAt||a.date}</span></div>
  <div class="article-trust-line"><span>✓ 出典確認</span><span>✓ 事実と見解を分離</span><a href="policy.html">編集方針を見る →</a></div>
  <p class="lead">${a.excerpt}</p>
  ${summaryHtml}
  <div class="pointbox"><strong>この記事のポイント</strong><ul>${(a.points||[]).map(x=>`<li>${x}</li>`).join('')}</ul></div>
  ${metricsHtml}
  ${sections}
  ${comparisonHtml}
  ${source}
  <h2>この記事が関係する人</h2>
  <div class="audience">${(a.audience||[]).map(x=>`<span>${x}</span>`).join('')}</div>
  ${tagsHtml}
  ${updatesHtml}
  <section class="related-section">
    <h2>関連記事</h2>
    <div class="card-grid">${related.map(x=>`<a class="article-card" href="article.html?id=${x.id}"><img src="${x.image}" alt=""><div class="pad"><span class="pill">${x.category}</span><h3>${x.title}</h3></div></a>`).join('')}</div>
  </section>
  <nav class="prevnext">
    ${newer?`<a href="article.html?id=${newer.id}"><small>← 新しい記事</small><span>${newer.title}</span></a>`:'<span></span>'}
    ${older?`<a href="article.html?id=${older.id}"><small>前の記事 →</small><span>${older.title}</span></a>`:'<span></span>'}
  </nav>
`;

const canonical='https://agent-insight.github.io/tokyo-mansion-watch/article.html?id='+encodeURIComponent(a.id);
let d=document.querySelector('meta[name="description"]'); if(d)d.setAttribute('content',a.excerpt);
let c=document.querySelector('link[rel="canonical"]'); if(c)c.setAttribute('href',canonical);
