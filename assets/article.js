
const params=new URLSearchParams(location.search), id=params.get('id');
const all=(window.ARTICLES||[]).slice().sort((a,b)=>b.date.localeCompare(a.date));
const a=all.find(x=>x.id===id)||all[0];
document.title=a.title+'｜東京マンションウォッチ';
const canonical='https://agent-insight.github.io/tokyo-mansion-watch/article.html?id='+encodeURIComponent(a.id);

function estimateReadingMinutes(article){
  const text=[article.title,article.excerpt,...(article.points||[]),...(article.body||[]).map(x=>x[1]||'')].join('');
  return Math.max(2, Math.ceil(text.length/500));
}
function escapeHtml(s){ return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }



function articleContentType(a){
  const tags=a.tags||[];
  if(tags.includes('比較')) return '比較';
  if(a.category==='東京23区マンション市況' || tags.includes('REINS')) return '市況';
  if(a.category==='住宅ローン') return 'ローン';
  if(a.category==='売却・住み替え') return '売却';
  if(tags.includes('単身者向け') || tags.includes('単身')) return '単身';
  return '保存版';
}

function freshnessBadge(a){
  if(!window.TMW_GOV) return '';
  const f=window.TMW_GOV.freshnessFor(a);
  if(f.type==='evergreen') return '';
  const checked=window.TMW_GOV.formatChecked(a);
  return `<span class="freshness-badge ${f.type}">${f.label}${checked?` ${checked}`:''}</span>`;
}

function freshnessNotice(a){
  if(!window.TMW_GOV) return '';
  const f=window.TMW_GOV.freshnessFor(a);
  if(f.type==='stale' || f.type==='review'){
    return `<div class="freshness-notice ${f.type}"><strong>${f.label}</strong><span>最新の市況・金利・制度は更新情報もあわせてご確認ください。</span><a href="${a.category==='住宅ローン'?'rules.html':'brief.html'}">最新情報を見る →</a></div>`;
  }
  return '';
}

function naturalizeText(text){
  let s=String(text||'');
  // 固い「です。」の連続を避け、雑誌・コラムに近いリズムへ。
  s=s.replace(/ことが重要です。/g,'ことが重要。');
  s=s.replace(/のが基本です。/g,'のが基本。');
  s=s.replace(/が強みです。/g,'が強み。');
  s=s.replace(/がポイントです。/g,'がポイント。');
  s=s.replace(/という選択肢です。/g,'という選択肢。');
  s=s.replace(/という状況です。/g,'という状況。');
  s=s.replace(/という数字です。/g,'という数字。');
  s=s.replace(/([0-9０-９A-Za-z一-龠ぁ-んァ-ヶ％%㎡円万億・（）()／〜～\-]+)です。$/,'$1。');
  s=s.replace(/整理します。$/,'整理してみます。');
  s=s.replace(/解説します。$/,'見ていきます。');
  return s;
}

function voiceIntro(article){
  const tags=article.tags||[];
  if(tags.includes('大井町')){
    return '大井町は、私自身が住み替え先として選んだ街です。数字だけでは分からない使いやすさもありますし、逆に「ここは物件ごとの差が大きい」と感じるところもあります。今回は仲介の現場で見る順番に沿って整理します。';
  }
  if(article.category==='住宅ローン'){
    return '住宅ローンの相談では、「結局どれを選べばいいですか？」とよく聞かれます。金利だけなら比較は簡単ですが、実際は年齢、借入期間、手元資金、将来の売却まで入れると答えが変わります。ここでは普段の面談で私が確認している順番で見ていきます。';
  }
  if(article.category==='東京23区市況'){
    return '市況の数字は毎月見ていますが、平均価格だけで「上がった・下がった」と判断すると少し危険です。成約件数、在庫、実際の成約単価を一緒に見た方が、現場の感覚に近くなります。';
  }
  if(tags.some(t=>['湾岸','勝どき','晴海','豊洲','月島','タワーマンション'].includes(t))){
    return '湾岸の物件は、同じマンションでも階数・方角・眺望で価格差が大きく出ます。案内のときも「エリア平均」より、まず棟内の競合住戸を見ます。今回もその目線で整理します。';
  }
  if(article.category==='売却・住み替え'){
    return '売却相談で一番よくお伝えするのは、「高く出すこと」と「高く売れること」は別、という点です。査定額だけではなく、反響や競合、次の住まいまで含めて考えます。';
  }
  return '不動産は、数字だけを並べても判断しづらいことが多いです。この記事では、私がお客様に説明するときと同じように「結局どこを見るのか」を中心にまとめます。';
}

let h2Index=0;
const sections=(a.body||[]).map(([t,v])=>{
  if(t==='h2'){
    h2Index++;
    const heading=v==='エージェント山口の見解'?'現場ではこう見ています':v;
    return `<h2 id="toc-${h2Index}">${heading}</h2>`;
  }
  if(t==='view') return `<div class="author-view human-view"><strong>${a.viewLabel || '私ならこう見ます'}</strong><p>${naturalizeText(v)}</p></div>`;
  if(t==='table' && v && Array.isArray(v.headers) && Array.isArray(v.rows)){
    return `<div class="table-wrap article-inline-table"><table class="comparison-table"><thead><tr>${v.headers.map(c=>`<th>${escapeHtml(c)}</th>`).join('')}</tr></thead><tbody>${v.rows.map(row=>`<tr>${row.map((c,i)=>i===0?`<th>${escapeHtml(c)}</th>`:`<td>${escapeHtml(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  return `<p>${naturalizeText(v)}</p>`;
}).join('');

const sourceBadge=a.sourceType||(a.sourceUrl?"外部情報":"実務解説");
const source=(Array.isArray(a.sources) && a.sources.length)
  ? `<details class="source-box human-source">
       <summary>参考資料</summary>
       <div class="source-list">${a.sources.map(s=>`<div class="source-list-item"><a href="${s.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(s.name)} ↗</a>${s.note?`<span>${escapeHtml(s.note)}</span>`:''}</div>`).join('')}</div>
       <span>確認：${a.checkedAt||a.date}</span>
     </details>`
  : (a.sourceUrl
      ? `<details class="source-box human-source">
           <summary>参考資料</summary>
           <a href="${a.sourceUrl}" target="_blank" rel="noopener noreferrer">${a.sourceName} ↗</a>
           <span>確認：${a.checkedAt||a.date}</span>
         </details>`
      : '');

const related=all.filter(x=>x.id!==a.id).map(x=>{
  let score=(x.category===a.category?3:0);
  score+=(x.tags||[]).filter(t=>(a.tags||[]).includes(t)).length;
  return {x,score};
}).sort((p,q)=>q.score-p.score || q.x.date.localeCompare(p.x.date)).slice(0,3).map(o=>o.x);

const idx=all.findIndex(x=>x.id===a.id);
const newer=idx>0?all[idx-1]:null;
const older=idx<all.length-1?all[idx+1]:null;

const summary3=(a.summary3||a.points||[]).slice(0,3);
const readingMinutes=estimateReadingMinutes(a);
const tocItems=(a.body||[]).filter(x=>x[0]==='h2').map((x,i)=>({title:x[1],id:'toc-'+(i+1)}));
const metrics=a.metrics||[];
const comparison=a.comparison||[];
const updateLog=a.updateLog||[[a.date,"記事公開"]];


const clusterContext = (a.tags||[]).includes("大井町")
  ? `<div class="cluster-context"><strong>大井町をまとめて読む</strong><a href="topic-oimachi.html">大井町マンション完全ガイド →</a></div>`
  : ((a.tags||[]).includes("50年ローン")
      ? `<div class="cluster-context"><strong>50年ローンをまとめて読む</strong><a href="topic-50year.html">50年住宅ローン完全ガイド →</a></div>`
      : '');

const usefulTools=[];
if(a.category==='住宅ローン' || (a.tags||[]).some(t=>['住宅ローン','50年ローン','35年ローン','金利1%','金利1.5%','金利2%'].includes(t))){
  usefulTools.push({href:'tools/mortgage-calculator/',title:'住宅ローン返済シミュレーター',desc:'月々返済・総利息・5年/10年/15年後の残債を計算'});
}
if(a.category==='東京23区市況' || (a.tags||[]).some(t=>['東京23区','REINS','市況','坪単価'].includes(t))){
  usefulTools.push({href:'market-data.html',title:'東京23区・中古マンション市況データ',desc:'成約件数・成約㎡単価・在庫を定点観測'});
}
const usefulToolsHtml=usefulTools.length ? `<aside class="article-useful-tools"><strong>関連ツール・データ</strong>${usefulTools.map(t=>`<a href="${t.href}"><b>${t.title}</b><span>${t.desc}</span></a>`).join('')}</aside>` : '';

const topicInternalLinks=[];
if((a.tags||[]).includes('大井町')) topicInternalLinks.push({href:'topic-oimachi.html',text:'大井町マンション完全ガイド'});
if((a.tags||[]).includes('50年ローン') || a.category==='住宅ローン') topicInternalLinks.push({href:'topic-50year.html',text:'50年住宅ローン完全ガイド'});
if((a.tags||[]).some(t=>['湾岸','勝どき','晴海','豊洲','月島','タワーマンション'].includes(t))) topicInternalLinks.push({href:'area-bay.html',text:'湾岸タワマンガイド'});
if((a.tags||[]).some(t=>['品川区','大崎','五反田','品川シーサイド'].includes(t))) topicInternalLinks.push({href:'area-shinagawa.html',text:'品川区マンションガイド'});
if((a.tags||[]).some(t=>['目黒区','中目黒','祐天寺','都立大学','学芸大学'].includes(t))) topicInternalLinks.push({href:'area-meguro.html',text:'目黒区マンションガイド'});
const topicInternalHtml=topicInternalLinks.length ? `<div class="in-article-links"><span>あわせて読む</span>${topicInternalLinks.slice(0,3).map(x=>`<a href="${x.href}">${x.text} →</a>`).join('')}</div>` : '';

const summaryHtml = summary3.length ? `
  <section class="summary3">
    <div class="summary3-title">先に要点だけ</div>
    <ol>${summary3.map(x=>`<li>${x}</li>`).join('')}</ol>
  </section>` : '';

const tocHtml=tocItems.length>=3 ? `
  <nav class="article-toc" aria-label="記事の目次">
    <div class="toc-title">この記事の目次</div>
    <ol>${tocItems.map(x=>`<li><a href="#${x.id}">${x.title}</a></li>`).join('')}</ol>
  </nav>` : '';

const metricsHtml = metrics.length ? `
  <section class="number-section">
    <h2>まず押さえたい数字</h2>
    <div class="number-grid">
      ${metrics.map(m=>`<div class="number-card"><small>${escapeHtml(m.label)}</small><strong>${escapeHtml(m.value)}</strong><span>${escapeHtml(m.note||'')}</span></div>`).join('')}
    </div>
  </section>` : '';

const comparisonHtml = comparison.length>1 ? `
  <section class="comparison-section">
    <h2>並べるとこうなります</h2>
    <div class="table-wrap"><table class="comparison-table">
      <thead><tr>${comparison[0].map(c=>`<th>${escapeHtml(c)}</th>`).join('')}</tr></thead>
      <tbody>${comparison.slice(1).map(row=>`<tr>${row.map((c,i)=>i===0?`<th>${escapeHtml(c)}</th>`:`<td>${escapeHtml(c)}</td>`).join('')}</tr>`).join('')}</tbody>
    </table></div>
  </section>` : '';

const updatesHtml = updateLog.length>1 ? `
  <details class="update-section compact-update">
    <summary>この記事の更新履歴</summary>
    <div class="update-list">${updateLog.map(([d,t])=>`<div><time>${escapeHtml(d)}</time><span>${escapeHtml(t)}</span></div>`).join('')}</div>
  </details>` : '';

const tagsHtml = `
  <div class="article-tags compact-tags">
    <div class="chips">${(a.tags||[]).map(t=>`<a href="search.html?q=${encodeURIComponent(t)}">${escapeHtml(t)}</a>`).join('')}</div>
  </div>`;

document.getElementById('articleBody').innerHTML=`
  <div class="breadcrumb"><a href="index.html">トップ</a><span>›</span><a href="category.html?cat=${encodeURIComponent(a.category)}">${a.category}</a></div>
  <div class="meta"><span>${a.category}</span><time>${a.date}</time></div>
  <h1>${a.title}</h1>
  <img class="article-hero-image" fetchpriority="high" decoding="async" src="${a.image||'assets/thumb-market.jpg'}" alt="${a.title}" onerror="this.src='assets/thumb-market.jpg'">
  <div class="article-datebar"><span>${a.date}</span><span>約${readingMinutes}分</span>${freshnessBadge(a)}</div>
  ${freshnessNotice(a)}
  <p class="lead">${naturalizeText(a.excerpt)}</p>
  <div class="author-intro-note"><span>山口より</span><p>${a.openingNote || voiceIntro(a)}</p></div>
  ${clusterContext}
  ${summaryHtml}
  ${usefulToolsHtml}
  ${tocHtml}
  ${metricsHtml}
  ${sections}
  ${topicInternalHtml}
  ${comparisonHtml}
  ${source}
  <section class="share-section">
    <h2>共有する</h2>
    <div class="share-buttons">
      <a href="https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(canonical)}" target="_blank" rel="noopener noreferrer">LINE</a>
      <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(a.title)}&url=${encodeURIComponent(canonical)}" target="_blank" rel="noopener noreferrer">X</a>
      <button id="copyUrlBtn" type="button">URLをコピー</button>
    </div>
  </section>
  ${tagsHtml}
  ${updatesHtml}
  <section class="related-section">
    <h2>関連記事</h2>
    <div class="card-grid">${related.map(x=>`<a class="article-card" href="article.html?id=${x.id}"><img loading="lazy" decoding="async" src="${x.image||'assets/thumb-market.jpg'}" alt="${x.category||'記事画像'}" onerror="this.src='assets/thumb-market.jpg'"><div class="pad"><span class="pill">${x.category}</span><h3>${x.title}</h3></div></a>`).join('')}</div>
  </section>
  <section class="more-links">
    <h2>もっと読む</h2>
    <div class="more-link-grid">
      <a href="category.html?cat=${encodeURIComponent(a.category)}">${a.category}の記事をもっと見る →</a>
      <a href="all-articles.html">全記事一覧 →</a>
      <a href="faq.html">よくある質問 →</a>
      <a href="contact.html">購入・売却を相談する →</a>
    </div>
  </section>
  <nav class="prevnext">
    ${newer?`<a href="article.html?id=${newer.id}"><small>← 新しい記事</small><span>${newer.title}</span></a>`:'<span></span>'}
    ${older?`<a href="article.html?id=${older.id}"><small>前の記事 →</small><span>${older.title}</span></a>`:'<span></span>'}
  </nav>
`;

let d=document.querySelector('meta[name="description"]'); if(d)d.setAttribute('content',a.excerpt);
let c=document.querySelector('link[rel="canonical"]'); if(c)c.setAttribute('href',canonical);

const articleLd={
  "@context":"https://schema.org",
  "@type":"Article",
  "headline":a.title,
  "description":a.excerpt,
  "datePublished":String(a.date||"").replace(/\./g,"-"),
  "dateModified":String(a.checkedAt||a.date||"").replace(/\./g,"-"),
  "inLanguage":"ja-JP",
  "mainEntityOfPage":canonical,
  "image":new URL(a.image||"assets/thumb-market.jpg", location.href).href,
  "author":{"@type":"Person","name":"山口 功記","url":"https://agent-insight.github.io/tokyo-mansion-watch/profile.html"},
  "publisher":{"@type":"Organization","name":"東京マンションウォッチ"}
};
const ld=document.createElement('script');
ld.type='application/ld+json';
ld.textContent=JSON.stringify(articleLd);
document.head.appendChild(ld);

document.getElementById('copyUrlBtn')?.addEventListener('click',async function(){
  try{
    await navigator.clipboard.writeText(canonical);
    this.textContent='コピーしました';
    setTimeout(()=>this.textContent='URLをコピー',1500);
  }catch(e){
    prompt('URLをコピーしてください',canonical);
  }
});

function setMetaProperty(prop, content){
  let el=document.querySelector(`meta[property="${prop}"]`);
  if(!el){el=document.createElement('meta');el.setAttribute('property',prop);document.head.appendChild(el);}
  el.setAttribute('content',content);
}
setMetaProperty('og:title',a.title+'｜東京マンションウォッチ');
setMetaProperty('og:description',a.excerpt);
setMetaProperty('og:url',canonical);
setMetaProperty('og:image',new URL(a.image||'assets/thumb-market.jpg',location.href).href);

const breadcrumbLd={
  "@context":"https://schema.org",
  "@type":"BreadcrumbList",
  "itemListElement":[
    {"@type":"ListItem","position":1,"name":"トップ","item":"https://agent-insight.github.io/tokyo-mansion-watch/"},
    {"@type":"ListItem","position":2,"name":a.category,"item":"https://agent-insight.github.io/tokyo-mansion-watch/category.html?cat="+encodeURIComponent(a.category)},
    {"@type":"ListItem","position":3,"name":a.title,"item":canonical}
  ]
};
const bld=document.createElement('script');
bld.type='application/ld+json';
bld.textContent=JSON.stringify(breadcrumbLd);
document.head.appendChild(bld);
