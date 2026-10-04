(() => {
  const input=document.getElementById('publisherInput');
  const status=document.getElementById('publisherStatus');
  const preview=document.getElementById('publisherPreview');
  const line=document.getElementById('publisherLine');
  const mail=document.getElementById('publisherMail');
  const mailSubject=document.getElementById('publisherMailSubject');
  const instagram=document.getElementById('publisherInstagram');
  const code=document.getElementById('publisherCode');

  const checks=['checkPrimary','checkDate','checkFactOpinion','checkNoHype'].map(id=>document.getElementById(id));

  function normalizeObjectText(raw){
    let s=raw.trim();
    s=s.replace(/^```(?:js|javascript)?\s*/i,'').replace(/```$/,'').trim();
    if(s.endsWith(',')) s=s.slice(0,-1);
    return s;
  }

  function parseObject(raw){
    const s=normalizeObjectText(raw);
    if(!s) throw new Error('入力が空です');
    try{
      return Function('"use strict";return ('+s+')')();
    }catch(e){
      throw new Error('JavaScriptオブジェクトとして読み取れません');
    }
  }

  function validate(obj){
    const errors=[];
    ['id','date','label','headline','intro','items'].forEach(k=>{
      if(obj[k]===undefined || obj[k]===null || obj[k]==='') errors.push(`${k} がありません`);
    });
    if(!Array.isArray(obj.items) || obj.items.length<1) errors.push('items がありません');
    if(Array.isArray(obj.items)){
      obj.items.forEach((it,i)=>{
        ['rank','type','title','text','yamaguchi','href','linkText','topic'].forEach(k=>{
          if(!it[k]) errors.push(`items[${i}].${k} がありません`);
        });
      });
    }
    return errors;
  }

  function esc(s){
    return String(s??'').replace(/[&<>"']/g,c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }

  function render(obj){
    preview.className='publisher-preview';
    preview.innerHTML=`
      <div class="pub-preview-meta"><span>${esc(obj.label)}</span><span>${esc(obj.readTime||'約3分')}</span>${obj.verified?'<b>公式確認済</b>':''}</div>
      <h2>${esc(obj.headline)}</h2>
      <p>${esc(obj.intro)}</p>
      <div class="pub-preview-grid">
        ${(obj.items||[]).map(it=>`
          <article>
            <span>${esc(it.rank)} / ${esc(it.type)}</span>
            <strong>${esc(it.title)}</strong>
            <p>${esc(it.text)}</p>
            <div><b>エージェント山口の見解</b>${esc(it.yamaguchi)}</div>
          </article>`).join('')}
      </div>`;
  }

  function makeLine(obj){
    const items=(obj.items||[]).map(it=>`■ ${it.title}
${it.text}

エージェント山口の見解：${it.yamaguchi}`).join('

');
    return `こんにちは、TERASSの山口です😊

今週のマンション・住宅ローン情報を、重要な3点だけまとめました。

${items}

詳しい内容は「東京マンションウォッチ」の3分ウォッチにまとめています。
気になる物件や住宅ローンについては、このLINEにそのままご返信ください。`;
  }

  function makeMailSubject(obj){
    const d=(obj.label||'今週').replace(/年|月/g,'/').replace('日','');
    return `【${d}】東京マンションウォッチ｜今週の重要3点`;
  }

  function makeMail(obj){
    const items=(obj.items||[]).map((it,i)=>`${i+1}. ${it.title}
${it.text}

エージェント山口の見解
${it.yamaguchi}`).join('

');
    return `こんにちは、TERASSの山口です。

今週の東京マンション市場・住宅ローンについて、購入や売却を考えるうえで押さえておきたいポイントを3つに絞りました。

${items}

細かい数字や背景は「東京マンションウォッチ」の3分ウォッチにまとめています。
ご自身の予算や候補物件に当てはめて確認したい場合は、このメールにそのままご返信ください。

TERASS
不動産エージェント 山口功記`;
  }

  function makeInstagram(obj){
    const points=(obj.items||[]).map(it=>`・${it.title}`).join('
');
    const view=(obj.items||[]).map(it=>it.yamaguchi).filter(Boolean)[0]||'';
    return `【今週の東京マンション 3分ウォッチ】

${obj.headline}

今週はこの3点。
${points}

エージェント山口の見解
${view}

数字だけで判断せず、物件ごとの価格妥当性・ローン・将来売却までセットで見るのが大切です。

あとで見返せるように保存がおすすめです。

#東京マンション #中古マンション #住宅ローン #不動産購入 #マンション購入`;
  }

  function makeCode(obj){
    return JSON.stringify(obj,null,2)+',';
  }

  function run(){
    try{
      const obj=parseObject(input.value);
      const errors=validate(obj);
      if(errors.length){
        status.className='publisher-status error';
        status.innerHTML='<strong>確認が必要です</strong><span>'+errors.slice(0,8).join(' / ')+'</span>';
        preview.className='publisher-preview-empty';
        preview.textContent='不足項目を直すとプレビューできます。';
        line.value='';
        code.value='';
        return;
      }
      status.className='publisher-status ok';
      status.innerHTML='<strong>形式OK</strong><span>次にファクトチェック4項目を確認してください。</span>';
      render(obj);
      line.value=makeLine(obj);
      if(mailSubject) mailSubject.value=makeMailSubject(obj);
      if(mail) mail.value=makeMail(obj);
      if(instagram) instagram.value=makeInstagram(obj);
      code.value=makeCode(obj);
    }catch(e){
      status.className='publisher-status error';
      status.innerHTML='<strong>読み取りエラー</strong><span>'+esc(e.message)+'</span>';
    }
  }

  async function copyText(el,btn){
    if(!el.value) return;
    try{
      await navigator.clipboard.writeText(el.value);
      const old=btn.textContent; btn.textContent='コピーしました';
      setTimeout(()=>btn.textContent=old,1200);
    }catch(e){
      el.select(); document.execCommand('copy');
    }
  }

  document.getElementById('publisherValidate').addEventListener('click',run);
  document.getElementById('copyLine').addEventListener('click',e=>copyText(line,e.currentTarget));
  document.getElementById('copyMail').addEventListener('click',e=>copyText(mail,e.currentTarget));
  document.getElementById('copyMailSubject').addEventListener('click',e=>copyText(mailSubject,e.currentTarget));
  document.getElementById('copyInstagram').addEventListener('click',e=>copyText(instagram,e.currentTarget));
  document.getElementById('copyCode').addEventListener('click',e=>copyText(code,e.currentTarget));

  document.querySelectorAll('[data-channel-tab]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const key=btn.dataset.channelTab;
      document.querySelectorAll('[data-channel-tab]').forEach(b=>b.classList.toggle('active',b===btn));
      document.querySelectorAll('[data-channel-panel]').forEach(p=>p.classList.toggle('active',p.dataset.channelPanel===key));
    });
  });
  document.getElementById('publisherClear').addEventListener('click',()=>{
    input.value=''; line.value=''; if(mail) mail.value=''; if(mailSubject) mailSubject.value=''; if(instagram) instagram.value=''; code.value=''; preview.className='publisher-preview-empty'; preview.textContent='形式確認後に表示されます。'; status.innerHTML='';
    checks.forEach(c=>c.checked=false);
  });
  document.getElementById('publisherSample').addEventListener('click',()=>{
    input.value=`{
  id:"2026-10-12",
  date:"2026-10-12",
  label:"2026年10月12日",
  readTime:"約3分",
  headline:"今週の変化を一言で。",
  intro:"重要な変化だけを短く整理します。",
  verified:true,
  items:[
    {
      rank:"01",
      type:"住宅ローン",
      title:"例：金利の変更",
      text:"確認できた事実をここに。",
      yamaguchi:"実務ではこう見ます。",
      href:"rules.html",
      linkText:"詳しく見る →",
      topic:"loan"
    }
  ]
}`;
    run();
  });

  checks.forEach(c=>c.addEventListener('change',()=>{
    const all=checks.every(x=>x.checked);
    if(all && status.classList.contains('ok')){
      status.innerHTML='<strong>公開前チェック完了</strong><span>コードを brief-data.js の先頭へ追加できます。</span>';
    }
  }));
})();