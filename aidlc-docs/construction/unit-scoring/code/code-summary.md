# unit-scoring Code Generation Summary

## 生成ファイル一覧

### DBマイグレーション
| ファイル | 目的 |
|---|---|
| `supabase/migrations/00005_create_scoring_tables.sql` | dimension_scores, finalized_scores, weekly_aggregates + RLS |

### ビジネスロジック
| ファイル | 目的 |
|---|---|
| `src/features/scoring/lib/types.ts` | スコア型定義 |
| `src/features/scoring/lib/schemas.ts` | Zodスキーマ |
| `src/features/scoring/lib/calculator.ts` | スコア算出ロジック |
| `src/features/scoring/server/service.ts` | スコアリングサービス |
| `src/features/scoring/server/router.ts` | tRPCルーター |

### Cron Job
| ファイル | 目的 |
|---|---|
| `src/app/api/cron/aggregate-weekly/route.ts` | 週次集計バッチ |

### React Query フック
| ファイル | 目的 |
|---|---|
| `src/features/scoring/hooks/useSetDimensions.ts` | 次元スコア設定 |
| `src/features/scoring/hooks/useWeeklyTotal.ts` | 週次合計取得 |

### テスト
| ファイル | 種別 |
|---|---|
| `src/features/scoring/lib/__tests__/calculator.test.ts` | ユニットテスト |
| `src/features/scoring/lib/__tests__/calculator.property.test.ts` | PBTテスト |

### 更新ファイル
| ファイル | 変更内容 |
|---|---|
| `src/lib/trpc/router.ts` | scoringRouter追加 |
| `vercel.json` | aggregate-weekly Cron追加 |

## ストーリー実装状況
| Story ID | タイトル | 状態 |
|---|---|---|
| US-012 | AIによる自動タスクスコア算出 | ✅ |
| US-014 | リアルタイム先延ばし時間カウント | ✅ (unit-taskのProcrastinationTimerと連携) |
| US-015 | 先延ばしスコア算出 | ✅ |
| US-017 | 週次スコア集計 | ✅ |
