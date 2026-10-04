(() => {
  const DAY = 86400000;
  const now = new Date();

  function parseDate(s){
    if(!s) return null;
    const d = new Date(String(s).replace(/\./g,'-') + 'T12:00:00+09:00');
    return isNaN(d) ? null : d;
  }
  function daysSince(s){
    const d=parseDate(s);
    return d ? Math.floor((now-d)/DAY) : null;
  }

  window.TMW_GOV = {
    freshnessFor(article){
      const cat=article?.category||'';
      const tags=article?.tags||[];
      const checked=article?.checkedAt||article?.date||'';
      const age=daysSince(checked);
      let limit=null;
      if(cat.includes('市況') || tags.includes('REINS')) limit=40;
      else if(cat==='住宅ローン' || tags.some(t=>String(t).includes('金利'))) limit=45;
      else if(cat==='再開発') limit=120;
      else if(tags.some(t=>['税制','制度','住宅ローン減税'].includes(t))) limit=60;

      if(limit===null || age===null) return {type:'evergreen',label:'保存版'};
      if(age<=limit) return {type:'fresh',label:'確認済'};
      if(age<=limit*2) return {type:'review',label:'再確認推奨'};
      return {type:'stale',label:'情報更新待ち'};
    },
    formatChecked(article){
      const s=article?.checkedAt||article?.date||'';
      return s ? String(s).replace(/-/g,'/') : '';
    }
  };
})();