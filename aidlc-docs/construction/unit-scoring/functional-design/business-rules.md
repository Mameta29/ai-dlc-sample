# unit-scoring ビジネスルール定義

## ルール一覧

| ID | ルール名 |
|---|---|
| BR-SCORE-001 | タスクスコア範囲 |
| BR-SCORE-002 | 次元スコア範囲 |
| BR-SCORE-003 | 先延ばしスコア計算式 |
| BR-SCORE-004 | スコア確定の不可逆性 |
| BR-SCORE-005 | 締切なしタスクのスコア |
| BR-SCORE-006 | 週次集計の冪等性 |
| BR-SCORE-007 | 手動調整の許可 |

---

## BR-SCORE-001: タスクスコア範囲
- **ルール**: task_scoreは1〜100の整数値。
- **計算**: 6次元平均 × 20（各次元1〜5 → 平均1〜5 → ×20 → 20〜100）

## BR-SCORE-002: 次元スコア範囲
- **ルール**: 各次元は1〜5の整数値。

## BR-SCORE-003: 先延ばしスコア計算式
- **ルール**: `procrastination_score = task_score × elapsed_percentage / 100`
- **範囲**: 0〜100（task_score最大100 × 経過率最大100% / 100）

## BR-SCORE-004: スコア確定の不可逆性
- **ルール**: FinalizedScoreは一度作成されたら変更不可。
- **理由**: ランキングの公正性維持。

## BR-SCORE-005: 締切なしタスクのスコア
- **ルール**: deadline=nullのタスクはprocrastination_score=0固定。
- **動作**: DimensionScoreは記録可能だがランキングには反映されない。

## BR-SCORE-006: 週次集計の冪等性
- **ルール**: aggregateWeeklyScoresは何度実行しても同じ結果。
- **実装**: FinalizedScoreのweek_keyベースで再集計（upsert）。

## BR-SCORE-007: 手動調整の許可
- **ルール**: ユーザーはスコア確定前であれば次元スコアを手動調整可能。
- **動作**: 調整後にtask_scoreを再計算。source=MANUALLY_ADJUSTED。

---

## テスト可能なプロパティ（PBT-01準拠）

| プロパティ | カテゴリ | 説明 |
|---|---|---|
| タスクスコアの範囲不変条件 | Invariant | 任意の6次元入力（各1〜5）に対し、task_scoreは常に20〜100 |
| 先延ばしスコアの範囲不変条件 | Invariant | 任意のtask_score(1〜100)とelapsed(0〜100)に対し、結果は0〜100 |
| スコア計算の冪等性 | Idempotence | 同一入力で複数回計算しても結果は同一 |
| 週次集計の冪等性 | Idempotence | aggregateを複数回実行しても集計結果は同一 |
| スコア確定の不可逆性 | Invariant | 確定済みスコアへの更新は常に拒否される |
