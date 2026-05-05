# SABOROU ユニット依存関係

## 依存関係マトリクス

「→」は「依存する」を示す。行のユニットが列のユニットに依存。

| ユニット | auth | task | scoring | ai | ranking | analytics | social | profile | notification | mcp | ui |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **auth** | - | | | | | | | | | | |
| **task** | → | - | → | | | | | | | | |
| **scoring** | → | → | - | | | → | | | | | |
| **ai** | → | → | | - | | → | | | | | |
| **ranking** | → | | → | | - | | → | | | | |
| **social** | → | | | | | | - | → | | | |
| **profile** | → | | | | | | | - | | | |
| **notification** | → | | | | | | | → | - | | |
| **analytics** | → | | | | | - | | | | | |
| **mcp** | → | | | | | → | | | | - | |
| **ui** | → | → | → | → | → | → | → | → | → | | - |

## 依存関係グラフ

```
                    +-------+
                    | auth  |
                    +---+---+
                        |
          +-------------+-------------+
          |             |             |
      +---v---+    +---v---+    +---v---+
      | task  |    |profile|    |analytics|
      +---+---+    +---+---+    +---+---+
          |             |             |
     +----+----+        |        +---+---+
     |         |        |        |       |
 +---v---+ +---v---+    |    +--v--+ +--v--+
 |scoring| |  ai   |    |    | mcp | |     |
 +---+---+ +-------+    |    +-----+ |     |
     |                   |            |     |
 +---v---+          +---v--------+   |     |
 |ranking|          |notification|   |     |
 +-------+          +------------+   |     |
     |                               |     |
     +------+---v---+----------------+     |
            | social|                      |
            +-------+                      |
                                           |
                    +-----+                |
                    | ui  |<---------------+
                    +-----+
                   (全ユニット依存)
```

## 実装順序の根拠

### Phase 0: スケルトン（全ユニット同時）
- 全ユニットのディレクトリ構造作成
- 型定義（TypeScript interfaces）
- tRPCルーターのスタブ
- DBスキーマ設計・マイグレーション

### Phase 1: 基盤（auth → task → scoring）
1. **auth**: 他の全ユニットが依存する認証基盤。最優先。
2. **task**: スコアリング・AI対話の前提となるタスクデータ。authに依存。
3. **scoring**: ランキングの前提となるスコアデータ。task + authに依存。

### Phase 2: コア機能（ai, ranking, analytics 並行可能）
4. **ai**: task + auth + analyticsに依存。対話エンジン。
5. **ranking**: scoring + socialに依存。ランキング機能。
6. **analytics**: authに依存。データ収集パイプライン。

### Phase 3: 拡張（social, profile, notification 並行可能）
7. **social**: auth + profileに依存。ソーシャル機能。
8. **profile**: authに依存。プロフィール管理。
9. **notification**: auth + profileに依存。通知機能。

### Phase 4: 出力
10. **mcp**: auth + analyticsに依存。MCP Server。

### 全Phase横断
11. **ui**: 各フェーズで対応するUIを段階的に構築。

## クリティカルパス

```
auth → task → scoring → ranking
auth → task → ai
auth → analytics → mcp
```

**ボトルネック**: `auth` — 全ユニットの基盤。最初に完成させる必要あり。
