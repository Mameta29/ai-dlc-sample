# unit-auth Functional Design Plan

## 対象ユニット
- **ユニット**: unit-auth
- **責任**: Google OAuth認証、セッション管理、トークン検証、アクセス制御ミドルウェア
- **関連ストーリー**: US-001（Googleサインアップ）、US-052（アカウント削除）

## 設計チェックリスト
- [x] ドメインエンティティ定義（domain-entities.md）
- [x] ビジネスロジックモデル（business-logic-model.md）
- [x] ビジネスルール定義（business-rules.md）
- [x] フロントエンドコンポーネント設計（frontend-components.md）

---

## 質問: unit-auth Functional Design確認事項

---

## Question 1
アカウント削除の猶予期間中にユーザーがログインした場合の動作は？

A) 削除キャンセル（復元）して通常利用に戻す
B) 「削除リクエスト中です」と表示し、キャンセルするか確認ダイアログを出す
C) ログイン自体をブロックする
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 2
セッションの有効期限はどう設定しますか？

A) 短期（1時間）— セキュリティ重視、頻繁に再認証
B) 中期（24時間）— バランス型
C) 長期（7日間）— UX重視、モバイルユーザーの利便性優先
D) リフレッシュトークン方式（アクセストークン15分 + リフレッシュトークン7日）
X) Other (please describe after [Answer]: tag below)

[Answer]: D

---

## Question 3
複数デバイスからの同時ログインは許可しますか？

A) 許可する（制限なし）
B) 最大3デバイスまで
C) 新しいデバイスでログインすると他デバイスのセッションを無効化
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---
