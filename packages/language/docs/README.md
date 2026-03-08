# @nandlang-ts/language

NANDゲート回路のパーサー、コンパイラ、VM。

## ディレクトリ構成

| ファイル | 役割 |
|---------|------|
| `src/vm.ts` | `Vm` クラス: `compile(code)`, `run(inputs)`, `getAllSignals()` |
| `src/code-fragments.ts` | サンプルコード定義 |
| `src/parser/ast.ts` | AST型定義: `Program`, `Statement`, `SubStatement` |
| `src/parser/program.ts` | プログラムパーサー: `program` |
| `src/parser/statement.ts` | 文パーサー: `varStatement`, `wireStatement`, `moduleStatement` |
| `src/parser/parser.ts` | 基本パーサー: 識別子、キーワード等 |
| `src/lib/parser-combinator.ts` | カスタムパーサーコンビネータライブラリ: `seq`, `or`, `rep`, `map` 等 |
| `src/internal-model/program.ts` | ランタイムプログラム: `Program` クラス (`run`, `getAllSignals`) |
| `src/internal-model/module.ts` | モジュール定義: `NandModule`, `BitinModule`, `BitoutModule`, `FlipflopModule`, `createModule` |
| `src/internal-model/gate.ts` | NANDゲート実装: `nand(a, b)` |
| `src/internal-model/variable.ts` | 変数（モジュールインスタンス）: `Variable` クラス |

## 組み込みモジュール

| モジュール | 入力ポート | 出力ポート | 説明 |
|-----------|-----------|-----------|------|
| NAND | i0, i1 | o0 | NANDゲート |
| BITIN | - | o0 | 外部入力 |
| BITOUT | i0 | - | 外部出力 |
| FLIPFLOP | s, r | q | RS型フリップフロップ |

## テスト

vitest を使用。`npm run --workspace packages/language test` で実行。
各パーサーとモジュールにユニットテストあり（`*.test.ts`）。
