# Unit Test Execution

## Run All Unit Tests

```bash
cd saborou/apps/web
npx vitest run
```

## Test Files Summary

| ユニット | テストファイル | 種別 |
|---|---|---|
| unit-auth | `features/auth/lib/__tests__/auth-service.test.ts` | ユニット |
| unit-auth | `features/auth/lib/__tests__/auth-service.property.test.ts` | PBT |
| unit-auth | `__tests__/middleware.test.ts` | ユニット |
| unit-auth | `features/auth/components/__tests__/AuthProvider.test.tsx` | コンポーネント |
| unit-auth | `features/auth/components/__tests__/SignOutButton.test.tsx` | コンポーネント |
| unit-auth | `features/auth/components/__tests__/DeletionCancelDialog.test.tsx` | コンポーネント |
| unit-auth | `app/api/cron/delete-accounts/__tests__/route.test.ts` | API |
| unit-task | `features/task/lib/__tests__/calculator.test.ts` | ユニット |
| unit-task | `features/task/lib/__tests__/calculator.property.test.ts` | PBT |
| unit-task | `features/task/server/__tests__/router.test.ts` | スキーマ |
| unit-task | `features/task/components/__tests__/TaskCreateForm.test.tsx` | コンポーネント |
| unit-task | `features/task/components/__tests__/ProcrastinationTimer.test.tsx` | コンポーネント |
| unit-task | `features/task/components/__tests__/TaskCard.test.tsx` | コンポーネント |
| unit-scoring | `features/scoring/lib/__tests__/calculator.test.ts` | ユニット |
| unit-scoring | `features/scoring/lib/__tests__/calculator.property.test.ts` | PBT |
| unit-ai | `features/ai/lib/__tests__/characters.test.ts` | ユニット |

## Expected Results
- **Total Tests**: ~50+ テストケース
- **PBT Tests**: 4ファイル（各100回のランダムテスト）
- **Expected**: 全テスト PASS
- **Coverage Target**: 80%+（ビジネスロジック）

## Run with Coverage

```bash
npx vitest run --coverage
```

## Run Specific Unit Tests

```bash
# unit-auth のみ
npx vitest run --reporter=verbose src/features/auth

# unit-task のみ
npx vitest run --reporter=verbose src/features/task

# PBT のみ
npx vitest run --reporter=verbose "*.property.test.*"
```

## Fix Failing Tests

1. テスト出力でエラー詳細を確認
2. `npx vitest watch` でウォッチモード起動
3. 該当ファイルを修正
4. 全テスト再実行で確認
