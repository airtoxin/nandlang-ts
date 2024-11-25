import { expect, test } from "vitest";
import { AND, NOT, OR } from "./code-fragments";
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
