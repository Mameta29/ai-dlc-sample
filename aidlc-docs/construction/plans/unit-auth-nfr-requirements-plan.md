# unit-auth NFR Requirements Plan

## 対象ユニット
- **ユニット**: unit-auth
- **責任**: Google OAuth認証、セッション管理、トークン検証、アクセス制御ミドルウェア
- **Functional Design**: 完了（4エンティティ、6ビジネスプロセス、11ビジネスルール）

## NFR評価チェックリスト
- [x] NFR要件定義（nfr-requirements.md）
- [x] 技術スタック決定（tech-stack-decisions.md）

---

## 質問: unit-auth NFR確認事項

---

## Question 1
認証レスポンスタイムの目標値は？

A) 厳格（サインイン完了まで2秒以内、トークン検証10ms以内）
B) 標準（サインイン完了まで3秒以内、トークン検証50ms以内）
C) 柔軟（Supabase Authのデフォルト性能に委ねる）
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 2
認証失敗時のレートリミットはどう設定しますか？

A) 厳格（5回/分失敗でアカウントロック30分）
B) 中程度（10回/分失敗で一時ブロック5分）
C) Supabase Authのデフォルトレートリミットに委ねる
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 3
セッション関連のモニタリング・アラートは必要ですか？

A) 詳細モニタリング（異常検知、不正アクセス検出、アラート通知）
B) 基本モニタリング（認証成功/失敗率、エラーログ集計）
C) 最小限（Supabaseダッシュボードの標準モニタリングのみ）
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---
