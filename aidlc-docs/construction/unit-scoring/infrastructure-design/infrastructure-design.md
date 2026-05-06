# unit-scoring インフラストラクチャ設計

## unit-authと共有するインフラ
Vercel + Supabase（差分のみ記載）

## 追加DBテーブル
| テーブル | RLSポリシー |
|---|---|
| public.dimension_scores | 自分のタスクのスコアのみ読み書き可 |
| public.finalized_scores | 自分のスコアのみ読み取り可（サービスロールで作成） |
| public.weekly_aggregates | 全ユーザー読み取り可（ランキング用） |

## 追加Cron Job
```json
{ "path": "/api/cron/aggregate-weekly", "schedule": "0 0 * * 1" }
```
