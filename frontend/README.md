# 電子書籍検索 Frontend

電子書籍を検索・閲覧するためのWebフロントエンドです。

## 機能

- キーワード検索
- サムネイル付き検索結果表示
- PDFファイルへのリンク

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example` を `.env` にコピーして編集します。

```bash
cp .env.example .env
```

**環境変数:**

| 変数名            | 説明                   | デフォルト値            |
| ----------------- | ---------------------- | ----------------------- |
| `BACKEND_API_URL` | 検索APIのURL           | `http://localhost:3000` |
| `FILE_SERVER_URL` | ファイルサーバーのURL  | `http://localhost:8080` |
| `PORT`            | フロントエンドのポート | `8000`                  |

### 3. 開発サーバーの起動

```bash
npm run dev
```

### 4. ブラウザでアクセス

```
open http://localhost:8000
```

## Docker

### ビルド＆起動

```bash
# プロジェクトルートで実行
docker compose up -d --build
```

### 環境変数の設定

docker-compose実行時に環境変数で設定できます：

```bash
BACKEND_API_URL=http://your-api:3000 FILE_SERVER_URL=http://your-fileserver:8080 docker compose up -d
```

または `.env` ファイルをプロジェクトルートに作成：

```env
BACKEND_API_URL=http://your-api:3000
FILE_SERVER_URL=http://your-fileserver:8080
FRONTEND_PORT=8000
```

## エンドポイント

| パス      | 説明                     |
| --------- | ------------------------ |
| `/`       | 検索ページ（メイン画面） |
| `/health` | ヘルスチェック           |

## 使用技術

- [Hono](https://hono.dev/) - Web framework
- TypeScript
- Node.js

