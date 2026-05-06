# unit-auth ドメインエンティティ定義

## エンティティ一覧

| エンティティ | 説明 |
|---|---|
| User | アプリケーションユーザー |
| Session | 認証セッション（アクセストークン + リフレッシュトークン） |
| OAuthAccount | Google OAuth連携アカウント |
| AccountDeletionRequest | アカウント削除リクエスト（猶予期間管理） |

---

## User

| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| id | UUID | Yes | プライマリキー（Supabase Auth UIDと同一） |
| email | string | Yes | Googleアカウントメールアドレス |
| display_name | string | No | 表示名（ニックネーム、unit-profileで設定） |
| avatar_url | string | No | Googleプロフィール画像URL |
| status | UserStatus | Yes | アカウント状態 |
| created_at | timestamp | Yes | アカウント作成日時 |
| updated_at | timestamp | Yes | 最終更新日時 |
| last_sign_in_at | timestamp | No | 最終ログイン日時 |

### UserStatus（列挙型）

| 値 | 説明 |
|---|---|
| ACTIVE | 通常利用中 |
| PENDING_DELETION | 削除リクエスト中（猶予期間） |
| DELETED | 削除済み（論理削除） |

---

## Session

Supabase Authのセッション管理を利用。以下はアプリケーション層で管理する論理的なセッション概念。

| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| access_token | string | Yes | JWTアクセストークン（有効期限: 15分） |
| refresh_token | string | Yes | リフレッシュトークン（有効期限: 7日） |
| user_id | UUID | Yes | 関連ユーザーID |
| expires_at | timestamp | Yes | アクセストークン有効期限 |
| created_at | timestamp | Yes | セッション作成日時 |

**マルチデバイス**: 同時ログイン制限なし。各デバイスに独立したセッションを発行。

---

## OAuthAccount

| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| id | UUID | Yes | プライマリキー |
| user_id | UUID | Yes | 関連ユーザーID（FK → User） |
| provider | string | Yes | OAuthプロバイダー名（固定: "google"） |
| provider_account_id | string | Yes | Googleアカウント固有ID |
| provider_email | string | Yes | Googleアカウントメール |
| access_token | string | No | Google APIアクセストークン（プロフィール画像取得用） |
| created_at | timestamp | Yes | 連携日時 |

**Note**: Supabase Authが内部的に管理するため、アプリケーション層では直接操作しない。参照のみ。

---

## AccountDeletionRequest

| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| id | UUID | Yes | プライマリキー |
| user_id | UUID | Yes | 削除対象ユーザーID（FK → User） |
| requested_at | timestamp | Yes | 削除リクエスト日時 |
| scheduled_deletion_at | timestamp | Yes | 削除実行予定日時（リクエスト + 猶予期間） |
| status | DeletionStatus | Yes | 削除リクエスト状態 |
| cancelled_at | timestamp | No | キャンセル日時 |

### DeletionStatus（列挙型）

| 値 | 説明 |
|---|---|
| PENDING | 猶予期間中 |
| CANCELLED | ユーザーによりキャンセル |
| COMPLETED | 削除実行済み |

---

## エンティティ関連図

### Text Alternative
```
User (1) ──── (1) OAuthAccount
  │
  │ 1:N
  ▼
Session (N)
  │
User (1) ──── (0..1) AccountDeletionRequest
```

- User : OAuthAccount = 1:1（Googleアカウント1つにつき1ユーザー）
- User : Session = 1:N（複数デバイスから同時ログイン可能）
- User : AccountDeletionRequest = 1:0..1（削除リクエストは最大1件のみ有効）
