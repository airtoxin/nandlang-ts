import { expect, test } from "vitest";
import { AND, NOR, NOT, OR, XNOR, XOR } from "./code-fragments";
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
