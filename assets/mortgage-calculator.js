(() => {
  const $ = (id) => document.getElementById(id);
  const form = $('mortgageForm');
  if (!form) return;

  // 返済期間は1年刻みで1〜50年
  const yearsSelect = $('loanYears');
  if (yearsSelect && !yearsSelect.options.length) {
    for (let y = 1; y <= 50; y++) {
      const opt = document.createElement('option');
      opt.value = String(y);
      opt.textContent = y + '年';
      if (y === 50) opt.selected = true;
      yearsSelect.appendChild(opt);
    }
  }

  let mode = 'payment';
  let selectedBalanceYear = 10;

  function moneyYen(n){
    if (!Number.isFinite(n)) return '—';
    const man = n / 10000;
    if (man >= 10000) {
      const oku = man / 10000;
      return oku.toLocaleString('ja-JP',{minimumFractionDigits:oku<10?2:1,maximumFractionDigits:2}).replace(/\.00$/,'') + '億円';
    }
    return Math.round(man).toLocaleString('ja-JP') + '万円';
  }
  function moneyMonthly(n){
    if (!Number.isFinite(n)) return '—';
    return (n/10000).toLocaleString('ja-JP',{minimumFractionDigits:1,maximumFractionDigits:1}) + '万円/月';
  }
  function monthlyPayment(principal, annualRate, years){
    const n = years * 12;
    const r = annualRate / 100 / 12;
    if (r === 0) return principal / n;
    const pow = Math.pow(1+r,n);
    return principal * r * pow / (pow - 1);
  }
  function principalFromPayment(payment, annualRate, years){
    const n = years * 12;
    const r = annualRate / 100 / 12;
    if (r === 0) return payment * n;
    const pow = Math.pow(1+r,n);
    return payment * (pow - 1) / (r * pow);
  }
  function balanceAfter(principal, annualRate, years, elapsedYears){
    const n=years*12, k=Math.min(elapsedYears*12,n), r=annualRate/100/12;
    if (k >= n) return 0;
    const p=monthlyPayment(principal,annualRate,years);
    if (r === 0) return Math.max(0, principal-p*k);
    return Math.max(0, principal*Math.pow(1+r,k)-p*((Math.pow(1+r,k)-1)/r));
  }
  function validate(rate, years){
    const err=$('calcError');
    err.textContent='';
    if (!Number.isFinite(rate)||rate<0||rate>10){err.textContent='金利は0〜10％の範囲で入力してください。';return false;}
    if (!Number.isInteger(years)||years<1||years>50){err.textContent='返済期間は1〜50年で選択してください。';return false;}
    if (mode === 'payment'){
      const amountMan=Number($('loanAmount').value);
      if (!Number.isFinite(amountMan)||amountMan<100||amountMan>100000){err.textContent='借入額は100万円〜10億円の範囲で入力してください。';return false;}
    } else {
      const budget=Number($('monthlyBudget').value);
      if (!Number.isFinite(budget)||budget<1||budget>500){err.textContent='毎月予算は1万円〜500万円の範囲で入力してください。';return false;}
    }
    return true;
  }
  function currentPrincipal(rate, years){
    if (mode === 'payment') return Number($('loanAmount').value)*10000;
    return principalFromPayment(Number($('monthlyBudget').value)*10000, rate, years);
  }
  function selectedButtons(){
    document.querySelectorAll('[data-amount]').forEach(b=>b.classList.toggle('selected', Number(b.dataset.amount)===Number($('loanAmount').value)));
    document.querySelectorAll('[data-budget]').forEach(b=>b.classList.toggle('selected', Number(b.dataset.budget)===Number($('monthlyBudget').value)));
    document.querySelectorAll('[data-rate]').forEach(b=>b.classList.toggle('selected', Number(b.dataset.rate)===Number($('annualRate').value)));
  }
  function renderBalanceVisual(principal,rate,years){
    const bal=balanceAfter(principal,rate,years,selectedBalanceYear);
    const ratio=principal>0 ? Math.max(0,Math.min(100,bal/principal*100)) : 0;
    $('balanceVisualTitle').textContent=selectedBalanceYear+'年後の残債';
    $('balanceVisualValue').textContent=moneyYen(bal);
    $('balanceTrackFill').style.width=ratio+'%';
    $('balanceVisualNote').textContent=`借入元金の約${ratio.toFixed(0)}％が残る計算です。売却予定がある場合は、想定売却価格と比較してください。`;
  }
  function renderTermTable(principal,rate){
    const rows=[35,40,50].map(y=>{
      const m=monthlyPayment(principal,rate,y);
      const total=m*y*12;
      const bal10=balanceAfter(principal,rate,y,10);
      return `<tr${y===Number($('loanYears').value)?' class="is-current"':''}><th>${y}年</th><td>${moneyMonthly(m)}</td><td>${moneyYen(total-principal)}</td><td>${moneyYen(bal10)}</td></tr>`;
    }).join('');
    $('termComparisonBody').innerHTML=rows;
  }
  function updateUrl(rate,years,principal){
    try{
      const u=new URL(location.href);
      u.searchParams.set('mode',mode);
      u.searchParams.set('rate',String(rate));
      u.searchParams.set('years',String(years));
      if(mode==='payment') u.searchParams.set('amount',String(Math.round(principal/10000)));
      else u.searchParams.set('budget',String(Number($('monthlyBudget').value)));
      const start = $('loanStartMonth') ? $('loanStartMonth').value : '';
      if (start) u.searchParams.set('start', start);
      history.replaceState(null,'',u);
    }catch(e){}
  }
  function updateScheduleLink(principal, rate, years){
    const link = $('scheduleLink');
    if (!link) return;
    const start = $('loanStartMonth') && $('loanStartMonth').value ? $('loanStartMonth').value : '2026-10';
    const q = new URLSearchParams({
      amount: String(Math.round(principal/10000)),
      rate: String(rate),
      years: String(years),
      start
    });
    link.href = '../mortgage-schedule/?' + q.toString();
  }

  function calc(track=true){
    const rate=Number($('annualRate').value);
    const years=Number($('loanYears').value);
    if (!validate(rate,years)) return;

    const principal=currentPrincipal(rate,years);
    const monthly=monthlyPayment(principal,rate,years);
    const total=monthly*years*12;
    const interest=total-principal;

    $('mainMetricLabel').textContent = mode==='payment' ? '毎月返済額' : '借入額の目安';
    $('monthlyPayment').textContent = mode==='payment' ? moneyMonthly(monthly) : moneyYen(principal);
    $('monthlySub').textContent = mode==='payment'
      ? `借入 ${Math.round(principal/10000).toLocaleString('ja-JP')}万円 / 年利 ${rate.toFixed(2)}% / ${years}年`
      : `毎月 ${Number($('monthlyBudget').value).toFixed(1)}万円 / 年利 ${rate.toFixed(2)}% / ${years}年`;

    $('totalPayment').textContent=moneyYen(total);
    $('totalInterest').textContent=moneyYen(interest);
    $('annualPayment').textContent=moneyYen(monthly*12);
    $('interestRatio').textContent=(principal>0 ? (interest/principal*100).toFixed(1) : '0.0')+'%';

    [5,10,15,20].forEach(y=>{
      const el=$('balance'+y);
      if(el) el.textContent=moneyYen(balanceAfter(principal,rate,years,y));
    });

    renderTermTable(principal,rate);
    renderBalanceVisual(principal,rate,years);

    const base=monthly;
    const m05=monthlyPayment(principal,rate+0.5,years);
    const m10=monthlyPayment(principal,rate+1.0,years);
    $('stressBase').textContent=rate.toFixed(2)+'%';
    $('stressBaseMonthly').textContent=moneyMonthly(base);
    $('stressHalf').textContent=(rate+0.5).toFixed(2)+'%';
    $('stressHalfDiff').textContent=`月 +${((m05-base)/10000).toFixed(1)}万円`;
    $('stressOne').textContent=(rate+1).toFixed(2)+'%';
    $('stressOneDiff').textContent=`月 +${((m10-base)/10000).toFixed(1)}万円`;

    const bal10=balanceAfter(principal,rate,years,10);
    const tenRatio=principal ? bal10/principal*100 : 0;
    $('calcInsight').innerHTML = mode==='payment'
      ? `<strong>この条件の見どころ：</strong>${years}年返済では月々${moneyMonthly(monthly).replace('/月','')}。10年後にも元金の約${tenRatio.toFixed(0)}％が残るため、住み替え予定がある場合は残債も確認しておきましょう。`
      : `<strong>この条件の借入目安：</strong>毎月${Number($('monthlyBudget').value).toFixed(1)}万円なら約${moneyYen(principal)}。これは借入可能額の審査結果ではなく、返済額から逆算した概算です。`;

    selectedButtons();
    updateScheduleLink(principal,rate,years);
    updateUrl(rate,years,principal);

    if(track && typeof gtag === 'function') {
      gtag('event','mortgage_calculator_use',{
        mode,
        loan_amount_man:Math.round(principal/10000),
        rate,
        years
      });
    }
  }

  function setMode(next){
    mode=next;
    document.querySelectorAll('[data-calc-mode]').forEach(b=>b.classList.toggle('active',b.dataset.calcMode===mode));
    $('paymentModeFields').hidden=mode!=='payment';
    $('borrowModeFields').hidden=mode!=='borrow';
    $('calcFormTitle').textContent=mode==='payment'?'借入条件を入力':'毎月予算から逆算';
    calc(false);
  }

  document.querySelectorAll('[data-calc-mode]').forEach(btn=>btn.addEventListener('click',()=>setMode(btn.dataset.calcMode)));
  document.querySelectorAll('[data-amount]').forEach(btn=>btn.addEventListener('click',()=>{$('loanAmount').value=btn.dataset.amount;calc();}));
  document.querySelectorAll('[data-budget]').forEach(btn=>btn.addEventListener('click',()=>{$('monthlyBudget').value=btn.dataset.budget;calc();}));
  document.querySelectorAll('[data-rate]').forEach(btn=>btn.addEventListener('click',()=>{$('annualRate').value=btn.dataset.rate;calc();}));
  document.querySelectorAll('[data-balance-year]').forEach(btn=>btn.addEventListener('click',()=>{
    selectedBalanceYear=Number(btn.dataset.balanceYear);
    document.querySelectorAll('[data-balance-year]').forEach(b=>b.classList.toggle('active',b===btn));
    calc(false);
  }));

  form.addEventListener('submit',(e)=>{e.preventDefault();calc();});
  ['loanAmount','monthlyBudget','annualRate','loanYears','loanStartMonth'].forEach(id=>{
    const el=$(id);
    el.addEventListener('change',()=>calc());
    el.addEventListener('input',()=>{window.clearTimeout(el._t);el._t=window.setTimeout(()=>calc(false),250);});
  });

  $('resetBtn').addEventListener('click',()=>{
    $('loanAmount').value=10000;$('monthlyBudget').value=25;$('annualRate').value=1;$('loanYears').value=50;if($('loanStartMonth')) $('loanStartMonth').value='2026-10';
    selectedBalanceYear=10; setMode('payment'); calc();
  });

  $('copyResultBtn').addEventListener('click',async()=>{
    const rate=Number($('annualRate').value), years=Number($('loanYears').value), principal=currentPrincipal(rate,years);
    const monthly=monthlyPayment(principal,rate,years);
    const text=`東京マンションウォッチ 住宅ローン試算\n借入額：${moneyYen(principal)}\n金利：年${rate.toFixed(2)}%\n返済期間：${years}年\n毎月返済：約${moneyMonthly(monthly)}\n10年後残債：約${moneyYen(balanceAfter(principal,rate,years,10))}\nhttps://agent-insight.github.io/tokyo-mansion-watch/tools/mortgage-calculator/`;
    try{
      await navigator.clipboard.writeText(text);
      $('copyStatus').textContent='結果をコピーしました。';
      if(typeof gtag==='function') gtag('event','mortgage_result_copy',{rate,years});
    }catch(e){
      $('copyStatus').textContent='コピーできませんでした。画面の数値を選択してご利用ください。';
    }
  });

  // Restore shareable query parameters when present
  try{
    const q=new URLSearchParams(location.search);
    if(q.get('amount')) $('loanAmount').value=q.get('amount');
    if(q.get('budget')) $('monthlyBudget').value=q.get('budget');
    if(q.get('rate')) $('annualRate').value=q.get('rate');
    if(q.get('years') && Number(q.get('years'))>=1 && Number(q.get('years'))<=50) $('loanYears').value=q.get('years');
    if(q.get('start') && /^\d{4}-\d{2}$/.test(q.get('start'))) $('loanStartMonth').value=q.get('start');
    if(q.get('mode')==='borrow') mode='borrow';
  }catch(e){}
  setMode(mode);
  calc(false);
})();

(() => {
  const $ = id => document.getElementById(id);
  const yearsSel = $('loanYears');
  if (!yearsSel) return;

  // Force 1-50 year options at 1-year increments.
  const selectedYears = Number(yearsSel.value) || 50;
  yearsSel.innerHTML = '';
  for (let y=1; y<=50; y++) {
    const o=document.createElement('option');
    o.value=String(y); o.textContent=y+'年';
    if (y===selectedYears) o.selected=true;
    yearsSel.appendChild(o);
  }

  function monthlyPayment(P, annual, years){
    const n=Math.max(1,Math.round(years*12));
    const r=annual/100/12;
    if(r===0) return P/n;
    const x=Math.pow(1+r,n);
    return P*r*x/(x-1);
  }

  function balanceAfter(P, annual, years, elapsedYears){
    const n=Math.round(years*12);
    const k=Math.min(Math.round(elapsedYears*12),n);
    const r=annual/100/12;
    const pay=monthlyPayment(P,annual,years);
    if(k>=n) return 0;
    if(r===0) return Math.max(0,P-pay*k);
    return Math.max(0,P*Math.pow(1+r,k)-pay*(Math.pow(1+r,k)-1)/r);
  }

  function yenMan(v){
    const man=v/10000;
    if(man>=10000) return (man/10000).toLocaleString('ja-JP',{maximumFractionDigits:2})+'億円';
    return Math.round(man).toLocaleString('ja-JP')+'万円';
  }

  function getPrincipal(){
    const modeBtn=document.querySelector('[data-calc-mode].active');
    const mode=modeBtn?modeBtn.dataset.calcMode:'payment';
    const annual=Number($('annualRate').value)||0;
    const years=Number($('loanYears').value)||50;
    if(mode==='borrow'){
      const payment=(Number($('monthlyBudget').value)||0)*10000;
      const n=years*12, r=annual/100/12;
      if(r===0) return payment*n;
      const x=Math.pow(1+r,n);
      return payment*(x-1)/(r*x);
    }
    return (Number($('loanAmount').value)||0)*10000;
  }

  function fillYears(){
    const years=Number($('loanYears').value)||50;
    ['futureRateYear','prepayYear'].forEach(id=>{
      const s=$(id); if(!s) return;
      const prev=Number(s.value)||5;
      s.innerHTML='';
      for(let y=1;y<years;y++){
        const o=document.createElement('option');
        o.value=String(y); o.textContent=y+'年後';
        if(y===Math.min(prev,years-1)) o.selected=true;
        s.appendChild(o);
      }
    });
  }

  function runFuture(){
    const P=getPrincipal();
    const baseRate=Number($('annualRate').value)||0;
    const years=Number($('loanYears').value)||50;
    const changeYear=Number($('futureRateYear').value)||1;
    const futureRate=Number($('futureRateValue').value)||0;
    const oldPay=monthlyPayment(P,baseRate,years);
    const bal=balanceAfter(P,baseRate,years,changeYear);
    const remain=Math.max(1,years-changeYear);
    const newPay=monthlyPayment(bal,futureRate,remain);
    const diff=newPay-oldPay;
    $('futureRateOutput').innerHTML=`
      <div><small>${changeYear}年後の残高</small><strong>${yenMan(bal)}</strong></div>
      <div><small>現在の毎月返済</small><strong>${yenMan(oldPay)}/月</strong></div>
      <div><small>${futureRate.toFixed(2)}%へ変更後</small><strong>${yenMan(newPay)}/月</strong></div>
      <div><small>毎月の差</small><strong>${diff>=0?'+':''}${(diff/10000).toFixed(1)}万円</strong></div>`;
    if(typeof gtag==='function') gtag('event','future_rate_simulation',{change_year:changeYear,future_rate:futureRate});
  }

  function payoffMonths(P, annual, payment){
    const r=annual/100/12;
    if(P<=0) return 0;
    if(r===0) return Math.ceil(P/payment);
    if(payment<=P*r) return Infinity;
    return Math.ceil(-Math.log(1-P*r/payment)/Math.log(1+r));
  }

  function remainingInterest(P, annual, months, payment){
    let bal=P, sum=0;
    const r=annual/100/12;
    for(let i=0;i<months && bal>0.01;i++){
      const interest=r===0?0:bal*r;
      let pp=payment-interest;
      if(pp<=0) return Infinity;
      if(pp>bal) pp=bal;
      bal-=pp; sum+=interest;
    }
    return sum;
  }

  function runPrepay(){
    const P=getPrincipal();
    const rate=Number($('annualRate').value)||0;
    const years=Number($('loanYears').value)||50;
    const y=Number($('prepayYear').value)||1;
    const amount=(Number($('prepayAmount').value)||0)*10000;
    const type=$('prepayType').value;
    const original=monthlyPayment(P,rate,years);
    const balBefore=balanceAfter(P,rate,years,y);
    const prep=Math.min(amount,balBefore);
    const balAfter=Math.max(0,balBefore-prep);
    const remainingMonths=(years-y)*12;
    let content='';

    if(type==='term'){
      const newMonths=payoffMonths(balAfter,rate,original);
      const shorten=Math.max(0,remainingMonths-newMonths);
      const beforeInt=remainingInterest(balBefore,rate,remainingMonths,original);
      const afterInt=remainingInterest(balAfter,rate,newMonths,original);
      const saved=Math.max(0,beforeInt-afterInt);
      content=`
        <div><small>繰上返済前残高</small><strong>${yenMan(balBefore)}</strong></div>
        <div><small>返済後残高</small><strong>${yenMan(balAfter)}</strong></div>
        <div><small>期間短縮</small><strong>約${Math.floor(shorten/12)}年${shorten%12}か月</strong></div>
        <div><small>利息軽減概算</small><strong>${yenMan(saved)}</strong></div>`;
    }else{
      const newPay=monthlyPayment(balAfter,rate,(years-y));
      const beforeInt=remainingInterest(balBefore,rate,remainingMonths,original);
      const afterInt=remainingInterest(balAfter,rate,remainingMonths,newPay);
      const saved=Math.max(0,beforeInt-afterInt);
      content=`
        <div><small>繰上返済前残高</small><strong>${yenMan(balBefore)}</strong></div>
        <div><small>返済後残高</small><strong>${yenMan(balAfter)}</strong></div>
        <div><small>新しい毎月返済</small><strong>${yenMan(newPay)}/月</strong></div>
        <div><small>毎月軽減</small><strong>${((original-newPay)/10000).toFixed(1)}万円/月</strong></div>
        <div><small>利息軽減概算</small><strong>${yenMan(saved)}</strong></div>`;
    }
    $('prepayOutput').innerHTML=content;
    if(typeof gtag==='function') gtag('event','prepayment_simulation',{prepay_year:y,prepay_amount_man:prep/10000,type});
  }

  yearsSel.addEventListener('change',fillYears);
  fillYears();
  $('runFutureRate')?.addEventListener('click',runFuture);
  $('runPrepay')?.addEventListener('click',runPrepay);
})();
