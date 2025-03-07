# Prisma でスキーマを変える手順

1. prisma/schema.prisma ファイルに移動し、データモデルを編集します。
2. データモデルを変更したら、以下のコマンドを実行します

```
   npx prisma migrate dev --name add-post-model
```

3. マイグレーションを適用する

```
    npx prisma migrate deploy
```

4. Prisma Client の再生成

```
    npx prisma generate
```
