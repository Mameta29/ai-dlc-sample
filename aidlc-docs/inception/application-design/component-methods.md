# SABOROU コンポーネントメソッド定義

> **Note**: 詳細なビジネスルールはFunctional Design（CONSTRUCTIONフェーズ）で定義します。
> ここではメソッドシグネチャと高レベルの目的を定義します。

---

## AuthComponent

| メソッド | 入力 | 出力 | 目的 |
|---|---|---|---|
| `signInWithGoogle()` | - | `Session` | Google OAuthフロー開始 |
| `signOut()` | - | `void` | セッション破棄 |
| `getSession()` | - | `Session \| null` | 現在のセッション取得 |
| `validateToken(token)` | `string` | `boolean` | トークン検証 |
| `deleteAccount(userId)` | `string` | `void` | アカウント削除リクエスト |

---

## TaskComponent

| メソッド | 入力 | 出力 | 目的 |
|---|---|---|---|
| `createTask(input)` | `CreateTaskInput` | `Task` | タスク新規登録 |
| `updateTask(id, input)` | `string, UpdateTaskInput` | `Task` | タスク編集 |
| `deleteTask(id)` | `string` | `void` | タスク削除 |
| `completeTask(id)` | `string` | `TaskCompletion` | タスク完了（スコア確定トリガー） |
| `listTasks(userId, filter)` | `string, TaskFilter` | `Task[]` | タスク一覧取得 |
| `getTask(id)` | `string` | `Task` | タスク詳細取得 |
| `getElapsedPercentage(id)` | `string` | `number` | 先延ばし%消費率取得 |

---

## AIComponent

| メソッド | 入力 | 出力 | 目的 |
|---|---|---|---|
| `quantifyTask(task, userResponses)` | `Task, DimensionScores` | `TaskScore` | タスク多次元定量化 |
| `generateExcuses(taskId, character)` | `string, CharacterType` | `Excuse[]` | 言い訳パターン生成（3〜4種） |
| `askOpenQuestion(taskId, character)` | `string, CharacterType` | `Message` | オープン質問生成 |
| `respondToUser(conversationId, userMessage)` | `string, string` | `StreamingMessage` | ユーザー返答への応答（ストリーミング） |
| `generateProvocation(taskId)` | `string` | `Message` | 煽り対話生成（自己像抽出） |
| `switchCharacter(conversationId, character)` | `string, CharacterType` | `void` | キャラクター切替 |
| `getVariation(pattern, previousVariations)` | `ExcusePattern, string[]` | `string` | 言い回しバリエーション生成 |

---

## ScoringComponent

| メソッド | 入力 | 出力 | 目的 |
|---|---|---|---|
| `calculateTaskScore(dimensions)` | `DimensionScores` | `number` | タスクスコア算出（1〜100） |
| `calculateProcrastinationScore(taskId)` | `string` | `number` | 先延ばしスコア算出 |
| `finalizeScore(taskId)` | `string` | `FinalScore` | スコア確定 |
| `getWeeklyTotal(userId)` | `string` | `number` | 週次合計スコア取得 |
| `aggregateWeeklyScores()` | - | `void` | 週次集計バッチ |

---

## RankingComponent

| メソッド | 入力 | 出力 | 目的 |
|---|---|---|---|
| `getGlobalRanking(limit, offset)` | `number, number` | `RankEntry[]` | グローバルランキング取得 |
| `getGroupRanking(groupId)` | `string` | `RankEntry[]` | グループランキング取得 |
| `getUserRank(userId)` | `string` | `RankPosition` | ユーザーの現在順位取得 |
| `resetWeeklyRanking()` | - | `void` | 週次リセット |
| `subscribeToRanking(type, id)` | `RankType, string?` | `Subscription` | リアルタイム購読 |

---

## SocialComponent

| メソッド | 入力 | 出力 | 目的 |
|---|---|---|---|
| `followUser(targetUserId)` | `string` | `void` | フォロー |
| `unfollowUser(targetUserId)` | `string` | `void` | フォロー解除 |
| `getFollowers(userId)` | `string` | `User[]` | フォロワー一覧 |
| `getFollowing(userId)` | `string` | `User[]` | フォロー中一覧 |
| `createGroup(input)` | `CreateGroupInput` | `Group` | グループ作成 |
| `joinGroup(groupId)` | `string` | `void` | グループ参加 |
| `leaveGroup(groupId)` | `string` | `void` | グループ退出 |
| `getFeed(userId, cursor)` | `string, string?` | `FeedItem[]` | フィード取得 |
| `addReaction(feedItemId)` | `string` | `void` | サボいいね |
| `searchUsers(query)` | `string` | `User[]` | ユーザー検索 |

---

## ProfileComponent

| メソッド | 入力 | 出力 | 目的 |
|---|---|---|---|
| `getProfile(userId)` | `string` | `UserProfile` | プロフィール取得 |
| `updateProfile(input)` | `UpdateProfileInput` | `UserProfile` | プロフィール更新 |
| `updateNotificationSettings(input)` | `NotificationSettings` | `void` | 通知設定更新 |
| `updatePrivacySettings(input)` | `PrivacySettings` | `void` | プライバシー設定更新 |
| `exportData(userId)` | `string` | `ExportData` | データエクスポート |
| `selectCharacter(character)` | `CharacterType` | `void` | AIキャラクター選択 |

---

## AnalyticsComponent

| メソッド | 入力 | 出力 | 目的 |
|---|---|---|---|
| `recordEvent(event)` | `AnalyticsEvent` | `void` | イベント記録（リアルタイム） |
| `recordConversation(log)` | `ConversationLog` | `void` | 対話ログ記録 |
| `analyzeAcceptancePatterns(userId)` | `string` | `AcceptanceProfile` | 受容パターン分析 |
| `analyzeSubjectiveWeight(userId)` | `string` | `WeightProfile` | 主観次元分析 |
| `analyzeStakeholders(userId)` | `string` | `StakeholderProfile` | ステークホルダー分析 |
| `analyzeIdentity(userId)` | `string` | `IdentityProfile` | 自己像分析 |
| `analyzeIgnitionThreshold(userId)` | `string` | `ThresholdProfile` | 着火閾値分析 |
| `analyzeLinguisticTriggers(userId)` | `string` | `TriggerProfile` | 言語的トリガー分析 |
| `analyzeBiorhythm(userId)` | `string` | `BiorhythmProfile` | 生体リズム分析 |
| `analyzeSelfGeneratedExcuses(userId)` | `string` | `ExcuseProfile` | 自己生成型言い訳分析 |
| `generateManual(userId)` | `string` | `UserManual` | 自己取扱説明書生成 |
| `runBatchAnalysis()` | - | `void` | バッチ分析（日次/週次） |

---

## MCPServerComponent

| メソッド | 入力 | 出力 | 目的 |
|---|---|---|---|
| `listTools()` | - | `MCPToolList` | 利用可能ツール一覧 |
| `getManual(apiKey, scope)` | `string, DataScope` | `UserManual` | 自己取扱説明書データ取得 |
| `getProfile(apiKey)` | `string` | `MCPProfile` | プロファイル概要取得 |
| `validateApiKey(apiKey)` | `string` | `boolean` | API Key検証 |
| `generateApiKey(userId)` | `string` | `string` | API Key生成 |
| `revokeApiKey(apiKey)` | `string` | `void` | API Key無効化 |

---

## NotificationComponent

| メソッド | 入力 | 出力 | 目的 |
|---|---|---|---|
| `subscribePush(userId, subscription)` | `string, PushSubscription` | `void` | Push通知購読登録 |
| `sendProcrastinationCheck(userId, taskId)` | `string, string` | `void` | 先延ばし確認通知送信 |
| `sendScoreNotification(userId, score)` | `string, number` | `void` | スコア変動通知 |
| `sendSocialNotification(userId, event)` | `string, SocialEvent` | `void` | ソーシャル通知 |
| `scheduleNotifications(userId)` | `string` | `void` | 通知スケジューリング |
| `unsubscribePush(userId)` | `string` | `void` | Push通知購読解除 |
