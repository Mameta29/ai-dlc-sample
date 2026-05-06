# unit-auth デプロイアーキテクチャ

## 環境構成

| 環境 | Vercel | Supabase | 用途 |
|---|---|---|---|
| Development | Vercel Dev環境 | dev Supabaseプロジェクト | ローカル開発・個人テスト |
| Preview | Vercel Previewデプロイ | dev Supabaseプロジェクト | PRプレビュー・レビュー |
| Production | Vercel Production | prod Supabaseプロジェクト | 本番環境 |

---

## デプロイフロー

### Development

```
ローカル開発
  |
  | next dev (Turbopack)
  v
localhost:3000 ---> dev Supabase
```

- `next dev` でローカル起動
- Supabase CLIでローカルエミュレーター利用も可能（オプション）
- 環境変数: `.env.local`

### Preview (PR作成時)

```
git push → PR作成
  |
  | Vercel自動デプロイ
  v
{branch}.vercel.app ---> dev Supabase
```

- PRごとにプレビューURLを自動生成
- dev Supabaseプロジェクトを共有使用
- レビュアーがプレビューURLで動作確認

### Production (mainブランチマージ時)

```
PR merge to main
  |
  | Vercel自動デプロイ
  v
saborou.vercel.app ---> prod Supabase
```

- mainブランチへのマージで自動デプロイ
- prod Supabaseプロジェクトに接続
- ロールバック: Vercelの即時ロールバック機能利用

---

## Supabase環境分離

### dev Supabaseプロジェクト

| 設定 | 値 |
|---|---|
| プロジェクト名 | saborou-dev |
| Google OAuth | テスト用クライアントID（localhost + preview URLをリダイレクトURIに登録） |
| RLS | 有効（本番と同一ポリシー） |
| データ | テスト/シードデータ |

### prod Supabaseプロジェクト

| 設定 | 値 |
|---|---|
| プロジェクト名 | saborou-prod |
| Google OAuth | 本番用クライアントID（本番ドメインのみリダイレクトURIに登録） |
| RLS | 有効 |
| データ | 本番データ |
| バックアップ | Supabase自動バックアップ（日次） |

---

## DBマイグレーション戦略

### マイグレーションフロー

```
1. ローカルでマイグレーションファイル作成
   supabase/migrations/YYYYMMDDHHMMSS_description.sql

2. ローカルで検証
   supabase db push (ローカルエミュレーターに適用)

3. dev環境に適用
   supabase db push --db-url $DEV_DB_URL

4. PRレビュー・承認

5. prod環境に適用
   supabase db push --db-url $PROD_DB_URL
```

### unit-auth 初期マイグレーション

```sql
-- 001_create_users.sql
-- public.users テーブル作成
-- public.account_deletion_requests テーブル作成
-- RLSポリシー設定
-- インデックス作成
```

---

## Google OAuth設定

### dev環境

| 設定 | 値 |
|---|---|
| Google Cloud Console | SABOROUプロジェクト（テスト） |
| 承認済みリダイレクトURI | `http://localhost:3000/auth/callback`, `https://*.vercel.app/auth/callback` |
| OAuth同意画面 | テストモード（テストユーザーのみ） |

### prod環境

| 設定 | 値 |
|---|---|
| Google Cloud Console | SABOROUプロジェクト（本番） |
| 承認済みリダイレクトURI | `https://saborou.vercel.app/auth/callback` (本番ドメイン確定後に変更) |
| OAuth同意画面 | 公開（Google審査通過後） |

---

## Vercel Cron Jobs設定

### vercel.json

```json
{
  "crons": [
    {
      "path": "/api/cron/delete-accounts",
      "schedule": "0 3 * * *"
    }
  ]
}
```

- 毎日03:00 UTCに実行
- Vercel ProプランでCron Jobs利用可能
- `CRON_SECRET` ヘッダーで認証

---

## スケーリング

### 自動スケーリング（Vercel管理）

| コンポーネント | スケーリング方式 |
|---|---|
| Edge Functions (Middleware) | 自動（グローバル分散、制限なし） |
| Serverless Functions | 自動（同時実行数はVercelプランに依存） |
| Static Assets | CDN自動配信 |

### Supabaseスケーリング

| コンポーネント | スケーリング方式 |
|---|---|
| PostgreSQL | Supabaseプランに応じたリソース（初期: Freeまたは Pro） |
| Auth Service | Supabase管理（MAU制限あり） |
| Realtime | Supabase管理（同時接続数制限あり） |

### 初期プラン推奨

| サービス | プラン | 理由 |
|---|---|---|
| Vercel | Pro | Cron Jobs、プレビューデプロイ無制限 |
| Supabase | Free → Pro（ユーザー増加時） | 初期は無料プランで十分。MAU 50,000超でPro移行 |
