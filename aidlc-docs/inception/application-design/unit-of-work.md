# SABOROU ユニット定義

## 分解方針
- **分割方式**: コンポーネント1:1マッピング
- **開発方式**: スケルトン先行（全ユニットの骨格を先に作り、順次肉付け）
- **リポジトリ構成**: monorepo（メインアプリ + MCP Server）
- **ディレクトリ構成**: 機能ドメイン型（`src/features/{domain}/`）

---

## ユニット一覧

| # | ユニット名 | ドメイン | 実装順序 |
|---|---|---|---|
| 1 | unit-auth | Auth | Phase 1（基盤） |
| 2 | unit-task | Task | Phase 1（基盤） |
| 3 | unit-scoring | Scoring | Phase 1（基盤） |
| 4 | unit-ai | AI | Phase 2（コア機能） |
| 5 | unit-ranking | Ranking | Phase 2（コア機能） |
| 6 | unit-analytics | Analytics | Phase 2（コア機能） |
| 7 | unit-social | Social | Phase 3（拡張） |
| 8 | unit-profile | Profile | Phase 3（拡張） |
| 9 | unit-notification | Notification | Phase 3（拡張） |
| 10 | unit-mcp | MCP Server | Phase 4（出力） |
| 11 | unit-ui | UI (Presentation) | 全Phase横断 |

---

## Unit 1: unit-auth

| 項目 | 内容 |
|---|---|
| **責任** | Google OAuth認証、セッション管理、トークン検証、アクセス制御ミドルウェア |
| **コンポーネント** | AuthComponent |
| **技術** | Supabase Auth, Google OAuth Provider |
| **成果物** | 認証ミドルウェア、保護ルート設定、セッション管理ユーティリティ |

---

## Unit 2: unit-task

| 項目 | 内容 |
|---|---|
| **責任** | タスクCRUD、状態管理（先延ばし中/完了/期限切れ）、締切管理 |
| **コンポーネント** | TaskComponent |
| **技術** | tRPC Router, Supabase Client, Zod |
| **成果物** | tRPCルーター、DBスキーマ・マイグレーション、バリデーション |

---

## Unit 3: unit-scoring

| 項目 | 内容 |
|---|---|
| **責任** | タスクスコア算出、先延ばしスコア計算、スコア確定、週次集計 |
| **コンポーネント** | ScoringComponent |
| **技術** | tRPC Router, Supabase Database Functions |
| **成果物** | スコアリングロジック、DB関数、週次集計Cron |

---

## Unit 4: unit-ai

| 項目 | 内容 |
|---|---|
| **責任** | AI対話エンジン、言い訳生成、タスク定量化、キャラクター管理、煽り対話 |
| **コンポーネント** | AIComponent |
| **技術** | OpenAI SDK, Vercel AI SDK, Streaming |
| **成果物** | プロンプトテンプレート、対話ルーター、キャラクター設定、ストリーミングAPI |

---

## Unit 5: unit-ranking

| 項目 | 内容 |
|---|---|
| **責任** | グローバル/グループランキング、Realtime配信、週次リセット |
| **コンポーネント** | RankingComponent |
| **技術** | Supabase Realtime, PostgreSQL Views |
| **成果物** | ランキングビュー、Realtime購読、リセットCron |

---

## Unit 6: unit-analytics

| 項目 | 内容 |
|---|---|
| **責任** | 8種データ収集、リアルタイム簡易分析、バッチ深層分析、自己取扱説明書生成 |
| **コンポーネント** | AnalyticsComponent |
| **技術** | Supabase DB Functions, Vercel Cron, OpenAI API（分析用） |
| **成果物** | イベント収集API、分析パイプライン、プロファイル生成ロジック |

---

## Unit 7: unit-social

| 項目 | 内容 |
|---|---|
| **責任** | フォロー/フォロワー、グループCRUD、フィード生成、リアクション、ユーザー検索 |
| **コンポーネント** | SocialComponent |
| **技術** | tRPC Router, Supabase Client |
| **成果物** | ソーシャルAPI、フィード生成ロジック、招待リンクシステム |

---

## Unit 8: unit-profile

| 項目 | 内容 |
|---|---|
| **責任** | プロフィール管理、通知設定、プライバシー設定、データエクスポート、アカウント削除 |
| **コンポーネント** | ProfileComponent |
| **技術** | tRPC Router, Supabase Client |
| **成果物** | プロフィールAPI、設定管理、エクスポート機能 |

---

## Unit 9: unit-notification

| 項目 | 内容 |
|---|---|
| **責任** | Web Push通知、通知スケジューリング、Service Worker連携 |
| **コンポーネント** | NotificationComponent |
| **技術** | web-push, Vercel Cron, Service Worker |
| **成果物** | Push通知API、Service Worker、スケジューラー |

---

## Unit 10: unit-mcp

| 項目 | 内容 |
|---|---|
| **責任** | MCPプロトコル準拠エンドポイント、API Key管理、データスコープ制御 |
| **コンポーネント** | MCPServerComponent |
| **技術** | Node.js, MCP SDK, Supabase Client |
| **成果物** | MCP Server（独立プロセス）、API Key管理、スキーマドキュメント |

---

## Unit 11: unit-ui

| 項目 | 内容 |
|---|---|
| **責任** | 全ページレンダリング、ルーティング、状態管理、PWA機能、オフラインキャッシュ |
| **コンポーネント** | UIComponent |
| **技術** | Next.js 16.2 App Router, Tailwind CSS v4, shadcn/ui, React Query |
| **成果物** | ページコンポーネント、共通UIコンポーネント、PWA設定、Service Worker |

---

## コード組織戦略（Greenfield）

### monorepo構成
```
saborou/
├── apps/
│   ├── web/                          # Next.js メインアプリ
│   │   ├── src/
│   │   │   ├── app/                  # App Router (ページ・レイアウト)
│   │   │   │   ├── (auth)/           # 認証関連ページ
│   │   │   │   ├── (dashboard)/      # ダッシュボード
│   │   │   │   ├── (ranking)/        # ランキングページ
│   │   │   │   ├── (social)/         # ソーシャルページ
│   │   │   │   ├── (profile)/        # プロフィールページ
│   │   │   │   ├── (manual)/         # 自己取扱説明書ページ
│   │   │   │   ├── api/              # API Routes (tRPC)
│   │   │   │   └── layout.tsx
│   │   │   ├── features/             # 機能ドメイン
│   │   │   │   ├── auth/
│   │   │   │   │   ├── components/
│   │   │   │   │   ├── hooks/
│   │   │   │   │   ├── lib/
│   │   │   │   │   └── server/       # tRPC router, DB queries
│   │   │   │   ├── task/
│   │   │   │   ├── ai/
│   │   │   │   ├── scoring/
│   │   │   │   ├── ranking/
│   │   │   │   ├── social/
│   │   │   │   ├── profile/
│   │   │   │   ├── analytics/
│   │   │   │   └── notification/
│   │   │   ├── components/           # 共通UIコンポーネント
│   │   │   ├── lib/                  # 共通ユーティリティ
│   │   │   │   ├── supabase/
│   │   │   │   ├── trpc/
│   │   │   │   └── utils/
│   │   │   └── types/                # 共有型定義
│   │   ├── public/
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   └── mcp-server/                   # MCP Server (独立プロセス)
│       ├── src/
│       │   ├── server.ts
│       │   ├── tools/
│       │   ├── auth/
│       │   └── types/
│       └── package.json
├── packages/
│   └── shared/                       # 共有型・ユーティリティ
│       ├── src/
│       │   ├── types/
│       │   └── utils/
│       └── package.json
├── supabase/
│   ├── migrations/                   # DBマイグレーション
│   ├── functions/                    # Edge Functions (必要に応じて)
│   └── seed.sql
├── package.json                      # ワークスペースルート
├── turbo.json                        # Turborepo設定
└── tsconfig.base.json
```

### 実装フェーズ

| フェーズ | ユニット | 説明 |
|---|---|---|
| **Phase 0: スケルトン** | 全ユニット | ディレクトリ構造、型定義、インターフェース定義のみ |
| **Phase 1: 基盤** | auth, task, scoring | 認証、タスクCRUD、スコアリングの基盤機能 |
| **Phase 2: コア機能** | ai, ranking, analytics | AI対話、ランキング、データ収集 |
| **Phase 3: 拡張** | social, profile, notification | ソーシャル機能、設定、通知 |
| **Phase 4: 出力** | mcp | MCP Server、データ出力 |
| **全Phase横断** | ui | 各フェーズでUIを段階的に構築 |
