import { expect, test } from "vitest";
import {
  AND,
  AND3,
  DECODER_3BIT,
  NOR,
  NOT,
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
