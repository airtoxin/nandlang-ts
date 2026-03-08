# 開発ガイド

## セットアップ

`npm install` で全パッケージの依存をインストール。

## よく使うコマンド

| コマンド | 用途 |
|---------|------|
| `npm run --workspace packages/viewer dev` | 開発サーバー起動 |
| `npm run --workspace packages/language test` | language ユニットテスト |
| `npm test` | 全テスト |
| `npm run format` | Prettier フォーマット |
| `npm run --workspace packages/viewer build` | プロダクションビルド |
| `npx tsc -b` | 型チェック |

## ツールチェイン

| ツール | 用途 |
|--------|------|
| npm workspaces | モノレポ管理 |
| TypeScript | 型チェック |
| Vite | viewer ビルド＆開発サーバー |
| Vitest | language ユニットテスト |
| Prettier | コードフォーマッタ |
| ESLint | viewer リンター |
| mise | ランタイムバージョン管理 |

## プロジェクトの規約

- 言語の構文キーワードは大文字: `VAR`, `WIRE`, `MOD START`, `MOD END`
- ポート名 `_` は単一ポートのモジュールで省略記法として使用
- パーサーは関数型パーサーコンビネータで実装（正規表現不使用）
- viewer は `@nandlang-ts/language` の src を vite エイリアスで直接参照
