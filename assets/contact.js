const TERASS_EMAIL = "kouki.yamaguchi@terass.com";

function consultationDraft(){
  const name=document.getElementById('name').value.trim();
  const topic=document.getElementById('topic').value;
  const property=document.getElementById('property').value.trim();
  const message=document.getElementById('message').value.trim();
  const subject=`【東京マンションウォッチ】${topic}のご相談${name?`／${name}様`:''}`;
  const body=[
    `お名前：${name||'未入力'}`,
    `ご相談内容：${topic}`,
    `希望エリア・物件名：${property||'未入力'}`,
    '',
    '【ご相談内容】',
    message||'未入力',
    '',
    '東京マンションウォッチからのお問い合わせ'
  ].join('\n');
  return {subject,body};
}

const form=document.getElementById('contactForm');
const actions=document.createElement('div');
actions.className='contact-mail-options';
actions.style.cssText='display:flex;flex-wrap:wrap;gap:10px;margin-top:12px';
actions.innerHTML='<button type="button" id="gmailContact" style="flex:1;min-width:180px;padding:12px;border:1px solid #d4dfe9;border-radius:10px;background:#fff;color:#173a5c;font-weight:700;cursor:pointer">Gmailでメールを作成</button><button type="button" id="copyContact" style="flex:1;min-width:180px;padding:12px;border:1px solid #d4dfe9;border-radius:10px;background:#fff;color:#173a5c;font-weight:700;cursor:pointer">メール内容をコピー</button>';
form.appendChild(actions);
const note=document.createElement('p');
note.style.cssText='font-size:12px;color:#536779;margin-top:10px';
note.textContent='メールアプリが開かない場合は「Gmailでメールを作成」をお試しください。Gmailへのログインが必要です。いずれも送信前に内容を確認できます。';
form.appendChild(note);
document.getElementById('gmailContact').addEventListener('click',()=>{
  const {subject,body}=consultationDraft();
  const url='https://mail.google.com/mail/?view=cm&fs=1&to='+encodeURIComponent(TERASS_EMAIL)+'&su='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  window.open(url,'_blank','noopener,noreferrer');
});
document.getElementById('copyContact').addEventListener('click',async()=>{
  const {subject,body}=consultationDraft();
  const text='宛先：'+TERASS_EMAIL+'\n件名：'+subject+'\n\n'+body;
  try{await navigator.clipboard.writeText(text);note.textContent='メールの内容をコピーしました。Gmailなどに貼り付けて送信してください。';}
  catch(_){note.textContent='コピーできませんでした。ブラウザの権限設定をご確認ください。';}
});
form.addEventListener('submit',e=>{
  e.preventDefault();
  const {subject,body}=consultationDraft();
  window.location.href='mailto:'+TERASS_EMAIL+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
});
