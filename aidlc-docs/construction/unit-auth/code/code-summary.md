# unit-auth Code Generation Summary

## 生成ファイル一覧

### プロジェクト構造
| ファイル | 目的 |
|---|---|
| `saborou/package.json` | monorepoルート設定 |
| `saborou/turbo.json` | Turborepo設定 |
| `saborou/tsconfig.base.json` | 共通TypeScript設定 |
| `saborou/vercel.json` | Vercel Cron Jobs設定 |
| `saborou/.env.local.example` | 環境変数テンプレート |
| `saborou/apps/web/package.json` | Webアプリ依存関係 |
| `saborou/apps/web/tsconfig.json` | WebアプリTypeScript設定 |
| `saborou/apps/web/next.config.ts` | Next.js設定 |
| `saborou/apps/web/postcss.config.mjs` | PostCSS設定（Tailwind v4） |
| `saborou/apps/web/vitest.config.ts` | Vitest設定 |
| `saborou/packages/shared/package.json` | 共有パッケージ設定 |

### Supabaseクライアント
| ファイル | 目的 |
|---|---|
| `src/lib/supabase/server.ts` | サーバーサイドクライアント |
| `src/lib/supabase/client.ts` | ブラウザクライアント |
| `src/lib/supabase/middleware.ts` | Middleware用クライアント |
| `src/types/database.types.ts` | DB型定義 |

### DBマイグレーション
| ファイル | 目的 |
|---|---|
| `supabase/migrations/00001_create_users.sql` | usersテーブル + RLS |
| `supabase/migrations/00002_create_account_deletion_requests.sql` | 削除リクエストテーブル + RLS |

### ビジネスロジック
| ファイル | 目的 |
|---|---|
| `src/features/auth/lib/types.ts` | Auth型定義 |
| `src/features/auth/lib/logger.ts` | 構造化ログ |
| `src/features/auth/lib/auth-service.ts` | 認証サービス |

### Middleware
| ファイル | 目的 |
|---|---|
| `src/middleware.ts` | ルート保護 |

### フロントエンドコンポーネント
| ファイル | 目的 |
|---|---|
| `src/features/auth/components/AuthProvider.tsx` | 認証コンテキスト |
| `src/features/auth/components/SignOutButton.tsx` | ログアウトボタン |
| `src/features/auth/components/DeletionCancelDialog.tsx` | 削除キャンセルダイアログ |
| `src/features/auth/hooks/useAuth.ts` | 認証フック |

### 認証ページ
| ファイル | 目的 |
|---|---|
| `src/app/(auth)/layout.tsx` | 認証レイアウト |
| `src/app/(auth)/signin/page.tsx` | サインインページ |
| `src/app/(auth)/callback/page.tsx` | OAuthコールバック |

### Cron Job
| ファイル | 目的 |
|---|---|
| `src/app/api/cron/delete-accounts/route.ts` | 削除バッチAPI |

### テスト（7ファイル）
| ファイル | 種別 |
|---|---|
| `src/features/auth/lib/__tests__/auth-service.test.ts` | ユニットテスト |
| `src/features/auth/lib/__tests__/auth-service.property.test.ts` | PBTテスト |
| `src/__tests__/middleware.test.ts` | ユニットテスト |
| `src/features/auth/components/__tests__/AuthProvider.test.tsx` | コンポーネントテスト |
| `src/features/auth/components/__tests__/SignOutButton.test.tsx` | コンポーネントテスト |
| `src/features/auth/components/__tests__/DeletionCancelDialog.test.tsx` | コンポーネントテスト |
| `src/app/api/cron/delete-accounts/__tests__/route.test.ts` | APIテスト |

## ストーリー実装状況

| Story ID | タイトル | 状態 |
|---|---|---|
| US-001 | Googleアカウントでサインアップ | ✅ 実装完了 |
| US-052 | アカウント削除 | ✅ 実装完了 |
