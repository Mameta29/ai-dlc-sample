# unit-auth NFR設計パターン

## 適用パターン一覧

| # | パターン | カテゴリ | 対象NFR |
|---|---|---|---|
| 1 | Token Refresh with Exponential Backoff | 耐障害性 | NFR-AUTH-P03, NFR-AUTH-R02 |
| 2 | Middleware Gateway | パフォーマンス | NFR-AUTH-P02, NFR-AUTH-P04 |
| 3 | Graceful Degradation | 可用性 | NFR-AUTH-A02, NFR-AUTH-A03 |
| 4 | Idempotent Batch Processing | 信頼性 | NFR-AUTH-R03 |
| 5 | Structured Logging | 運用 | NFR-AUTH-M01〜M04 |
| 6 | Defense in Depth | セキュリティ | NFR-AUTH-SEC01〜SEC06 |

---

## Pattern 1: Token Refresh with Exponential Backoff

### 目的
トークンリフレッシュ失敗時に、サーバー負荷を抑えつつ自動回復する。

### 設計

```
リフレッシュ失敗時:
  1回目リトライ: 1秒後
  2回目リトライ: 2秒後
  3回目リトライ: 4秒後
  3回失敗: サインインページへリダイレクト（静かに遷移）
```

### 適用箇所
- `@supabase/ssr` のセッションリフレッシュ処理
- AuthProviderの `onAuthStateChange` ハンドラ

### 制約
- 自動リトライはトークンリフレッシュのみ。OAuthフロー自体のリトライはユーザー操作ベース
- リトライ中はUIに影響を与えない（バックグラウンド処理）

---

## Pattern 2: Middleware Gateway

### 目的
全リクエストをEdge Runtimeで高速にフィルタリングし、認証チェックを一元化する。

### 設計

```
リクエスト → Next.js Middleware (Edge Runtime)
  ├── 公開ルート → パススルー
  ├── 認証ルート（認証済み） → ダッシュボードへリダイレクト
  └── 保護ルート
      ├── セッションあり → ステータスチェック → パススルー / ダイアログ表示
      └── セッションなし → /auth/signin?redirect={path} へリダイレクト
```

### パフォーマンス考慮
- Edge Runtimeで実行（コールドスタートなし）
- JWT署名検証はローカル実行（外部API呼び出し不要）
- `matcher` 設定で静的アセット（_next/static, favicon等）を除外

### 適用箇所
- `middleware.ts`（プロジェクトルート）

---

## Pattern 3: Graceful Degradation

### 目的
Supabase Auth障害時でも既存セッション保持ユーザーは継続利用可能にする。

### 設計

| 障害レベル | 影響 | 対応 |
|---|---|---|
| Supabase Auth一時障害 | 新規サインイン不可 | エラーメッセージ表示 + リトライボタン |
| トークンリフレッシュ失敗 | セッション延長不可 | 既存アクセストークン有効期間（15分）は継続利用 |
| 完全障害 | 認証機能停止 | メンテナンスページ表示 |

### JWT署名のオフライン検証
- Supabase JWTの公開鍵をSDKがキャッシュ
- Supabase APIが到達不能でも、キャッシュ済み公開鍵でトークン検証が可能
- 検証結果: ユーザーID、有効期限は取得可能

---

## Pattern 4: Idempotent Batch Processing

### 目的
アカウント削除バッチ処理が何度実行されても安全であることを保証する。

### 設計

```
削除バッチ処理:
  1. SELECT ... WHERE status = 'PENDING' AND scheduled_deletion_at < NOW() FOR UPDATE SKIP LOCKED
  2. 対象ユーザーごとにトランザクション内で:
     a. 関連データの匿名化/削除
     b. 全セッション無効化
     c. User.status → DELETED
     d. AccountDeletionRequest.status → COMPLETED
  3. 各ユーザーの処理は独立トランザクション（1件失敗しても他は継続）
  4. 失敗分は次回バッチで再取得（statusがPENDINGのまま残る）
```

### 冪等性保証
- ステータスチェック（PENDING AND 期限切れ）が冪等なフィルタとして機能
- 既にCOMPLETEDのレコードは再処理されない
- `FOR UPDATE SKIP LOCKED` で並行実行時の二重処理を防止

---

## Pattern 5: Structured Logging

### 目的
認証イベントを構造化ログとして記録し、モニタリング・デバッグに活用する。

### ログフォーマット

```json
{
  "timestamp": "2026-05-06T00:00:00.000Z",
  "level": "info",
  "event": "auth.signin.success",
  "requestId": "uuid",
  "userId": "uuid",
  "metadata": {
    "provider": "google",
    "isNewUser": false,
    "deviceType": "mobile"
  }
}
```

### イベント種別

| イベント | レベル | 説明 |
|---|---|---|
| auth.signin.success | info | サインイン成功 |
| auth.signin.failure | warn | サインイン失敗 |
| auth.signout | info | サインアウト |
| auth.token.refresh | debug | トークンリフレッシュ成功 |
| auth.token.refresh.failure | warn | トークンリフレッシュ失敗 |
| auth.deletion.request | info | 削除リクエスト |
| auth.deletion.cancel | info | 削除キャンセル |
| auth.deletion.execute | info | 削除実行 |
| auth.deletion.failure | error | 削除バッチ失敗 |

### PII除外
- メールアドレス、IPアドレスはログに含めない（SECURITY-03準拠）
- userIdのみで追跡可能

---

## Pattern 6: Defense in Depth

### 目的
複数層でセキュリティを確保し、単一の防御層の突破がシステム全体の侵害にならないようにする。

### レイヤー構成

```
Layer 1: ネットワーク（TLS 1.2+, Vercel Edge Network）
  └── Layer 2: Middleware（JWT検証、ルート保護）
      └── Layer 3: Cookie（HttpOnly, Secure, SameSite=Lax）
          └── Layer 4: Supabase RLS（行レベルセキュリティ）
              └── Layer 5: アプリケーション（ステータス検証、CSRF保護）
```

### 各レイヤーの役割

| レイヤー | 防御対象 | 実装 |
|---|---|---|
| ネットワーク | 盗聴、中間者攻撃 | Vercel自動TLS + Supabase TLS |
| Middleware | 不正アクセス | JWT署名検証 + ルートマッチング |
| Cookie | XSS | HttpOnly（JSからアクセス不可） |
| RLS | データ漏洩 | PostgreSQL行レベルポリシー |
| アプリケーション | CSRF、ステータス不整合 | SameSite Cookie + ステータスチェック |
