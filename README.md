# 東京マンションウォッチ Ver.18

## Ver.18 仕上げ強化
- Google FontsをHTML headから確実に読み込むよう修正
- 記事に読了目安を追加
- 記事に自動目次を追加
- BreadcrumbList構造化データ追加
- GA4で以下をイベント計測
  - LINE相談クリック
  - 問い合わせページクリック
  - 記事クリック
  - カテゴリクリック
  - エリアページクリック
  - サイト内検索
- エリア専門ページを新設
  - 大井町
  - 品川区
  - 目黒区
  - 湾岸・タワーマンション
- RSSフィード rss.xml を追加
- 404ページを改善
- 検索結果ページを noindex,follow 化
- 画像 lazy load / async decode
- キーボード操作・フォーカス表示改善
- Skip Link追加
- 各下層ページに共通フッター追加
- sitemap.xml更新
- スマホUI微調整

## GA4で確認できる主なイベント
line_contact_click
contact_page_click
article_click
category_click
area_hub_click
site_search

## 公開後
Search Consoleのサイトマップは既存 sitemap.xml のままでOKです。
RSS: https://agent-insight.github.io/tokyo-mansion-watch/rss.xml
