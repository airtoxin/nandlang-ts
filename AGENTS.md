# nandlang-ts

NANDゲートのみから論理回路を構築するプログラミング言語とビジュアライザ。

## プロジェクト構成

npm workspaces によるモノレポ構成。

| パッケージ | 説明 |
|-----------|------|
| `packages/language` | 言語コア（パーサー、AST、VM、ランタイム） |
| `packages/viewer` | React製インタラクティブ回路ビジュアライザ＆パズル |

## ドキュメント

- [nandlang 言語仕様](./README.md)
- [アーキテクチャ概要](./docs/architecture.md)
- [言語パッケージ](./packages/language/docs/README.md)
- [ビューワパッケージ](./packages/viewer/docs/README.md)
- [開発ガイド](./docs/development.md)
- [E2Eテスト（Playwright）](./docs/e2e-testing.md)
