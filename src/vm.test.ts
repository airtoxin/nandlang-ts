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

  test("succeeds with half addr", () => {
    const program = `
      MOD START AND
          VAR i0 BITIN
          VAR i1 BITIN
          VAR nand NAND
          WIRE i0 _ TO nand i0
          WIRE i1 _ TO nand i1
          VAR not NAND
          WIRE nand _ TO not i0
          WIRE nand _ TO not i1
          VAR o0 BITOUT
          WIRE not _ TO o0 _
      MOD END
      
      MOD START XOR
          VAR i0 BITIN
          VAR i1 BITIN
          
          VAR nand0 NAND
          WIRE i0 _ TO nand0 i0
          WIRE i1 _ TO nand0 i1
          
          VAR nand1 NAND
          WIRE i0 _ TO nand1 i0
          WIRE nand0 _ TO nand1 i1
          
          VAR nand2 NAND
          WIRE nand0 _ TO nand2 i0
          WIRE i1 _ TO nand2 i1
          
          VAR nand3 NAND
          WIRE nand1 _ TO nand3 i0
          WIRE nand2 _ TO nand3 i1
          
          VAR o0 BITOUT
          WIRE nand3 _ TO o0 _
      MOD END
      
      # HALF ADDER
      VAR a BITIN
      VAR b BITIN
      VAR xor XOR
      VAR and AND
      
      # SUM
      VAR sum BITOUT
      WIRE a _ TO xor i0
      WIRE b _ TO xor i1
      WIRE xor _ TO sum _
      
      # CARRY
      VAR car BITOUT
      WIRE a _ TO and i0
      WIRE b _ TO and i1
      WIRE and _ TO car _
    `;
    const vm = new Vm();
    vm.compile(program);
    expect(
      vm.run(
        new Map([
          ["a", true],
          ["b", true],
        ]),
      ),
    ).toMatchInlineSnapshot(`
      Map {
        "sum" => false,
        "car" => true,
      }
    `);
  });
});
