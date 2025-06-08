FROM node:18-alpine

WORKDIR /usr/src/app/

# 必要なパッケージをインストール
RUN apk update && apk add --no-cache \
    postgresql-client \
    openssl \
    openssl-dev

# npmキャッシュをクリア
RUN npm cache clean --force

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# Prismaスキーマファイルをコピー（prisma generateのため）
COPY prisma/ ./prisma/

# 依存関係をインストール（devDependenciesも含める）
# npm ciの代わりにnpm installを使用してlock fileの同期問題を回避
RUN rm -f package-lock.json && npm install

# アプリケーションのソースコードをコピー
COPY . .

# 本番環境用ビルド（必要に応じて）
# RUN npm run build