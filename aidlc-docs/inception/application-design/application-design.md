# SABOROU アプリケーション設計（統合ドキュメント）

## 設計方針

| 項目 | 決定 |
|---|---|
| **分割方式** | 機能ドメイン型（Auth, Task, AI, Scoring, Ranking, Social, Profile, Analytics, MCP, Notification, UI） |
| **AI対話エンジン配置** | Next.js API Routes統合（OpenAI API直接呼び出し） |
| **MCP Server** | 独立プロセスとして別デプロイ |
| **リアルタイム** | ハイブリッド（ランキング: Supabase Realtime / フィード: ポーリング） |
| **データ分析** | ハイブリッド（簡易分析: リアルタイム / 深層分析: バッチ日次・週次） |

---

## アーキテクチャ全体像

```
+------------------------------------------------------------------+
|                         Client (PWA)                               |
|  Next.js 16.2 App Router + React Server Components                |
|  Tailwind CSS v4 + shadcn/ui CLI v4                               |
+------------------------------------------------------------------+
                              |
                    tRPC + Supabase Realtime
                              |
+------------------------------------------------------------------+
|                    Next.js API Layer (Vercel)                      |
|  tRPC Routers: Task | AI | Scoring | Ranking | Social | Profile  |
+------------------------------------------------------------------+
          |              |              |              |
          v              v              v              v
+------------+  +------------+  +------------------+  +----------+
| Supabase   |  | OpenAI API |  | Vercel Cron Jobs |  | Web Push |
| PostgreSQL |  | (GPT-4o)   |  | (バッチ分析)     |  | API      |
| + Auth     |  |            |  |                  |  |          |
| + Realtime |  |            |  |                  |  |          |
| + RLS      |  |            |  |                  |  |          |
+------------+  +------------+  +------------------+  +----------+
          |
          | Supabase Client
          v
+------------------------------------------------------------------+
|               MCP Server (独立Node.jsプロセス)                     |
|               自己取扱説明書データ公開                              |
+------------------------------------------------------------------+
```

---

## コンポーネント一覧（11コンポーネント）

| # | コンポーネント | ドメイン | 主な責任 |
|---|---|---|---|
| 1 | AuthComponent | Auth | Google OAuth認証、セッション管理、アクセス制御 |
| 2 | TaskComponent | Task | タスクCRUD、状態遷移、締切管理 |
| 3 | AIComponent | AI | OpenAI対話、キャラクター管理、言い訳生成 |
| 4 | ScoringComponent | Scoring | タスクスコア算出、先延ばしスコア計算、週次集計 |
| 5 | RankingComponent | Ranking | グローバル/グループランキング、Realtime配信 |
| 6 | SocialComponent | Social | フォロー、グループ、フィード、リアクション |
| 7 | ProfileComponent | Profile | プロフィール編集、設定管理、データエクスポート |
| 8 | AnalyticsComponent | Analytics | 8種データ収集、分析、自己取扱説明書生成 |
| 9 | MCPServerComponent | MCP | MCPプロトコル公開、API Key認証 |
| 10 | NotificationComponent | Notification | Push通知、スケジューリング |
| 11 | UIComponent | Presentation | ページレンダリング、PWA、オフライン |

---

## サービス層（7サービス）

| # | サービス | オーケストレーション対象 |
|---|---|---|
| 1 | TaskLifecycleService | Task + AI + Scoring + Analytics |
| 2 | ConversationService | AI + Analytics + Notification |
| 3 | RankingService | Ranking + Scoring + Social + Notification |
| 4 | AnalysisPipelineService | Analytics + AI |
| 5 | SocialFeedService | Social + Ranking + Notification |
| 6 | OnboardingService | Auth + Profile + AI + Notification |
| 7 | DataExportService | Analytics + Profile + MCP |

---

## 通信パターンサマリー

| パターン | 対象 | 技術 |
|---|---|---|
| 同期 (Request/Response) | UI↔API, API↔OpenAI | tRPC, REST |
| 非同期 (Event-Driven) | スコア確定→ランキング更新 | Supabase DB Triggers |
| リアルタイム (WebSocket) | ランキング更新配信 | Supabase Realtime |
| ストリーミング (SSE) | AI対話応答 | Vercel AI SDK |
| ポーリング | フィード更新 | 30秒間隔 |
| Cron | バッチ分析、週次リセット | Vercel Cron Jobs |

---

## デプロイメント構成

| コンポーネント | デプロイ先 | 備考 |
|---|---|---|
| Next.js App (UI + API) | Vercel | グローバルCDN、Edge Runtime |
| PostgreSQL + Auth + Realtime | Supabase | マネージドサービス |
| MCP Server | 独立デプロイ (Vercel or Railway) | Node.jsプロセス |
| Cron Jobs | Vercel Cron | 日次/週次バッチ |

---

## 詳細ドキュメント参照

- コンポーネント詳細: [components.md](./components.md)
- メソッドシグネチャ: [component-methods.md](./component-methods.md)
- サービス層詳細: [services.md](./services.md)
- 依存関係・データフロー: [component-dependency.md](./component-dependency.md)
