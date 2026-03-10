import { expect, test } from "vitest";
import {
  ADD,
  AND,
  AND3,
  BYTEADD,
  DEC,
  DECODER_3BIT,
  ENC,
  NOR,
  NOT,
  ON,
  OR,
  OR3,
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

test("BYTEIN and BYTEOUT", () => {
  const vm = new Vm();
  vm.compile(`
    VAR a BYTEIN
    VAR out BYTEOUT
    WIRE a o0 TO out i0
    WIRE a o1 TO out i1
    WIRE a o2 TO out i2
    WIRE a o3 TO out i3
    WIRE a o4 TO out i4
    WIRE a o5 TO out i5
    WIRE a o6 TO out i6
    WIRE a o7 TO out i7
  `);
  expect([...vm.run(new Map([["a", 0]])).entries()]).toEqual([["out", 0]]);
  expect([...vm.run(new Map([["a", 1]])).entries()]).toEqual([["out", 1]]);
  expect([...vm.run(new Map([["a", 42]])).entries()]).toEqual([["out", 42]]);
  expect([...vm.run(new Map([["a", 255]])).entries()]).toEqual([["out", 255]]);
  expect([...vm.run(new Map([["a", 128]])).entries()]).toEqual([["out", 128]]);
});

test("BYTEADD", () => {
  const vm = new Vm();
  vm.compile(`
    ${BYTEADD}
    VAR a BYTEIN
    VAR b BYTEIN
    VAR out BYTEOUT
    VAR add BYTEADD
    WIRE a o0 TO add a0
    WIRE a o1 TO add a1
    WIRE a o2 TO add a2
    WIRE a o3 TO add a3
    WIRE a o4 TO add a4
    WIRE a o5 TO add a5
    WIRE a o6 TO add a6
    WIRE a o7 TO add a7
    WIRE b o0 TO add b0
    WIRE b o1 TO add b1
    WIRE b o2 TO add b2
    WIRE b o3 TO add b3
    WIRE b o4 TO add b4
    WIRE b o5 TO add b5
    WIRE b o6 TO add b6
    WIRE b o7 TO add b7
    WIRE add o0 TO out i0
    WIRE add o1 TO out i1
    WIRE add o2 TO out i2
    WIRE add o3 TO out i3
    WIRE add o4 TO out i4
    WIRE add o5 TO out i5
    WIRE add o6 TO out i6
    WIRE add o7 TO out i7
  `);
  expect([...vm.run(new Map([["a", 0], ["b", 0]])).entries()]).toEqual([["out", 0]]);
  expect([...vm.run(new Map([["a", 1], ["b", 1]])).entries()]).toEqual([["out", 2]]);
  expect([...vm.run(new Map([["a", 42], ["b", 58]])).entries()]).toEqual([["out", 100]]);
  expect([...vm.run(new Map([["a", 127], ["b", 128]])).entries()]).toEqual([["out", 255]]);
  // Overflow: 200 + 100 = 300 → 300 - 256 = 44
  expect([...vm.run(new Map([["a", 200], ["b", 100]])).entries()]).toEqual([["out", 44]]);
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
