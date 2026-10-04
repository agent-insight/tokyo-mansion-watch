
const params=new URLSearchParams(location.search), cat=params.get('cat')||'東京23区マンション市況';
const all=window.ARTICLES||[];
const configs={
  "東京23区マンション市況":{
    lead:"東京23区の中古・新築マンション市場を、価格だけでなく成約件数・在庫・供給・金利まで含めて読み解きます。",
    points:["平均価格だけでなく在庫・成約件数も見る","新築と中古の価格差を確認","エリア別・マンション別に需給を見る"]
  },
  "品川区・目黒区":{
    lead:"山口が特に注力する品川区・目黒区。大井町、大崎、五反田、中目黒、都立大学などを中心に、価格・再開発・資産性を確認します。",
    points:["駅距離と生活動線","再開発の進捗と価格への織り込み","管理・間取り・将来売却"]
  },
  "湾岸・タワーマンション":{
    lead:"勝どき・晴海・豊洲・月島・有明・東雲・芝浦・港南など、湾岸タワマンを棟単位・住戸単位で比較します。",
    points:["同一棟内の競合在庫","階数・方角・眺望の差","管理費・修繕積立金・将来売却"]
  },
  "住宅ローン":{
    lead:"変動・固定・50年・諸費用・ペアローンなどを、金利だけでなく審査・期間・団信・総返済額まで含めて比較します。",
    points:["表面金利だけで決めない","50年は残債と売却計画も確認","20行以上から条件に合う銀行を探す"]
  },
  "再開発":{
    lead:"大井町・品川・高輪ゲートウェイ・湾岸など、住宅市場に影響する再開発を一次情報から追います。",
    points:["計画・決定・完成を区別","価格への織り込みを確認","生活利便性と供給増を両方見る"]
  },
  "購入ノウハウ":{
    lead:"初めての購入からセカンドオピニオンまで、物件選び・資金計画・管理・資産性の考え方をまとめます。",
    points:["価格妥当性","管理・修繕計画","将来売却しやすいか"]
  },
  "売却・住み替え":{
    lead:"査定、売出価格、価格改定、売却先行・購入先行など、住み替えも含めた売却戦略を整理します。",
    points:["査定額と売れる価格は別","競合在庫と販売期間","残債と住み替えスケジュール"]
  },
  "不動産実務":{
    lead:"契約、重要事項説明、管理規約、修繕計画、広告表示など、実際の取引で確認したい実務テーマを解説します。",
    points:["契約条件","管理規約・修繕","法改正・広告ルール"]
  }
};
const cfg=configs[cat]||{lead:"関連記事をまとめています。",points:[]};
const categoryImages={
  "東京23区マンション市況":"assets/thumb-market.jpg",
  "品川区・目黒区":"assets/thumb-buy.jpg",
  "湾岸・タワーマンション":"assets/thumb-bay.jpg",
  "住宅ローン":"assets/thumb-loan.jpg",
  "再開発":"assets/thumb-redevelop.jpg",
  "購入ノウハウ":"assets/thumb-buy.jpg",
  "売却・住み替え":"assets/thumb-sell.jpg",
  "不動産実務":"assets/thumb-management.jpg"
};
document.title=cat+'｜東京マンションウォッチ';
document.getElementById('pageTitle').textContent=cat;
document.getElementById('categoryIntro').innerHTML=`
          <div class="category-intro-copy">
            <span class="eyebrow">CATEGORY</span>
            <h2>${cat}</h2>
            <p>${cfg.lead}</p>
          </div>
          <img src="${categoryImages[cat]||'assets/thumb-market.jpg'}" alt="${cat}">
        `;
document.getElementById('categoryPoints').innerHTML=`<ul>${cfg.points.map(x=>`<li>${x}</li>`).join('')}</ul>`;
const list=all.filter(a=>a.category===cat).sort((a,b)=>b.date.localeCompare(a.date));
document.getElementById('list').innerHTML=list.length?list.map(a=>`
  <a class="category-row" href="article.html?id=${a.id}">
    <img src="${a.image||'assets/thumb-market.jpg'}" alt="${a.category||'記事画像'}" onerror="this.src='assets/thumb-market.jpg'">
    <div>
      <div class="all-article-meta"><time>${a.date}</time>${a.sourceType?`<b>${a.sourceType}</b>`:''}</div>
      <h3>${a.title}</h3><p>${a.excerpt}</p>
    </div><span>→</span>
  </a>`).join(''):'<p>記事はこれから追加されます。</p>';
