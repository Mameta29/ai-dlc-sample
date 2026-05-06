# unit-ai Code Generation Summary

## 生成ファイル一覧

### DBマイグレーション
- `supabase/migrations/00006_create_ai_tables.sql` — conversations, messages, excuse_patterns + RLS

### ビジネスロジック
- `src/features/ai/lib/types.ts` — AI型定義
- `src/features/ai/lib/characters.ts` — 3キャラクター定義 + system prompts
- `src/features/ai/lib/prompts.ts` — プロンプトテンプレート（定量化、言い訳、煽り、オープン質問）
- `src/features/ai/lib/schemas.ts` — Zodスキーマ
- `src/features/ai/server/service.ts` — AI対話サービス
- `src/features/ai/server/router.ts` — tRPCルーター

### ストリーミングAPI
- `src/app/api/ai/chat/route.ts` — Vercel AI SDK + OpenAI GPT-4oストリーミング

### React Hooks
- `src/features/ai/hooks/useChat.ts` — AI SDKストリーミングチャット
- `src/features/ai/hooks/useConversation.ts` — 対話管理フック

### テスト
- `src/features/ai/lib/__tests__/characters.test.ts` — キャラクター設定テスト

### 更新ファイル
- `src/lib/trpc/router.ts` — aiRouter追加
- `package.json` — @ai-sdk/openai, @ai-sdk/react, ai追加

## ストーリー実装状況
| Story ID | タイトル | 状態 |
|---|---|---|
| US-011 | AIによるタスク重さ質問 | ✅ |
| US-018 | AIからのオープン質問 | ✅ |
| US-019 | AIによる言い訳パターン提示 | ✅ |
| US-020 | 言い回しバリエーション | ✅ |
| US-021 | 煽り対話（自己像抽出） | ✅ |
| US-022 | AIキャラクター切り替え | ✅ |
| US-003 | AIキャラクター選択（オンボーディング） | ✅ |
