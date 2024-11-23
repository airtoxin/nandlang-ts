import { describe, expect, test } from "vitest";
import { Vm } from "./vm";

describe("Vm", () => {
  test("succeeds with direct in-out wiring", () => {
    const program = `
      VAR in BITIN
      VAR out BITOUT
      WIRE in _ TO out _
    `;
    const vm = new Vm();
    vm.compile(program);
    expect(vm.run(new Map([["in", true]]))).toMatchInlineSnapshot(`
      Map {
        "out" => true,
      }
    `);
  });

  test("succeeds with nand wiring", () => {
    const program = `
      VAR in0 BITIN
      VAR in1 BITIN
      VAR nand NAND
      VAR out BITOUT
      WIRE in0 _ TO nand i0
      WIRE in1 _ TO nand i1
      WIRE nand _ TO out _
    `;
    const vm = new Vm();
    vm.compile(program);
    expect(
      vm.run(
        new Map([
          ["in0", false],
          ["in1", false],
        ]),
      ),
    ).toMatchInlineSnapshot(`
      Map {
        "out" => true,
      }
    `);
    expect(
      vm.run(
        new Map([
          ["in0", false],
          ["in1", true],
        ]),
      ),
    ).toMatchInlineSnapshot(`
      Map {
        "out" => true,
      }
    `);
    expect(
      vm.run(
        new Map([
          ["in0", true],
          ["in1", false],
        ]),
      ),
    ).toMatchInlineSnapshot(`
      Map {
        "out" => true,
      }
    `);
    expect(
      vm.run(
        new Map([
          ["in0", true],
          ["in1", true],
        ]),
      ),
    ).toMatchInlineSnapshot(`
      Map {
        "out" => false,
      }
    `);
  });

  test("fails with multiple wiring", () => {
    const program = `
      VAR in0 BITIN
      VAR in1 BITIN
      VAR out BITOUT
      WIRE in0 _ TO out _
      WIRE in1 _ TO out _
    `;
    const vm = new Vm();
    expect(() => vm.compile(program)).toThrowError();
  });
});
