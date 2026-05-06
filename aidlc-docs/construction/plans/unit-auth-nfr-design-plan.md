# unit-auth NFR Design Plan

## 対象ユニット
- **ユニット**: unit-auth
- **NFR Requirements**: 完了（7カテゴリ・20要件）
- **技術スタック**: Supabase Auth + @supabase/ssr + Next.js Middleware

## NFR設計チェックリスト
- [x] NFR設計パターン定義（nfr-design-patterns.md）
- [x] 論理コンポーネント定義（logical-components.md）

---

## 質問: unit-auth NFR Design確認事項

---

## Question 1
認証失敗時のリトライ戦略は？

A) 即時リトライ（ユーザー操作ベース。自動リトライなし）
B) 指数バックオフ付き自動リトライ（トークンリフレッシュのみ、最大3回）
C) リトライなし（失敗時は即座にサインインページへ）
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 2
JWTの公開鍵キャッシュ戦略は？

A) アプリ起動時に1回取得し、メモリキャッシュ（再起動まで保持）
B) TTL付きキャッシュ（1時間ごとに再取得）
C) Supabase SDKのデフォルトキャッシュに委ねる
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 3
アカウント削除バッチ処理の障害回復パターンは？

A) トランザクション保証 + 次回バッチで未完了分を再試行
B) 冪等性を確保し、何度実行しても同じ結果になるよう設計
C) AとBの両方
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---
