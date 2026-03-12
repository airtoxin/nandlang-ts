import { expect, test } from "vitest";
import {
  ADD,
  AND,
  AND3,
  BYTEADD,
  BYTEREG,
  DEC,
  DECODER_3BIT,
  DLATCH,
  ENC,
  NOR,
  NOT,
  ON,
  OR,
  OR3,
  REG,
  XNOR,
  XOR,
} from "./code-fragments";
import { Vm } from "./vm";

const getRunner = (program: string) => {
  const vm = new Vm();
  vm.compile(program);
  return (inputs: [string, boolean][]): [string, boolean][] => {
    return [...vm.run(new Map(inputs)).entries()];
  };
};

test("ON", () => {
  const runner = getRunner(`
    ${ON}
    VAR out BITOUT

    VAR on ON
    WIRE on _ TO out _
  `);
  expect(runner([])).toEqual([["out", true]]);
});

test("NOT", () => {
  const runner = getRunner(`
    ${NOT}
    VAR in BITIN
    VAR out BITOUT
    
    VAR not NOT
    WIRE in _ TO not _
    WIRE not _ TO out _
  `);
  expect(runner([["in", true]])).toEqual([["out", false]]);
  expect(runner([["in", false]])).toEqual([["out", true]]);
});

test("AND", () => {
  const runner = getRunner(`
    ${AND}
    VAR x BITIN
    VAR y BITIN
    VAR out BITOUT
    
    VAR and AND
    WIRE x _ TO and i0
    WIRE y _ TO and i1
    WIRE and _ TO out _
  `);
  expect(
    runner([
      ["x", false],
      ["y", false],
    ]),
  ).toEqual([["out", false]]);
  expect(
    runner([
      ["x", true],
      ["y", false],
    ]),
  ).toEqual([["out", false]]);
  expect(
    runner([
      ["x", false],
      ["y", true],
    ]),
  ).toEqual([["out", false]]);
  expect(
    runner([
      ["x", true],
      ["y", true],
    ]),
  ).toEqual([["out", true]]);
});

test("AND3", () => {
  const runner = getRunner(`
    ${AND3}
    VAR x BITIN
    VAR y BITIN
    VAR z BITIN
    VAR out BITOUT
    
    VAR and3 AND3
    WIRE x _ TO and3 i0
    WIRE y _ TO and3 i1
    WIRE z _ TO and3 i2
    WIRE and3 _ TO out _
  `);
  expect(
    runner([
      ["x", false],
      ["y", false],
      ["z", false],
    ]),
  ).toEqual([["out", false]]);
  expect(
    runner([
      ["x", true],
      ["y", false],
      ["z", false],
    ]),
  ).toEqual([["out", false]]);
  expect(
    runner([
      ["x", false],
      ["y", true],
      ["z", false],
    ]),
  ).toEqual([["out", false]]);
  expect(
    runner([
      ["x", false],
      ["y", false],
      ["z", true],
    ]),
  ).toEqual([["out", false]]);
  expect(
    runner([
      ["x", true],
      ["y", true],
      ["z", false],
    ]),
  ).toEqual([["out", false]]);
  expect(
    runner([
      ["x", true],
      ["y", false],
      ["z", true],
    ]),
  ).toEqual([["out", false]]);
  expect(
    runner([
      ["x", false],
      ["y", true],
      ["z", true],
    ]),
  ).toEqual([["out", false]]);
  expect(
    runner([
      ["x", true],
      ["y", true],
      ["z", true],
    ]),
  ).toEqual([["out", true]]);
});

test("OR", () => {
  const runner = getRunner(`
    ${OR}
    VAR x BITIN
    VAR y BITIN
    VAR out BITOUT
    
    VAR or OR
    WIRE x _ TO or i0
    WIRE y _ TO or i1
    WIRE or _ TO out _
  `);
  expect(
    runner([
      ["x", false],
      ["y", false],
    ]),
  ).toEqual([["out", false]]);
  expect(
    runner([
      ["x", true],
      ["y", false],
    ]),
  ).toEqual([["out", true]]);
  expect(
    runner([
      ["x", false],
      ["y", true],
    ]),
  ).toEqual([["out", true]]);
  expect(
    runner([
      ["x", true],
      ["y", true],
    ]),
  ).toEqual([["out", true]]);
});

test("OR3", () => {
  const runner = getRunner(`
    ${OR3}
    VAR x BITIN
    VAR y BITIN
    VAR z BITIN
    VAR out BITOUT
    
    VAR or3 OR3
    WIRE x _ TO or3 i0
    WIRE y _ TO or3 i1
    WIRE z _ TO or3 i2
    WIRE or3 _ TO out _
  `);
  expect(
    runner([
      ["x", false],
      ["y", false],
      ["z", false],
    ]),
  ).toEqual([["out", false]]);
  expect(
    runner([
      ["x", true],
      ["y", false],
      ["z", false],
    ]),
  ).toEqual([["out", true]]);
  expect(
    runner([
      ["x", false],
      ["y", true],
      ["z", false],
    ]),
  ).toEqual([["out", true]]);
  expect(
    runner([
      ["x", false],
      ["y", false],
      ["z", true],
    ]),
  ).toEqual([["out", true]]);
  expect(
    runner([
      ["x", true],
      ["y", true],
      ["z", false],
    ]),
  ).toEqual([["out", true]]);
  expect(
    runner([
      ["x", true],
      ["y", false],
      ["z", true],
    ]),
  ).toEqual([["out", true]]);
  expect(
    runner([
      ["x", false],
      ["y", true],
      ["z", true],
    ]),
  ).toEqual([["out", true]]);
  expect(
    runner([
      ["x", true],
      ["y", true],
      ["z", true],
    ]),
  ).toEqual([["out", true]]);
});

test("NOR", () => {
  const runner = getRunner(`
    ${NOR}
    VAR x BITIN
    VAR y BITIN
    VAR out BITOUT
    
    VAR nor NOR
    WIRE x _ TO nor i0
    WIRE y _ TO nor i1
    WIRE nor _ TO out _
  `);
  expect(
    runner([
      ["x", false],
      ["y", false],
    ]),
  ).toEqual([["out", true]]);
  expect(
    runner([
      ["x", true],
      ["y", false],
    ]),
  ).toEqual([["out", false]]);
  expect(
    runner([
      ["x", false],
      ["y", true],
    ]),
  ).toEqual([["out", false]]);
  expect(
    runner([
      ["x", true],
      ["y", true],
    ]),
  ).toEqual([["out", false]]);
});

test("XOR", () => {
  const runner = getRunner(`
    ${XOR}
    VAR x BITIN
    VAR y BITIN
    VAR out BITOUT
    VAR xor XOR
    WIRE x _ TO xor i0
    WIRE y _ TO xor i1
    WIRE xor _ TO out _
  `);
  expect(
    runner([
      ["x", false],
      ["y", false],
    ]),
  ).toEqual([["out", false]]);
  expect(
    runner([
      ["x", true],
      ["y", false],
    ]),
  ).toEqual([["out", true]]);
  expect(
    runner([
      ["x", false],
      ["y", true],
    ]),
  ).toEqual([["out", true]]);
  expect(
    runner([
      ["x", true],
      ["y", true],
    ]),
  ).toEqual([["out", false]]);
});

test("XNOR", () => {
  const runner = getRunner(`
    ${XNOR}
    VAR x BITIN
    VAR y BITIN
    VAR out BITOUT
    VAR xnor XNOR
    WIRE x _ TO xnor i0
    WIRE y _ TO xnor i1
    WIRE xnor _ TO out _
  `);
  expect(
    runner([
      ["x", false],
      ["y", false],
    ]),
  ).toEqual([["out", true]]);
  expect(
    runner([
      ["x", true],
      ["y", false],
    ]),
  ).toEqual([["out", false]]);
  expect(
    runner([
      ["x", false],
      ["y", true],
    ]),
  ).toEqual([["out", false]]);
  expect(
    runner([
      ["x", true],
      ["y", true],
    ]),
  ).toEqual([["out", true]]);
});

test("ADD", () => {
  const runner = getRunner(`
    ${ADD}
    VAR a BITIN
    VAR b BITIN
    VAR cin BITIN
    VAR s BITOUT
    VAR cout BITOUT

    VAR add ADD
    WIRE a _ TO add i0
    WIRE b _ TO add i1
    WIRE cin _ TO add i2
    WIRE add o0 TO s _
    WIRE add o1 TO cout _
  `);
  expect(
    runner([
      ["a", false],
      ["b", false],
      ["cin", false],
    ]),
  ).toEqual([
    ["s", false],
    ["cout", false],
  ]);
  expect(
    runner([
      ["a", false],
      ["b", false],
      ["cin", true],
    ]),
  ).toEqual([
    ["s", true],
    ["cout", false],
  ]);
  expect(
    runner([
      ["a", false],
      ["b", true],
      ["cin", false],
    ]),
  ).toEqual([
    ["s", true],
    ["cout", false],
  ]);
  expect(
    runner([
      ["a", false],
      ["b", true],
      ["cin", true],
    ]),
  ).toEqual([
    ["s", false],
    ["cout", true],
  ]);
  expect(
    runner([
      ["a", true],
      ["b", false],
      ["cin", false],
    ]),
  ).toEqual([
    ["s", true],
    ["cout", false],
  ]);
  expect(
    runner([
      ["a", true],
      ["b", false],
      ["cin", true],
    ]),
  ).toEqual([
    ["s", false],
    ["cout", true],
  ]);
  expect(
    runner([
      ["a", true],
      ["b", true],
      ["cin", false],
    ]),
  ).toEqual([
    ["s", false],
    ["cout", true],
  ]);
  expect(
    runner([
      ["a", true],
      ["b", true],
      ["cin", true],
    ]),
  ).toEqual([
    ["s", true],
    ["cout", true],
  ]);
});

test("DEC", () => {
  const runner = getRunner(`
    ${DEC}
    VAR x BITIN
    VAR y BITIN
    VAR z BITIN
    VAR o0 BITOUT
    VAR o1 BITOUT
    VAR o2 BITOUT
    VAR o3 BITOUT
    VAR o4 BITOUT
    VAR o5 BITOUT
    VAR o6 BITOUT
    VAR o7 BITOUT
    VAR dec DEC
    WIRE x _ TO dec i0
    WIRE y _ TO dec i1
    WIRE z _ TO dec i2
    WIRE dec o0 TO o0 _
    WIRE dec o1 TO o1 _
    WIRE dec o2 TO o2 _
    WIRE dec o3 TO o3 _
    WIRE dec o4 TO o4 _
    WIRE dec o5 TO o5 _
    WIRE dec o6 TO o6 _
    WIRE dec o7 TO o7 _
  `);
  expect(
    runner([
      ["x", false],
      ["y", false],
      ["z", false],
    ]),
  ).toEqual([
    ["o0", true],
    ["o1", false],
    ["o2", false],
    ["o3", false],
    ["o4", false],
    ["o5", false],
    ["o6", false],
    ["o7", false],
  ]);
  expect(
    runner([
      ["x", true],
      ["y", false],
      ["z", false],
    ]),
  ).toEqual([
    ["o0", false],
    ["o1", true],
    ["o2", false],
    ["o3", false],
    ["o4", false],
    ["o5", false],
    ["o6", false],
    ["o7", false],
  ]);
  expect(
    runner([
      ["x", false],
      ["y", true],
      ["z", false],
    ]),
  ).toEqual([
    ["o0", false],
    ["o1", false],
    ["o2", true],
    ["o3", false],
    ["o4", false],
    ["o5", false],
    ["o6", false],
    ["o7", false],
  ]);
  expect(
    runner([
      ["x", true],
      ["y", true],
      ["z", false],
    ]),
  ).toEqual([
    ["o0", false],
    ["o1", false],
    ["o2", false],
    ["o3", true],
    ["o4", false],
    ["o5", false],
    ["o6", false],
    ["o7", false],
  ]);
  expect(
    runner([
      ["x", false],
      ["y", false],
      ["z", true],
    ]),
  ).toEqual([
    ["o0", false],
    ["o1", false],
    ["o2", false],
    ["o3", false],
    ["o4", true],
    ["o5", false],
    ["o6", false],
    ["o7", false],
  ]);
  expect(
    runner([
      ["x", true],
      ["y", false],
      ["z", true],
    ]),
  ).toEqual([
    ["o0", false],
    ["o1", false],
    ["o2", false],
    ["o3", false],
    ["o4", false],
    ["o5", true],
    ["o6", false],
    ["o7", false],
  ]);
  expect(
    runner([
      ["x", false],
      ["y", true],
      ["z", true],
    ]),
  ).toEqual([
    ["o0", false],
    ["o1", false],
    ["o2", false],
    ["o3", false],
    ["o4", false],
    ["o5", false],
    ["o6", true],
    ["o7", false],
  ]);
  expect(
    runner([
      ["x", true],
      ["y", true],
      ["z", true],
    ]),
  ).toEqual([
    ["o0", false],
    ["o1", false],
    ["o2", false],
    ["o3", false],
    ["o4", false],
    ["o5", false],
    ["o6", false],
    ["o7", true],
  ]);
});

test("ENC", () => {
  const runner = getRunner(`
    ${ENC}
    VAR i0 BITIN
    VAR i1 BITIN
    VAR i2 BITIN
    VAR i3 BITIN
    VAR i4 BITIN
    VAR i5 BITIN
    VAR i6 BITIN
    VAR i7 BITIN
    VAR o0 BITOUT
    VAR o1 BITOUT
    VAR o2 BITOUT
    VAR enc ENC
    WIRE i0 _ TO enc i0
    WIRE i1 _ TO enc i1
    WIRE i2 _ TO enc i2
    WIRE i3 _ TO enc i3
    WIRE i4 _ TO enc i4
    WIRE i5 _ TO enc i5
    WIRE i6 _ TO enc i6
    WIRE i7 _ TO enc i7
    WIRE enc o0 TO o0 _
    WIRE enc o1 TO o1 _
    WIRE enc o2 TO o2 _
  `);
  expect(
    runner([
      ["i0", true],
      ["i1", false],
      ["i2", false],
      ["i3", false],
      ["i4", false],
      ["i5", false],
      ["i6", false],
      ["i7", false],
    ]),
  ).toEqual([
    ["o0", false],
    ["o1", false],
    ["o2", false],
  ]);
  expect(
    runner([
      ["i0", false],
      ["i1", true],
      ["i2", false],
      ["i3", false],
      ["i4", false],
      ["i5", false],
      ["i6", false],
      ["i7", false],
    ]),
  ).toEqual([
    ["o0", true],
    ["o1", false],
    ["o2", false],
  ]);
  expect(
    runner([
      ["i0", false],
      ["i1", false],
      ["i2", true],
      ["i3", false],
      ["i4", false],
      ["i5", false],
      ["i6", false],
      ["i7", false],
    ]),
  ).toEqual([
    ["o0", false],
    ["o1", true],
    ["o2", false],
  ]);
  expect(
    runner([
      ["i0", false],
      ["i1", false],
      ["i2", false],
      ["i3", true],
      ["i4", false],
      ["i5", false],
      ["i6", false],
      ["i7", false],
    ]),
  ).toEqual([
    ["o0", true],
    ["o1", true],
    ["o2", false],
  ]);
  expect(
    runner([
      ["i0", false],
      ["i1", false],
      ["i2", false],
      ["i3", false],
      ["i4", true],
      ["i5", false],
      ["i6", false],
      ["i7", false],
    ]),
  ).toEqual([
    ["o0", false],
    ["o1", false],
    ["o2", true],
  ]);
  expect(
    runner([
      ["i0", false],
      ["i1", false],
      ["i2", false],
      ["i3", false],
      ["i4", false],
      ["i5", true],
      ["i6", false],
      ["i7", false],
    ]),
  ).toEqual([
    ["o0", true],
    ["o1", false],
    ["o2", true],
  ]);
  expect(
    runner([
      ["i0", false],
      ["i1", false],
      ["i2", false],
      ["i3", false],
      ["i4", false],
      ["i5", false],
      ["i6", true],
      ["i7", false],
    ]),
  ).toEqual([
    ["o0", false],
    ["o1", true],
    ["o2", true],
  ]);
  expect(
    runner([
      ["i0", false],
      ["i1", false],
      ["i2", false],
      ["i3", false],
      ["i4", false],
      ["i5", false],
      ["i6", false],
      ["i7", true],
    ]),
  ).toEqual([
    ["o0", true],
    ["o1", true],
    ["o2", true],
  ]);
});

test("BYTEIN to BYTEOUT byte wire", () => {
  const vm = new Vm();
  vm.compile(`
    VAR a BYTEIN
    VAR out BYTEOUT
    WIRE a _ TO out _
  `);
  expect([...vm.run(new Map([["a", 0]])).entries()]).toEqual([["out", 0]]);
  expect([...vm.run(new Map([["a", 1]])).entries()]).toEqual([["out", 1]]);
  expect([...vm.run(new Map([["a", 42]])).entries()]).toEqual([["out", 42]]);
  expect([...vm.run(new Map([["a", 255]])).entries()]).toEqual([["out", 255]]);
  expect([...vm.run(new Map([["a", 128]])).entries()]).toEqual([["out", 128]]);
});

test("BYTESPLIT and BYTEMERGE", () => {
  const vm = new Vm();
  vm.compile(`
    VAR a BYTEIN
    VAR s BYTESPLIT
    WIRE a _ TO s _
    VAR m BYTEMERGE
    WIRE s o0 TO m i0
    WIRE s o1 TO m i1
    WIRE s o2 TO m i2
    WIRE s o3 TO m i3
    WIRE s o4 TO m i4
    WIRE s o5 TO m i5
    WIRE s o6 TO m i6
    WIRE s o7 TO m i7
    VAR out BYTEOUT
    WIRE m _ TO out _
  `);
  expect([...vm.run(new Map([["a", 0]])).entries()]).toEqual([["out", 0]]);
  expect([...vm.run(new Map([["a", 1]])).entries()]).toEqual([["out", 1]]);
  expect([...vm.run(new Map([["a", 42]])).entries()]).toEqual([["out", 42]]);
  expect([...vm.run(new Map([["a", 255]])).entries()]).toEqual([["out", 255]]);
  expect([...vm.run(new Map([["a", 128]])).entries()]).toEqual([["out", 128]]);
});

test("BYTEADD with byte wire", () => {
  const vm = new Vm();
  vm.compile(`
    ${BYTEADD}
    VAR a BYTEIN
    VAR b BYTEIN
    VAR out BYTEOUT
    VAR add BYTEADD
    WIRE a _ TO add a
    WIRE b _ TO add b
    WIRE add out TO out _
  `);
  expect([...vm.run(new Map([["a", 0], ["b", 0]])).entries()]).toEqual([["out", 0]]);
  expect([...vm.run(new Map([["a", 1], ["b", 1]])).entries()]).toEqual([["out", 2]]);
  expect([...vm.run(new Map([["a", 42], ["b", 58]])).entries()]).toEqual([["out", 100]]);
  expect([...vm.run(new Map([["a", 127], ["b", 128]])).entries()]).toEqual([["out", 255]]);
  // Overflow: 200 + 100 = 300 → 300 - 256 = 44
  expect([...vm.run(new Map([["a", 200], ["b", 100]])).entries()]).toEqual([["out", 44]]);
});

test("BIT to BYTE type mismatch error", () => {
  const vm = new Vm();
  expect(() => vm.compile(`
    VAR a BITIN
    VAR out BYTEOUT
    WIRE a _ TO out _
  `)).toThrow("Type mismatch: cannot wire BIT source to BYTE destination out");
});

test("BYTE to BIT type mismatch error", () => {
  const vm = new Vm();
  expect(() => vm.compile(`
    VAR a BYTEIN
    VAR out BITOUT
    WIRE a _ TO out _
  `)).toThrow("Type mismatch: cannot wire BYTE source to BIT destination out");
});

test("BIT to BYTE port name type mismatch error", () => {
  const vm = new Vm();
  expect(() => vm.compile(`
    VAR a BITIN
    VAR s BYTESPLIT
    WIRE a _ TO s byte
  `)).toThrow("Type mismatch: cannot wire BIT source to BYTE port");
});

test("BYTE to BIT port name type mismatch error", () => {
  const vm = new Vm();
  expect(() => vm.compile(`
    VAR m BYTEMERGE
    VAR out BITOUT
    WIRE m byte TO out _
  `)).toThrow("Type mismatch: cannot wire BYTE source to BIT destination out");
});

test("DLATCH", () => {
  const vm = new Vm();
  vm.compile(`
    ${DLATCH}
    VAR d BITIN
    VAR e BITIN
    VAR q BITOUT

    VAR dl DLATCH
    WIRE d _ TO dl d
    WIRE e _ TO dl e
    WIRE dl _ TO q _
  `);
  // Initial: hold → q=0
  expect([...vm.run(new Map([["d", false], ["e", false]])).entries()]).toEqual([["q", false]]);
  // Write 1
  expect([...vm.run(new Map([["d", true], ["e", true]])).entries()]).toEqual([["q", true]]);
  // Hold → q still 1
  expect([...vm.run(new Map([["d", false], ["e", false]])).entries()]).toEqual([["q", true]]);
  // Write 0
  expect([...vm.run(new Map([["d", false], ["e", true]])).entries()]).toEqual([["q", false]]);
  // Input changes but enable off → q still 0
  expect([...vm.run(new Map([["d", true], ["e", false]])).entries()]).toEqual([["q", false]]);
  // Write 1 again
  expect([...vm.run(new Map([["d", true], ["e", true]])).entries()]).toEqual([["q", true]]);
});

test("REG", () => {
  const vm = new Vm();
  vm.compile(`
    ${REG}
    VAR d BITIN
    VAR clk BITIN
    VAR q BITOUT

    VAR reg REG
    WIRE d _ TO reg d
    WIRE clk _ TO reg clk
    WIRE reg _ TO q _
  `);
  // Initial: clk=0, d=0 → master captures 0, slave holds initial 0 → q=0
  expect([...vm.run(new Map([["d", false], ["clk", false]])).entries()]).toEqual([["q", false]]);
  // clk=0, d=1 → master captures 1, slave holds → q=0
  expect([...vm.run(new Map([["d", true], ["clk", false]])).entries()]).toEqual([["q", false]]);
  // Rising edge: clk=1 → master holds 1, slave captures master(1) → q=1
  expect([...vm.run(new Map([["d", true], ["clk", true]])).entries()]).toEqual([["q", true]]);
  // clk=1, d changes to 0 → master still holds 1, slave transparent → q=1
  expect([...vm.run(new Map([["d", false], ["clk", true]])).entries()]).toEqual([["q", true]]);
  // clk=0 → master captures d=0, slave holds 1 → q=1
  expect([...vm.run(new Map([["d", false], ["clk", false]])).entries()]).toEqual([["q", true]]);
  // Rising edge: clk=1 → master holds 0, slave captures master(0) → q=0
  expect([...vm.run(new Map([["d", false], ["clk", true]])).entries()]).toEqual([["q", false]]);
  // Hold at 0: clk=0, d=1 → master captures 1, slave holds 0 → q=0
  expect([...vm.run(new Map([["d", true], ["clk", false]])).entries()]).toEqual([["q", false]]);
  // Rising edge: clk=1 → master holds 1, slave captures master(1) → q=1
  expect([...vm.run(new Map([["d", true], ["clk", true]])).entries()]).toEqual([["q", true]]);
  // clk=0, d=0 → master captures 0, slave holds 1 → q=1
  expect([...vm.run(new Map([["d", false], ["clk", false]])).entries()]).toEqual([["q", true]]);
  // Rising edge with d=0: clk=1 → master holds 0, slave captures → q=0
  expect([...vm.run(new Map([["d", false], ["clk", true]])).entries()]).toEqual([["q", false]]);
  // Hold: clk=0 → q=0
  expect([...vm.run(new Map([["d", false], ["clk", false]])).entries()]).toEqual([["q", false]]);
});

test("BYTEREG", () => {
  const vm = new Vm();
  vm.compile(`
    ${BYTEREG}
    VAR d BYTEIN
    VAR clk BITIN
    VAR q BYTEOUT

    VAR reg BYTEREG
    WIRE d _ TO reg d
    WIRE clk _ TO reg clk
    WIRE reg q TO q _
  `);
  // Initial: clk=0 → q=0
  expect([...vm.run(new Map<string, boolean | number>([["d", 0], ["clk", false]])).entries()]).toEqual([["q", 0]]);
  // clk=0, d=42 → master captures, slave holds → q=0
  expect([...vm.run(new Map<string, boolean | number>([["d", 42], ["clk", false]])).entries()]).toEqual([["q", 0]]);
  // Rising edge: clk=1 → q=42
  expect([...vm.run(new Map<string, boolean | number>([["d", 42], ["clk", true]])).entries()]).toEqual([["q", 42]]);
  // clk=1, d changes → q stays 42
  expect([...vm.run(new Map<string, boolean | number>([["d", 100], ["clk", true]])).entries()]).toEqual([["q", 42]]);
  // clk=0 → master captures d=100, slave holds → q=42
  expect([...vm.run(new Map<string, boolean | number>([["d", 100], ["clk", false]])).entries()]).toEqual([["q", 42]]);
  // Rising edge → q=100
  expect([...vm.run(new Map<string, boolean | number>([["d", 100], ["clk", true]])).entries()]).toEqual([["q", 100]]);
  // clk=0, d=255 → q=100
  expect([...vm.run(new Map<string, boolean | number>([["d", 255], ["clk", false]])).entries()]).toEqual([["q", 100]]);
  // Rising edge → q=255
  expect([...vm.run(new Map<string, boolean | number>([["d", 255], ["clk", true]])).entries()]).toEqual([["q", 255]]);
  // clk=0, d=0 → q=255
  expect([...vm.run(new Map<string, boolean | number>([["d", 0], ["clk", false]])).entries()]).toEqual([["q", 255]]);
  // Rising edge → q=0
  expect([...vm.run(new Map<string, boolean | number>([["d", 0], ["clk", true]])).entries()]).toEqual([["q", 0]]);
});

test("COUNTER", () => {
  const vm = new Vm();
  vm.compile(`
    VAR reset BITIN
    VAR load BYTEIN
    VAR inc BITIN
    VAR count BYTEOUT

    VAR ctr COUNTER
    WIRE reset _ TO ctr reset
    WIRE load _ TO ctr load
    WIRE inc _ TO ctr inc
    WIRE ctr count TO count _
  `);
  const run = (reset: boolean, load: number, inc: boolean) =>
    [...vm.run(new Map<string, boolean | number>([["reset", reset], ["load", load], ["inc", inc]])).entries()];

  // 初期状態: hold → 0
  expect(run(false, 0, false)).toEqual([["count", 0]]);
  // inc → 1
  expect(run(false, 0, true)).toEqual([["count", 1]]);
  // inc → 2
  expect(run(false, 0, true)).toEqual([["count", 2]]);
  // inc → 3
  expect(run(false, 0, true)).toEqual([["count", 3]]);
  // hold → 3
  expect(run(false, 0, false)).toEqual([["count", 3]]);
  expect(run(false, 0, false)).toEqual([["count", 3]]);
  // load 100
  expect(run(false, 100, false)).toEqual([["count", 100]]);
  // hold → 100
  expect(run(false, 0, false)).toEqual([["count", 100]]);
  // inc → 101
  expect(run(false, 0, true)).toEqual([["count", 101]]);
  // load takes priority over inc
  expect(run(false, 42, true)).toEqual([["count", 42]]);
  // reset takes priority over load
  expect(run(true, 200, false)).toEqual([["count", 0]]);
  // reset takes priority over inc
  expect(run(true, 0, true)).toEqual([["count", 0]]);
  // inc from 0 → 1
  expect(run(false, 0, true)).toEqual([["count", 1]]);
  // load 255
  expect(run(false, 255, false)).toEqual([["count", 255]]);
  // inc → overflow → 0
  expect(run(false, 0, true)).toEqual([["count", 0]]);
  // inc → 1
  expect(run(false, 0, true)).toEqual([["count", 1]]);
  // reset → 0
  expect(run(true, 0, false)).toEqual([["count", 0]]);
  // hold → 0
  expect(run(false, 0, false)).toEqual([["count", 0]]);
});

test("DECODER_3BIT", () => {
  const runner = getRunner(`
    ${DECODER_3BIT}
    VAR x BITIN
    VAR y BITIN
    VAR z BITIN
    VAR o0 BITOUT
    VAR o1 BITOUT
    VAR o2 BITOUT
    VAR o3 BITOUT
    VAR o4 BITOUT
    VAR o5 BITOUT
    VAR o6 BITOUT
    VAR o7 BITOUT    
    VAR dec DECODER_3BIT
    WIRE x _ TO dec i0
    WIRE y _ TO dec i1
    WIRE z _ TO dec i2
    WIRE dec o0 TO o0 _
    WIRE dec o1 TO o1 _
    WIRE dec o2 TO o2 _
    WIRE dec o3 TO o3 _
    WIRE dec o4 TO o4 _
    WIRE dec o5 TO o5 _
    WIRE dec o6 TO o6 _
    WIRE dec o7 TO o7 _
  `);
  expect(
    runner([
      ["x", false],
      ["y", false],
      ["z", false],
    ]),
  ).toEqual([
    ["o0", true],
    ["o1", false],
    ["o2", false],
    ["o3", false],
    ["o4", false],
    ["o5", false],
    ["o6", false],
    ["o7", false],
  ]);
  expect(
    runner([
      ["x", true],
      ["y", false],
      ["z", false],
    ]),
  ).toEqual([
    ["o0", false],
    ["o1", true],
    ["o2", false],
    ["o3", false],
    ["o4", false],
    ["o5", false],
    ["o6", false],
    ["o7", false],
  ]);
  expect(
    runner([
      ["x", false],
      ["y", true],
      ["z", false],
    ]),
  ).toEqual([
    ["o0", false],
    ["o1", false],
    ["o2", true],
    ["o3", false],
    ["o4", false],
    ["o5", false],
    ["o6", false],
    ["o7", false],
  ]);
  expect(
    runner([
      ["x", false],
      ["y", false],
      ["z", true],
    ]),
  ).toEqual([
    ["o0", false],
    ["o1", false],
    ["o2", false],
    ["o3", true],
    ["o4", false],
    ["o5", false],
    ["o6", false],
    ["o7", false],
  ]);
  expect(
    runner([
      ["x", true],
      ["y", true],
      ["z", false],
    ]),
  ).toEqual([
    ["o0", false],
    ["o1", false],
    ["o2", false],
    ["o3", false],
    ["o4", true],
    ["o5", false],
    ["o6", false],
    ["o7", false],
  ]);
  expect(
    runner([
      ["x", true],
      ["y", false],
      ["z", true],
    ]),
  ).toEqual([
    ["o0", false],
    ["o1", false],
    ["o2", false],
    ["o3", false],
    ["o4", false],
    ["o5", true],
    ["o6", false],
    ["o7", false],
  ]);
  expect(
    runner([
      ["x", false],
      ["y", true],
      ["z", true],
    ]),
  ).toEqual([
    ["o0", false],
    ["o1", false],
    ["o2", false],
    ["o3", false],
    ["o4", false],
    ["o5", false],
    ["o6", true],
    ["o7", false],
  ]);
  expect(
    runner([
      ["x", true],
      ["y", true],
      ["z", true],
    ]),
  ).toEqual([
    ["o0", false],
    ["o1", false],
    ["o2", false],
    ["o3", false],
    ["o4", false],
    ["o5", false],
    ["o6", false],
    ["o7", true],
  ]);
});
