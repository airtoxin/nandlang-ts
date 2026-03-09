# レベルデザイン: 基礎ゲート編 (Lv1〜10)

## Context

現在6レベル（NOT, AND, OR, NOR, XOR, SR Latch）が存在するが、チュートリアル要素がなく、モジュール解放システムもない。レベルを再設計し、ワイヤリングの基礎から段階的に学べる10レベル構成にする。クリアしたゲートはモジュールとして後続レベルで使用可能になる。SR LatchとFLIPFLOPは後続の数値演算編で扱う。

## 設計方針

- **自由記述方式**: fixedCodeにはBITIN/BITOUTのみ宣言。ユーザーがVAR宣言もWIRE文も自由に書く
- **モジュール解放**: レベルクリア時にそのゲートがモジュールとして使えるようになる
- **解放モジュールのMOD定義**: fixedCodeにMOD定義を含めてコンパイル可能にする（表示上は隠す）

## レベル一覧

| Lv | タイトル | 目的 | 使用可能モジュール | 解放モジュール |
|----|---------|------|-------------------|--------------|
| 1 | Wire | 結線方法を学ぶ（パススルー） | - | - |
| 2 | NAND | NANDの動作を知る | - | - |
| 3 | NOT | NANDからNOTを作る | - | NOT |
| 4 | AND | ANDゲートを作る | NOT | AND |
| 5 | OR | ORゲートを作る | NOT | OR |
| 6 | NOR | NORゲートを作る | NOT, AND, OR | NOR |
| 7 | XOR | XORゲートを作る | NOT, AND, OR, NOR | XOR |
| 8 | XNOR | XNORゲートを作る | NOT〜XOR | XNOR |
| 9 | AND3 | 3入力ANDを作る | NOT〜XNOR | AND3 |
| 10 | OR3 | 3入力ORを作る | NOT〜AND3 | OR3 |

## 各レベル詳細設計

### Lv1: Wire（パススルー）
- **説明**: 入力aをそのまま出力outに接続してください。\nWIRE文で変数同士を結線します。
- **fixedCode**: `VAR a BITIN\nVAR out BITOUT`
- **テスト**: `a=0→out=0`, `a=1→out=1`
- **editableCode**: 空

### Lv2: NAND
- **説明**: 2つの入力をNANDゲートに接続し、結果をoutに出力してください。\nVAR文で変数を宣言し、WIRE文で結線します。
- **fixedCode**: `VAR a BITIN\nVAR b BITIN\nVAR out BITOUT`
- **テスト**: 4パターンの真理値表
- **editableCode**: 空（ユーザーが `VAR nand NAND` + WIRE文を書く）

### Lv3: NOT
- **説明**: NANDゲートを使って入力aの反転をoutに出力してください。
- **fixedCode**: `VAR a BITIN\nVAR out BITOUT`
- **テスト**: `a=0→out=1`, `a=1→out=0`
- **解放**: NOT モジュール

### Lv4: AND
- **説明**: aとbの両方が1のときだけoutが1になる回路を作ってください。
- **fixedCode**: BITIN x2 + BITOUT + NOTのMOD定義
- **テスト**: 4パターン
- **解放**: AND モジュール

### Lv5: OR
- **説明**: aまたはbのどちらかが1ならoutが1になる回路を作ってください。
- **fixedCode**: BITIN x2 + BITOUT + NOTのMOD定義
- **テスト**: 4パターン
- **解放**: OR モジュール

### Lv6: NOR
- **説明**: aとbの両方が0のときだけoutが1になる回路を作ってください。
- **fixedCode**: BITIN x2 + BITOUT + NOT/AND/ORのMOD定義
- **テスト**: 4パターン
- **解放**: NOR モジュール

### Lv7: XOR
- **説明**: aとbが異なるときだけoutが1になる回路を作ってください。
- **fixedCode**: BITIN x2 + BITOUT + NOT〜NORのMOD定義
- **テスト**: 4パターン
- **解放**: XOR モジュール

### Lv8: XNOR
- **説明**: aとbが同じときだけoutが1になる回路を作ってください。
- **fixedCode**: BITIN x2 + BITOUT + NOT〜XORのMOD定義
- **テスト**: 4パターン
- **解放**: XNOR モジュール

### Lv9: AND3
- **説明**: 3つの入力a,b,cすべてが1のときだけoutが1になる回路を作ってください。
- **fixedCode**: BITIN x3 + BITOUT + NOT〜XNORのMOD定義
- **テスト**: 8パターン（3ビット全組み合わせ）
- **解放**: AND3 モジュール

### Lv10: OR3
- **説明**: 3つの入力a,b,cのいずれかが1ならoutが1になる回路を作ってください。
- **fixedCode**: BITIN x3 + BITOUT + NOT〜AND3のMOD定義
- **テスト**: 8パターン（3ビット全組み合わせ）
- **解放**: OR3 モジュール

## 実装変更

### 1. Puzzle型の拡張 (`packages/viewer/src/lib/puzzles.ts`)

```typescript
export type Puzzle = {
  id: number;
  title: string;
  description: string;
  inputNames: string[];
  outputNames: string[];
  testCases: PuzzleTestCase[];
  fixedCode: string;       // コンパイル用（MOD定義+BITIN/BITOUT宣言）
  editableCode: string;    // 空文字列（ユーザーがVAR+WIREを自由に記述）
  unlocksModule?: string;  // クリア時に解放されるモジュール名
  availableModules?: string[]; // このレベルで使用可能な解放済みモジュール名リスト
};
```

- puzzles配列を10レベルに書き換え（SR Latch除外）
- fixedCodeにはMOD定義を含める（コンパイルに必要）
- 各レベルのMOD定義は `@nandlang-ts/language` の code-fragments.ts からimport
- editableCodeは全レベルで空文字列

### 2. fixedCode内のMOD定義の表示 (`packages/viewer/src/components/CodeEditorPanel.tsx`)

fixedCodeにMOD定義が含まれると長大になるため、表示を工夫する:
- MOD START〜MOD END ブロックは非表示にし、VAR行のみ表示
- `availableModules`がある場合、「利用可能モジュール: NOT, AND, ...」ラベルを表示
- 詳細を見たい場合は折りたたみで展開可能

### 3. 進捗管理 (`packages/viewer/src/lib/progress.ts` - 新規)

```typescript
const STORAGE_KEY = "nandlang-progress";
type ProgressData = { completedLevels: number[] };

export function getProgress(): ProgressData;
export function markLevelCompleted(puzzleId: number): ProgressData;
export function isLevelUnlocked(puzzleId: number, puzzles: Puzzle[], progress: ProgressData): boolean;
export function getUnlockedModules(puzzles: Puzzle[], progress: ProgressData): string[];
export function resetProgress(): void;
```

- Lv1は常にアンロック
- Lv Nは Lv N-1がcompletedLevelsに含まれていればアンロック
- 解放済みモジュール = completedLevelsに含まれるパズルの`unlocksModule`を収集

### 4. LevelSelectPage更新 (`packages/viewer/src/pages/LevelSelectPage.tsx`)

- ロック済みレベルはグレーアウト（クリック不可）
- クリア済みレベルにはチェックマーク表示
- 進捗リセットボタン追加

### 5. LevelPage更新 (`packages/viewer/src/pages/LevelPage.tsx`)

- 全テスト通過時に `markLevelCompleted` を呼ぶ
- モジュール解放時に通知メッセージ表示（例: 「NOT モジュールが解放されました！」）
- ロック済みレベルへのアクセスは `/levels` にリダイレクト

### 6. fixedCodeの構成方針

**自由記述方式**: fixedCodeにはBITIN/BITOUT宣言 + 解放済みモジュールのMOD定義のみ。ユーザーがVAR宣言（NANDや解放済みモジュールの使用）とWIRE文を自由に記述する。

例（Lv4 AND）:
```
# fixedCode (コンパイル用全文)
MOD START NOT
  VAR in BITIN
  VAR nand NAND
  WIRE in _ TO nand i0
  WIRE in _ TO nand i1
  VAR out BITOUT
  WIRE nand _ TO out _
MOD END
VAR a BITIN
VAR b BITIN
VAR out BITOUT
```

表示上はMOD定義を隠し:
```
利用可能モジュール: NAND, NOT
VAR a BITIN
VAR b BITIN
VAR out BITOUT
```

ユーザーが書く例:
```
VAR nand NAND
VAR not NOT
WIRE a _ TO nand i0
WIRE b _ TO nand i1
WIRE nand _ TO not _
WIRE not _ TO out _
```

## 検証方法

1. `npm run dev` でviewerを起動
2. Lv1から順にプレイして各レベルの真理値表テストが通ることを確認
3. レベルクリア後にモジュールが解放されることを確認
4. 次レベルがアンロックされることを確認
5. ロック済みレベルにアクセスできないことを確認
6. ブラウザリロード後も進捗が保持されることを確認
7. 既存のユニットテスト（`npm test -w packages/language`）がパスすることを確認
