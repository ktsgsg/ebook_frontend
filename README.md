# 電子書籍検索 Frontend

電子書籍を検索・閲覧するためのWebフロントエンドアプリケーションです。

## 概要

- **フレームワーク**: [Hono](https://hono.dev/)
- **言語**: TypeScript / Node.js
- **コンテナ**: Docker Compose

## クイックスタート

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd ebook_frontend
```

### 2. 環境変数の設定

`.env` ファイルを作成して環境変数を設定します：

```bash
cp .env.example .env
```

```env
# バックエンドAPI URL（検索API）
BACKEND_API_URL=https://api.tierin.f5.si

# ファイルサーバーURL（PDF/サムネイル配信）
FILE_SERVER_URL=https://storage.tierin.f5.si
```

### 3. Docker Compose で起動

```bash
docker compose up -d --build
```

### 4. アクセス

ブラウザで http://localhost:8000 を開きます。

## 環境変数

| 変数名            | 説明                   | デフォルト値                   |
| ----------------- | ---------------------- | ------------------------------ |
| `BACKEND_API_URL` | 検索APIのURL           | `https://api.tierin.f5.si`     |
| `FILE_SERVER_URL` | ファイルサーバーのURL  | `https://storage.tierin.f5.si` |
| `PORT`            | フロントエンドのポート | `8000`                         |

## コマンド

```bash
# 起動
docker compose up -d

# ビルドして起動
docker compose up -d --build

# ログ確認
docker compose logs -f frontend

# 停止
docker compose down

# 再起動
docker compose restart
```

## エンドポイント

| パス      | 説明                     |
| --------- | ------------------------ |
| `/`       | 検索ページ（メイン画面） |
| `/health` | ヘルスチェック           |

## ヘルスチェック

コンテナは30秒間隔でヘルスチェックを実行します。  
ステータス確認：

```bash
docker compose ps
```

## ローカル開発（Docker なし）

```bash
cd frontend
npm install
npm run dev
```

## ディレクトリ構成

```
ebook_frontend/
├── compose.yml       # Docker Compose 設定
├── .env              # 環境変数
└── frontend/
    ├── Dockerfile
    ├── package.json
    └── src/
        ├── index.ts      # エントリーポイント
        ├── config.ts     # 設定
        ├── templates.ts  # HTMLテンプレート
        ├── styles.ts     # CSS
        └── types.ts      # 型定義
```

## ライセンス

GLPみたいなossのやつ