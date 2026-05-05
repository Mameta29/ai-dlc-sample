# SABOROU アプリケーション設計プラン

## 設計チェックリスト
- [x] コンポーネント定義（components.md）
- [x] コンポーネントメソッド定義（component-methods.md）
- [x] サービス層定義（services.md）
- [x] コンポーネント依存関係（component-dependency.md）
- [x] 統合ドキュメント（application-design.md）
- [x] 設計の整合性検証

---

## 質問: アプリケーション設計に関する確認事項

以下の質問にお答えください。各質問の`[Answer]:`タグの後にアルファベットを記入してください。

---

## Question 1
コンポーネントの分割粒度はどの程度を想定しますか？

A) レイヤー型（Presentation / Application / Domain / Infrastructure の4層）
B) 機能ドメイン型（Auth / Task / AI / Ranking / Social / Profile ドメインごとに分割）
C) ハイブリッド型（レイヤー型ベースに、ドメインで横串を通す）
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 2
AI対話エンジンとバックエンドAPIの関係はどう設計しますか？

A) 統合型 — Next.js API Routes内でOpenAI APIを直接呼び出す
B) 分離型 — AI対話を独立したマイクロサービスとして切り出す
C) Edge Functions型 — AI対話をVercel Edge Functionsで処理（低レイテンシ）
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3
MCP Server（自己取扱説明書公開用）の構成はどうしますか？

A) Next.js API Routes内にMCPエンドポイントを同居させる
B) 独立したMCP Serverプロセスとして別デプロイ
C) Supabase Edge Functionsとして実装
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 4
リアルタイム機能（ランキング更新、フィード等）の実装方式は？

A) Supabase Realtime（PostgreSQL CDC + WebSocket）を活用
B) Server-Sent Events（SSE）で独自実装
C) ポーリング（シンプルだがリアルタイム性低い）
D) A + Cのハイブリッド（ランキングはRealtime、フィードはポーリング）
X) Other (please describe after [Answer]: tag below)

[Answer]: D

---

## Question 5
データ分析・自己取扱説明書生成のタイミングは？

A) リアルタイム — 対話ごとに即時分析・更新
B) バッチ処理 — 日次/週次で集計・分析
C) ハイブリッド — 簡易分析はリアルタイム、深い分析はバッチ
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---
