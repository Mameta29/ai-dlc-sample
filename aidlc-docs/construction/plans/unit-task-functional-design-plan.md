# unit-task Functional Design Plan

## 対象ユニット
- **ユニット**: unit-task
- **責任**: タスクCRUD、状態管理（先延ばし中/完了/期限切れ）、締切管理
- **関連ストーリー**: US-005〜US-010（タスク入力、締切設定、一覧、編集、削除、完了報告）

## 設計チェックリスト
- [x] ドメインエンティティ定義（domain-entities.md）
- [x] ビジネスロジックモデル（business-logic-model.md）
- [x] ビジネスルール定義（business-rules.md）
- [x] フロントエンドコンポーネント設計（frontend-components.md）

---

## 質問: unit-task Functional Design確認事項

---

## Question 1
タスクの「締切なし」を選択した場合の扱いは？

A) 先延ばしスコアは0固定（ランキング対象外、タスク管理のみ）
B) 締切なしタスクにデフォルト締切（7日後）を自動設定
C) 締切なしタスクは先延ばし機能の対象外だが一覧には表示
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2
タスク編集時に締切を変更した場合、先延ばし時間の計算はどうしますか？

A) 新しい締切で先延ばし時間を再計算（変更履歴は記録するがスコアに反映しない）
B) 元の締切基準のスコアを保持し、新しい締切は残り時間表示のみに影響
C) 締切変更回数に応じてペナルティ（スコア減算）を適用
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3
期限切れタスクの扱いは？

A) 自動的に「期限切れ」状態に遷移、先延ばしスコアは最大値で確定
B) 期限切れ通知を表示するが状態は変えない（ユーザーが手動で完了/削除）
C) 期限切れ後も先延ばし時間はカウント継続（スコアが際限なく増える）
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4
タスクの変更履歴はどの程度保持しますか？

A) タイトル・締切の変更のみ記録（監査用、画面には表示しない）
B) 全フィールドの変更を記録し、タスク詳細画面で履歴表示
C) 変更履歴は保持しない（最新状態のみ）
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---
