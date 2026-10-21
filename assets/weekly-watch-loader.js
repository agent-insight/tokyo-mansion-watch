(() => {
  const stamp = Date.now();
  const data = document.createElement('script');
  data.src = 'assets/weekly-watch.js?t=' + stamp;
  data.async = false;
  data.onload = () => {
    const render = document.createElement('script');
    render.src = 'assets/brief-render.js?t=' + stamp;
    render.async = false;
    document.body.appendChild(render);
  };
  data.onerror = () => {
    const target = document.getElementById('briefThree') || document.getElementById('briefArchiveList');
    if (target) target.innerHTML = '<div class="empty"><strong>最新データを読み込めませんでした。</strong><p>ページを再読み込みしてください。</p></div>';
  };
  document.body.appendChild(data);
})();
