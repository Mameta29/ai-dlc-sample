# unit-scoring ドメインエンティティ定義

## エンティティ一覧

| エンティティ | 説明 |
|---|---|
| DimensionScore | タスクの6次元スコア（AI算出 + ユーザー回答） |
| FinalizedScore | 確定済み先延ばしスコア |
| WeeklyAggregate | 週次集計スコア |

---

## DimensionScore

| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| id | UUID | Yes | プライマリキー |
| task_id | UUID | Yes | 対象タスクID（FK → tasks） |
| stakeholders | number | Yes | 利害関係者数（1〜5） |
| financial_impact | number | Yes | 金額影響度（1〜5） |
| urgency | number | Yes | 期日の切迫度（1〜5） |
| difficulty | number | Yes | 難度（1〜5） |
| uncertainty | number | Yes | 未知度（1〜5） |
| reputation_impact | number | Yes | 評価への影響（1〜5） |
| source | ScoreSource | Yes | スコアの算出元 |
| created_at | timestamp | Yes | 作成日時 |

### ScoreSource（列挙型）

| 値 | 説明 |
|---|---|
| AI_ESTIMATED | AIが推定（ユーザーがスキップした次元） |
| USER_PROVIDED | ユーザーが回答 |
| MANUALLY_ADJUSTED | ユーザーが手動調整 |

---

## FinalizedScore

| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| id | UUID | Yes | プライマリキー |
| task_id | UUID | Yes | 対象タスクID（FK → tasks, UNIQUE） |
| user_id | UUID | Yes | ユーザーID（FK → users） |
| task_score | number | Yes | タスク重さスコア（1〜100） |
| elapsed_percentage | number | Yes | 確定時の先延ばし経過率（0〜100） |
| procrastination_score | number | Yes | 先延ばしスコア（task_score × elapsed_percentage / 100） |
| finalized_at | timestamp | Yes | スコア確定日時 |
| week_key | string | Yes | 所属週キー（例: "2026-W19"） |

---

## WeeklyAggregate

| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| id | UUID | Yes | プライマリキー |
| user_id | UUID | Yes | ユーザーID（FK → users） |
| week_key | string | Yes | 週キー（例: "2026-W19"） |
| total_score | number | Yes | 週次合計先延ばしスコア |
| task_count | number | Yes | 確定タスク数 |
| created_at | timestamp | Yes | 作成日時 |
| updated_at | timestamp | Yes | 更新日時 |

---

## エンティティ関連図

```
Task (1) ──── (1) DimensionScore
  │
  │ 1:1
  ▼
FinalizedScore (1) ──── (N:1) ──── WeeklyAggregate
```
