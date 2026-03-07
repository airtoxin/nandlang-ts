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
  starterCode: string;
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
    starterCode: `VAR a BITIN
# NANDゲートを使って回路を組み立ててください
VAR out BITOUT
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
    starterCode: `VAR a BITIN
VAR b BITIN
# NANDゲートを使って回路を組み立ててください
VAR out BITOUT
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
    starterCode: `VAR a BITIN
VAR b BITIN
# NANDゲートを使って回路を組み立ててください
VAR out BITOUT
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
    starterCode: `VAR a BITIN
VAR b BITIN
# NANDゲートを使って回路を組み立ててください
VAR out BITOUT
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
    starterCode: `VAR a BITIN
VAR b BITIN
# NANDゲートを使って回路を組み立ててください
VAR out BITOUT
`,
  },
];
