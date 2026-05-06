# unit-scoring 技術スタック決定

| カテゴリ | 技術 | 理由 |
|---|---|---|
| APIレイヤー | tRPC（既存） | unit-taskと統一 |
| DB | Supabase PostgreSQL（既存） | 共有DB |
| 週次集計バッチ | Vercel Cron Jobs | 毎週月曜 00:00 UTC |
| クライアント計算 | 共有calculator関数 | unit-taskのcalculatorを拡張 |
