# SABOROU コンポーネント依存関係

## 依存関係マトリクス

| コンポーネント | 依存先 |
|---|---|
| **UI** | Auth, Task, AI, Scoring, Ranking, Social, Profile, Analytics, Notification |
| **TaskComponent** | Auth (認可), Scoring (スコア計算) |
| **AIComponent** | Auth (認可), Task (タスクコンテキスト), Analytics (ログ記録) |
| **ScoringComponent** | Task (タスクデータ), Analytics (スコアイベント) |
| **RankingComponent** | Scoring (スコアデータ), Social (グループ情報) |
| **SocialComponent** | Auth (認可), Profile (ユーザー情報) |
| **ProfileComponent** | Auth (認可) |
| **AnalyticsComponent** | Auth (ユーザー識別) |
| **MCPServer** | Analytics (分析データ), Auth (API Key検証) |
| **NotificationComponent** | Auth (ユーザー識別), Profile (通知設定) |

## 依存関係図

```
+------------------+
|       UI         |
| (Next.js Pages)  |
+--------+---------+
         |
         | tRPC calls
         v
+--------------------------------------------------+
|              tRPC API Layer                        |
+--------------------------------------------------+
         |
         v
+--------+---------+--------+---------+--------+
|  Task  |   AI   | Scoring| Ranking | Social |
+--------+---------+--------+---------+--------+
|Profile | Analytics | Notification              |
+--------+-----------+---------------------------+
         |
         v
+--------------------------------------------------+
|           Supabase (PostgreSQL + Auth + RLS)      |
+--------------------------------------------------+
         |
         v
+------------------+     +-------------------+
| OpenAI API       |     | MCP Server        |
| (GPT-4o)         |     | (独立デプロイ)     |
+------------------+     +-------------------+
```

## 通信パターン

### 同期通信（リクエスト/レスポンス）

| 呼び出し元 | 呼び出し先 | パターン | 用途 |
|---|---|---|---|
| UI → API | tRPC | HTTP/JSON | 全CRUD操作 |
| AI → OpenAI | REST | HTTP/Streaming | AI対話生成 |
| MCP Server → Supabase | PostgreSQL Client | TCP | データ取得 |
| NotificationComponent → Web Push | Push API | HTTP | プッシュ通知 |

### 非同期通信（イベント駆動）

| イベント発行元 | イベント | 購読者 | パターン |
|---|---|---|---|
| TaskComponent | `task.completed` | ScoringComponent, AnalyticsComponent | Supabase DB Trigger |
| ScoringComponent | `score.finalized` | RankingComponent, NotificationComponent | Supabase DB Trigger |
| RankingComponent | `ranking.updated` | UI (Realtime) | Supabase Realtime |
| AIComponent | `conversation.message` | AnalyticsComponent | Direct call (同期) |
| SocialComponent | `feed.new_item` | NotificationComponent | Supabase DB Trigger |

### リアルタイム通信

| 対象 | 方式 | 用途 |
|---|---|---|
| ランキング更新 | Supabase Realtime (WebSocket) | グローバル/グループランキングのリアルタイム更新 |
| AI対話 | Streaming Response (SSE) | AI応答のストリーミング表示 |
| フィード | ポーリング (30秒間隔) | フォロー中ユーザーのアクティビティ |

## データフロー

### メインフロー: タスク登録〜スコア確定

```
User
  |
  | 1. タスク入力
  v
TaskComponent ---> 2. タスク保存 ---> Supabase
  |
  | 3. AI定量化開始
  v
AIComponent ---> 4. 質問生成 ---> OpenAI API
  |
  | 5. ユーザー回答
  v
ScoringComponent ---> 6. タスクスコア算出 ---> Supabase
  |
  | --- 先延ばし期間 ---
  |
  | 7. 完了報告
  v
ScoringComponent ---> 8. 先延ばしスコア確定 ---> Supabase
  |
  | 9. DB Trigger
  v
RankingComponent ---> 10. ランキング更新 ---> Supabase Realtime
  |
  v
AnalyticsComponent ---> 11. イベント記録
```

### サブフロー: AI対話〜データ収集

```
NotificationComponent
  |
  | 1. 先延ばし確認通知
  v
User
  |
  | 2. アプリ起動（生体リズムデータ記録）
  v
AIComponent ---> 3. オープン質問 ---> User
  |                                      |
  | 4a. ユーザー自由記述                   | 4b. AI言い訳提示
  v                                      v
AnalyticsComponent                 AIComponent
(自己生成型言い訳記録)              (言い訳A/B/C/Dテスト)
                                        |
                                        | 5. ユーザー反応記録
                                        v
                                   AnalyticsComponent
                                   (受容パターン記録)
```

## 外部依存関係

| 外部サービス | 用途 | フォールバック |
|---|---|---|
| Supabase | データベース、認証、Realtime | ローカルキャッシュ（読み取り） |
| OpenAI API | AI対話、分析 | テンプレート応答（劣化モード） |
| Vercel | ホスティング、Edge、Cron | - |
| Google OAuth | 認証 | - |
| Web Push Service | プッシュ通知 | アプリ内通知のみ |
