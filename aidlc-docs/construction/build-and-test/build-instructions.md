# Build Instructions

## Prerequisites
- **Node.js**: >= 20.0.0
- **npm**: >= 10.9.0
- **Supabase CLI**: 最新版（ローカルDB用）
- **Turbo**: ワークスペースに含まれる（devDependencies）

## Environment Variables

`.env.local.example` を `.env.local` にコピーし、以下を設定:

```bash
cp saborou/.env.local.example saborou/apps/web/.env.local
```

| 変数名 | 取得方法 |
|---|---|
| NEXT_PUBLIC_SUPABASE_URL | Supabaseダッシュボード → Settings → API |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabaseダッシュボード → Settings → API |
| SUPABASE_SERVICE_ROLE_KEY | Supabaseダッシュボード → Settings → API |
| NEXT_PUBLIC_SITE_URL | `http://localhost:3000` (開発時) |
| CRON_SECRET | 任意のランダム文字列（`openssl rand -hex 32`） |
| OPENAI_API_KEY | OpenAIダッシュボードから取得 |

## Build Steps

### 1. Install Dependencies

```bash
cd saborou
npm install
```

### 2. Setup Supabase (Local)

```bash
# Supabase CLIインストール（未インストールの場合）
npx supabase init

# ローカルSupabase起動
npx supabase start

# マイグレーション適用
npx supabase db push
```

### 3. Build All Units

```bash
# 全パッケージビルド
npx turbo build
```

### 4. Verify Build Success

- **期待される出力**: `Tasks: X successful, X total` (全タスク成功)
- **ビルド成果物**: `saborou/apps/web/.next/` ディレクトリ
- **許容される警告**: TypeScript strict mode関連の警告（tRPCの型推論）

## Development Server

```bash
# 開発サーバー起動
npx turbo dev
# → http://localhost:3000
```

## Troubleshooting

### Build Fails with Module Not Found
- **原因**: 依存関係未インストール
- **解決**: `rm -rf node_modules && npm install`

### Supabase Connection Error
- **原因**: 環境変数未設定またはSupabase未起動
- **解決**: `.env.local` の設定確認、`npx supabase start` 実行

### OPENAI_API_KEY Error
- **原因**: OpenAI APIキー未設定
- **解決**: `.env.local` に `OPENAI_API_KEY=sk-...` を追加
