import { describe, expect, test } from "vitest";
import { Vm } from "./vm";
import { run } from "./module";

describe("vm", () => {
  test("direct wiring", () => {
    const program = `\
      VAR in BITIN
      VAR out BITOUT
      FROM in o0 TO out i0
    `;
    const vm = new Vm(program);
    const globalModule = vm.compile();
    const global = globalModule.createVariable("_");

    expect(run(global, new Map([["in", false]]))).toMatchInlineSnapshot(`
      Map {
        "out" => false,
      }
    `);

    expect(run(global, new Map([["in", true]]))).toMatchInlineSnapshot(`
      Map {
        "out" => true,
      }
    `);
  });

  test("simple wiring", () => {
    const program = `\
      VAR in0 BITIN
      VAR in1 BITIN
      VAR out BITOUT
      
      VAR nand NAND
      
      FROM in0 o0 TO nand i0
      FROM in1 o0 TO nand i1
      FROM nand o0 TO out i0
    `;
    const vm = new Vm(program);
    const globalModule = vm.compile();
    const global = globalModule.createVariable("_");

    expect(
      run(
        global,
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
      run(
        global,
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

  test("NOT GATE", () => {
    const program = `\
      VAR in BITIN
      VAR out BITOUT
      
      MOD START NOT
        VAR in BITIN
        VAR out BITOUT
        VAR nand NAND
        
        FROM in o0 TO nand i0
        FROM in o0 TO nand i1
        FROM nand o0 TO out i0
      MOD END
      
      VAR not NOT
      
      FROM in o0 TO not in
      FROM not out TO out i0
    `;
    const vm = new Vm(program);
    const globalModule = vm.compile();
    const global = globalModule.createVariable("_");

    expect(run(global, new Map([["in", true]]))).toMatchInlineSnapshot(`
      Map {
        "out" => false,
      }
    `);

    expect(run(global, new Map([["in", false]]))).toMatchInlineSnapshot(`
      Map {
        "out" => true,
      }
    `);
  });
});
