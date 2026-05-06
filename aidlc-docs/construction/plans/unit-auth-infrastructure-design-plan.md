# unit-auth Infrastructure Design Plan

## 対象ユニット
- **ユニット**: unit-auth
- **論理コンポーネント**: 6つ（Auth Middleware, Supabase Client Server/Browser, Auth Context Provider, Deletion Scheduler, Auth Logger）
- **デプロイ先**: Vercel (フロント) + Supabase (バックエンド) — 要件で決定済み

## インフラ設計チェックリスト
- [x] インフラ設計（infrastructure-design.md）
- [x] デプロイアーキテクチャ（deployment-architecture.md）

---

## 質問: unit-auth Infrastructure Design確認事項

---

## Question 1
Vercelのデプロイ環境構成は？

A) 2環境（Preview + Production）
B) 3環境（Development + Preview + Production）
C) 1環境（Productionのみ、ブランチプレビューで代用）
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 2
Supabaseプロジェクトの環境分離は？

A) 環境ごとに独立したSupabaseプロジェクト（dev / staging / prod）
B) 1プロジェクトでスキーマ分離（public / staging / dev）
C) 2プロジェクト（dev + prod）
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 3
ログ・モニタリングのインフラは？

A) Vercel組み込みログ + Supabaseダッシュボード（追加サービスなし）
B) 外部ログサービス導入（Axiom, Datadog等）
C) Vercel Log Drains経由で外部サービスに転送
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---
