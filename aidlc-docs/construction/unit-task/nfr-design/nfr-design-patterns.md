# unit-task NFR設計パターン

## 適用パターン一覧

| # | パターン | カテゴリ | 対象NFR |
|---|---|---|---|
| 1 | Optimistic Update | パフォーマンス | NFR-TASK-P01〜P02 |
| 2 | Cursor-based Pagination | スケーラビリティ | NFR-TASK-S01 |
| 3 | Input Validation Chain | セキュリティ | NFR-TASK-SEC02 |
| 4 | Idempotent Batch Processing | 信頼性 | NFR-TASK-R02 |
| 5 | Transactional Completion | 信頼性 | NFR-TASK-R01 |

---

## Pattern 1: Optimistic Update

### 目的
タスクCRUD操作の体感速度を向上。サーバー応答を待たずにUIを即時更新。

### 設計
- TanStack Queryの `useMutation` + `onMutate` で楽観的更新
- 成功: キャッシュ確定
- 失敗: `onError` でロールバック + エラートースト

### 適用操作
- タスク作成: 一覧にタスクカードを即時追加
- タスク編集: タイトル/締切を即時反映
- タスク削除: 一覧から即時削除
- タスク完了: ステータスバッジを即時変更

---

## Pattern 2: Cursor-based Pagination

### 目的
大量タスクでもパフォーマンスを維持。

### 設計
- `created_at` + `id` でカーソル定義
- 1ページ20件
- 無限スクロールで自動読み込み
- TanStack Queryの `useInfiniteQuery` を使用

---

## Pattern 3: Input Validation Chain

### 目的
クライアント〜サーバー〜DBの3層でバリデーション。

### 設計
```
Client (Zod schema) → tRPC (Zod input) → DB (CHECK constraint + RLS)
```

- Zodスキーマを共有（クライアント/サーバー同一定義）
- tRPCのinputでサーバー側バリデーション自動適用
- DB側はCHECK制約（タイトル長、ステータス値）+ RLS（所有権）

---

## Pattern 4: Idempotent Batch Processing

### 目的
期限切れバッチが何度実行されても安全。

### 設計
- `WHERE status = 'PROCRASTINATING' AND deadline < NOW()`
- 既にEXPIREDのタスクは再処理されない
- `FOR UPDATE SKIP LOCKED` で並行実行時の競合防止

---

## Pattern 5: Transactional Completion

### 目的
タスク完了 + スコア確定の一貫性保証。

### 設計
- PostgreSQL RPC関数（`complete_task_and_finalize_score`）でトランザクション実行
- Task status更新 + Scoring確定を1トランザクションで処理
- 失敗時は全ロールバック
