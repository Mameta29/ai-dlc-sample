# SABOROU ユニット分解プラン

## 分解チェックリスト
- [x] ユニット定義（unit-of-work.md）
- [x] ユニット依存関係（unit-of-work-dependency.md）
- [x] ストーリーマッピング（unit-of-work-story-map.md）
- [x] ユニット境界・依存関係の整合性検証
- [x] 全ストーリーがユニットに割り当てられていることを確認

---

## 質問: ユニット分解に関する確認事項

以下の質問にお答えください。各質問の`[Answer]:`タグの後にアルファベットを記入してください。

---

## Question 1
ユニット（開発単位）の分割方針はどうしますか？

A) コンポーネント1:1マッピング — 各ドメインコンポーネントをそのまま1ユニットとする（11ユニット）
B) 機能グループ型 — 関連コンポーネントをグループ化して少数ユニットにまとめる（4〜6ユニット）
C) 優先度型 — MVP機能（タスク+スコア+ランキング）を1ユニット目、AI対話を2ユニット目、ソーシャルを3ユニット目のように段階的に分割
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2
開発の進め方はどう想定していますか？

A) 順次実装 — ユニット1を完全に実装してからユニット2に進む
B) 並行実装 — 複数ユニットを同時に開発する（インターフェース先行定義）
C) スケルトン先行 — 全ユニットの骨格を先に作り、順次肉付け
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 3
MCP Serverのユニット配置はどうしますか？

A) メインアプリと同一リポジトリ内のサブディレクトリ（monorepo）
B) 完全に別リポジトリとして分離
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4
Next.jsプロジェクト内のディレクトリ構成はどの方式を好みますか？

A) 機能ドメイン型 — `src/features/{domain}/` 配下にUI・ロジック・APIをまとめる
B) レイヤー型 — `src/app/`, `src/components/`, `src/lib/`, `src/server/` と技術層で分離
C) ハイブリッド型 — App Router構造（`src/app/`）+ 共有ロジックは`src/lib/{domain}/`
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---
