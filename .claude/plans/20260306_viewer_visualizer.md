# nandlang ビジュアライザ実装プラン

## Context

nandlang-tsのviewerパッケージ（現在Viteテンプレートのまま）に、nandlangプログラムのビジュアライザを構築する。ユーザーがnandlangコードを書き、回路図として視覚化し、インタラクティブに実行し、真理値表を確認できるツールを目指す。

## レイアウト

```
+----------------------------+----------------------------------+
|  コードエディタ (左)        |  回路図 (右)                      |
|  - textarea                |  - React Flow キャンバス           |
|  - サンプル選択ドロップダウン |  - BITIN: トグルスイッチ           |
|  - コンパイルボタン          |  - BITOUT: LED表示               |
|  - エラー表示               |  - NAND/カスタム: ボックスノード    |
+----------------------------+----------------------------------+
|  真理値表 (下部, 全幅)                                         |
|  - 全入力パターンに対する出力一覧                                |
|  - 現在のインタラクティブ入力状態をハイライト                      |
+---------------------------------------------------------------+
```

## 依存関係の追加

`packages/viewer/package.json` に追加:
- `@xyflow/react` - React Flowライブラリ（回路図描画）
- `@nandlang-ts/language: "workspace:*"` - 言語パッケージ（パーサー・VM）

## 設定変更

### `packages/viewer/vite.config.ts`
- `@nandlang-ts/language` をソースTSファイルに解決するエイリアス追加

### `packages/viewer/tsconfig.app.json`
- language パッケージへのパスマッピング追加

### `packages/language/package.json`
- `exports` フィールド追加（ソースファイルを直接参照可能にする）

## コンポーネント設計

```
App
├── CodeEditorPanel        - コード入力、サンプル選択、コンパイル、エラー表示
├── CircuitDiagramPanel    - ReactFlowラッパー、カスタムノード登録
│   ├── BitinNode          - トグルスイッチ（入力ON/OFF切替）
│   ├── BitoutNode         - LED表示（出力値表示）
│   ├── NandNode           - NANDゲート（i0,i1→o0）
│   ├── FlipflopNode       - フリップフロップ（s,r→q）
│   └── ModuleNode         - カスタムモジュール（動的ポート）
└── TruthTablePanel        - 真理値表テーブル
```

## ファイル一覧

### 新規作成 (`packages/viewer/src/`)

| ファイル | 内容 |
|---------|------|
| `lib/astToGraph.ts` | AST→React Flowノード・エッジ変換。VAR→ノード、WIRE→エッジ。ポート`_`解決含む |
| `lib/examples.ts` | code-fragmentsからサンプルコードをラベル付きで再エクスポート |
| `hooks/useCircuit.ts` | コード→パース→コンパイル→実行のライフサイクル管理フック |
| `hooks/useTruthTable.ts` | コードと入出力ポート名から全真理値表行を生成するフック |
| `components/CodeEditorPanel.tsx` | 左パネル: textarea、サンプル選択、コンパイルボタン、エラー表示 |
| `components/CircuitDiagramPanel.tsx` | 右パネル: ReactFlowとカスタムノード登録 |
| `components/TruthTablePanel.tsx` | 下部パネル: 真理値表HTML表 |
| `components/nodes/BitinNode.tsx` | BITIN用カスタムノード: クリックでトグル、色変化 |
| `components/nodes/BitoutNode.tsx` | BITOUT用カスタムノード: LED表示 |
| `components/nodes/NandNode.tsx` | NAND用カスタムノード: 2入力1出力ボックス |
| `components/nodes/FlipflopNode.tsx` | FLIPFLOP用カスタムノード: s,r入力、q出力 |
| `components/nodes/ModuleNode.tsx` | カスタムモジュール用ノード: 動的ポート数 |
| `components/nodes/nodeStyles.css` | ノード共通スタイル |

### 変更 (`packages/viewer/src/`)

| ファイル | 内容 |
|---------|------|
| `App.tsx` | Viteテンプレートを3パネルレイアウトに置き換え |
| `App.css` | 3パネルグリッドレイアウトスタイル |
| `index.css` | ベースリセットスタイル調整 |

### 変更（設定ファイル）

| ファイル | 内容 |
|---------|------|
| `packages/viewer/package.json` | 依存関係追加 |
| `packages/viewer/vite.config.ts` | エイリアス追加 |
| `packages/viewer/tsconfig.app.json` | パスマッピング追加 |

## コアロジック: AST→グラフ変換 (`astToGraph.ts`)

### ノード生成（varStatementから）
- 各`varStatement`につき1つのReact Flowノードを作成
- `moduleName`に基づいてノードタイプを決定:
  - `NAND` → nandNode (handles: i0,i1入力 / o0出力)
  - `BITIN` → bitinNode (handle: o0出力のみ)
  - `BITOUT` → bitoutNode (handle: i0入力のみ)
  - `FLIPFLOP` → flipflopNode (handles: s,r入力 / q出力)
  - その他 → moduleNode (MOD定義内のBITIN/BITOUT変数名からポート解決)

### エッジ生成（wireStatementから）
- 各`wireStatement`につき1つのReact Flowエッジ
- `source=srcVariableName`, `sourceHandle=srcPortName`
- `target=destVariableName`, `targetHandle=destPortName`
- ポート名`_`はモジュール型に基づき唯一のポートに解決

### カスタムモジュールのポート解決
- MOD定義内のBITIN変数名 → 入力ポート名一覧
- MOD定義内のBITOUT変数名 → 出力ポート名一覧
- `module.ts`の`createModule`と同じロジック（L88-109参照）

### ノード配置
- 簡易的なカラムレイアウト: BITIN→左、処理ノード→中央、BITOUT→右
- 宣言順で上から配置

## データフロー

```
ユーザーがコード入力 → [コンパイルボタン]
  → parseProgram(code) でAST生成
    → 失敗: エラー表示
    → 成功: astToGraph(ast) → {nodes, edges}
         + Vm.compile(code) → Vmインスタンス保持
  → Vm.run(inputSignals) → outputSignals
    → ノードのdata更新（BITIN色、BITOUT LED）
    → 真理値表の現在行ハイライト

BITIN トグル時:
  → inputSignals更新 → Vm.run() → outputSignals更新
```

## エラーハンドリング

- パースエラー: `parseProgram`の`rest`フィールドからエラー位置を表示
- コンパイル/実行エラー: try-catchでキャッチし、エラーメッセージを表示
- 真理値表: 入力8個超の場合は警告表示（256行以上になるため）

## 重要な参照ファイル（既存・変更なし）

- `packages/language/src/vm.ts` - Vmクラス（compile/run）
- `packages/language/src/parser/ast.ts` - AST型定義
- `packages/language/src/parser/program.ts` - パーサー（parseProgram）
- `packages/language/src/internal-model/module.ts` - モジュール定義（ポート構造の参考）
- `packages/language/src/code-fragments.ts` - サンプルコード（NOT, AND, OR, XOR等）

## 検証方法

1. `cd packages/viewer && npm run dev` でdevサーバー起動
2. デフォルトでサンプルコード（NAND回路）が表示されることを確認
3. コードエディタでコードを編集し、コンパイルボタンで回路図が更新されることを確認
4. BITINノードをクリックしてトグルし、BITOUTノードの出力が変化することを確認
5. 真理値表が全入力パターンの出力を正しく表示することを確認
6. サンプル選択（NOT, AND, OR, XOR等）でプリセットコードがロードされることを確認
7. 不正なコードでエラーメッセージが表示されることを確認

## 実装順序

1. 設定変更（package.json, vite.config.ts, tsconfig）と依存関係インストール
2. コアロジック（astToGraph.ts, examples.ts）
3. カスタムノードコンポーネント（5種）
4. フック（useCircuit, useTruthTable）
5. パネルコンポーネント（3種）
6. App.tsx組み立てとスタイリング
