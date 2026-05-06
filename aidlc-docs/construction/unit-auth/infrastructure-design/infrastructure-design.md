# unit-auth インフラストラクチャ設計

## 論理コンポーネント → インフラマッピング

| 論理コンポーネント | インフラサービス | 環境 |
|---|---|---|
| Auth Middleware | Vercel Edge Network | Edge Runtime（グローバル分散） |
| Supabase Auth Client (Server) | Vercel Serverless Functions | Node.js Runtime |
| Supabase Auth Client (Browser) | ブラウザ（クライアントサイド） | - |
| Auth Context Provider | ブラウザ（クライアントサイド） | - |
| Account Deletion Scheduler | Vercel Cron Jobs | Serverless Function |
| Auth Logger | Vercel Runtime Logs | Vercel組み込み |
| データベース（User, AccountDeletionRequest） | Supabase PostgreSQL | Supabaseマネージド |
| 認証基盤 | Supabase Auth | Supabaseマネージド |

---

## コンピュートインフラ

### Vercel

| リソース | 設定 | 備考 |
|---|---|---|
| Edge Functions | Middleware用 | コールドスタートなし、グローバル分散 |
| Serverless Functions | API Routes用 | Node.js 20.x、東京リージョン優先 |
| Cron Jobs | 削除バッチ | 毎日03:00 UTC、タイムアウト60秒 |

### Supabase

| リソース | 設定 | 備考 |
|---|---|---|
| Auth Service | Google OAuth Provider設定済み | マネージド |
| PostgreSQL | auth.users（内部）+ public.users + public.account_deletion_requests | RLS有効 |
| JWT | アクセストークン15分、リフレッシュトークン7日 | Supabase設定で変更 |

---

## ストレージインフラ

### Supabase PostgreSQL

| テーブル | スキーマ | RLSポリシー |
|---|---|---|
| auth.users | Supabase Auth管理（内部） | Supabase管理 |
| public.users | アプリケーションユーザー情報 | 自分のレコードのみ読み書き可 |
| public.account_deletion_requests | 削除リクエスト | 自分のリクエストのみ読み取り可、作成は認証ユーザーのみ |

### 暗号化（SECURITY-01準拠）

| 対象 | 暗号化方式 | 管理 |
|---|---|---|
| PostgreSQLストレージ | AES-256暗号化at rest | Supabase管理 |
| 通信 | TLS 1.2+ | Supabase + Vercel自動 |
| Cookie | Secure属性 | アプリケーション設定 |

---

## ネットワークインフラ

### リクエストフロー

```
ユーザー (ブラウザ/PWA)
    |
    | HTTPS (TLS 1.2+)
    v
Vercel Edge Network (CDN + Edge Functions)
    |
    | Middleware: JWT検証
    v
Vercel Serverless Functions (東京リージョン)
    |
    | HTTPS (TLS 1.2+)
    v
Supabase (PostgreSQL + Auth)
```

### 外部通信

| 通信先 | プロトコル | 目的 |
|---|---|---|
| Google OAuth | HTTPS | OAuth認証フロー |
| Supabase Auth API | HTTPS | セッション管理、トークン発行 |
| Supabase Database | HTTPS (PostgREST) | データ読み書き |

---

## モニタリングインフラ

### Vercel組み込みログ

| 機能 | 利用方法 |
|---|---|
| Runtime Logs | Serverless Function / Edge Functionのログ表示 |
| Build Logs | デプロイ時のビルドログ |
| Web Analytics | ページビュー、パフォーマンスメトリクス |
| Speed Insights | Core Web Vitals |

### Supabaseダッシュボード

| 機能 | 利用方法 |
|---|---|
| Auth Logs | 認証イベント（サインイン/サインアウト/エラー） |
| Database Metrics | クエリ実行回数、レスポンスタイム |
| API Logs | REST API / GraphQL呼び出しログ |

---

## 環境変数管理

| 変数名 | Dev | Prod | 管理場所 |
|---|---|---|---|
| NEXT_PUBLIC_SUPABASE_URL | dev-project.supabase.co | prod-project.supabase.co | Vercel Environment Variables |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | dev匿名キー | prod匿名キー | Vercel Environment Variables |
| SUPABASE_SERVICE_ROLE_KEY | devサービスキー | prodサービスキー | Vercel Secrets |
| CRON_SECRET | ランダム文字列 | ランダム文字列 | Vercel Secrets |

**Note**: `NEXT_PUBLIC_` プレフィックスの変数はクライアントに公開される。機密情報は絶対に含めない。
