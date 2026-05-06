# unit-task インフラストラクチャ設計

## 共有インフラ（unit-authと同一）

unit-authで定義したインフラをそのまま利用。以下は差分のみ。

## 追加コンポーネント

| 論理コンポーネント | インフラサービス |
|---|---|
| Task tRPC Router | Vercel Serverless Functions（既存tRPCルートに統合） |
| Task Service | Vercel Serverless Functions内 |
| Expiration Scheduler | Vercel Cron Jobs（1時間ごと） |
| Procrastination Calculator | クライアントサイド + Serverless |

## 追加DBテーブル

| テーブル | RLSポリシー |
|---|---|
| public.tasks | 自分のタスクのみ読み書き可 |
| public.task_change_logs | 自分のタスクの履歴のみ読み取り可 |

## tRPC設定

unit-taskが最初のtRPC利用ユニット。以下のインフラセットアップが必要:
- `src/lib/trpc/` — tRPCクライアント/サーバー設定
- `src/app/api/trpc/[trpc]/route.ts` — tRPC APIルートハンドラ

## 追加Cron Job

```json
{
  "path": "/api/cron/expire-tasks",
  "schedule": "0 * * * *"
}
```

## 追加環境変数

追加の環境変数は不要（既存のSupabase設定を利用）。
