# SABOROU 要件確認質問

以下の質問にお答えください。各質問の`[Answer]:`タグの後にアルファベットの選択肢を記入してください。

---

## Question 1
今回実装するスコープはどこまでですか？

A) MVPのみ（タスク入力→先延ばし→ランキング）
B) MVP + AI対話による言い訳生成・スコア化（中期展望まで）
C) MVP + 中期展望 + 自己取扱説明書データ出力（全体）
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 2
プラットフォームは何を想定していますか？

A) Webアプリケーション（PC・モバイルブラウザ対応）
B) ネイティブモバイルアプリ（iOS/Android）
C) Webアプリ + PWA（モバイル対応）
D) LINE Bot / チャットベースUI
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 3
認証方式はどれを想定していますか？

A) メールアドレス + パスワード
B) Googleソーシャルログイン
C) LINE連携ログイン
D) 認証なし（匿名利用、ニックネームのみ）
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 4
AI（言い訳生成・タスク定量化）の実装方式はどうしますか？

A) OpenAI API（GPT-4o等）
B) Claude API（Anthropic）
C) ローカルLLM / オープンソースモデル
D) ルールベース（AI APIなし、MVP段階ではテンプレート対応）
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5
バックエンドの技術スタックの希望はありますか？

A) Next.js（フルスタック、API Routes）
B) Node.js + Express / Fastify
C) Python（FastAPI / Django）
D) 技術スタックはお任せ（最適なものを提案してほしい）
X) Other (please describe after [Answer]: tag below)

[Answer]: D

---

## Question 6
データベースの希望はありますか？

A) PostgreSQL（リレーショナル）
B) Supabase（PostgreSQL + リアルタイム + 認証込み）
C) Firebase / Firestore（NoSQL）
D) お任せ（最適なものを提案してほしい）
X) Other (please describe after [Answer]: tag below)

[Answer]: D

---

## Question 7
ランキング機能の公開範囲はどうしますか？

A) 全ユーザーで1つのグローバルランキング
B) フレンド間 / グループ内ランキング
C) 両方（グローバル + グループ）
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 8
デプロイ先の希望はありますか？

A) Vercel（フロントエンド） + Supabase / PlanetScale（バックエンド）
B) AWS（Amplify / Lambda / DynamoDB等）
C) Google Cloud（Cloud Run / Firebase等）
D) お任せ（最適なものを提案してほしい）
X) Other (please describe after [Answer]: tag below)

[Answer]: D

---

## Question 9
ハッカソン用のプロトタイプですか？それとも本番運用を見据えた開発ですか？

A) ハッカソン向けプロトタイプ（速度優先、最小構成）
B) ハッカソン発表後に本番運用も検討（バランス型）
C) 本番運用前提（品質・スケーラビリティ重視）
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 10: セキュリティ拡張
このプロジェクトにセキュリティ拡張ルールを適用しますか？

A) はい — すべてのセキュリティルールをブロッキング制約として適用する（本番グレードのアプリケーション向け推奨）
B) いいえ — セキュリティルールをスキップする（PoC、プロトタイプ、実験的プロジェクト向け）
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 11: プロパティベーステスト拡張
このプロジェクトにプロパティベーステスト（PBT）ルールを適用しますか？

A) はい — すべてのPBTルールをブロッキング制約として適用する（ビジネスロジック、データ変換があるプロジェクト向け推奨）
B) 部分的 — 純粋関数とシリアライゼーションのみPBTルールを適用する
C) いいえ — PBTルールをスキップする（シンプルなCRUDアプリ、UIのみのプロジェクト向け）
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---
