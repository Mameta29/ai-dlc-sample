# unit-task 論理コンポーネント

## コンポーネント一覧

| # | 論理コンポーネント | 種別 | 目的 |
|---|---|---|---|
| 1 | Task tRPC Router | tRPCルーター | タスクCRUD APIエンドポイント |
| 2 | Task Service | サーバーサイドロジック | ビジネスロジック実行 |
| 3 | Task Query Hooks | React Hooks | tRPC + TanStack Query統合 |
| 4 | Expiration Scheduler | Vercel Cron | 期限切れバッチ処理 |
| 5 | Procrastination Calculator | ユーティリティ | 経過率算出（クライアント/サーバー共用） |

---

## LC-1: Task tRPC Router

### エンドポイント

| Procedure | 種別 | 入力 | 出力 |
|---|---|---|---|
| task.create | mutation | CreateTaskInput | Task |
| task.update | mutation | UpdateTaskInput | Task |
| task.delete | mutation | { id: string } | void |
| task.complete | mutation | { id: string } | TaskCompletion |
| task.list | query | TaskFilter | TaskPage |
| task.get | query | { id: string } | Task |

### 実装場所
- `src/features/task/server/router.ts`

---

## LC-2: Task Service

### 責任
- タスクCRUDのビジネスロジック
- バリデーション
- 変更履歴記録
- unit-scoringとの連携（完了時）

### 実装場所
- `src/features/task/server/service.ts`

---

## LC-3: Task Query Hooks

### フック一覧
| Hook | 目的 |
|---|---|
| useTaskList | タスク一覧取得（無限スクロール） |
| useTask | タスク詳細取得 |
| useCreateTask | タスク作成（楽観的更新） |
| useUpdateTask | タスク更新（楽観的更新） |
| useDeleteTask | タスク削除（楽観的更新） |
| useCompleteTask | タスク完了 |

### 実装場所
- `src/features/task/hooks/`

---

## LC-4: Expiration Scheduler

### 実行方式
- Vercel Cron Job（1時間ごと）
- API Route: `src/app/api/cron/expire-tasks/route.ts`

### 実装場所
- `src/app/api/cron/expire-tasks/route.ts`

---

## LC-5: Procrastination Calculator

### 目的
先延ばし経過率のクライアント/サーバー共用算出ロジック。

### インターフェース
```typescript
function calcElapsedPercentage(
  startedAt: Date,
  deadline: Date | null,
  status: TaskStatus,
  completedAt?: Date | null
): number
```

### 実装場所
- `src/features/task/lib/calculator.ts`
