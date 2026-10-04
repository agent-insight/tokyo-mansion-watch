(() => {
  const explanations = {
    deals:{
      title:'成約件数を見る意味',
      text:'取引の活発さを見る指標です。前年より大きく減っているため、価格だけでなく「買主が実際に動いているか」も確認したい局面です。'
    },
    price:{
      title:'成約㎡単価を見る意味',
      text:'実際に成約した住戸の1㎡あたり価格です。ただし毎月の成約物件の築年・立地・広さが違うため、−0.3％だけで個別物件の値下がりとは判断しません。'
    },
    stock:{
      title:'在庫を見る意味',
      text:'市場にある売物件の量を見る指標です。在庫増は買主には選択肢増、売主には競合増という意味があります。ただしこの数字は首都圏全体です。'
    },
    rate:{
      title:'政策金利を見る意味',
      text:'住宅ローン金利そのものではありませんが、変動金利や金融機関の調達環境を考える重要な背景です。実際の適用金利は各銀行の商品条件を確認します。'
    }
  };
  const explain=document.getElementById('marketCardExplain');
  document.querySelectorAll('[data-market-card]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('[data-market-card]').forEach(b=>b.classList.toggle('active',b===btn));
      const x=explanations[btn.dataset.marketCard];
      explain.innerHTML=`<strong>${x.title}</strong><p>${x.text}</p>`;
      if(typeof gtag==='function') gtag('event','market_metric_click',{metric:btn.dataset.marketCard});
    });
  });

  function updateConversion(){
    const areaInput=document.getElementById('marketArea');
    const area=Math.max(20,Math.min(200,Number(areaInput.value)||70));
    const sqm=132.69;
    const tsubo=sqm*3.305785;
    const total=sqm*area;
    document.getElementById('tsuboPrice').textContent='約'+tsubo.toFixed(1)+'万円/坪';
    document.getElementById('areaPriceLabel').textContent=area.toFixed(0)+'㎡換算';
    document.getElementById('areaPrice').textContent= total>=10000
      ? '約'+(total/10000).toFixed(2)+'億円'
      : '約'+Math.round(total).toLocaleString('ja-JP')+'万円';
  }
  const area=document.getElementById('marketArea');
  area.addEventListener('input',updateConversion);
  area.addEventListener('change',()=>{
    updateConversion();
    if(typeof gtag==='function') gtag('event','market_area_conversion',{area_sqm:Number(area.value)||70});
  });
  updateConversion();

  const copyBtn=document.getElementById('copyMarketLink');
  copyBtn.addEventListener('click',async()=>{
    try{
      await navigator.clipboard.writeText('https://agent-insight.github.io/tokyo-mansion-watch/market-data.html');
      document.getElementById('copyMarketStatus').textContent='URLをコピーしました。';
      if(typeof gtag==='function') gtag('event','market_link_copy');
    }catch(e){
      document.getElementById('copyMarketStatus').textContent='コピーできませんでした。';
    }
  });
})();