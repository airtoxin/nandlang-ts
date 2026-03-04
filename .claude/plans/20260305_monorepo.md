# nandlang-ts monorepo化プラン

## Context

現在の単一パッケージ構成を、npm workspacesを使ったmonorepo構成に変換する。既存コードは `packages/language` に移動し、新規の `packages/viewer` パッケージを空で作成する。

## 変換後のディレクトリ構成

```
nandlang-ts/
├── .github/workflows/node.js.yml    (変更)
├── .gitignore                        (変更なし)
├── README.md                         (変更なし)
├── package.json                      (書き換え: workspace root)
├── package-lock.json                 (再生成)
├── tsconfig.json                     (書き換え: project references)
├── packages/
│   ├── language/
│   │   ├── package.json              (新規)
│   │   ├── tsconfig.json             (新規)
│   │   └── src/                      (既存srcを移動)
│   └── viewer/
│       ├── package.json              (新規)
│       ├── tsconfig.json             (新規)
│       └── src/
│           └── index.ts              (新規: placeholder)
```

## 実装手順

### 1. ディレクトリ作成 & ソース移動
```bash
mkdir -p packages/language packages/viewer/src
git mv src packages/language/src
```
- `git mv` で履歴を保持

### 2. `packages/language/package.json` 作成
- name: `@nandlang-ts/language`
- 既存の全dependencies/devDependenciesをここに移動
- scripts: dev, test, format を維持

### 3. `packages/language/tsconfig.json` 作成
- 既存tsconfig.jsonの内容 + `composite: true`, `declaration: true`, `declarationMap: true`, `include: ["src"]`

### 4. `packages/viewer/package.json` 作成
- name: `@nandlang-ts/viewer`
- 最小構成（typescript のみ devDependency）

### 5. `packages/viewer/tsconfig.json` 作成
- language と同じコンパイラオプション

### 6. `packages/viewer/src/index.ts` 作成
- `export {};` のみの placeholder

### 7. root `package.json` 書き換え
```json
{
  "name": "nandlang-ts",
  "version": "0.0.1",
  "private": true,
  "workspaces": ["packages/*"],
  "scripts": {
    "test": "npm test --workspaces",
    "format": "prettier --ignore-path .gitignore --write ."
  },
  "devDependencies": {
    "prettier": "^3.3.3"
  }
}
```

### 8. root `tsconfig.json` 書き換え
```json
{
  "files": [],
  "references": [
    { "path": "packages/language" },
    { "path": "packages/viewer" }
  ]
}
```

### 9. `.github/workflows/node.js.yml` 更新
- `npm test` → `npm test --workspaces` に変更

### 10. lockfile再生成
```bash
rm package-lock.json
npm install
```

## 重要な考慮事項

- **import パス**: 全てのソースは相対パスを使用しているため、`src/` ディレクトリごと移動すれば変更不要
- **vitest**: 設定ファイルなしでデフォルト動作しているため、package内で `vitest` 実行すれば自動検出される
- **.gitignore**: リポジトリルートの `.gitignore` は `packages/` 配下にも適用される
- **npm workspaces**: 依存関係はルートの `node_modules` にホイスティングされる

## 対象ファイル

- 変更: `/package.json`, `/tsconfig.json`, `/.github/workflows/node.js.yml`
- 移動: `/src/` → `/packages/language/src/`
- 新規: `packages/language/package.json`, `packages/language/tsconfig.json`, `packages/viewer/package.json`, `packages/viewer/tsconfig.json`, `packages/viewer/src/index.ts`
- 再生成: `package-lock.json`

## 検証

1. `npm install` が正常完了すること
2. `npm test --workspaces` で既存テストが全てパスすること
3. `npx tsc --build` がエラーなく完了すること
