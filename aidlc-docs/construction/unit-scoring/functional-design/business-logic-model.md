# unit-scoring ビジネスロジックモデル

## ビジネスプロセス一覧

| # | プロセス | トリガー | 関連ストーリー |
|---|---|---|---|
| 1 | タスクスコア算出 | AI質問回答後 / スキップ時 | US-012 |
| 2 | 先延ばしスコア算出 | リアルタイム計算 | US-014, US-015 |
| 3 | スコア確定 | タスク完了 / 期限切れ | US-015 |
| 4 | 週次集計 | Cron（毎週月曜 00:00 UTC） | US-017 |

---

## BP-1: タスクスコア算出

```
計算式:
  task_score = (stakeholders + financial_impact + urgency +
                difficulty + uncertainty + reputation_impact) / 6 × 100 / 5

  → 各次元1〜5の平均を100点満点に変換

ルール:
  - 全6次元が揃ったら計算
  - スキップされた次元はAIが推定（source: AI_ESTIMATED）
  - ユーザーが手動調整した場合は再計算（source: MANUALLY_ADJUSTED）
  - 結果を tasks.task_score に反映
```

---

## BP-2: 先延ばしスコア算出（リアルタイム）

```
計算式:
  procrastination_score = task_score × elapsed_percentage / 100

  - task_score: BP-1で算出済み（1〜100）
  - elapsed_percentage: unit-taskのcalcElapsedPercentageで算出（0〜100）

ルール:
  - task_scoreが未設定の場合: 0を返す
  - deadlineがnullの場合: 0を返す（ランキング対象外）
  - クライアント側でリアルタイム計算（1分間隔）
```

---

## BP-3: スコア確定

```
トリガー: タスク完了（COMPLETED）または期限切れ（EXPIRED）

1. タスクの現在状態を取得
2. 確定時の値を計算:
   - COMPLETED: completed_at時点のelapsed_percentageを使用
   - EXPIRED: elapsed_percentage = 100
3. procrastination_score = task_score × elapsed_percentage / 100
4. FinalizedScoreレコード作成
   - week_key: 確定日のISO週番号
5. tasks.procrastination_score を更新
6. WeeklyAggregateを更新（upsert）
   - total_score += procrastination_score
   - task_count += 1
```

---

## BP-4: 週次集計（バッチ）

```
1. 前週のweek_keyを算出
2. 前週のFinalizedScoreを集計
3. WeeklyAggregateレコードをupsert
   - user_idごとにtotal_scoreとtask_countを集計
4. ランキングデータ更新（unit-rankingへ通知）
```
