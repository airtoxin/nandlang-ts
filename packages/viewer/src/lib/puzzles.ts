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
    title: "Lv1: NOT",
    description:
      "NANDゲートを使ってNOTゲートを作ってください。\n入力aの反転をoutに出力します。",
    inputNames: ["a"],
    outputNames: ["out"],
    testCases: [
      tc({ a: false }, { out: true }),
      tc({ a: true }, { out: false }),
    ],
    fixedCode: `VAR a BITIN
VAR out BITOUT
VAR nand NAND`,
    editableCode: `WIRE a _ TO nand i0
WIRE a _ TO nand i1
WIRE nand _ TO out _
`,
  },
  {
    id: 2,
    title: "Lv2: AND",
    description:
      "NANDゲートを使ってANDゲートを作ってください。\naとbの両方が1のときだけoutが1になります。",
    inputNames: ["a", "b"],
    outputNames: ["out"],
    testCases: [
      tc({ a: false, b: false }, { out: false }),
      tc({ a: false, b: true }, { out: false }),
      tc({ a: true, b: false }, { out: false }),
      tc({ a: true, b: true }, { out: true }),
    ],
    fixedCode: `VAR a BITIN
VAR b BITIN
VAR out BITOUT
VAR nand NAND
VAR n2 NAND`,
    editableCode: `WIRE a _ TO nand i0
WIRE b _ TO nand i1
WIRE nand _ TO n2 i0
WIRE nand _ TO n2 i1
WIRE n2 _ TO out _
`,
  },
  {
    id: 3,
    title: "Lv3: OR",
    description:
      "NANDゲートを使ってORゲートを作ってください。\naまたはbのどちらかが1ならoutが1になります。",
    inputNames: ["a", "b"],
    outputNames: ["out"],
    testCases: [
      tc({ a: false, b: false }, { out: false }),
      tc({ a: false, b: true }, { out: true }),
      tc({ a: true, b: false }, { out: true }),
      tc({ a: true, b: true }, { out: true }),
    ],
    fixedCode: `VAR a BITIN
VAR b BITIN
VAR out BITOUT
VAR na NAND
VAR nb NAND
VAR nand NAND`,
    editableCode: `WIRE a _ TO na i0
WIRE a _ TO na i1
WIRE b _ TO nb i0
WIRE b _ TO nb i1
WIRE na _ TO nand i0
WIRE nb _ TO nand i1
WIRE nand _ TO out _
`,
  },
  {
    id: 4,
    title: "Lv4: NOR",
    description:
      "NANDゲートを使ってNORゲートを作ってください。\naとbの両方が0のときだけoutが1になります。",
    inputNames: ["a", "b"],
    outputNames: ["out"],
    testCases: [
      tc({ a: false, b: false }, { out: true }),
      tc({ a: false, b: true }, { out: false }),
      tc({ a: true, b: false }, { out: false }),
      tc({ a: true, b: true }, { out: false }),
    ],
    fixedCode: `VAR a BITIN
VAR b BITIN
VAR out BITOUT
VAR na NAND
VAR nb NAND
VAR or NAND
VAR not NAND`,
    editableCode: `WIRE a _ TO na i0
WIRE a _ TO na i1
WIRE b _ TO nb i0
WIRE b _ TO nb i1
WIRE na _ TO or i0
WIRE nb _ TO or i1
WIRE or _ TO not i0
WIRE or _ TO not i1
WIRE not _ TO out _
`,
  },
  {
    id: 5,
    title: "Lv5: XOR",
    description:
      "NANDゲートを使ってXORゲートを作ってください。\naとbが異なるときだけoutが1になります。",
    inputNames: ["a", "b"],
    outputNames: ["out"],
    testCases: [
      tc({ a: false, b: false }, { out: false }),
      tc({ a: false, b: true }, { out: true }),
      tc({ a: true, b: false }, { out: true }),
      tc({ a: true, b: true }, { out: false }),
    ],
    fixedCode: `VAR a BITIN
VAR b BITIN
VAR out BITOUT
VAR nand NAND
VAR n1 NAND
VAR n2 NAND
VAR n3 NAND`,
    editableCode: `WIRE a _ TO nand i0
WIRE b _ TO nand i1
WIRE a _ TO n1 i0
WIRE nand _ TO n1 i1
WIRE nand _ TO n2 i0
WIRE b _ TO n2 i1
WIRE n1 _ TO n3 i0
WIRE n2 _ TO n3 i1
WIRE n3 _ TO out _
`,
  },
  {
    id: 6,
    title: "Lv6: SR Latch",
    description:
      "FLIPFLOPを使ってSRラッチを作ってください。\nsが1のときqを1にセット、rが1のときqを0にリセットします。\nどちらも0のときは前の状態を保持します。\n(テストは順番に実行され、状態が引き継がれます)",
    inputNames: ["s", "r"],
    outputNames: ["q"],
    testCases: [
      // Initial state: q=0
      tc({ s: false, r: false }, { q: false }),
      // Set: q becomes 1
      tc({ s: true, r: false }, { q: true }),
      // Hold: q stays 1
      tc({ s: false, r: false }, { q: true }),
      // Reset: q becomes 0
      tc({ s: false, r: true }, { q: false }),
      // Hold: q stays 0
      tc({ s: false, r: false }, { q: false }),
      // Set again: q becomes 1
      tc({ s: true, r: false }, { q: true }),
    ],
    fixedCode: `VAR s BITIN
VAR r BITIN
VAR q BITOUT
VAR ff FLIPFLOP`,
    editableCode: `WIRE s _ TO ff s
WIRE r _ TO ff r
WIRE ff _ TO q _
`,
  },
];
