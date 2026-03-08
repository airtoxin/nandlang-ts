# マルチページ化（タイトル・レベル選択・レベル・サンドボックス）

## Context

現在の `packages/viewer` は単一ページのパズルゲーム。タイトル画面、レベル選択画面、サンドボックスモードを追加してゲームとしての体裁を整える。既存コンポーネントは既にゲームロジックとビューアロジックが分離されているため、1パッケージ内でページを追加する方針。

## ルート設計

| パス | コンポーネント | 説明 |
|------|---------------|------|
| `/` | `TitlePage` | タイトル、Puzzles/Sandboxへのリンク |
| `/levels` | `LevelSelectPage` | パズル一覧グリッド |
| `/level/:id` | `LevelPage` | パズルプレイ（現App.tsxの内容） |
| `/sandbox` | `SandboxPage` | 自由編集＋回路可視化（テストなし） |

Vercelデプロイのため `BrowserRouter` を使用（サーバーサイドリライト対応済み）。

## 変更対象ファイル

| ファイル | 操作 | 説明 |
|---------|------|------|
| `packages/viewer/package.json` | 変更 | `react-router-dom` 追加 |
| `packages/viewer/index.html` | 変更 | title を "nandlang" に |
| `packages/viewer/src/App.tsx` | 書き換え | ルーターシェルに |
| `packages/viewer/src/components/CodeEditorPanel.tsx` | 変更 | `puzzle` propをオプショナル化 |
| `packages/viewer/src/pages/TitlePage.tsx` | 新規 | タイトル画面 |
| `packages/viewer/src/pages/TitlePage.css` | 新規 | タイトル画面スタイル |
| `packages/viewer/src/pages/LevelSelectPage.tsx` | 新規 | レベル選択画面 |
| `packages/viewer/src/pages/LevelSelectPage.css` | 新規 | レベル選択スタイル |
| `packages/viewer/src/pages/LevelPage.tsx` | 新規 | 現App.tsxから抽出 |
| `packages/viewer/src/pages/SandboxPage.tsx` | 新規 | サンドボックス画面 |
| `packages/viewer/src/pages/SandboxPage.css` | 新規 | サンドボックススタイル |

変更なし: `CircuitDiagramPanel`, `TestCasePanel`, `useCircuit`, `useTestCases`, `puzzles.ts`, 全ノードコンポーネント, `astToGraph.ts`

## 実装ステップ

### Step 1: react-router-dom 追加
- `npm install react-router-dom -w @nandlang-ts/viewer`
- **コミット: "Add react-router-dom dependency"**

### Step 2: ルーター設定 + LevelPage抽出
- `App.tsx` を `BrowserRouter` + `Routes` のルーターシェルに書き換え
- 現 `App.tsx` の内容を `pages/LevelPage.tsx` に移動
- `currentLevel` state → `useParams()` の `:id` に置換
- `handleNextLevel` → `useNavigate()` で `/level/:nextId` へ遷移
- `useEffect` で `id` パラメータ変更時にパズルをリロード（または `key={id}` で強制remount）
- `index.html` の title 更新
- この時点では `/` も `/levels` も `/sandbox` も `LevelPage` へリダイレクトで仮実装
- **コミット: "Set up BrowserRouter and extract LevelPage"**

### Step 3: TitlePage 作成
- ゲームタイトル、キャッチコピー、Puzzles/Sandboxリンク
- ダークテーマに合わせたスタイル
- `/` ルートを TitlePage に差し替え
- **コミット: "Add TitlePage"**

### Step 4: LevelSelectPage 作成
- `puzzles` をインポートしてカードグリッド表示
- 各カードは `<Link to={/level/${puzzle.id}}>`
- `/levels` ルートを差し替え
- **コミット: "Add LevelSelectPage"**

### Step 5: SandboxPage 作成
- `CodeEditorPanel` の `puzzle` propをオプショナル化、`initialCode` prop追加
  - puzzle無し時: タイトル/説明/fixedCode非表示、全体がテキストエリア
- `SandboxPage`: `useCircuit` + `CircuitDiagramPanel` + `CodeEditorPanel`（puzzle無し）
- テスト用パネルなし、2カラムレイアウト
- `/sandbox` ルートを差し替え
- **コミット: "Add SandboxPage with optional puzzle in CodeEditorPanel"**

## 注意点

- **ルート変更時のstate reset**: `/level/1` → `/level/2` で同コンポーネントが再利用される。`key={id}` をRoute elementに付与して強制remount で対応
- **ReactFlowProvider**: `CircuitDiagramPanel` 内で自己完結しているため、SandboxPageでそのまま再利用可能
- **パッケージ名変更**: スコープ外。別タスクとして実施可能

## 検証方法

1. `npm run dev` で起動
2. `/` → タイトル画面表示、2つのリンクが機能する
3. `/levels` → 6つのレベルカードが表示される
4. カードクリック → `/level/1` でパズル画面に遷移、既存の動作が維持される
5. パズルクリア → Next Level で `/level/2` に遷移
6. `/sandbox` → テストパネルなしで自由にコード編集＋回路可視化
7. ブラウザの戻る/進むが正しく動作する
8. 不正なlevel ID（`/level/99`）が `/levels` にリダイレクトされる
9. `npm run build` と `npm run lint` が成功する
