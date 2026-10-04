
const TERASS_EMAIL = "YOUR_TERASS_EMAIL@example.com";

document.getElementById('contactForm').addEventListener('submit', function(e){
  e.preventDefault();
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

  window.location.href=`mailto:${TERASS_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
