# パズルレベルシステムの実装計画

## Context

現在のviewerは自由にコードを書いてテストケースを手動追加するサンドボックス形式。これをZachtronics風のパズルゲームに変更し、5段階のレベルでNANDゲートのみを使って各種論理ゲートを構築するチャレンジにする。

## パズル設計 (5問、難易度順)

| Lv | 課題 | 入力 | 出力 | 最小NAND数 | 難易度 |
|----|------|------|------|-----------|--------|
| 1 | NOT | a | out | 1 | 同じ入力を両方に繋ぐだけ |
| 2 | AND | a, b | out | 2 | NAND + NOT |
| 3 | OR | a, b | out | 3 | NOT×2 + NAND |
| 4 | NOR | a, b | out | 4 | OR + NOT |
| 5 | XOR | a, b | out | 4 | 複雑な配線が必要 |

各レベルのテストケースは全入力パターンを網羅（NOT: 2ケース、その他: 4ケース）。

## 変更ファイル一覧

### 1. 新規: `packages/viewer/src/lib/puzzles.ts`
- `Puzzle` 型定義（id, title, description, inputNames, outputNames, testCases, starterCode）
- 5つのパズルデータを定義
- starterCodeにはBITIN/BITOUT変数が事前定義済み（変数名を明示）

### 2. 変更: `packages/viewer/src/hooks/useTestCases.ts`
- `loadTestCases(puzzleTestCases)` 関数を追加（パズルのテストケースで初期化）
- `allPassed` を導出して返す
- `addTestCase`, `removeTestCase`, `toggleInput`, `toggleExpectedOutput` を削除

### 3. 変更: `packages/viewer/src/components/TestCasePanel.tsx`
- Props: `onAdd`, `onRemove`, `onToggleInput`, `onToggleExpectedOutput` を削除
- 入力・期待出力のBitButtonを読み取り専用の表示に変更
- Add/Removeボタンを削除
- 全テスト通過時に「Next Level」ボタン付きの成功バナーを表示
- Props追加: `allPassed`, `onNextLevel`, `isLastLevel`

### 4. 変更: `packages/viewer/src/components/CodeEditorPanel.tsx`
- examplesセレクタをレベルセレクタに置き換え
- パズルの説明文を表示するエリアを追加
- Props: `puzzles`, `currentLevel`, `onLevelChange`, `initialCode`
- レベル変更時にstarterCodeをtextareaにセット

### 5. 変更: `packages/viewer/src/App.tsx`
- `currentLevel` stateを追加
- `puzzles` からレベル管理
- レベル変更時: テストケースをパズルから読み込み、コードをリセット、コンパイル
- inputNames/outputNamesをパズル定義から取得
- examples importを削除

### 6. 変更: `packages/viewer/src/App.css`
- パズル説明文のスタイル
- 成功バナー＋Next Levelボタンのスタイル
- 不要になったadd/removeボタンのスタイル削除

### 7. 削除: `packages/viewer/src/lib/examples.ts`

## 実装順序

1. `puzzles.ts` 作成
2. `useTestCases.ts` 修正（loadTestCases, allPassed追加、不要API削除）
3. `TestCasePanel.tsx` 修正（読み取り専用化、成功バナー追加）
4. `CodeEditorPanel.tsx` 修正（レベルセレクタ、説明文表示）
5. `App.tsx` で全体を接続
6. `App.css` スタイル更新
7. `examples.ts` 削除

## 検証方法

1. `npm run dev` でviewer起動
2. Lv1 NOT: コードを書いてCompile → Run All → 全PASSで「Next Level」表示確認
3. Next Levelクリック → Lv2に遷移、コードリセット確認
4. 各レベルで正解コードを入力して通過できることを確認
5. 間違ったコードでFAIL表示されることを確認
