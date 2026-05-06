# unit-task Code Generation Plan

> **This plan is the single source of truth for Code Generation (unit-task)**

## ユニットコンテキスト

| 項目 | 内容 |
|---|---|
| **ユニット** | unit-task |
| **責任** | タスクCRUD、状態管理、締切管理、先延ばし経過率計算 |
| **関連ストーリー** | US-005〜US-010 |
| **依存先ユニット** | unit-auth（認証） |
| **被依存ユニット** | unit-scoring（スコア計算）、unit-ai（タスク定量化） |

## コード配置先

```
saborou/apps/web/src/
├── features/task/
│   ├── server/          # tRPCルーター、サービス
│   ├── components/      # UIコンポーネント
│   ├── hooks/           # React Query フック
│   └── lib/             # 経過率計算ユーティリティ
├── lib/trpc/            # tRPC基盤設定（新規）
├── app/api/trpc/        # tRPC APIルート（新規）
└── app/api/cron/expire-tasks/  # 期限切れCron
```

---

## 生成ステップ

### Step 1: tRPC基盤セットアップ
- [x] `src/lib/trpc/server.ts` — tRPCサーバー初期化、コンテキスト定義
- [x] `src/lib/trpc/client.ts` — tRPCクライアント設定
- [x] `src/lib/trpc/react.tsx` — tRPC React Provider
- [x] `src/app/api/trpc/[trpc]/route.ts` — tRPC APIルートハンドラ
- [x] `src/app/layout.tsx` 更新 — TRPCProvider追加
- **ストーリー**: 基盤（全unit共通）

### Step 2: DBマイグレーション
- [x] `supabase/migrations/00003_create_tasks.sql` — tasksテーブル + RLS
- [x] `supabase/migrations/00004_create_task_change_logs.sql` — 変更履歴テーブル + RLS
- **ストーリー**: US-005〜US-010

### Step 3: 共通ユーティリティ
- [x] `src/features/task/lib/calculator.ts` — 先延ばし経過率計算
- [x] `src/features/task/lib/types.ts` — Task型定義
- [x] `src/features/task/lib/schemas.ts` — Zodバリデーションスキーマ
- **ストーリー**: US-005〜US-010

### Step 4: ビジネスロジック
- [x] `src/features/task/server/service.ts` — タスクサービス
- [x] `src/features/task/server/router.ts` — tRPCルーター
- **ストーリー**: US-005〜US-010

### Step 5: ビジネスロジック テスト
- [x] `src/features/task/lib/__tests__/calculator.test.ts` — 経過率計算テスト
- [x] `src/features/task/lib/__tests__/calculator.property.test.ts` — PBTテスト
- [x] `src/features/task/server/__tests__/router.test.ts` — tRPCルーターテスト
- **ストーリー**: US-005〜US-010（テスト）

### Step 6: Cron Job（期限切れバッチ）
- [x] `src/app/api/cron/expire-tasks/route.ts` — 期限切れバッチ
- [x] `vercel.json` 更新 — Cron追加
- **ストーリー**: US-007

### Step 7: React Query フック
- [x] `src/features/task/hooks/useTaskList.ts` — 一覧取得（無限スクロール）
- [x] `src/features/task/hooks/useTask.ts` — 詳細取得
- [x] `src/features/task/hooks/useCreateTask.ts` — 作成（楽観的更新）
- [x] `src/features/task/hooks/useUpdateTask.ts` — 更新（楽観的更新）
- [x] `src/features/task/hooks/useDeleteTask.ts` — 削除（楽観的更新）
- [x] `src/features/task/hooks/useCompleteTask.ts` — 完了
- **ストーリー**: US-005〜US-010

### Step 8: フロントエンドコンポーネント
- [x] `src/features/task/components/TaskCreateForm.tsx`
- [x] `src/features/task/components/TaskList.tsx`
- [x] `src/features/task/components/TaskCard.tsx`
- [x] `src/features/task/components/TaskEditDialog.tsx`
- [x] `src/features/task/components/TaskDeleteConfirm.tsx`
- [x] `src/features/task/components/ProcrastinationTimer.tsx`
- [x] `src/features/task/components/TaskStatusFilter.tsx`
- **ストーリー**: US-005〜US-010

### Step 9: フロントエンド テスト
- [x] `src/features/task/components/__tests__/TaskCreateForm.test.tsx`
- [x] `src/features/task/components/__tests__/ProcrastinationTimer.test.tsx`
- [x] `src/features/task/components/__tests__/TaskCard.test.tsx`
- **ストーリー**: US-005〜US-010（UIテスト）

### Step 10: ドキュメント
- [x] `aidlc-docs/construction/unit-task/code/code-summary.md`
- **ストーリー**: 基盤

---

## ストーリートレーサビリティ

| Story ID | タイトル | 実装ステップ |
|---|---|---|
| US-005 | テキストでタスク入力 | Step 2, 3, 4, 7, 8 |
| US-006 | 締切日時の設定 | Step 2, 3, 4, 7, 8 |
| US-007 | タスク一覧表示 | Step 3, 4, 6, 7, 8 |
| US-008 | タスク編集 | Step 2, 3, 4, 7, 8 |
| US-009 | タスク削除 | Step 4, 7, 8 |
| US-010 | タスクの完了報告 | Step 4, 7, 8 |

## 合計
- **10ステップ**
- **生成ファイル数**: 約30ファイル
- **テストファイル数**: 6ファイル（PBT含む）
