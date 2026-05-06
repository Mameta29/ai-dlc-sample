# unit-ai ドメインエンティティ定義

## エンティティ一覧

| エンティティ | 説明 |
|---|---|
| Conversation | AI対話セッション |
| Message | 対話メッセージ（AI/ユーザー） |
| AICharacter | AIキャラクター定義 |
| ExcusePattern | 言い訳パターンデータ |

---

## Conversation

| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| id | UUID | Yes | プライマリキー |
| user_id | UUID | Yes | ユーザーID |
| task_id | UUID | No | 関連タスクID（タスク対話の場合） |
| character_type | CharacterType | Yes | 現在のAIキャラクター |
| conversation_type | ConversationType | Yes | 対話種別 |
| created_at | timestamp | Yes | 開始日時 |
| updated_at | timestamp | Yes | 最終更新日時 |

### CharacterType（列挙型）
| 値 | 説明 |
|---|---|
| SABOROU | サボロー（共感型、優しい） |
| NAMAKEMONO_SENPAI | ナマケモノ先輩（ゆるい先輩口調） |
| SABORIST | サボリスト（煽り型、挑発的） |

### ConversationType（列挙型）
| 値 | 説明 |
|---|---|
| TASK_QUANTIFY | タスク定量化質問 |
| EXCUSE_GENERATION | 言い訳生成 |
| PROVOCATION | 煽り対話（自己像抽出） |
| OPEN_QUESTION | オープン質問 |

---

## Message

| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| id | UUID | Yes | プライマリキー |
| conversation_id | UUID | Yes | 対話ID |
| role | MessageRole | Yes | 送信者（ai/user） |
| content | string | Yes | メッセージ本文 |
| metadata | jsonb | No | 追加データ（言い訳パターンID、反応種別等） |
| created_at | timestamp | Yes | 送信日時 |

### MessageRole（列挙型）
| 値 | 説明 |
|---|---|
| AI | AIメッセージ |
| USER | ユーザーメッセージ |

---

## ExcusePattern

| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| id | UUID | Yes | プライマリキー |
| conversation_id | UUID | Yes | 対話ID |
| category | ExcuseCategory | Yes | 言い訳カテゴリ |
| content | string | Yes | 言い訳テキスト |
| user_reaction | UserReaction | No | ユーザーの反応 |
| created_at | timestamp | Yes | 生成日時 |

### ExcuseCategory（列挙型）
| 値 | 説明 |
|---|---|
| BURDEN | 迷惑系（「他の人に迷惑かけるし...」） |
| TIME | 時間系（「まだ時間あるし...」） |
| IMPORTANCE | 重要性系（「そこまで重要じゃないし...」） |
| ABILITY | 能力系（「今の自分には難しいし...」） |

### UserReaction（列挙型）
| 値 | 説明 |
|---|---|
| AGREE | 同意（「うんそうだ」） |
| DISAGREE | 反論（「いやでも…」） |
| SKIP | スキップ |
