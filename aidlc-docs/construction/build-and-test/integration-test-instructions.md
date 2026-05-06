# Integration Test Instructions

## Purpose
ユニット間の連携が正しく動作することを確認する。

## Test Scenarios

### Scenario 1: Auth → Task Integration
- **Description**: 認証済みユーザーがタスクをCRUDできることを確認
- **Setup**: テストユーザーでサインイン
- **Test Steps**:
  1. Google OAuthでサインイン
  2. タスクを作成（タイトル + 締切）
  3. タスク一覧に表示されることを確認
  4. タスクを編集
  5. タスクを完了
- **Expected**: 全操作が成功し、データが正しく保存される

### Scenario 2: Task → Scoring Integration
- **Description**: タスク完了時にスコアが確定されることを確認
- **Setup**: タスク作成 + 次元スコア設定済み
- **Test Steps**:
  1. タスクに次元スコアを設定（6次元）
  2. task_scoreが計算されることを確認
  3. タスクを完了
  4. FinalizedScoreが作成されることを確認
  5. WeeklyAggregateが更新されることを確認
- **Expected**: procrastination_score = task_score × elapsed_percentage / 100

### Scenario 3: Task → AI Integration
- **Description**: タスク登録後にAI対話が開始されることを確認
- **Setup**: テストユーザー + キャラクター選択済み
- **Test Steps**:
  1. タスクを作成
  2. AI対話セッション開始（TASK_QUANTIFY）
  3. 6次元の質問に回答
  4. タスクスコアが設定されることを確認
- **Expected**: 対話データとスコアが正しく保存される

### Scenario 4: Scoring → Ranking Integration
- **Description**: スコア確定後にランキングに反映されることを確認
- **Setup**: 複数ユーザー + スコア確定済み
- **Test Steps**:
  1. ユーザーAのスコア確定
  2. ユーザーBのスコア確定
  3. グローバルランキング取得
  4. 順位がスコア順であることを確認
- **Expected**: total_score降順でランキング表示

### Scenario 5: Auth → Account Deletion Flow
- **Description**: アカウント削除フロー全体のテスト
- **Test Steps**:
  1. 削除リクエスト作成
  2. ユーザーステータスがPENDING_DELETIONに変更
  3. ログイン時にキャンセルダイアログ表示
  4. キャンセルでACTIVEに復帰
- **Expected**: ステータス遷移が正しく動作

## Setup Integration Test Environment

```bash
# ローカルSupabase起動
npx supabase start

# テスト用シードデータ投入
npx supabase db seed

# 環境変数設定（ローカルSupabase用）
export NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
export NEXT_PUBLIC_SUPABASE_ANON_KEY=$(npx supabase status -o json | jq -r '.ANON_KEY')
```

## Run Integration Tests

```bash
# 統合テスト実行（手動確認ベース）
npm run dev
# ブラウザで http://localhost:3000 にアクセスし、各シナリオを手動実行

# 将来的にPlaywright等でE2E自動化を検討
```
