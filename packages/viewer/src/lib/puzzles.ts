import {
  NOT,
  AND,
  OR,
  NOR,
  XOR,
  XNOR,
  AND3,
  OR3,
  ADD,
  DEC,
  ENC,
  DLATCH,
  MUX,
  DMUX,
} from "@nandlang-ts/language/code-fragments";

export type PuzzleTestCase = {
  inputs: Map<string, boolean | number>;
  expectedOutputs: Map<string, boolean | number>;
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
  availableModules?: string[];
  /** ヘルプマニュアル内の関連セクションID */
  helpSections?: string[];
};

function tc(
  inputs: Record<string, boolean | number>,
  expectedOutputs: Record<string, boolean | number>,
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
    helpSections: ["syntax-wire", "mod-bitin", "mod-bitout"],
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
    helpSections: ["syntax-var", "syntax-wire", "mod-nand"],
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
    availableModules: ["NAND"],
    helpSections: ["mod-nand", "gate-not"],
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
    availableModules: ["NAND", "NOT"],
    helpSections: ["mod-nand", "gate-not", "gate-and"],
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
    availableModules: ["NAND", "NOT"],
    helpSections: ["mod-nand", "gate-not", "gate-or"],
  },
  {
    id: 6,
    title: "Lv6: ON",
    description:
      "入力なしで常に1を出力する回路を作ってください。\nNANDゲートの入力に何も接続しないとどうなるか考えてみましょう。",
    inputNames: [],
    outputNames: ["out"],
    testCases: [tc({}, { out: true })],
    moduleDefs: "",
    fixedCode: `VAR out BITOUT`,
    editableCode: `VAR nand NAND\nWIRE nand _ TO out _\n`,
    availableModules: ["NAND"],
    helpSections: ["mod-nand", "gate-on"],
  },
  {
    id: 7,
    title: "Lv7: NOR",
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
    availableModules: ["NAND", "NOT", "AND", "OR"],
    helpSections: ["gate-nor"],
  },
  {
    id: 8,
    title: "Lv8: XOR",
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
    availableModules: ["NAND", "NOT", "AND", "OR", "NOR"],
    helpSections: ["gate-xor"],
  },
  {
    id: 9,
    title: "Lv9: XNOR",
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
    availableModules: ["NAND", "NOT", "AND", "OR", "NOR", "XOR"],
    helpSections: ["gate-xnor"],
  },
  {
    id: 10,
    title: "Lv10: AND3",
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
    availableModules: ["NAND", "NOT", "AND", "OR", "NOR", "XOR", "XNOR"],
    helpSections: ["gate-and"],
  },
  {
    id: 11,
    title: "Lv11: OR3",
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
    availableModules: ["NAND", "NOT", "AND", "OR", "NOR", "XOR", "XNOR", "AND3"],
    helpSections: ["gate-or"],
  },
  {
    id: 12,
    title: "Lv12: MUX",
    description:
      "マルチプレクサー（MUX）は、セレクタ信号で2つの入力のどちらかを選択して出力する回路です。\n\n" +
      "入力:\n" +
      "  a, b = データ入力\n" +
      "  sel = セレクタ（0ならaを選択、1ならbを選択）\n\n" +
      "出力:\n" +
      "  out = 選択された入力の値\n\n" +
      "ヒント: セレクタが0のときはa側だけを、1のときはb側だけを有効にするにはどうすればよいか考えてみましょう。" +
      "それぞれの結果を合流させれば完成です。",
    inputNames: ["a", "b", "sel"],
    outputNames: ["out"],
    testCases: [
      // sel=0 → aを選択
      tc({ a: false, b: false, sel: false }, { out: false }),
      tc({ a: true, b: false, sel: false }, { out: true }),
      tc({ a: false, b: true, sel: false }, { out: false }),
      tc({ a: true, b: true, sel: false }, { out: true }),
      // sel=1 → bを選択
      tc({ a: false, b: false, sel: true }, { out: false }),
      tc({ a: true, b: false, sel: true }, { out: false }),
      tc({ a: false, b: true, sel: true }, { out: true }),
      tc({ a: true, b: true, sel: true }, { out: true }),
    ],
    moduleDefs: `${NOT}${AND}${OR}${NOR}${XOR}${XNOR}${AND3}${OR3}`,
    fixedCode: `VAR a BITIN\nVAR b BITIN\nVAR sel BITIN\nVAR out BITOUT`,
    editableCode: `VAR nsel NOT
WIRE sel _ TO nsel _
VAR and0 AND
WIRE a _ TO and0 i0
WIRE nsel _ TO and0 i1
VAR and1 AND
WIRE b _ TO and1 i0
WIRE sel _ TO and1 i1
VAR or OR
WIRE and0 _ TO or i0
WIRE and1 _ TO or i1
WIRE or _ TO out _
`,
    availableModules: ["NAND", "NOT", "AND", "OR", "NOR", "XOR", "XNOR", "AND3", "OR3"],
    helpSections: ["circuit-mux"],
  },
  {
    id: 13,
    title: "Lv13: DMUX",
    description:
      "デマルチプレクサー（DMUX）はMUXの逆で、1つの入力をセレクタ信号に応じて2つの出力のどちらかに振り分けます。\n\n" +
      "入力:\n" +
      "  in = データ入力\n" +
      "  sel = セレクタ（0ならaに出力、1ならbに出力）\n\n" +
      "出力:\n" +
      "  a = sel=0のときinの値、sel=1のとき0\n" +
      "  b = sel=1のときinの値、sel=0のとき0\n\n" +
      "MUXが「選んで合流」ならDMUXは「選んで分岐」です。" +
      "入力信号をセレクタの値に応じて片方の出力だけに通す方法を考えてみましょう。",
    inputNames: ["in", "sel"],
    outputNames: ["a", "b"],
    testCases: [
      // sel=0 → aにinを出力、b=0
      tc({ in: false, sel: false }, { a: false, b: false }),
      tc({ in: true, sel: false }, { a: true, b: false }),
      // sel=1 → a=0、bにinを出力
      tc({ in: false, sel: true }, { a: false, b: false }),
      tc({ in: true, sel: true }, { a: false, b: true }),
    ],
    moduleDefs: `${NOT}${AND}${OR}${NOR}${XOR}${XNOR}${AND3}${OR3}${MUX}`,
    fixedCode: `VAR in BITIN\nVAR sel BITIN\nVAR a BITOUT\nVAR b BITOUT`,
    editableCode: `VAR nsel NOT
WIRE sel _ TO nsel _
VAR and0 AND
WIRE in _ TO and0 i0
WIRE nsel _ TO and0 i1
WIRE and0 _ TO a _
VAR and1 AND
WIRE in _ TO and1 i0
WIRE sel _ TO and1 i1
WIRE and1 _ TO b _
`,
    availableModules: ["NAND", "NOT", "AND", "OR", "NOR", "XOR", "XNOR", "AND3", "OR3", "MUX"],
    helpSections: ["circuit-dmux"],
  },
  {
    id: 14,
    title: "Lv14: Half Adder",
    description:
      "コンピュータの計算の基本、2進数の足し算を回路で実現しましょう！\n\n" +
      "私たちが普段使う10進数の足し算（例: 7+5=12）では、1桁に収まらないとき繰り上がりが発生します。" +
      "2進数でも同じです。1ビット同士の足し算では:\n" +
      "  0+0=0, 0+1=1, 1+0=1, 1+1=10（繰り上がり）\n\n" +
      "Half Adder（半加算器）は、この1ビット同士の足し算を行う回路です。" +
      "結果は2つの出力で表します:\n" +
      "  s（Sum）= 足し算の結果の1の位\n" +
      "  c（Carry）= 繰り上がり（桁上げ）\n\n" +
      "例えば 1+1 の場合、2進数で 10 なので s=0, c=1 となります。\n" +
      "これまで学んだゲートの中に、この動作にぴったりなものがあるはずです。",
    inputNames: ["a", "b"],
    outputNames: ["s", "c"],
    testCases: [
      tc({ a: false, b: false }, { s: false, c: false }),
      tc({ a: false, b: true }, { s: true, c: false }),
      tc({ a: true, b: false }, { s: true, c: false }),
      tc({ a: true, b: true }, { s: false, c: true }),
    ],
    moduleDefs: `${NOT}${AND}${OR}${NOR}${XOR}${XNOR}${AND3}${OR3}${MUX}${DMUX}`,
    fixedCode: `VAR a BITIN\nVAR b BITIN\nVAR s BITOUT\nVAR c BITOUT`,
    editableCode: `VAR xor XOR
VAR and AND
WIRE a _ TO xor i0
WIRE b _ TO xor i1
WIRE xor _ TO s _
WIRE a _ TO and i0
WIRE b _ TO and i1
WIRE and _ TO c _
`,
    availableModules: ["NAND", "NOT", "AND", "OR", "NOR", "XOR", "XNOR", "AND3", "OR3", "MUX", "DMUX"],
    helpSections: ["circuit-half-adder"],
  },
  {
    id: 15,
    title: "Lv15: Full Adder",
    description:
      "Half Adderでは1ビット同士の足し算ができましたが、複数桁の足し算には対応できません。\n\n" +
      "例えば2桁の2進数 11+01 を計算するとき、1の位の 1+1=10 で繰り上がりが発生し、" +
      "2の位では 1+0 に加えて繰り上がりの 1 も足す必要があります。\n\n" +
      "Full Adder（全加算器）は、2つの入力 a, b に加えて下の桁からの繰り上がり cin も受け取り、" +
      "3つの値の合計を計算します。出力は:\n" +
      "  s（Sum）= 合計の1の位\n" +
      "  cout（Carry Out）= 上の桁への繰り上がり\n\n" +
      "Full Adderを連結すれば、何桁でも足し算できます。" +
      "例えば8個のFull Adderを繋げれば8ビット（0〜255）の足し算が可能です。\n\n" +
      "ヒント: Half Adderの考え方を2段階に適用してみましょう。" +
      "まずaとbを足し、その結果にcinを足します。繰り上がりはどちらかの段で発生すればOKです。",
    inputNames: ["a", "b", "cin"],
    outputNames: ["s", "cout"],
    testCases: [
      tc({ a: false, b: false, cin: false }, { s: false, cout: false }),
      tc({ a: false, b: false, cin: true }, { s: true, cout: false }),
      tc({ a: false, b: true, cin: false }, { s: true, cout: false }),
      tc({ a: false, b: true, cin: true }, { s: false, cout: true }),
      tc({ a: true, b: false, cin: false }, { s: true, cout: false }),
      tc({ a: true, b: false, cin: true }, { s: false, cout: true }),
      tc({ a: true, b: true, cin: false }, { s: false, cout: true }),
      tc({ a: true, b: true, cin: true }, { s: true, cout: true }),
    ],
    moduleDefs: `${NOT}${AND}${OR}${NOR}${XOR}${XNOR}${AND3}${OR3}${MUX}${DMUX}`,
    fixedCode: `VAR a BITIN\nVAR b BITIN\nVAR cin BITIN\nVAR s BITOUT\nVAR cout BITOUT`,
    editableCode: `VAR xor0 XOR
VAR xor1 XOR
WIRE a _ TO xor0 i0
WIRE b _ TO xor0 i1
WIRE xor0 _ TO xor1 i0
WIRE cin _ TO xor1 i1
WIRE xor1 _ TO s _
VAR and0 AND
WIRE a _ TO and0 i0
WIRE b _ TO and0 i1
VAR and1 AND
WIRE xor0 _ TO and1 i0
WIRE cin _ TO and1 i1
VAR or0 OR
WIRE and0 _ TO or0 i0
WIRE and1 _ TO or0 i1
WIRE or0 _ TO cout _
`,
    availableModules: ["NAND", "NOT", "AND", "OR", "NOR", "XOR", "XNOR", "AND3", "OR3", "MUX", "DMUX"],
    helpSections: ["circuit-half-adder", "circuit-full-adder"],
  },
  {
    id: 16,
    title: "Lv16: Decoder",
    description:
      "デコーダは、2進数の入力パターンを解読して、対応する1本の出力線だけを有効にする回路です。\n\n" +
      "3ビットの入力（i0, i1, i2）は 0〜7 の8通りの値を表現できます。" +
      "デコーダはこの値に対応する出力（o0〜o7）のうち1つだけを1にします。\n" +
      "例: i0=1, i1=0, i2=1（2進数で 101 = 10進数で5）→ o5だけが1\n\n" +
      "各出力は「3つの入力がすべて特定の値であるか」を判定するAND回路です。" +
      "入力が0であるべき箇所にはNOTを通してからANDに入れます。",
    inputNames: ["i0", "i1", "i2"],
    outputNames: ["o0", "o1", "o2", "o3", "o4", "o5", "o6", "o7"],
    testCases: [
      tc({ i0: false, i1: false, i2: false }, { o0: true, o1: false, o2: false, o3: false, o4: false, o5: false, o6: false, o7: false }),
      tc({ i0: true, i1: false, i2: false }, { o0: false, o1: true, o2: false, o3: false, o4: false, o5: false, o6: false, o7: false }),
      tc({ i0: false, i1: true, i2: false }, { o0: false, o1: false, o2: true, o3: false, o4: false, o5: false, o6: false, o7: false }),
      tc({ i0: true, i1: true, i2: false }, { o0: false, o1: false, o2: false, o3: true, o4: false, o5: false, o6: false, o7: false }),
      tc({ i0: false, i1: false, i2: true }, { o0: false, o1: false, o2: false, o3: false, o4: true, o5: false, o6: false, o7: false }),
      tc({ i0: true, i1: false, i2: true }, { o0: false, o1: false, o2: false, o3: false, o4: false, o5: true, o6: false, o7: false }),
      tc({ i0: false, i1: true, i2: true }, { o0: false, o1: false, o2: false, o3: false, o4: false, o5: false, o6: true, o7: false }),
      tc({ i0: true, i1: true, i2: true }, { o0: false, o1: false, o2: false, o3: false, o4: false, o5: false, o6: false, o7: true }),
    ],
    moduleDefs: `${NOT}${AND}${OR}${NOR}${XOR}${XNOR}${AND3}${OR3}${MUX}${DMUX}${ADD}`,
    fixedCode: `VAR i0 BITIN\nVAR i1 BITIN\nVAR i2 BITIN\nVAR o0 BITOUT\nVAR o1 BITOUT\nVAR o2 BITOUT\nVAR o3 BITOUT\nVAR o4 BITOUT\nVAR o5 BITOUT\nVAR o6 BITOUT\nVAR o7 BITOUT`,
    editableCode: `VAR n0 NOT
VAR n1 NOT
VAR n2 NOT
WIRE i0 _ TO n0 _
WIRE i1 _ TO n1 _
WIRE i2 _ TO n2 _
VAR a0 AND3
WIRE n0 _ TO a0 i0
WIRE n1 _ TO a0 i1
WIRE n2 _ TO a0 i2
WIRE a0 _ TO o0 _
VAR a1 AND3
WIRE i0 _ TO a1 i0
WIRE n1 _ TO a1 i1
WIRE n2 _ TO a1 i2
WIRE a1 _ TO o1 _
VAR a2 AND3
WIRE n0 _ TO a2 i0
WIRE i1 _ TO a2 i1
WIRE n2 _ TO a2 i2
WIRE a2 _ TO o2 _
VAR a3 AND3
WIRE i0 _ TO a3 i0
WIRE i1 _ TO a3 i1
WIRE n2 _ TO a3 i2
WIRE a3 _ TO o3 _
VAR a4 AND3
WIRE n0 _ TO a4 i0
WIRE n1 _ TO a4 i1
WIRE i2 _ TO a4 i2
WIRE a4 _ TO o4 _
VAR a5 AND3
WIRE i0 _ TO a5 i0
WIRE n1 _ TO a5 i1
WIRE i2 _ TO a5 i2
WIRE a5 _ TO o5 _
VAR a6 AND3
WIRE n0 _ TO a6 i0
WIRE i1 _ TO a6 i1
WIRE i2 _ TO a6 i2
WIRE a6 _ TO o6 _
VAR a7 AND3
WIRE i0 _ TO a7 i0
WIRE i1 _ TO a7 i1
WIRE i2 _ TO a7 i2
WIRE a7 _ TO o7 _
`,
    availableModules: ["NAND", "NOT", "AND", "OR", "NOR", "XOR", "XNOR", "AND3", "OR3", "MUX", "DMUX", "ADD"],
    helpSections: ["circuit-decoder"],
  },
  {
    id: 17,
    title: "Lv17: Encoder",
    description:
      "エンコーダはデコーダの逆です。8本の入力線のうち1本だけが有効なとき、" +
      "どの線が有効かを3ビットの2進数で出力します。\n\n" +
      "例: i5だけが1 → o0=1, o1=0, o2=1（2進数で 101 = 10進数で5）\n\n" +
      "各出力ビットは、そのビットが1になる入力線すべてのORを取ります:\n" +
      "  o0（1の位）= i1 OR i3 OR i5 OR i7\n" +
      "  o1（2の位）= i2 OR i3 OR i6 OR i7\n" +
      "  o2（4の位）= i4 OR i5 OR i6 OR i7\n\n" +
      "テストケースでは、常に入力のうち1本だけが1になります。",
    inputNames: ["i0", "i1", "i2", "i3", "i4", "i5", "i6", "i7"],
    outputNames: ["o0", "o1", "o2"],
    testCases: [
      tc({ i0: true, i1: false, i2: false, i3: false, i4: false, i5: false, i6: false, i7: false }, { o0: false, o1: false, o2: false }),
      tc({ i0: false, i1: true, i2: false, i3: false, i4: false, i5: false, i6: false, i7: false }, { o0: true, o1: false, o2: false }),
      tc({ i0: false, i1: false, i2: true, i3: false, i4: false, i5: false, i6: false, i7: false }, { o0: false, o1: true, o2: false }),
      tc({ i0: false, i1: false, i2: false, i3: true, i4: false, i5: false, i6: false, i7: false }, { o0: true, o1: true, o2: false }),
      tc({ i0: false, i1: false, i2: false, i3: false, i4: true, i5: false, i6: false, i7: false }, { o0: false, o1: false, o2: true }),
      tc({ i0: false, i1: false, i2: false, i3: false, i4: false, i5: true, i6: false, i7: false }, { o0: true, o1: false, o2: true }),
      tc({ i0: false, i1: false, i2: false, i3: false, i4: false, i5: false, i6: true, i7: false }, { o0: false, o1: true, o2: true }),
      tc({ i0: false, i1: false, i2: false, i3: false, i4: false, i5: false, i6: false, i7: true }, { o0: true, o1: true, o2: true }),
    ],
    moduleDefs: `${NOT}${AND}${OR}${NOR}${XOR}${XNOR}${AND3}${OR3}${MUX}${DMUX}${ADD}${DEC}`,
    fixedCode: `VAR i0 BITIN\nVAR i1 BITIN\nVAR i2 BITIN\nVAR i3 BITIN\nVAR i4 BITIN\nVAR i5 BITIN\nVAR i6 BITIN\nVAR i7 BITIN\nVAR o0 BITOUT\nVAR o1 BITOUT\nVAR o2 BITOUT`,
    editableCode: `VAR or00 OR
WIRE i1 _ TO or00 i0
WIRE i3 _ TO or00 i1
VAR or01 OR
WIRE i5 _ TO or01 i0
WIRE i7 _ TO or01 i1
VAR or02 OR
WIRE or00 _ TO or02 i0
WIRE or01 _ TO or02 i1
WIRE or02 _ TO o0 _
VAR or10 OR
WIRE i2 _ TO or10 i0
WIRE i3 _ TO or10 i1
VAR or11 OR
WIRE i6 _ TO or11 i0
WIRE i7 _ TO or11 i1
VAR or12 OR
WIRE or10 _ TO or12 i0
WIRE or11 _ TO or12 i1
WIRE or12 _ TO o1 _
VAR or20 OR
WIRE i4 _ TO or20 i0
WIRE i5 _ TO or20 i1
VAR or21 OR
WIRE i6 _ TO or21 i0
WIRE i7 _ TO or21 i1
VAR or22 OR
WIRE or20 _ TO or22 i0
WIRE or21 _ TO or22 i1
WIRE or22 _ TO o2 _
`,
    availableModules: ["NAND", "NOT", "AND", "OR", "NOR", "XOR", "XNOR", "AND3", "OR3", "MUX", "DMUX", "ADD", "DEC"],
    helpSections: ["circuit-decoder", "circuit-encoder"],
  },
  {
    id: 18,
    title: "Lv18: Byte Add",
    description:
      "いよいよ整数の足し算です！\n\n" +
      "BYTEINは0〜255の整数をバイト信号として受け取ります。" +
      "BYTEOUTはその逆で、バイト信号から整数を出力します。\n\n" +
      "BYTESPLITはバイト信号を8本のビット線（o0〜o7）に分解します。" +
      "BYTEMERGEはその逆で、8本のビット線（i0〜i7）をバイト信号にまとめます。\n\n" +
      "Full Adder（ADD）を8個連結して「リップルキャリー加算器」を構築しましょう。" +
      "各ADDは対応するビット同士を足し、繰り上がり（carry）を次のビットのADDに渡します。\n\n" +
      "  add0: sa.o0 + sb.o0         → m.i0（1の位）\n" +
      "  add1: sa.o1 + sb.o1 + carry → m.i1（2の位）\n" +
      "  add2: sa.o2 + sb.o2 + carry → m.i2（4の位）\n" +
      "  ...以下同様\n\n" +
      "結果が255を超える場合はオーバーフローし、下位8ビットのみが出力されます。",
    inputNames: ["a", "b"],
    outputNames: ["out"],
    testCases: [
      // 基本: ゼロとの加算
      tc({ a: 0, b: 0 }, { out: 0 }),
      tc({ a: 1, b: 0 }, { out: 1 }),
      tc({ a: 0, b: 1 }, { out: 1 }),
      tc({ a: 0, b: 255 }, { out: 255 }),
      tc({ a: 255, b: 0 }, { out: 255 }),
      // 小さな値
      tc({ a: 1, b: 1 }, { out: 2 }),
      tc({ a: 2, b: 3 }, { out: 5 }),
      tc({ a: 7, b: 8 }, { out: 15 }),
      tc({ a: 10, b: 20 }, { out: 30 }),
      // 2のべき乗
      tc({ a: 1, b: 2 }, { out: 3 }),
      tc({ a: 4, b: 8 }, { out: 12 }),
      tc({ a: 16, b: 32 }, { out: 48 }),
      tc({ a: 64, b: 128 }, { out: 192 }),
      tc({ a: 64, b: 64 }, { out: 128 }),
      tc({ a: 128, b: 128 }, { out: 0 }), // オーバーフロー
      // 交換法則 a+b = b+a
      tc({ a: 42, b: 58 }, { out: 100 }),
      tc({ a: 58, b: 42 }, { out: 100 }),
      tc({ a: 99, b: 1 }, { out: 100 }),
      tc({ a: 1, b: 99 }, { out: 100 }),
      // 境界値
      tc({ a: 127, b: 128 }, { out: 255 }),
      tc({ a: 254, b: 1 }, { out: 255 }),
      tc({ a: 1, b: 254 }, { out: 255 }),
      tc({ a: 127, b: 127 }, { out: 254 }),
      // 繰り上がり連鎖
      tc({ a: 15, b: 1 }, { out: 16 }),   // 00001111 + 1 = 00010000
      tc({ a: 255, b: 1 }, { out: 0 }),   // 全ビット繰り上がり
      tc({ a: 127, b: 1 }, { out: 128 }), // 01111111 + 1 = 10000000
      // オーバーフロー
      tc({ a: 200, b: 100 }, { out: 44 }),
      tc({ a: 255, b: 255 }, { out: 254 }),
      tc({ a: 200, b: 200 }, { out: 144 }),
      tc({ a: 130, b: 130 }, { out: 4 }),
      // 同じ値の加算
      tc({ a: 50, b: 50 }, { out: 100 }),
      tc({ a: 100, b: 100 }, { out: 200 }),
      // 各ビット位置の検証
      tc({ a: 170, b: 85 }, { out: 255 }),  // 10101010 + 01010101 = 11111111
      tc({ a: 85, b: 170 }, { out: 255 }),  // 交換法則
    ],
    moduleDefs: `${NOT}${AND}${OR}${NOR}${XOR}${XNOR}${AND3}${OR3}${MUX}${DMUX}${ADD}${DEC}${ENC}`,
    fixedCode: `VAR a BYTEIN\nVAR b BYTEIN\nVAR out BYTEOUT\nVAR sa BYTESPLIT\nWIRE a _ TO sa _\nVAR sb BYTESPLIT\nWIRE b _ TO sb _\nVAR m BYTEMERGE\nWIRE m _ TO out _`,
    editableCode: `VAR add0 ADD
WIRE sa o0 TO add0 i0
WIRE sb o0 TO add0 i1
WIRE add0 o0 TO m i0
VAR add1 ADD
WIRE sa o1 TO add1 i0
WIRE sb o1 TO add1 i1
WIRE add0 o1 TO add1 i2
WIRE add1 o0 TO m i1
VAR add2 ADD
WIRE sa o2 TO add2 i0
WIRE sb o2 TO add2 i1
WIRE add1 o1 TO add2 i2
WIRE add2 o0 TO m i2
VAR add3 ADD
WIRE sa o3 TO add3 i0
WIRE sb o3 TO add3 i1
WIRE add2 o1 TO add3 i2
WIRE add3 o0 TO m i3
VAR add4 ADD
WIRE sa o4 TO add4 i0
WIRE sb o4 TO add4 i1
WIRE add3 o1 TO add4 i2
WIRE add4 o0 TO m i4
VAR add5 ADD
WIRE sa o5 TO add5 i0
WIRE sb o5 TO add5 i1
WIRE add4 o1 TO add5 i2
WIRE add5 o0 TO m i5
VAR add6 ADD
WIRE sa o6 TO add6 i0
WIRE sb o6 TO add6 i1
WIRE add5 o1 TO add6 i2
WIRE add6 o0 TO m i6
VAR add7 ADD
WIRE sa o7 TO add7 i0
WIRE sb o7 TO add7 i1
WIRE add6 o1 TO add7 i2
WIRE add7 o0 TO m i7
`,
    availableModules: ["NAND", "NOT", "AND", "OR", "NOR", "XOR", "XNOR", "AND3", "OR3", "MUX", "DMUX", "ADD", "DEC", "ENC", "BYTESPLIT", "BYTEMERGE"],
    helpSections: ["circuit-full-adder", "mod-bytein", "mod-byteout"],
  },
  {
    id: 19,
    title: "Lv19: SR Latch",
    description:
      "ここからは「記憶」を持つ回路に挑戦します！\n\n" +
      "これまでの回路はすべて組み合わせ回路（入力が決まれば出力が決まる）でしたが、" +
      "FLIPFLOPは状態を記憶できる特別なモジュールです。\n\n" +
      "FLIPFLOPには2つの入力と1つの出力があります:\n" +
      "  s（Set）= 1にすると出力qが1になる\n" +
      "  r（Reset）= 1にすると出力qが0になる\n" +
      "  両方0なら、前の状態を保持する\n\n" +
      "入力s, rをFLIPFLOPに接続し、出力qを取り出してください。\n" +
      "テストは順番に実行され、前のテストの状態が次に引き継がれます。",
    inputNames: ["s", "r"],
    outputNames: ["q"],
    testCases: [
      // 初期状態: hold → 0
      tc({ s: false, r: false }, { q: false }),
      // セット → 1
      tc({ s: true, r: false }, { q: true }),
      // hold → 1を保持
      tc({ s: false, r: false }, { q: true }),
      tc({ s: false, r: false }, { q: true }),
      // リセット → 0
      tc({ s: false, r: true }, { q: false }),
      // hold → 0を保持
      tc({ s: false, r: false }, { q: false }),
      tc({ s: false, r: false }, { q: false }),
      // セット → 1
      tc({ s: true, r: false }, { q: true }),
      // 連続セット → 1のまま
      tc({ s: true, r: false }, { q: true }),
      // hold → 1を保持
      tc({ s: false, r: false }, { q: true }),
      // リセット → 0
      tc({ s: false, r: true }, { q: false }),
      // 連続リセット → 0のまま
      tc({ s: false, r: true }, { q: false }),
      // hold → 0を保持
      tc({ s: false, r: false }, { q: false }),
      // セット→リセットの素早い切り替え
      tc({ s: true, r: false }, { q: true }),
      tc({ s: false, r: true }, { q: false }),
      tc({ s: true, r: false }, { q: true }),
      tc({ s: false, r: true }, { q: false }),
      // 最後にセットして保持確認
      tc({ s: true, r: false }, { q: true }),
      tc({ s: false, r: false }, { q: true }),
      tc({ s: false, r: false }, { q: true }),
    ],
    moduleDefs: `${NOT}${AND}${OR}${NOR}${XOR}${XNOR}${AND3}${OR3}${MUX}${DMUX}${ADD}${DEC}${ENC}`,
    fixedCode: `VAR s BITIN\nVAR r BITIN\nVAR q BITOUT`,
    editableCode: `VAR ff FLIPFLOP
WIRE s _ TO ff s
WIRE r _ TO ff r
WIRE ff _ TO q _
`,
    availableModules: ["NAND", "NOT", "AND", "OR", "NOR", "XOR", "XNOR", "AND3", "OR3", "MUX", "DMUX", "ADD", "DEC", "ENC", "FLIPFLOP"],
    helpSections: ["mod-flipflop", "circuit-sr-latch"],
  },
  {
    id: 20,
    title: "Lv20: D Latch",
    description:
      "SR Latchでは「セット」と「リセット」を別々に制御しましたが、" +
      "実際のメモリでは「この値を覚えて」という操作の方が自然です。\n\n" +
      "D Latch（データラッチ）は1ビットのメモリです:\n" +
      "  d（Data）= 記憶したい値（0または1）\n" +
      "  e（Enable）= 1のとき書き込み、0のとき保持\n" +
      "  q = 記憶されている値\n\n" +
      "e=1のとき: d=1ならq=1、d=0ならq=0（dの値がそのまま記憶される）\n" +
      "e=0のとき: dが変わってもqは前の値を保持する\n\n" +
      "ヒント: FLIPFLOPのs,rをd,eから作るには？\n" +
      "  s = d AND e（dが1かつeが1のときセット）\n" +
      "  r = (NOT d) AND e（dが0かつeが1のときリセット）",
    inputNames: ["d", "e"],
    outputNames: ["q"],
    testCases: [
      // 初期状態: enable=0, hold → 0
      tc({ d: false, e: false }, { q: false }),
      // d=1でもenable=0なら書き込まない → 0のまま
      tc({ d: true, e: false }, { q: false }),
      // 1を書き込み
      tc({ d: true, e: true }, { q: true }),
      // hold → 1を保持
      tc({ d: false, e: false }, { q: true }),
      tc({ d: true, e: false }, { q: true }),
      tc({ d: false, e: false }, { q: true }),
      // 0を書き込み
      tc({ d: false, e: true }, { q: false }),
      // hold → 0を保持
      tc({ d: false, e: false }, { q: false }),
      tc({ d: true, e: false }, { q: false }),
      // 1を書き込み
      tc({ d: true, e: true }, { q: true }),
      // 同じ値を再書き込み → 変化なし
      tc({ d: true, e: true }, { q: true }),
      // hold → 1を保持
      tc({ d: false, e: false }, { q: true }),
      // 0を書き込み
      tc({ d: false, e: true }, { q: false }),
      // 0を再書き込み → 変化なし
      tc({ d: false, e: true }, { q: false }),
      // 書き込み→保持→書き込みの素早い切り替え
      tc({ d: true, e: true }, { q: true }),
      tc({ d: false, e: false }, { q: true }),
      tc({ d: false, e: true }, { q: false }),
      tc({ d: false, e: false }, { q: false }),
      tc({ d: true, e: true }, { q: true }),
      tc({ d: false, e: false }, { q: true }),
      tc({ d: false, e: true }, { q: false }),
      // 最後にhold確認
      tc({ d: true, e: false }, { q: false }),
      tc({ d: false, e: false }, { q: false }),
      tc({ d: true, e: true }, { q: true }),
      tc({ d: false, e: false }, { q: true }),
    ],
    moduleDefs: `${NOT}${AND}${OR}${NOR}${XOR}${XNOR}${AND3}${OR3}${MUX}${DMUX}${ADD}${DEC}${ENC}`,
    fixedCode: `VAR d BITIN\nVAR e BITIN\nVAR q BITOUT`,
    editableCode: `VAR not NOT
VAR and_s AND
VAR and_r AND
VAR ff FLIPFLOP
WIRE d _ TO not _
WIRE d _ TO and_s i0
WIRE e _ TO and_s i1
WIRE not _ TO and_r i0
WIRE e _ TO and_r i1
WIRE and_s _ TO ff s
WIRE and_r _ TO ff r
WIRE ff _ TO q _
`,
    availableModules: ["NAND", "NOT", "AND", "OR", "NOR", "XOR", "XNOR", "AND3", "OR3", "MUX", "DMUX", "ADD", "DEC", "ENC", "FLIPFLOP"],
    helpSections: ["mod-flipflop", "circuit-sr-latch", "circuit-d-latch"],
  },
  {
    id: 21,
    title: "Lv21: Byte Memory",
    description:
      "D Latchで1ビットの記憶ができました。これを8個並べれば、1バイト（0〜255）を記憶できます！\n\n" +
      "入力:\n" +
      "  d（BYTEIN）= 記憶したい8ビットの値\n" +
      "  w（BITIN）= 1のとき書き込み、0のとき保持\n\n" +
      "出力:\n" +
      "  q（BYTEOUT）= 記憶されている8ビットの値\n\n" +
      "BYTESPLITでバイト信号を8本のビット線に分解し、D Latch（DLATCH）を8個使って各ビットを記憶し、" +
      "BYTEMERGEで8本のビット線をバイト信号に戻します。\n" +
      "DLATCHのポート: d（データ入力）、e（イネーブル）、q（出力）",
    inputNames: ["d", "w"],
    outputNames: ["q"],
    testCases: [
      // 初期状態: hold → 0
      tc({ d: 0, w: false }, { q: 0 }),
      // 値を入れてもwrite=0なら書き込まない
      tc({ d: 123, w: false }, { q: 0 }),
      // 42を書き込み
      tc({ d: 42, w: true }, { q: 42 }),
      // hold → 42を保持
      tc({ d: 0, w: false }, { q: 42 }),
      tc({ d: 255, w: false }, { q: 42 }),
      tc({ d: 100, w: false }, { q: 42 }),
      // 255を書き込み（全ビット1）
      tc({ d: 255, w: true }, { q: 255 }),
      // hold → 255を保持
      tc({ d: 0, w: false }, { q: 255 }),
      // 0を書き込み（全ビット0）
      tc({ d: 0, w: true }, { q: 0 }),
      // hold → 0を保持
      tc({ d: 255, w: false }, { q: 0 }),
      // 各ビットパターン
      tc({ d: 1, w: true }, { q: 1 }),       // 00000001
      tc({ d: 0, w: false }, { q: 1 }),
      tc({ d: 128, w: true }, { q: 128 }),   // 10000000
      tc({ d: 0, w: false }, { q: 128 }),
      tc({ d: 170, w: true }, { q: 170 }),   // 10101010
      tc({ d: 0, w: false }, { q: 170 }),
      tc({ d: 85, w: true }, { q: 85 }),     // 01010101
      tc({ d: 0, w: false }, { q: 85 }),
      // 上書き
      tc({ d: 100, w: true }, { q: 100 }),
      tc({ d: 200, w: true }, { q: 200 }),   // 連続書き込み
      tc({ d: 50, w: true }, { q: 50 }),
      // hold後に確認
      tc({ d: 0, w: false }, { q: 50 }),
      tc({ d: 255, w: false }, { q: 50 }),
      // 2のべき乗
      tc({ d: 2, w: true }, { q: 2 }),
      tc({ d: 4, w: true }, { q: 4 }),
      tc({ d: 8, w: true }, { q: 8 }),
      tc({ d: 16, w: true }, { q: 16 }),
      tc({ d: 32, w: true }, { q: 32 }),
      tc({ d: 64, w: true }, { q: 64 }),
      // 最後にholdで確認
      tc({ d: 0, w: false }, { q: 64 }),
      tc({ d: 255, w: false }, { q: 64 }),
      // 同じ値の再書き込み
      tc({ d: 64, w: true }, { q: 64 }),
      tc({ d: 0, w: false }, { q: 64 }),
    ],
    moduleDefs: `${NOT}${AND}${OR}${NOR}${XOR}${XNOR}${AND3}${OR3}${MUX}${DMUX}${ADD}${DEC}${ENC}${DLATCH}`,
    fixedCode: `VAR d BYTEIN\nVAR w BITIN\nVAR q BYTEOUT\nVAR ds BYTESPLIT\nWIRE d _ TO ds _\nVAR qm BYTEMERGE\nWIRE qm _ TO q _`,
    editableCode: `VAR dl0 DLATCH
WIRE ds o0 TO dl0 d
WIRE w _ TO dl0 e
WIRE dl0 _ TO qm i0
VAR dl1 DLATCH
WIRE ds o1 TO dl1 d
WIRE w _ TO dl1 e
WIRE dl1 _ TO qm i1
VAR dl2 DLATCH
WIRE ds o2 TO dl2 d
WIRE w _ TO dl2 e
WIRE dl2 _ TO qm i2
VAR dl3 DLATCH
WIRE ds o3 TO dl3 d
WIRE w _ TO dl3 e
WIRE dl3 _ TO qm i3
VAR dl4 DLATCH
WIRE ds o4 TO dl4 d
WIRE w _ TO dl4 e
WIRE dl4 _ TO qm i4
VAR dl5 DLATCH
WIRE ds o5 TO dl5 d
WIRE w _ TO dl5 e
WIRE dl5 _ TO qm i5
VAR dl6 DLATCH
WIRE ds o6 TO dl6 d
WIRE w _ TO dl6 e
WIRE dl6 _ TO qm i6
VAR dl7 DLATCH
WIRE ds o7 TO dl7 d
WIRE w _ TO dl7 e
WIRE dl7 _ TO qm i7
`,
    availableModules: ["NAND", "NOT", "AND", "OR", "NOR", "XOR", "XNOR", "AND3", "OR3", "MUX", "DMUX", "ADD", "DEC", "ENC", "FLIPFLOP", "DLATCH", "BYTESPLIT", "BYTEMERGE"],
    helpSections: ["mod-flipflop", "circuit-d-latch", "circuit-byte-memory", "mod-bytein", "mod-byteout"],
  },
  {
    id: 22,
    title: "Lv22: Register",
    description:
      "D Latchはenable=1の間ずっと入力が出力に反映される「レベルトリガ」でした。\n" +
      "しかし実際のCPUでは、クロック信号の立ち上がりの瞬間だけデータを取り込む「エッジトリガ」が必要です。\n\n" +
      "Register（Dフリップフロップ）はエッジトリガの1ビットメモリです:\n" +
      "  d（Data）= 記憶したい値\n" +
      "  clk（Clock）= クロック信号\n" +
      "  q = 記憶されている値\n\n" +
      "動作:\n" +
      "  clkが0→1に変化した瞬間（立ち上がりエッジ）のdの値を記憶\n" +
      "  clk=1の間にdが変化しても出力は変わらない\n" +
      "  clk=0の間は出力を保持\n\n" +
      "ヒント: DLATCHを2つ使う「マスター・スレーブ」構成で実現できます。\n" +
      "  マスター: d=入力d, e=NOT clk（clk=0で入力を取り込む）\n" +
      "  スレーブ: d=マスター出力, e=clk（clk=1でマスターの値を出力）\n" +
      "clkが0→1になると、マスターが値を保持し、スレーブがその値を出力します。",
    inputNames: ["d", "clk"],
    outputNames: ["q"],
    testCases: [
      // 初期状態: clk=0, d=0 → q=0
      tc({ d: false, clk: false }, { q: false }),
      // clk=0のままd=1 → masterが1を取り込むがslaveは保持 → q=0
      tc({ d: true, clk: false }, { q: false }),
      // 立ち上がりエッジ: clk=1 → masterが1を保持、slaveが出力 → q=1
      tc({ d: true, clk: true }, { q: true }),
      // clk=1のままd=0 → masterは保持中なので変化なし → q=1
      tc({ d: false, clk: true }, { q: true }),
      // clk=0 → masterがd=0を取り込む、slaveは保持 → q=1
      tc({ d: false, clk: false }, { q: true }),
      // 立ち上がりエッジ: clk=1 → masterが0を保持、slaveが出力 → q=0
      tc({ d: false, clk: true }, { q: false }),
      // clk=0, d=1 → masterが1を取り込む、slaveは保持 → q=0
      tc({ d: true, clk: false }, { q: false }),
      // 立ち上がりエッジ: clk=1 → q=1
      tc({ d: true, clk: true }, { q: true }),
      // clk=0に戻る → q=1保持
      tc({ d: false, clk: false }, { q: true }),
      // もう一度立ち上がりエッジ（d=0） → q=0
      tc({ d: false, clk: true }, { q: false }),
      // clk=0, d=1 → q=0保持
      tc({ d: true, clk: false }, { q: false }),
      tc({ d: true, clk: false }, { q: false }),
      // 立ち上がりエッジ → q=1
      tc({ d: true, clk: true }, { q: true }),
      // clk=1のままd変化 → q=1のまま
      tc({ d: false, clk: true }, { q: true }),
      tc({ d: true, clk: true }, { q: true }),
      // clk=0, d=0 → masterが0を取り込む
      tc({ d: false, clk: false }, { q: true }),
      // 立ち上がりエッジ → q=0
      tc({ d: false, clk: true }, { q: false }),
      // 保持確認
      tc({ d: true, clk: false }, { q: false }),
      tc({ d: false, clk: false }, { q: false }),
    ],
    moduleDefs: `${NOT}${AND}${OR}${NOR}${XOR}${XNOR}${AND3}${OR3}${MUX}${DMUX}${ADD}${DEC}${ENC}${DLATCH}`,
    fixedCode: `VAR d BITIN\nVAR clk BITIN\nVAR q BITOUT`,
    editableCode: `VAR nclk NOT
WIRE clk _ TO nclk _
VAR master DLATCH
WIRE d _ TO master d
WIRE nclk _ TO master e
VAR slave DLATCH
WIRE master _ TO slave d
WIRE clk _ TO slave e
WIRE slave _ TO q _
`,
    availableModules: ["NAND", "NOT", "AND", "OR", "NOR", "XOR", "XNOR", "AND3", "OR3", "MUX", "DMUX", "ADD", "DEC", "ENC", "FLIPFLOP", "DLATCH"],
    helpSections: ["mod-flipflop", "circuit-d-latch", "circuit-register"],
  },
];
