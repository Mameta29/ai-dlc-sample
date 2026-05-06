# unit-auth Code Generation Plan

> **This plan is the single source of truth for Code Generation (unit-auth)**

## ユニットコンテキスト

| 項目 | 内容 |
|---|---|
| **ユニット** | unit-auth |
| **責任** | Google OAuth認証、セッション管理、トークン検証、アクセス制御ミドルウェア |
| **関連ストーリー** | US-001（Googleサインアップ）、US-052（アカウント削除） |
| **依存先ユニット** | なし（基盤ユニット） |
| **被依存ユニット** | unit-task, unit-scoring, unit-ai, unit-ranking, unit-analytics, unit-social, unit-profile, unit-notification, unit-mcp |
| **プロジェクトタイプ** | Greenfield, monorepo |
| **ワークスペースルート** | /Users/shineikikkawa/dev/hackson/ai-dlc |

## データベースエンティティ

- `public.users` — アプリケーションユーザー情報
- `public.account_deletion_requests` — アカウント削除リクエスト

## コード配置先

```
saborou/
├── apps/web/src/
│   ├── app/(auth)/          # 認証ページ
│   ├── app/api/cron/        # Cron APIルート
│   ├── features/auth/       # 認証機能ドメイン
│   ├── lib/supabase/        # Supabaseクライアント
│   └── middleware.ts        # 認証Middleware
├── supabase/migrations/     # DBマイグレーション
└── vercel.json              # Cron設定
```

---

## 生成ステップ

### Step 1: プロジェクト構造セットアップ ✅
- [x] monorepoルート構成（package.json, turbo.json, tsconfig.base.json）
- [x] apps/web ディレクトリ構成（next.config.ts, tailwind.config.ts, package.json, tsconfig.json）
- [x] supabase/ ディレクトリ構成
- [x] 共通型定義ディレクトリ（packages/shared）
- **ストーリー**: 基盤（全ストーリー共通）

### Step 2: Supabaseクライアント生成 ✅
- [x] `apps/web/src/lib/supabase/server.ts` — サーバーサイドクライアント生成関数
- [x] `apps/web/src/lib/supabase/client.ts` — ブラウザクライアント生成関数
- [x] `apps/web/src/lib/supabase/middleware.ts` — Middleware用クライアント生成関数
- [x] 共通型定義（`apps/web/src/types/database.types.ts`）
- **ストーリー**: US-001（認証基盤）

### Step 3: DBマイグレーション生成 ✅
- [x] `supabase/migrations/00001_create_users.sql` — usersテーブル + RLSポリシー
- [x] `supabase/migrations/00002_create_account_deletion_requests.sql` — 削除リクエストテーブル + RLSポリシー
- **ストーリー**: US-001, US-052

### Step 4: 認証ビジネスロジック生成 ✅
- [x] `apps/web/src/features/auth/lib/auth-service.ts` — 認証サービス（signIn, signOut, getSession, deleteAccount, cancelDeletion）
- [x] `apps/web/src/features/auth/lib/logger.ts` — 認証イベントロガー
- [x] `apps/web/src/features/auth/lib/types.ts` — Auth機能の型定義
- **ストーリー**: US-001, US-052

### Step 5: 認証ビジネスロジック ユニットテスト ✅
- [x] `apps/web/src/features/auth/lib/__tests__/auth-service.test.ts` — 認証サービステスト
- [x] `apps/web/src/features/auth/lib/__tests__/auth-service.property.test.ts` — PBTテスト（ステータス遷移、冪等性）
- **ストーリー**: US-001, US-052（テスト）

### Step 6: 認証Middleware生成 ✅
- [x] `apps/web/src/middleware.ts` — Next.js Middleware（ルート保護、セッション検証）
- **ストーリー**: US-001（アクセス制御）

### Step 7: 認証Middleware ユニットテスト ✅
- [x] `apps/web/src/__tests__/middleware.test.ts` — Middlewareテスト
- **ストーリー**: US-001（アクセス制御テスト）

### Step 8: フロントエンドコンポーネント生成 ✅
- [x] `apps/web/src/features/auth/components/AuthProvider.tsx` — 認証コンテキストプロバイダー
- [x] `apps/web/src/features/auth/components/SignOutButton.tsx` — ログアウトボタン
- [x] `apps/web/src/features/auth/components/DeletionCancelDialog.tsx` — 削除キャンセルダイアログ
- [x] `apps/web/src/features/auth/hooks/useAuth.ts` — 認証フック
- **ストーリー**: US-001, US-052

### Step 9: 認証ページ生成 ✅
- [x] `apps/web/src/app/(auth)/signin/page.tsx` — サインインページ
- [x] `apps/web/src/app/(auth)/callback/page.tsx` — OAuthコールバックページ
- [x] `apps/web/src/app/(auth)/layout.tsx` — 認証レイアウト
- **ストーリー**: US-001

### Step 10: フロントエンドコンポーネント ユニットテスト ✅
- [x] `apps/web/src/features/auth/components/__tests__/AuthProvider.test.tsx` — AuthProviderテスト
- [x] `apps/web/src/features/auth/components/__tests__/SignOutButton.test.tsx` — SignOutButtonテスト
- [x] `apps/web/src/features/auth/components/__tests__/DeletionCancelDialog.test.tsx` — DeletionCancelDialogテスト
- **ストーリー**: US-001, US-052（UIテスト）

### Step 11: Cron Job（アカウント削除バッチ）生成 ✅
- [x] `apps/web/src/app/api/cron/delete-accounts/route.ts` — 削除バッチAPIルート
- [x] `apps/web/src/app/api/cron/delete-accounts/__tests__/route.test.ts` — バッチテスト
- **ストーリー**: US-052

### Step 12: デプロイアーティファクト生成 ✅
- [x] `vercel.json` — Cron Jobs設定
- [x] `.env.local.example` — 環境変数テンプレート
- **ストーリー**: 基盤

### Step 13: ドキュメント生成 ✅
- [x] `aidlc-docs/construction/unit-auth/code/code-summary.md` — コード生成サマリー
- **ストーリー**: 基盤

---

## ストーリートレーサビリティ

| Story ID | タイトル | 実装ステップ |
|---|---|---|
| US-001 | Googleアカウントでサインアップ | Step 2, 3, 4, 5, 6, 7, 8, 9, 10 |
| US-052 | アカウント削除 | Step 3, 4, 5, 8, 10, 11 |

---

## 合計

- **13ステップ**
- **生成ファイル数**: 約25ファイル（コード + テスト + 設定 + ドキュメント）
- **テストファイル数**: 7ファイル（ユニットテスト + PBT）
