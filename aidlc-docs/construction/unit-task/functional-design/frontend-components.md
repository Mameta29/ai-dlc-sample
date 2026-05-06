# unit-task フロントエンドコンポーネント設計

## コンポーネント一覧

| コンポーネント | 場所 | 目的 |
|---|---|---|
| TaskCreateForm | `features/task/components/TaskCreateForm.tsx` | タスク入力フォーム |
| TaskList | `features/task/components/TaskList.tsx` | タスク一覧 |
| TaskCard | `features/task/components/TaskCard.tsx` | タスクカード（一覧の各項目） |
| TaskEditDialog | `features/task/components/TaskEditDialog.tsx` | タスク編集ダイアログ |
| TaskDeleteConfirm | `features/task/components/TaskDeleteConfirm.tsx` | 削除確認ダイアログ |
| ProcrastinationTimer | `features/task/components/ProcrastinationTimer.tsx` | 先延ばし経過率タイマー |
| TaskStatusFilter | `features/task/components/TaskStatusFilter.tsx` | ステータスフィルター |

---

## TaskCreateForm

### 目的
タスクのタイトルと締切を入力して登録する。

### Props
| Prop | 型 | 必須 | 説明 |
|---|---|---|---|
| onSuccess | (task: Task) => void | No | 登録成功時コールバック |

### 状態管理
| State | 型 | 初期値 | 説明 |
|---|---|---|---|
| title | string | "" | タスクタイトル |
| deadline | Date | null | 締切日時 |
| hasDeadline | boolean | true | 締切あり/なしトグル |
| isSubmitting | boolean | false | 送信中フラグ |

### フォームバリデーション
- タイトル: 1〜200文字、空白のみ不可
- 締切: 未来日時のみ（hasDeadline=true の場合）

### ユーザーインタラクション
1. タイトル入力 → Enter または送信ボタンで登録
2. 締切トグルON → 日付ピッカー表示
3. 締切トグルOFF → 「ランキング対象外」ラベル表示
4. 送信成功 → フォームクリア + 成功トースト

### API連携
- `createTask` mutation (tRPC)

---

## TaskList

### 目的
ユーザーのタスク一覧を表示。フィルター・ソート対応。

### Props
なし（ページコンポーネント内で使用）

### 状態管理
| State | 型 | 初期値 | 説明 |
|---|---|---|---|
| statusFilter | TaskStatus | "all" | ステータスフィルター |
| sortBy | "created" | "deadline" | "score" | "created" | ソート基準 |

### API連携
- `listTasks` query (tRPC) with filter/sort params

---

## TaskCard

### 目的
タスク1件の表示。先延ばし経過率、残り時間、スコアを表示。

### Props
| Prop | 型 | 必須 | 説明 |
|---|---|---|---|
| task | Task | Yes | タスクデータ |
| onEdit | (task: Task) => void | Yes | 編集ボタンコールバック |
| onDelete | (taskId: string) => void | Yes | 削除ボタンコールバック |
| onComplete | (taskId: string) => void | Yes | 完了ボタンコールバック |

### 表示内容
- タイトル
- ステータスバッジ（先延ばし中/完了/期限切れ）
- ProcrastinationTimer（先延ばし中のみ）
- 残り時間（締切ありのみ）
- タスクスコア（設定済みの場合）
- アクションボタン（完了/編集/削除）

---

## TaskEditDialog

### 目的
タスクのタイトル・締切を編集するダイアログ。

### Props
| Prop | 型 | 必須 | 説明 |
|---|---|---|---|
| task | Task | Yes | 編集対象タスク |
| isOpen | boolean | Yes | ダイアログ表示状態 |
| onClose | () => void | Yes | 閉じるコールバック |
| onSave | (task: Task) => void | Yes | 保存成功コールバック |

### 締切変更確認
- 先延ばし中のタスクの締切変更時: 確認メッセージ表示
- 「先延ばし時間が再計算されます。よろしいですか？」

---

## TaskDeleteConfirm

### 目的
タスク削除前の確認ダイアログ。

### Props
| Prop | 型 | 必須 | 説明 |
|---|---|---|---|
| isOpen | boolean | Yes | 表示状態 |
| taskTitle | string | Yes | 削除対象タスクのタイトル |
| onConfirm | () => Promise<void> | Yes | 削除確認コールバック |
| onCancel | () => void | Yes | キャンセルコールバック |

---

## ProcrastinationTimer

### 目的
先延ばし経過率をリアルタイム表示するプログレスバー。

### Props
| Prop | 型 | 必須 | 説明 |
|---|---|---|---|
| startedAt | Date | Yes | 先延ばし開始日時 |
| deadline | Date | null | Yes | 締切日時（nullの場合は非表示） |
| status | TaskStatus | Yes | タスク状態 |
| completedAt | Date | null | No | 完了日時（COMPLETED時の固定表示用） |

### 動作
- 1分間隔で経過率を再計算
- プログレスバー: 0〜50%（緑）、50〜80%（黄）、80〜100%（赤）
- deadline = null: 非表示
- COMPLETED: completedAt時点の値で固定
- EXPIRED: 100%固定（赤）

---

## TaskStatusFilter

### 目的
タスク一覧のステータスフィルターUI。

### Props
| Prop | 型 | 必須 | 説明 |
|---|---|---|---|
| value | TaskStatus | "all" | Yes | 現在のフィルター値 |
| onChange | (status: TaskStatus | "all") => void | Yes | 変更コールバック |
| counts | Record<TaskStatus | "all", number> | Yes | 各ステータスの件数 |

### 表示
- タブ形式: 全て(N) | 先延ばし中(N) | 完了(N) | 期限切れ(N)
