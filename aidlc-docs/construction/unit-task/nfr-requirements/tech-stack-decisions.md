# unit-task 技術スタック決定

## 技術選定一覧

| カテゴリ | 技術 | 選定理由 |
|---|---|---|
| APIレイヤー | tRPC | 型安全なAPI定義、Next.js統合 |
| バリデーション | Zod | tRPC統合、ランタイム型検証 |
| データベース | Supabase PostgreSQL | unit-authと共有、RLS対応 |
| 状態管理 | TanStack Query (React Query) | サーバー状態キャッシュ、楽観的更新 |
| 期限切れバッチ | Vercel Cron Jobs | unit-authと同じインフラ |
| テスト | Vitest + fast-check | unit-authと統一 |

## tRPC設定

- `apps/web/src/features/task/server/router.ts` — タスクtRPCルーター
- `apps/web/src/app/api/trpc/[trpc]/route.ts` — tRPC APIルート
- `apps/web/src/lib/trpc/` — tRPCクライアント設定

## 非採用技術

| 技術 | 不採用理由 |
|---|---|
| REST API (Route Handlers) | tRPCの型安全性が優位 |
| GraphQL | 小規模プロジェクトには過剰 |
| Prisma | Supabase CLIのマイグレーション管理と競合 |
