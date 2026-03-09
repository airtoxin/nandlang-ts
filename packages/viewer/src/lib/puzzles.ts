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
    fixedCode: `VAR a BITIN\nVAR out BITOUT`,
    editableCode: "",
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
    fixedCode: `VAR a BITIN\nVAR b BITIN\nVAR out BITOUT`,
    editableCode: "",
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
    fixedCode: `VAR a BITIN\nVAR out BITOUT`,
    editableCode: "",
    unlocksModule: "NOT",
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
    fixedCode: `${NOT}VAR a BITIN\nVAR b BITIN\nVAR out BITOUT`,
    editableCode: "",
    unlocksModule: "AND",
    availableModules: ["NOT"],
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
    fixedCode: `${NOT}VAR a BITIN\nVAR b BITIN\nVAR out BITOUT`,
    editableCode: "",
    unlocksModule: "OR",
    availableModules: ["NOT"],
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
    fixedCode: `${NOT}${AND}${OR}VAR a BITIN\nVAR b BITIN\nVAR out BITOUT`,
    editableCode: "",
    unlocksModule: "NOR",
    availableModules: ["NOT", "AND", "OR"],
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
    fixedCode: `${NOT}${AND}${OR}${NOR}VAR a BITIN\nVAR b BITIN\nVAR out BITOUT`,
    editableCode: "",
    unlocksModule: "XOR",
    availableModules: ["NOT", "AND", "OR", "NOR"],
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
    fixedCode: `${NOT}${AND}${OR}${NOR}${XOR}VAR a BITIN\nVAR b BITIN\nVAR out BITOUT`,
    editableCode: "",
    unlocksModule: "XNOR",
    availableModules: ["NOT", "AND", "OR", "NOR", "XOR"],
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
    fixedCode: `${NOT}${AND}${OR}${NOR}${XOR}${XNOR}VAR a BITIN\nVAR b BITIN\nVAR c BITIN\nVAR out BITOUT`,
    editableCode: "",
    unlocksModule: "AND3",
    availableModules: ["NOT", "AND", "OR", "NOR", "XOR", "XNOR"],
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
    fixedCode: `${NOT}${AND}${OR}${NOR}${XOR}${XNOR}${AND3}VAR a BITIN\nVAR b BITIN\nVAR c BITIN\nVAR out BITOUT`,
    editableCode: "",
    unlocksModule: "OR3",
    availableModules: ["NOT", "AND", "OR", "NOR", "XOR", "XNOR", "AND3"],
  },
];
