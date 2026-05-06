# Performance Test Instructions

## Performance Requirements

| 指標 | 目標値 | 対象 |
|---|---|---|
| ページ読み込み（初回） | 3秒以内 | 全ページ |
| ページ読み込み（以降） | 1秒以内 | 全ページ |
| タスクCRUD | 200ms以内 | tRPC API |
| AI応答開始 | 5秒以内 | ストリーミング |
| ランキング取得 | 500ms以内 | グローバルランキング |
| トークン検証 | 50ms以内 | Middleware |

## Setup Performance Test

### 1. Lighthouse (Core Web Vitals)

```bash
# Chrome DevToolsのLighthouseタブで実行
# または CLI版
npx lighthouse http://localhost:3000 --output=json --output-path=./lighthouse-report.json
```

### 2. tRPC API Response Time

```bash
# 開発サーバー起動後、各エンドポイントの応答時間を測定
# Chrome DevTools → Network タブで確認
```

## Performance Targets

| Core Web Vital | 目標 |
|---|---|
| LCP (Largest Contentful Paint) | < 2.5s |
| FID (First Input Delay) | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.1 |

## Optimization Checklist

- [ ] Next.js Image最適化の利用
- [ ] 動的インポート（lazy loading）
- [ ] tRPCバッチリクエスト有効化
- [ ] Supabaseクエリのインデックス確認
- [ ] React Queryのstale time最適化
