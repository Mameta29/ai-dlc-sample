# unit-task Code Generation Summary

## 生成ファイル一覧

### tRPC基盤（新規、全ユニット共通）
| ファイル | 目的 |
|---|---|
| `src/lib/trpc/server.ts` | tRPCサーバー初期化、protectedProcedure |
| `src/lib/trpc/client.ts` | tRPCクライアント |
| `src/lib/trpc/react.tsx` | TRPCReactProvider |
| `src/lib/trpc/router.ts` | AppRouter（ルーター集約） |
| `src/app/api/trpc/[trpc]/route.ts` | tRPC APIルートハンドラ |

### DBマイグレーション
| ファイル | 目的 |
|---|---|
| `supabase/migrations/00003_create_tasks.sql` | tasksテーブル + RLS |
| `supabase/migrations/00004_create_task_change_logs.sql` | 変更履歴テーブル + RLS |

### ビジネスロジック
| ファイル | 目的 |
|---|---|
| `src/features/task/lib/types.ts` | Task型定義 |
| `src/features/task/lib/schemas.ts` | Zodバリデーションスキーマ |
| `src/features/task/lib/calculator.ts` | 先延ばし経過率計算 |
| `src/features/task/server/service.ts` | タスクサービス |
| `src/features/task/server/router.ts` | tRPCルーター |

### Cron Job
| ファイル | 目的 |
|---|---|
| `src/app/api/cron/expire-tasks/route.ts` | 期限切れバッチ |

### React Query フック（6ファイル）
| ファイル | 目的 |
|---|---|
| `src/features/task/hooks/useTaskList.ts` | 一覧（無限スクロール） |
| `src/features/task/hooks/useTask.ts` | 詳細取得 |
| `src/features/task/hooks/useCreateTask.ts` | 作成 |
| `src/features/task/hooks/useUpdateTask.ts` | 更新 |
| `src/features/task/hooks/useDeleteTask.ts` | 削除 |
| `src/features/task/hooks/useCompleteTask.ts` | 完了 |

### UIコンポーネント（7ファイル）
| ファイル | 目的 |
|---|---|
| `src/features/task/components/TaskCreateForm.tsx` | 入力フォーム |
| `src/features/task/components/TaskList.tsx` | 一覧 |
| `src/features/task/components/TaskCard.tsx` | カード |
| `src/features/task/components/TaskEditDialog.tsx` | 編集ダイアログ |
| `src/features/task/components/TaskDeleteConfirm.tsx` | 削除確認 |
| `src/features/task/components/ProcrastinationTimer.tsx` | 経過率タイマー |
| `src/features/task/components/TaskStatusFilter.tsx` | フィルター |

### テスト（6ファイル）
| ファイル | 種別 |
|---|---|
| `src/features/task/lib/__tests__/calculator.test.ts` | ユニットテスト |
| `src/features/task/lib/__tests__/calculator.property.test.ts` | PBTテスト |
| `src/features/task/server/__tests__/router.test.ts` | スキーマテスト |
| `src/features/task/components/__tests__/TaskCreateForm.test.tsx` | コンポーネントテスト |
| `src/features/task/components/__tests__/ProcrastinationTimer.test.tsx` | コンポーネントテスト |
| `src/features/task/components/__tests__/TaskCard.test.tsx` | コンポーネントテスト |

### 更新ファイル
| ファイル | 変更内容 |
|---|---|
| `src/app/layout.tsx` | TRPCProvider + AuthProvider追加 |
| `package.json` | tRPC, TanStack Query, Zod, superjson追加 |
| `vercel.json` | expire-tasks Cron追加 |

## ストーリー実装状況

| Story ID | タイトル | 状態 |
|---|---|---|
| US-005 | テキストでタスク入力 | ✅ |
| US-006 | 締切日時の設定 | ✅ |
| US-007 | タスク一覧表示 | ✅ |
| US-008 | タスク編集 | ✅ |
| US-009 | タスク削除 | ✅ |
| US-010 | タスクの完了報告 | ✅ |
