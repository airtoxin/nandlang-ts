import {
  NOT,
  AND,
  OR,
  NOR,
  XOR,
  XNOR,
  AND3,
} from "@nandlang-ts/language/code-fragments";

export type PuzzleTestCase = {
  inputs: Map<string, boolean>;
  expectedOutputs: Map<string, boolean>;
};

export type Puzzle = {
  id: number;
  title: string;
  description: string;
  inputNames: string[];
  outputNames: string[];
  testCases: PuzzleTestCase[];
  /** MOD定義（コンパイル時にfixedCodeの前に結合される、表示しない） */
  moduleDefs: string;
  /** 表示されるfixed部分（BITIN/BITOUT宣言等） */
  fixedCode: string;
  editableCode: string;
  unlocksModule?: string;
  availableModules?: string[];
};

function tc(
  inputs: Record<string, boolean>,
  expectedOutputs: Record<string, boolean>,
): PuzzleTestCase {
  return {
    inputs: new Map(Object.entries(inputs)),
    expectedOutputs: new Map(Object.entries(expectedOutputs)),
  };
}

export const puzzles: Puzzle[] = [
  {
    id: 1,
    title: "Lv1: Wire",
    description:
      "入力aをそのまま出力outに接続してください。\nWIRE文で変数同士を結線します。",
    inputNames: ["a"],
    outputNames: ["out"],
    testCases: [
      tc({ a: false }, { out: false }),
      tc({ a: true }, { out: true }),
    ],
    moduleDefs: "",
    fixedCode: `VAR a BITIN\nVAR out BITOUT`,
    editableCode: `WIRE a _ TO out _
`,
  },
  {
    id: 2,
    title: "Lv2: NAND",
    description:
      "2つの入力をNANDゲートに接続し、結果をoutに出力してください。\nVAR文で変数を宣言し、WIRE文で結線します。",
    inputNames: ["a", "b"],
    outputNames: ["out"],
    testCases: [
      tc({ a: false, b: false }, { out: true }),
      tc({ a: false, b: true }, { out: true }),
      tc({ a: true, b: false }, { out: true }),
      tc({ a: true, b: true }, { out: false }),
    ],
    moduleDefs: "",
    fixedCode: `VAR a BITIN\nVAR b BITIN\nVAR out BITOUT`,
    editableCode: `VAR nand NAND
WIRE a _ TO nand i0
WIRE b _ TO nand i1
WIRE nand _ TO out _
`,
    availableModules: ["NAND"],
  },
  {
    id: 3,
    title: "Lv3: NOT",
    description:
      "NANDゲートを使って入力aの反転をoutに出力してください。",
    inputNames: ["a"],
    outputNames: ["out"],
    testCases: [
      tc({ a: false }, { out: true }),
      tc({ a: true }, { out: false }),
    ],
    moduleDefs: "",
    fixedCode: `VAR a BITIN\nVAR out BITOUT`,
    editableCode: `VAR nand NAND
WIRE a _ TO nand i0
WIRE a _ TO nand i1
WIRE nand _ TO out _
`,
    unlocksModule: "NOT",
    availableModules: ["NAND"],
  },
  {
    id: 4,
    title: "Lv4: AND",
    description:
      "aとbの両方が1のときだけoutが1になる回路を作ってください。",
    inputNames: ["a", "b"],
    outputNames: ["out"],
    testCases: [
      tc({ a: false, b: false }, { out: false }),
      tc({ a: false, b: true }, { out: false }),
      tc({ a: true, b: false }, { out: false }),
      tc({ a: true, b: true }, { out: true }),
    ],
    moduleDefs: NOT,
    fixedCode: `VAR a BITIN\nVAR b BITIN\nVAR out BITOUT`,
    editableCode: `VAR nand NAND
VAR not NOT
WIRE a _ TO nand i0
WIRE b _ TO nand i1
WIRE nand _ TO not _
WIRE not _ TO out _
`,
    unlocksModule: "AND",
    availableModules: ["NAND", "NOT"],
  },
  {
    id: 5,
    title: "Lv5: OR",
    description:
      "aまたはbのどちらかが1ならoutが1になる回路を作ってください。",
    inputNames: ["a", "b"],
    outputNames: ["out"],
    testCases: [
      tc({ a: false, b: false }, { out: false }),
      tc({ a: false, b: true }, { out: true }),
      tc({ a: true, b: false }, { out: true }),
      tc({ a: true, b: true }, { out: true }),
    ],
    moduleDefs: NOT,
    fixedCode: `VAR a BITIN\nVAR b BITIN\nVAR out BITOUT`,
    editableCode: `VAR na NOT
VAR nb NOT
VAR nand NAND
WIRE a _ TO na _
WIRE b _ TO nb _
WIRE na _ TO nand i0
WIRE nb _ TO nand i1
WIRE nand _ TO out _
`,
    unlocksModule: "OR",
    availableModules: ["NAND", "NOT"],
  },
  {
    id: 6,
    title: "Lv6: NOR",
    description:
      "aとbの両方が0のときだけoutが1になる回路を作ってください。",
    inputNames: ["a", "b"],
    outputNames: ["out"],
    testCases: [
      tc({ a: false, b: false }, { out: true }),
      tc({ a: false, b: true }, { out: false }),
      tc({ a: true, b: false }, { out: false }),
      tc({ a: true, b: true }, { out: false }),
    ],
    moduleDefs: `${NOT}${AND}${OR}`,
    fixedCode: `VAR a BITIN\nVAR b BITIN\nVAR out BITOUT`,
    editableCode: `VAR or OR
VAR not NOT
WIRE a _ TO or i0
WIRE b _ TO or i1
WIRE or _ TO not _
WIRE not _ TO out _
`,
    unlocksModule: "NOR",
    availableModules: ["NAND", "NOT", "AND", "OR"],
  },
  {
    id: 7,
    title: "Lv7: XOR",
    description:
      "aとbが異なるときだけoutが1になる回路を作ってください。",
    inputNames: ["a", "b"],
    outputNames: ["out"],
    testCases: [
      tc({ a: false, b: false }, { out: false }),
      tc({ a: false, b: true }, { out: true }),
      tc({ a: true, b: false }, { out: true }),
      tc({ a: true, b: true }, { out: false }),
    ],
    moduleDefs: `${NOT}${AND}${OR}${NOR}`,
    fixedCode: `VAR a BITIN\nVAR b BITIN\nVAR out BITOUT`,
    editableCode: `VAR nand NAND
VAR or OR
VAR and AND
WIRE a _ TO nand i0
WIRE b _ TO nand i1
WIRE a _ TO or i0
WIRE b _ TO or i1
WIRE nand _ TO and i0
WIRE or _ TO and i1
WIRE and _ TO out _
`,
    unlocksModule: "XOR",
    availableModules: ["NAND", "NOT", "AND", "OR", "NOR"],
  },
  {
    id: 8,
    title: "Lv8: XNOR",
    description:
      "aとbが同じときだけoutが1になる回路を作ってください。",
    inputNames: ["a", "b"],
    outputNames: ["out"],
    testCases: [
      tc({ a: false, b: false }, { out: true }),
      tc({ a: false, b: true }, { out: false }),
      tc({ a: true, b: false }, { out: false }),
      tc({ a: true, b: true }, { out: true }),
    ],
    moduleDefs: `${NOT}${AND}${OR}${NOR}${XOR}`,
    fixedCode: `VAR a BITIN\nVAR b BITIN\nVAR out BITOUT`,
    editableCode: `VAR xor XOR
VAR not NOT
WIRE a _ TO xor i0
WIRE b _ TO xor i1
WIRE xor _ TO not _
WIRE not _ TO out _
`,
    unlocksModule: "XNOR",
    availableModules: ["NAND", "NOT", "AND", "OR", "NOR", "XOR"],
  },
  {
    id: 9,
    title: "Lv9: AND3",
    description:
      "3つの入力a,b,cすべてが1のときだけoutが1になる回路を作ってください。",
    inputNames: ["a", "b", "c"],
    outputNames: ["out"],
    testCases: [
      tc({ a: false, b: false, c: false }, { out: false }),
      tc({ a: false, b: false, c: true }, { out: false }),
      tc({ a: false, b: true, c: false }, { out: false }),
      tc({ a: false, b: true, c: true }, { out: false }),
      tc({ a: true, b: false, c: false }, { out: false }),
      tc({ a: true, b: false, c: true }, { out: false }),
      tc({ a: true, b: true, c: false }, { out: false }),
      tc({ a: true, b: true, c: true }, { out: true }),
    ],
    moduleDefs: `${NOT}${AND}${OR}${NOR}${XOR}${XNOR}`,
    fixedCode: `VAR a BITIN\nVAR b BITIN\nVAR c BITIN\nVAR out BITOUT`,
    editableCode: `VAR a0 AND
VAR a1 AND
WIRE a _ TO a0 i0
WIRE b _ TO a0 i1
WIRE a0 _ TO a1 i0
WIRE c _ TO a1 i1
WIRE a1 _ TO out _
`,
    unlocksModule: "AND3",
    availableModules: ["NAND", "NOT", "AND", "OR", "NOR", "XOR", "XNOR"],
  },
  {
    id: 10,
    title: "Lv10: OR3",
    description:
      "3つの入力a,b,cのいずれかが1ならoutが1になる回路を作ってください。",
    inputNames: ["a", "b", "c"],
    outputNames: ["out"],
    testCases: [
      tc({ a: false, b: false, c: false }, { out: false }),
      tc({ a: false, b: false, c: true }, { out: true }),
      tc({ a: false, b: true, c: false }, { out: true }),
      tc({ a: false, b: true, c: true }, { out: true }),
      tc({ a: true, b: false, c: false }, { out: true }),
      tc({ a: true, b: false, c: true }, { out: true }),
      tc({ a: true, b: true, c: false }, { out: true }),
      tc({ a: true, b: true, c: true }, { out: true }),
    ],
    moduleDefs: `${NOT}${AND}${OR}${NOR}${XOR}${XNOR}${AND3}`,
    fixedCode: `VAR a BITIN\nVAR b BITIN\nVAR c BITIN\nVAR out BITOUT`,
    editableCode: `VAR o0 OR
VAR o1 OR
WIRE a _ TO o0 i0
WIRE b _ TO o0 i1
WIRE o0 _ TO o1 i0
WIRE c _ TO o1 i1
WIRE o1 _ TO out _
`,
    unlocksModule: "OR3",
    availableModules: ["NAND", "NOT", "AND", "OR", "NOR", "XOR", "XNOR", "AND3"],
  },
];
