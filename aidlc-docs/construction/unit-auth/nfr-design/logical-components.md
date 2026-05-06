# unit-auth 論理コンポーネント

## コンポーネント一覧

| # | 論理コンポーネント | 種別 | 目的 |
|---|---|---|---|
| 1 | Auth Middleware | Edge Runtime | ルート保護・セッション検証 |
| 2 | Supabase Auth Client (Server) | サーバーサイドクライアント | サーバーコンポーネント/API用認証操作 |
| 3 | Supabase Auth Client (Browser) | ブラウザクライアント | クライアントサイド認証操作 |
| 4 | Auth Context Provider | React Context | クライアント認証状態管理 |
| 5 | Account Deletion Scheduler | Vercel Cron | 削除バッチ実行 |
| 6 | Auth Logger | ユーティリティ | 構造化ログ出力 |

---

## LC-1: Auth Middleware

### 責任
- 全リクエストの認証チェック
- ルートパターンに基づくアクセス制御
- セッションリフレッシュの自動実行

### 入出力

| 入力 | 出力 |
|---|---|
| HTTP Request（Cookie含む） | NextResponse（パススルー or リダイレクト） |

### 実装場所
- `middleware.ts`（プロジェクトルート）

### 設定

```typescript
// matcher: 静的アセットとAPIヘルスチェックを除外
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

### 公開ルート定義

```typescript
const PUBLIC_ROUTES = ['/', '/auth/signin', '/auth/callback']
```

---

## LC-2: Supabase Auth Client (Server)

### 責任
- Server Components / Route Handlers / Server Actions でのセッション取得
- Cookie の読み書き（@supabase/ssr 経由）

### 生成パターン

```typescript
// Server Component 用
createServerClient(cookieStore)

// Route Handler / Server Action 用
createServerClient(cookies())
```

### 実装場所
- `src/lib/supabase/server.ts`

---

## LC-3: Supabase Auth Client (Browser)

### 責任
- クライアントサイドでのOAuthフロー開始
- `onAuthStateChange` イベント監視
- トークンリフレッシュ（SDK自動実行）

### 生成パターン

```typescript
createBrowserClient(
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY
)
```

### 実装場所
- `src/lib/supabase/client.ts`

---

## LC-4: Auth Context Provider

### 責任
- 認証状態のアプリ全体への提供
- セッション変更のリアルタイム反映
- PENDING_DELETION検出時のダイアログ表示制御

### コンテキスト値

```typescript
type AuthContext = {
  user: User | null
  session: Session | null
  isLoading: boolean
  isPendingDeletion: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  cancelDeletion: () => Promise<void>
}
```

### 実装場所
- `src/features/auth/components/AuthProvider.tsx`

---

## LC-5: Account Deletion Scheduler

### 責任
- 毎日1回の削除バッチ実行
- PENDING かつ期限切れのAccountDeletionRequestの処理
- 処理結果のログ記録

### 実行方式
- Vercel Cron Job（`vercel.json` で設定）
- API Route: `app/api/cron/delete-accounts/route.ts`
- 実行スケジュール: 毎日 03:00 UTC

### セキュリティ
- Cron Secretによる認証（Vercel Cron Jobからのリクエストのみ許可）
- `CRON_SECRET` 環境変数で検証

### 冪等性
- `FOR UPDATE SKIP LOCKED` で並行実行防止
- ステータスチェックで二重処理防止

### 実装場所
- `src/app/api/cron/delete-accounts/route.ts`

---

## LC-6: Auth Logger

### 責任
- 認証イベントの構造化ログ出力
- PII除外の強制
- リクエストIDの自動付与

### インターフェース

```typescript
type AuthEvent =
  | 'auth.signin.success'
  | 'auth.signin.failure'
  | 'auth.signout'
  | 'auth.token.refresh'
  | 'auth.token.refresh.failure'
  | 'auth.deletion.request'
  | 'auth.deletion.cancel'
  | 'auth.deletion.execute'
  | 'auth.deletion.failure'

function logAuthEvent(
  event: AuthEvent,
  level: 'debug' | 'info' | 'warn' | 'error',
  userId?: string,
  metadata?: Record<string, unknown>
): void
```

### 実装場所
- `src/features/auth/lib/logger.ts`

---

## コンポーネント間の関係

### Text Alternative

```
Browser Client (LC-3)
    |
    v
Auth Context Provider (LC-4) --- uses ---> Browser Client (LC-3)
    |
    v
React Components (SignInPage, SignOutButton, DeletionCancelDialog)

---

HTTP Request
    |
    v
Auth Middleware (LC-1) --- uses ---> Server Client (LC-2)
    |
    v
Server Components / Route Handlers --- uses ---> Server Client (LC-2)
    |
    v
Auth Logger (LC-6) <--- called by --- LC-1, LC-2, LC-4, LC-5

---

Vercel Cron (daily)
    |
    v
Account Deletion Scheduler (LC-5) --- uses ---> Server Client (LC-2)
                                   --- uses ---> Auth Logger (LC-6)
```

---

## 環境変数

| 変数名 | 用途 | 設定場所 |
|---|---|---|
| NEXT_PUBLIC_SUPABASE_URL | Supabase プロジェクトURL | Vercel環境変数 |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase匿名キー | Vercel環境変数 |
| SUPABASE_SERVICE_ROLE_KEY | サービスロールキー（Cron用） | Vercel環境変数（Secretsのみ） |
| CRON_SECRET | Cronジョブ認証 | Vercel環境変数 |
