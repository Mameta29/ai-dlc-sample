# unit-auth 技術スタック決定

## 技術選定一覧

| カテゴリ | 技術 | バージョン | 選定理由 |
|---|---|---|---|
| 認証基盤 | Supabase Auth | v1.26.04 | Google OAuth標準対応、JWT発行、RLS連携 |
| OAuth Provider | Google OAuth 2.0 | - | 要件で指定（唯一の認証手段） |
| セッション管理 | Supabase Auth Helpers (SSR) | 最新 | Next.js App Router対応、Cookie自動管理 |
| Middleware | Next.js Middleware | 16.2 | サーバーサイドルート保護、Edge Runtime実行 |
| クライアント状態 | React Context | - | 認証状態のグローバル提供 |
| UIコンポーネント | shadcn/ui | CLI v4 | Button, Dialog, Toast等の認証UI |
| スタイリング | Tailwind CSS | v4 | 要件で指定 |
| テスト | Vitest + fast-check | 最新 | ユニットテスト + PBT |

---

## 技術決定の詳細

### Supabase Auth（認証基盤）

**決定**: Supabase Authをそのまま利用。カスタム認証サーバーは構築しない。

**理由**:
- Google OAuthフローが標準で対応済み
- JWTの発行・検証・リフレッシュが組み込み
- PostgreSQL RLSとの統合でデータアクセス制御が容易
- レートリミットが組み込み
- カスタム構築のコスト・リスクを回避

**トレードオフ**:
- Supabaseへのロックイン（許容範囲：認証層は差し替え可能な設計）
- カスタマイズ性はやや制限される

---

### Supabase Auth Helpers (SSR)

**決定**: `@supabase/ssr` パッケージを使用してNext.js App Routerと統合。

**理由**:
- Server Components/Route Handlersでのセッション取得が容易
- Cookie管理（HttpOnly, Secure）を自動化
- Middleware統合が公式サポート
- トークンリフレッシュの自動処理

---

### Next.js Middleware（ルート保護）

**決定**: Next.js Middlewareでサーバーサイドのルート保護を実装。

**理由**:
- Edge Runtimeで高速実行（トークン検証50ms以内の目標達成に寄与）
- リクエスト到達前にアクセス制御可能
- クライアントサイドProtectedRouteはフォールバックとしてのみ使用

---

### React Context（クライアント認証状態）

**決定**: React Contextで認証状態をアプリ全体に提供。

**理由**:
- 認証状態は全コンポーネントで必要
- Supabase `onAuthStateChange` との連携が自然
- 外部状態管理ライブラリ（Zustand等）は認証には過剰

---

## 依存関係

```
@supabase/supabase-js       -- Supabaseクライアント
@supabase/ssr               -- Next.js SSR統合
next (built-in middleware)   -- ルート保護
react (built-in context)    -- 状態管理
```

## 非採用技術と理由

| 技術 | 不採用理由 |
|---|---|
| NextAuth.js | Supabase Authで十分。追加の認証ライブラリは複雑さを増す |
| Clerk | 有料サービス。Supabase Authで要件を満たせる |
| Firebase Auth | Supabaseを既に採用済み。認証基盤の分離は不要 |
| Passport.js | Node.js用ミドルウェア。Next.js App Routerとの親和性が低い |
| カスタムJWT実装 | セキュリティリスク。Supabase Authの検証済み実装を利用すべき |
