# unit-task ドメインエンティティ定義

## エンティティ一覧

| エンティティ | 説明 |
|---|---|
| Task | ユーザーが登録するタスク |
| TaskChangeLog | タスク変更履歴（監査用） |

---

## Task

| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| id | UUID | Yes | プライマリキー |
| user_id | UUID | Yes | 所有ユーザーID（FK → users） |
| title | string | Yes | タスクタイトル（1〜200文字） |
| status | TaskStatus | Yes | タスク状態 |
| deadline | timestamp | No | 締切日時（nullの場合は締切なし） |
| task_score | number | No | AIが算出したタスク重さスコア（1〜100）。unit-scoring管理 |
| procrastination_score | number | No | 先延ばしスコア。unit-scoring管理 |
| started_at | timestamp | Yes | 先延ばし開始日時（タスク登録日時） |
| completed_at | timestamp | No | 完了日時 |
| expired_at | timestamp | No | 期限切れ判定日時 |
| created_at | timestamp | Yes | 作成日時 |
| updated_at | timestamp | Yes | 最終更新日時 |

### TaskStatus（列挙型）

| 値 | 説明 |
|---|---|
| PROCRASTINATING | 先延ばし中（登録直後のデフォルト） |
| COMPLETED | 完了（ユーザーが完了報告） |
| EXPIRED | 期限切れ（締切超過で自動遷移） |

---

## TaskChangeLog

| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| id | UUID | Yes | プライマリキー |
| task_id | UUID | Yes | 対象タスクID（FK → tasks） |
| field_name | string | Yes | 変更フィールド名（"title" or "deadline"） |
| old_value | string | No | 変更前の値 |
| new_value | string | No | 変更後の値 |
| changed_at | timestamp | Yes | 変更日時 |

---

## エンティティ関連図

### Text Alternative
```
User (1) ──── (N) Task
                    │
                    │ 1:N
                    ▼
              TaskChangeLog (N)
```

- User : Task = 1:N（ユーザーは複数タスクを持つ）
- Task : TaskChangeLog = 1:N（タスクは複数の変更履歴を持つ）
