# Ver.38 公開前QAレポート

実施日：2026-10-04

## チェック結果
- JavaScript構文：全ファイルOK
- ローカルリンク：欠損0
- article.html?id=...：67記事IDとの照合OK
- HTML重複id：0
- sitemap.xml / rss.xml：XML構文OK
- 「山口の見方」「山口の見解」旧表記：主要表示箇所0
- 公開ページの主要canonical：補完
- weekly.html：sitemap追加
- GA4：新規ページでもanalytics.js単体で初期化可能に修正
- publisher.html：Ver.37で見つかったJavaScript改行エラーを修正
- ヒーロー画像：表示用WebPを追加し、約2.4MB PNGをページ背景から切替
  （PNGはOGP用として保持）

## 公開判定
公開推奨。

## 補足
Playwright本体は環境にありましたがChromium実行ファイルが未導入のため、
実ブラウザ自動描画テストは実施できませんでした。
その代わり、静的リンク・JS構文・記事ID・HTML構造・XML・SEO基本項目を機械検査しています。
