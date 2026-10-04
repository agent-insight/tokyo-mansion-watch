(() => {
  const $ = id => document.getElementById(id);
  const q = new URLSearchParams(location.search);
  const amountMan = Math.max(100, Math.min(100000, Number(q.get('amount')) || 10000));
  const rate = Math.max(0, Math.min(10, Number(q.get('rate')) || 1));
  const years = Math.max(1, Math.min(50, Math.round(Number(q.get('years')) || 50)));
  const start = /^\d{4}-\d{2}$/.test(q.get('start')||'') ? q.get('start') : '2026-10';

  const P=amountMan*10000, n=years*12, r=rate/100/12;

  function monthly(P,r,n){
    if(r===0) return P/n;
    const x=Math.pow(1+r,n);
    return P*r*x/(x-1);
  }
  function yen(v){ return Math.round(v).toLocaleString('ja-JP')+'円'; }
  function compact(v){
    const m=v/10000;
    if(m>=10000) return (m/10000).toLocaleString('ja-JP',{maximumFractionDigits:2})+'億円';
    return Math.round(m).toLocaleString('ja-JP')+'万円';
  }
  function ym(offset){
    const [yy,mm]=start.split('-').map(Number);
    const d=new Date(Date.UTC(yy,mm-1+offset,1));
    return `${d.getUTCFullYear()}年${String(d.getUTCMonth()+1).padStart(2,'0')}月`;
  }

  const pay=monthly(P,r,n);
  let bal=P,totalInterest=0;
  const rows=[];
  for(let i=1;i<=n;i++){
    const interest=r===0?0:bal*r;
    let principalPay=pay-interest;
    let actual=pay;
    if(i===n || principalPay>bal){ principalPay=bal; actual=principalPay+interest; }
    bal=Math.max(0,bal-principalPay);
    totalInterest+=interest;
    rows.push({no:i,date:ym(i-1),year:Math.ceil(i/12),payment:actual,principal:principalPay,interest,balance:bal});
  }

  const annual=[];
  for(let y=1;y<=years;y++){
    const yr=rows.filter(x=>x.year===y);
    annual.push({
      year:y,
      payment:yr.reduce((a,b)=>a+b.payment,0),
      principal:yr.reduce((a,b)=>a+b.principal,0),
      interest:yr.reduce((a,b)=>a+b.interest,0),
      balance:yr[yr.length-1].balance
    });
  }

  $('sumPrincipal').textContent=compact(P);
  $('sumRate').textContent=rate.toFixed(2)+'%';
  $('sumYears').textContent=years+'年';
  $('sumMonthly').textContent=compact(pay)+'/月';
  $('sumInterest').textContent=compact(totalInterest);
  $('pdfConditions').textContent=`借入 ${compact(P)} ／ 年利 ${rate.toFixed(2)}% ／ ${years}年 ／ 返済開始 ${start.replace('-','年')}月`;
  $('createdAt').textContent=new Date().toLocaleDateString('ja-JP');

  const params=new URLSearchParams({amount:String(amountMan),rate:String(rate),years:String(years),start});
  $('backToCalculator').href='../mortgage-calculator/?'+params.toString();

  const filter=$('scheduleYearFilter');
  for(let y=1;y<=years;y++){
    const o=document.createElement('option');
    o.value=String(y);
    o.textContent=`${y}年目（${rows[(y-1)*12].date.slice(0,5)}〜）`;
    filter.appendChild(o);
  }

  function renderAnnual(){
    $('annualBody').innerHTML=annual.map(a=>`
      <tr><th>${a.year}年目</th><td>${yen(a.payment)}</td><td>${yen(a.principal)}</td><td>${yen(a.interest)}</td><td><strong>${yen(a.balance)}</strong></td></tr>
    `).join('');
  }

  function renderMonthly(){
    const v=filter.value;
    const shown=v==='all'?rows:rows.filter(x=>x.year===Number(v));
    $('scheduleCount').textContent=shown.length.toLocaleString('ja-JP')+'回分';
    $('scheduleBody').innerHTML=shown.map(x=>`
      <tr><td>${x.no}</td><td>${x.date}</td><td>${yen(x.payment)}</td><td>${yen(x.principal)}</td><td>${yen(x.interest)}</td><td><strong>${yen(x.balance)}</strong></td></tr>
    `).join('');
  }

  function renderBars(){
    const max=Math.max(...annual.map(a=>a.payment),1);
    const step=years>30?5:years>15?2:1;
    const sample=annual.filter(a=>a.year===1||a.year===years||a.year%step===0);
    $('scheduleBars').innerHTML=sample.map(a=>{
      const ph=Math.max(1,(a.principal/max)*100);
      const ih=Math.max(1,(a.interest/max)*100);
      return `<div class="schedule-bar-item">
        <div class="schedule-bar-stack">
          <span class="principal-part" style="height:${ph}%"></span>
          <span class="interest-part" style="height:${ih}%"></span>
        </div><small>${a.year}年</small></div>`;
    }).join('');
  }

  function printMode(mode){
    document.body.classList.remove('print-summary','print-detail');
    document.body.classList.add(mode==='summary'?'print-summary':'print-detail');
    if(typeof gtag==='function') gtag('event','mortgage_schedule_pdf',{mode,amount_man:amountMan,rate,years});
    setTimeout(()=>window.print(),100);
  }
  window.addEventListener('afterprint',()=>document.body.classList.remove('print-summary','print-detail'));

  $('pdfSummary').addEventListener('click',()=>printMode('summary'));
  $('pdfDetail').addEventListener('click',()=>printMode('detail'));
  filter.addEventListener('change',renderMonthly);

  $('downloadCsv').addEventListener('click',()=>{
    const csvRows=[['回','年月','返済額','元金返済額','利息返済額','借入残高']];
    rows.forEach(x=>csvRows.push([x.no,x.date,Math.round(x.payment),Math.round(x.principal),Math.round(x.interest),Math.round(x.balance)]));
    const blob=new Blob(['\uFEFF'+csvRows.map(r=>r.join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'});
    const url=URL.createObjectURL(blob), a=document.createElement('a');
    a.href=url; a.download=`住宅ローン返済予定表_${amountMan}万円_${rate}%_${years}年.csv`;
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    if(typeof gtag==='function') gtag('event','mortgage_schedule_csv',{amount_man:amountMan,rate,years});
  });

  renderAnnual(); renderMonthly(); renderBars();
})();