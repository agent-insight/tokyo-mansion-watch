(() => {
  const b=(window.TMW_BRIEFS||[])[0];
  const root=document.getElementById('clientShareContent');
  if(!b||!root) return;
  root.innerHTML=`
    <div class="client-share-meta"><span>${b.label}</span><span>${b.readTime}</span>${b.verified?'<b>主要数値は公式確認済</b>':''}</div>
    <div class="client-share-headline"><strong>${b.headline}</strong><p>${b.intro}</p></div>
    <div class="client-share-grid">
      ${b.items.map(i=>`
        <article>
          <div class="client-share-rank">${i.rank}</div>
          <span class="client-share-type">${i.type}</span>
          <h2>${i.title}</h2>
          <p>${i.text}</p>
          <div class="client-share-view"><b>エージェント山口の見解</b><span>${i.yamaguchi}</span></div>
          <a href="${i.href}">${i.linkText}</a>
        </article>`).join('')}
    </div>`;
})();