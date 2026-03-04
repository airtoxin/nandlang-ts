# パッケージ・CI最新化計画

## Context
依存パッケージとCIのNodeバージョンを最新化する。Node 18はEOL済みのため削除。

## 1. CIのNodeバージョン更新
**ファイル**: `.github/workflows/node.js.yml`
- `[18.x, 20.x, 22.x]` → `[22.x, 24.x]`

## 2. パッケージ更新

### Root (`package.json`)
- prettier: ^3.3.3 → ^3.8.1

### packages/language (`packages/language/package.json`)
- @types/node: ^22.9.0 → ^25.3.3
- dedent: ^1.5.3 → ^1.7.2
- prettier: ^3.3.3 → ^3.8.1
- tsx: ^4.19.2 → ^4.21.0
- typescript: ^5.6.3 → ^5.9.3

### packages/viewer (`packages/viewer/package.json`)
- @eslint/js: ^9.39.1 → ^10.0.1
- @types/node: ^24.10.1 → ^25.3.3
- @types/react: ^19.2.7 → ^19.2.14
- @vitejs/plugin-react: ^5.1.1 → ^5.1.4
- eslint: ^9.39.1 → ^10.0.2
- eslint-plugin-react-refresh: ^0.4.24 → ^0.5.2
- globals: ^16.5.0 → ^17.4.0
- react: ^19.2.0 → ^19.2.4
- react-dom: ^19.2.0 → ^19.2.4
- typescript-eslint: ^8.48.0 → ^8.56.1

## 3. `npm install` でロックファイル更新

## 4. ESLint設定の確認・修正
ESLint v10メジャーアップデートにより`packages/viewer/eslint.config.js`の修正が必要になる可能性あり。

## 5. 検証
- `npm test --workspaces --if-present` でテスト通過確認
- `cd packages/viewer && npx tsc -b` でビルド確認
- `cd packages/viewer && npx eslint .` でlint確認
