# アーキテクチャ概要

## データフロー

1. ユーザーがコードを入力
2. `parseProgram()` (`packages/language/src/parser/program.ts`) で AST 生成
3. `astToGraph()` (`packages/viewer/src/lib/astToGraph.ts`) で XYFlow ノード/エッジに変換
4. `Vm.compile()` (`packages/language/src/vm.ts`) で実行可能プログラム生成
5. `Vm.run(inputSignals)` で出力計算
6. ノード表示更新 + テスト結果表示

## モノレポ構成

- `packages/language/` - 言語コア
- `packages/viewer/` - Web ビジュアライザ
- `docs/` - プロジェクト全体のドキュメント
- `AGENTS.md` - ドキュメント目次
- `CLAUDE.md` - `AGENTS.md` へのシンボリックリンク

## パッケージ間の依存

`@nandlang-ts/viewer` → `@nandlang-ts/language`

viewer は `vite.config.ts` のエイリアスで language の `src/` を直接参照する。

## 信号伝搬

`@reactively/core` によるリアクティブな信号伝搬を使用。
BITIN で入力 → NAND ゲートで計算 → BITOUT で出力を収集。
FLIPFLOP は実行間で状態を保持する。
