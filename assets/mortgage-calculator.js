(() => {
  const $ = (id) => document.getElementById(id);
  const form = $('mortgageForm');
  if (!form) return;

  function moneyYen(n){
    if (!Number.isFinite(n)) return '—';
    const man = n / 10000;
    if (man >= 10000) return (man/10000).toFixed(man >= 100000 ? 1 : 2).replace(/\.00$/,'') + '億円';
    return Math.round(man).toLocaleString('ja-JP') + '万円';
  }
  function moneyMonthly(n){
    if (!Number.isFinite(n)) return '—';
    return (n/10000).toFixed(1) + '万円/月';
  }
  function monthlyPayment(principal, annualRate, years){
    const n = years * 12;
    const r = annualRate / 100 / 12;
    if (r === 0) return principal / n;
    return principal * r * Math.pow(1+r,n) / (Math.pow(1+r,n)-1);
  }
  function balanceAfter(principal, annualRate, years, elapsedYears){
    const n = years*12, k = Math.min(elapsedYears*12,n), r=annualRate/100/12;
    if (k >= n) return 0;
    const p=monthlyPayment(principal,annualRate,years);
    if (r === 0) return Math.max(0, principal-p*k);
    return Math.max(0, principal*Math.pow(1+r,k)-p*((Math.pow(1+r,k)-1)/r));
  }
  function calc(){
    const amountMan=Number($('loanAmount').value);
    const rate=Number($('annualRate').value);
    const years=Number($('loanYears').value);
    const compare=Number($('compareYears').value);
    const err=$('calcError');
    err.textContent='';
    if (!Number.isFinite(amountMan)||amountMan<100||amountMan>100000){err.textContent='借入額は100万円〜10億円の範囲で入力してください。';return;}
    if (!Number.isFinite(rate)||rate<0||rate>10){err.textContent='金利は0〜10％の範囲で入力してください。';return;}
    const principal=amountMan*10000;
    const monthly=monthlyPayment(principal,rate,years);
    const total=monthly*years*12;
    const compMonthly=monthlyPayment(principal,rate,compare);
    $('monthlyPayment').textContent=moneyMonthly(monthly);
    $('monthlySub').textContent=`借入 ${amountMan.toLocaleString('ja-JP')}万円 / 年利 ${rate.toFixed(2)}% / ${years}年`;
    $('totalPayment').textContent=moneyYen(total);
    $('totalInterest').textContent=moneyYen(total-principal);
    $('balance5').textContent=moneyYen(balanceAfter(principal,rate,years,5));
    $('balance10').textContent=moneyYen(balanceAfter(principal,rate,years,10));
    $('balance15').textContent=moneyYen(balanceAfter(principal,rate,years,15));
    $('currentTermLabel').textContent=years+'年';
    $('compareTermLabel').textContent=compare+'年';
    $('currentMonthly').textContent=moneyMonthly(monthly);
    $('compareMonthly').textContent=moneyMonthly(compMonthly);
    const diff=Math.abs(monthly-compMonthly);
    const direction=monthly<compMonthly ? `${years}年の方が` : (monthly>compMonthly ? `${compare}年の方が` : '月々は同額で');
    $('compareDiff').textContent=monthly===compMonthly ? '同じ返済期間です。' : `${direction}月々約${(diff/10000).toFixed(1)}万円低くなります。`;
    if (typeof gtag === 'function') gtag('event','mortgage_calculator_use',{loan_amount_man:amountMan,rate,years,compare_years:compare});
  }
  form.addEventListener('submit',(e)=>{e.preventDefault();calc();});
  ['loanAmount','annualRate','loanYears','compareYears'].forEach(id=>$(id).addEventListener('change',calc));
  $('presetBtn').addEventListener('click',()=>{$('loanAmount').value=10000;$('annualRate').value=1;$('loanYears').value=50;$('compareYears').value=35;calc();});
  calc();
})();