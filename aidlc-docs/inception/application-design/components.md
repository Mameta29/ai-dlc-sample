# SABOROU コンポーネント定義

## アーキテクチャスタイル
- **分割方式**: 機能ドメイン型
- **ドメイン**: Auth, Task, AI, Ranking, Social, Profile, Analytics, MCP

---

## Component 1: Auth Domain

| 項目 | 内容 |
|---|---|
| **名前** | AuthComponent |
| **目的** | ユーザー認証・セッション管理 |
| **責任** | Google OAuth認証、セッション管理、トークン検証、アクセス制御 |
| **インターフェース** | Supabase Auth統合、Google OAuth Provider |
| **技術** | Supabase Auth, next-auth互換ミドルウェア |

---

## Component 2: Task Domain

| 項目 | 内容 |
|---|---|
| **名前** | TaskComponent |
| **目的** | タスクのCRUD操作・状態管理 |
| **責任** | タスク登録/編集/削除、状態遷移（先延ばし中→完了→期限切れ）、締切管理 |
| **インターフェース** | REST API (tRPC)、Supabase RLS |
| **技術** | tRPC Router, Supabase Client, Zod validation |

---

## Component 3: AI Domain

| 項目 | 内容 |
|---|---|
| **名前** | AIComponent |
| **目的** | AI対話エンジン（言い訳生成、タスク定量化、煽り対話） |
| **責任** | OpenAI API呼び出し、プロンプト管理、キャラクター切替、対話ログ記録、言い回しバリエーション制御 |
| **インターフェース** | Next.js API Routes (Streaming)、WebSocket (対話) |
| **技術** | OpenAI SDK, Vercel AI SDK, ストリーミングレスポンス |

---

## Component 4: Scoring Domain

| 項目 | 内容 |
|---|---|
| **名前** | ScoringComponent |
| **目的** | 先延ばしスコアの計算・確定 |
| **責任** | タスクスコア算出、先延ばし%消費率計算、スコア確定処理、週次集計 |
| **インターフェース** | 内部サービス呼び出し、Supabase Functions |
| **技術** | tRPC Router, Supabase Database Functions |

---

## Component 5: Ranking Domain

| 項目 | 内容 |
|---|---|
| **名前** | RankingComponent |
| **目的** | ランキング集計・表示 |
| **責任** | グローバルランキング生成、グループランキング生成、リアルタイム更新、週次リセット |
| **インターフェース** | Supabase Realtime (WebSocket)、REST API |
| **技術** | Supabase Realtime, PostgreSQL Views/Functions |

---

## Component 6: Social Domain

| 項目 | 内容 |
|---|---|
| **名前** | SocialComponent |
| **目的** | ソーシャル機能（フォロー、グループ、フィード） |
| **責任** | フォロー/フォロワー管理、グループ作成/参加/退出、フィード生成、リアクション |
| **インターフェース** | REST API (tRPC)、ポーリング (フィード) |
| **技術** | tRPC Router, Supabase Client |

---

## Component 7: Profile Domain

| 項目 | 内容 |
|---|---|
| **名前** | ProfileComponent |
| **目的** | ユーザープロフィール・設定管理 |
| **責任** | プロフィール編集、通知設定、プライバシー設定、データエクスポート、アカウント削除 |
| **インターフェース** | REST API (tRPC) |
| **技術** | tRPC Router, Supabase Client |

---

## Component 8: Analytics Domain

| 項目 | 内容 |
|---|---|
| **名前** | AnalyticsComponent |
| **目的** | 行動データ収集・分析・自己取扱説明書生成 |
| **責任** | 8種データ収集、リアルタイム簡易分析、バッチ深層分析、自己取扱説明書生成、レポート出力 |
| **インターフェース** | 内部イベント収集、Cron (バッチ)、REST API (レポート) |
| **技術** | Supabase Database Functions, Vercel Cron Jobs, OpenAI API (分析) |

---

## Component 9: MCP Server (独立デプロイ)

| 項目 | 内容 |
|---|---|
| **名前** | MCPServerComponent |
| **目的** | 自己取扱説明書データをMCPプロトコルで外部AIに公開 |
| **責任** | MCPプロトコル準拠エンドポイント、API Key認証、データスコープ制御、スキーマ公開 |
| **インターフェース** | MCP Protocol (JSON-RPC over HTTP) |
| **技術** | Node.js独立プロセス, MCP SDK, Supabase Client (データ取得) |

---

## Component 10: Notification Domain

| 項目 | 内容 |
|---|---|
| **名前** | NotificationComponent |
| **目的** | プッシュ通知・アプリ内通知 |
| **責任** | Web Push通知送信、通知スケジューリング、通知設定管理、Service Worker連携 |
| **インターフェース** | Web Push API, Service Worker |
| **技術** | web-push, Vercel Cron Jobs, Service Worker |

---

## Component 11: UI (Presentation Layer)

| 項目 | 内容 |
|---|---|
| **名前** | UIComponent |
| **目的** | フロントエンドUI全体 |
| **責任** | ページレンダリング、ルーティング、状態管理、PWA機能、オフラインキャッシュ |
| **インターフェース** | React Server Components + Client Components |
| **技術** | Next.js 16.2 App Router, Tailwind CSS v4, shadcn/ui CLI v4, React Query |
