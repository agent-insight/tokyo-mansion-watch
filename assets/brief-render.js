(() => {
  const briefs=window.TMW_BRIEFS||[];
  if(!briefs.length) return;
  const latest=briefs[0];

  const $=id=>document.getElementById(id);
  if($('briefUpdated')) $('briefUpdated').textContent='最終更新：'+latest.label;
  if($('briefReadTime')) $('briefReadTime').textContent='読む時間：'+latest.readTime;
  if($('briefHeadline')) $('briefHeadline').textContent=latest.headline;
  if($('briefIntro')) $('briefIntro').textContent=latest.intro;
  if($('briefVerified')) $('briefVerified').style.display=latest.verified?'inline-flex':'none';

  const grid=$('briefThree');
  if(grid){
    grid.innerHTML=latest.items.map(i=>`
      <article data-topic="${i.topic}">
        <div class="brief-index">${i.rank}</div>
        <div class="brief-tag">${i.type}</div>
        <h3>${i.title}</h3>
        <p>${i.text}</p>
        <div class="brief-yamaguchi"><b>エージェント山口の見解</b><span>${i.yamaguchi}</span></div>
        <a href="${i.href}" data-smart-link data-topic="${i.topic}">${i.linkText}</a>
      </article>`).join('');
  }

  const archive=document.getElementById('briefArchiveList');
  if(archive){
    archive.innerHTML=briefs.map((b,idx)=>`
      <article class="brief-archive-item ${idx===0?'current':''}">
        <div><time>${b.label}</time>${idx===0?'<span>最新</span>':''}</div>
        <strong>${b.headline}</strong>
        <p>${b.items.map(x=>x.type).join('・')}</p>
        <a href="brief.html${idx===0?'':'?date='+encodeURIComponent(b.id)}">${idx===0?'読む →':'過去版を見る →'}</a>
      </article>`).join('');
  }
})();