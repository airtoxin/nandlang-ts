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
VAR out BITOUT`,
    editableCode: `# NANDゲートを使って回路を組み立ててください
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
VAR out BITOUT`,
    editableCode: `# NANDゲートを使って回路を組み立ててください
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
VAR out BITOUT`,
    editableCode: `# NANDゲートを使って回路を組み立ててください
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
VAR out BITOUT`,
    editableCode: `# NANDゲートを使って回路を組み立ててください
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
VAR out BITOUT`,
    editableCode: `# NANDゲートを使って回路を組み立ててください
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
VAR q BITOUT`,
    editableCode: `# FLIPFLOPを使って回路を組み立ててください
`,
  },
];
