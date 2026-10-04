(() => {
  const KEY='tmw_topic_scores_v1';
  const LAST='tmw_recent_articles_v1';
  const TOPICS=['single','loan','market','sell','area','compare'];

  function read(key, fallback){
    try{ return JSON.parse(localStorage.getItem(key)||'null') || fallback; }catch(e){ return fallback; }
  }
  function write(key,val){
    try{ localStorage.setItem(key,JSON.stringify(val)); }catch(e){}
  }
  function scores(){ return read(KEY,{}); }
  function add(topic, amount=1){
    if(!topic || !TOPICS.includes(topic)) return;
    const s=scores(); s[topic]=(s[topic]||0)+amount; write(KEY,s);
  }

  function inferFromUrl(){
    const path=location.pathname;
    const q=new URLSearchParams(location.search);
    if(path.endsWith('/single.html')||path.endsWith('/single')) return 'single';
    if(path.includes('market-data')) return 'market';
    if(path.includes('mortgage')||path.includes('topic-50year')) return 'loan';
    if(path.includes('area-')) return 'area';
    if(path.includes('for-you')) return null;
    if(path.includes('article')){
      const id=q.get('id')||'';
      if(id.includes('single')) return 'single';
      if(id.includes('loan')||id.includes('rate')) return 'loan';
      if(id.includes('sell')) return 'sell';
      if(id.includes('area-')||id.includes('oimachi')||id.includes('bay')) return 'area';
      if(id.includes('-vs-')) return 'compare';
      if(id.includes('market')) return 'market';
    }
    return null;
  }

  const topic=inferFromUrl();
  if(topic) add(topic,.5);

  document.addEventListener('click',e=>{
    const a=e.target.closest('a');
    if(!a) return;
    const t=a.dataset.topic;
    if(t) add(t,1);
    const href=a.getAttribute('href')||'';
    if(href.includes('single')) add('single',.5);
    if(href.includes('mortgage')||href.includes('50year')||href.includes('loan')) add('loan',.5);
    if(href.includes('market')) add('market',.5);
    if(href.includes('sell')) add('sell',.5);
    if(href.includes('area-')) add('area',.5);
    if(href.includes('-vs-')) add('compare',.25);
  },{passive:true});

  function topTopic(){
    const s=scores();
    return Object.keys(s).sort((a,b)=>(s[b]||0)-(s[a]||0))[0] || null;
  }

  const labels={
    single:['単身購入','single.html','一人で買う人向けの記事をまとめて見る →'],
    loan:['住宅ローン','topic-50year.html','ローン・50年返済をまとめて見る →'],
    market:['マンション市況','market-data.html','最新市況データを見る →'],
    sell:['売却・住み替え','category.html?cat=売却・住み替え','売却・住み替えの記事を見る →'],
    area:['エリア比較','topics.html','エリア別の記事を見る →'],
    compare:['比較記事','all-articles.html','比較記事をまとめて見る →']
  };

  const box=document.querySelector('[data-personalized-box]');
  const t=topTopic();
  if(box && t && labels[t]){
    const [label,href,text]=labels[t];
    box.hidden=false;
    box.innerHTML=`<div><span>YOUR INTEREST</span><strong>${label}をよく見ています</strong><p>この端末での閲覧傾向から、関連情報を近くに表示しています。</p></div><a href="${href}" data-topic="${t}">${text}</a>`;
  }

  // Reorder cards tagged with data-topic inside smart containers.
  document.querySelectorAll('[data-smart-container]').forEach(container=>{
    const s=scores();
    const children=[...container.children];
    children.sort((a,b)=>{
      const ta=a.dataset.topic||'', tb=b.dataset.topic||'';
      return (s[tb]||0)-(s[ta]||0);
    });
    children.forEach(c=>container.appendChild(c));
  });

  window.TMW_PERSONAL={scores,add,topTopic};
})();