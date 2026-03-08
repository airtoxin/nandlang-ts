# @nandlang-ts/viewer

React製の回路ビジュアライザ＆パズルゲーム。

## ディレクトリ構成

| ファイル | 役割 |
|---------|------|
| `src/App.tsx` | メインアプリ（3パネルレイアウト、レベル管理） |
| `src/main.tsx` | エントリポイント |
| `src/components/CodeEditorPanel.tsx` | コードエディタ＆パズル説明表示 |
| `src/components/CircuitDiagramPanel.tsx` | XYFlow 回路図（`ReactFlow` コンポーネント） |
| `src/components/TestCasePanel.tsx` | テストケース実行＆結果表示（`StatusBadge`, `BitValue`, `BitDisplay`） |
| `src/components/nodes/BitinNode.tsx` | BITIN ノード（トグルスイッチ） |
| `src/components/nodes/BitoutNode.tsx` | BITOUT ノード（LED表示） |
| `src/components/nodes/NandNode.tsx` | NAND ノード |
| `src/components/nodes/FlipflopNode.tsx` | FLIPFLOP ノード（内部状態 q=0/q=1 表示） |
| `src/components/nodes/ModuleNode.tsx` | カスタムモジュールノード（動的ポート） |
| `src/hooks/useCircuit.ts` | 回路コンパイル＆実行管理: `compile`, `toggleInput`, `updateNodeSignals` |
| `src/hooks/useTestCases.ts` | テストケース管理: `loadTestCases`, `runTests`, `resetResults` |
| `src/lib/astToGraph.ts` | AST → XYFlow グラフ変換（Dagre レイアウト）: `astToGraph` |
| `src/lib/puzzles.ts` | パズル定義: `Puzzle` 型, `puzzles` 配列 |

## 3パネルレイアウト

- 左: `CodeEditorPanel` - パズルタイトル＆説明、固定コード（読み取り専用）、編集可能コード、Compile & Run ボタン
- 右: `CircuitDiagramPanel` - XYFlow キャンバス、Dagre 自動レイアウト、ズーム/パン操作
- 下: `TestCasePanel` - Step / Run All ボタン、テスト結果テーブル、全通過時に "All tests passed!" + "Next Level →"

## パズルシステム

`src/lib/puzzles.ts` に6レベル定義:

| Lv | 課題 | 入力 | 出力 | 最小NAND数 |
|----|------|------|------|-----------|
| 1 | NOT | a | out | 1 |
| 2 | AND | a, b | out | 2 |
| 3 | OR | a, b | out | 3 |
| 4 | NOR | a, b | out | 4 |
| 5 | XOR | a, b | out | 4 |
| 6 | SR Latch | s, r | q | FLIPFLOP使用 |

各レベルは `fixedCode`（BITIN/BITOUT宣言）と `editableCode`（ユーザー編集部分）で構成。

## 主要な依存関係

- `@xyflow/react` - 回路図描画
- `dagre` - グラフ自動レイアウト
- `@nandlang-ts/language` - 言語コア
- `vite` - ビルド＆開発サーバー
