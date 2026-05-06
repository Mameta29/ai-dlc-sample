# unit-auth フロントエンドコンポーネント設計

## コンポーネント一覧

| コンポーネント | 場所 | 目的 |
|---|---|---|
| SignInPage | `app/(auth)/signin/page.tsx` | サインインページ |
| AuthCallbackPage | `app/(auth)/callback/page.tsx` | OAuthコールバック処理 |
| AuthProvider | `features/auth/components/AuthProvider.tsx` | 認証コンテキストプロバイダー |
| ProtectedRoute | `features/auth/components/ProtectedRoute.tsx` | 認証ガード |
| DeletionCancelDialog | `features/auth/components/DeletionCancelDialog.tsx` | 削除キャンセル確認ダイアログ |
| SignOutButton | `features/auth/components/SignOutButton.tsx` | ログアウトボタン |

---

## SignInPage

### 目的
Googleサインイン/サインアップのランディングページ。

### Props
なし（ページコンポーネント）

### 状態管理
| State | 型 | 初期値 | 説明 |
|---|---|---|---|
| isLoading | boolean | false | OAuth処理中の読み込み状態 |
| error | string | null | 認証エラーメッセージ |

### ユーザーインタラクション
1. 「Googleでログイン」ボタンクリック → `signInWithGoogle()` 呼び出し
2. 読み込み中はボタンを無効化しスピナー表示
3. エラー時はトーストでメッセージ表示

### API連携
- `supabase.auth.signInWithOAuth({ provider: 'google' })`

---

## AuthCallbackPage

### 目的
Google OAuthコールバックを受け取り、セッション確立後にリダイレクト。

### Props
なし（ページコンポーネント）

### フロー
1. URLからOAuth認証コードを取得
2. Supabase Authでセッション確立
3. ユーザーステータス確認
   - ACTIVE → ダッシュボードへリダイレクト
   - PENDING_DELETION → DeletionCancelDialog表示
   - 新規ユーザー → オンボーディングへリダイレクト
4. エラー時 → サインインページへリダイレクト（エラーメッセージ付き）

---

## AuthProvider

### 目的
認証状態をアプリケーション全体に提供するReact Contextプロバイダー。

### 提供するコンテキスト値
| 値 | 型 | 説明 |
|---|---|---|
| user | User | null | 現在のユーザー情報 |
| session | Session | null | 現在のセッション |
| isLoading | boolean | 認証状態の読み込み中フラグ |
| signInWithGoogle | () => Promise | Googleサインイン関数 |
| signOut | () => Promise | サインアウト関数 |

### 動作
- アプリ起動時にSupabase Authのセッションを確認
- `onAuthStateChange` でセッション変更をリアルタイム監視
- トークン自動リフレッシュをSupabase Auth Helperに委任

---

## ProtectedRoute

### 目的
認証必須ルートのガード。未認証ユーザーをサインインページへリダイレクト。

### Props
| Prop | 型 | 必須 | 説明 |
|---|---|---|---|
| children | ReactNode | Yes | 保護対象のコンテンツ |

### 動作
- AuthProviderからセッション取得
- セッションなし → `/auth/signin?redirect={currentPath}` へリダイレクト
- セッションあり → children をレンダリング

**Note**: 主要な保護はNext.js Middleware（サーバーサイド）で行い、このコンポーネントはクライアントサイドのフォールバック。

---

## DeletionCancelDialog

### 目的
PENDING_DELETIONユーザーへの削除キャンセル確認。

### Props
| Prop | 型 | 必須 | 説明 |
|---|---|---|---|
| isOpen | boolean | Yes | ダイアログの表示状態 |
| scheduledDeletionAt | Date | Yes | 削除予定日時 |
| onCancel | () => Promise | Yes | 削除キャンセル処理 |
| onContinue | () => void | Yes | 削除継続（ダイアログを閉じる） |

### 状態管理
| State | 型 | 初期値 | 説明 |
|---|---|---|---|
| isProcessing | boolean | false | キャンセル処理中 |

### 表示内容
- タイトル: 「アカウント削除リクエスト中」
- メッセージ: 「{scheduledDeletionAt}にアカウントが削除されます。キャンセルしますか？」
- ボタン: [キャンセルして利用を続ける（プライマリ）] / [削除を継続する（セカンダリ）]

### フォームバリデーション
なし（選択のみ）

---

## SignOutButton

### 目的
ログアウトボタン。ヘッダーやプロフィールメニューに配置。

### Props
| Prop | 型 | 必須 | 説明 |
|---|---|---|---|
| variant | "icon" | "text" | No | ボタン表示形式（デフォルト: "text"） |

### 動作
1. クリック → `signOut()` 呼び出し
2. 処理中はローディング表示
3. 完了 → サインインページへリダイレクト
