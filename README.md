# 東京マンションウォッチ Ver.16

## 本番連携
- LINE相談リンク設定済み
  https://line.me/ti/p/DipNvXkjll
- LINE IDはサイト上に表示しない方式
- GA4 設定済み
  測定ID: G-HZMQ3B6MT1
- Google Search Console HTMLファイル確認を実装
  /google4cde12fc9a39f2d2.html
- プライバシーポリシー新設
- メール問い合わせ先
  kouki.yamaguchi@terass.com

## GitHubアップロード後の作業
1. Ver.16をリポジトリへ上書き
2. GitHub Pagesの反映を待つ
3. ブラウザで
   https://agent-insight.github.io/tokyo-mansion-watch/google4cde12fc9a39f2d2.html
   を開き、文字列が表示されることを確認
4. Search Consoleに戻り「確認」
5. Search Console → サイトマップで
   sitemap.xml
   を送信
6. Google Analyticsのリアルタイムでアクセスが記録されるか確認

## UI
- PCヘッダーにLINE相談
- スマホ固定バーをLINE / メールの2ボタン化
- 問い合わせページでLINE / メールを選択
- プロフィール・記事にも相談導線追加
