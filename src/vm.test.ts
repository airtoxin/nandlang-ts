import { describe, expect, test } from "vitest";
import { Vm } from "./vm";
import { run } from "./module";

describe("vm", () => {
  test("direct wiring", () => {
    const program = `\
      VAR in BITIN
      VAR out BITOUT
      FROM in _ TO out _
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
      
      FROM in0 _ TO nand i0
      FROM in1 _ TO nand i1
      FROM nand _ TO out _
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
        
        FROM in _ TO nand i0
        FROM in _ TO nand i1
        FROM nand _ TO out _
      MOD END
      
      VAR not NOT
      
      FROM in _ TO not _
      FROM not _ TO out _
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

  test("AND GATE", () => {
    const program = `\      
      MOD START AND
        MOD START NOT
          VAR in BITIN
          VAR out BITOUT
          VAR nand NAND
          
          FROM in _ TO nand i0
          FROM in _ TO nand i1
          FROM nand _ TO out _
        MOD END
        
        VAR in0 BITIN
        VAR in1 BITIN
        VAR nand NAND
        VAR not NOT
        VAR out BITOUT
        
        FROM in0 _ TO nand i0
        FROM in1 _ TO nand i1
        FROM nand _ TO not _
        FROM not _ TO out _
      MOD END
      
      VAR in0 BITIN
      VAR in1 BITIN
      VAR and AND
      VAR out BITOUT
      
      FROM in0 _ TO and in0
      FROM in1 _ TO and in1
      FROM and _ TO out _
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
        "out" => false,
      }
    `);

    expect(
      run(
        global,
        new Map([
          ["in0", false],
          ["in1", true],
        ]),
      ),
    ).toMatchInlineSnapshot(`
      Map {
        "out" => false,
      }
    `);

    expect(
      run(
        global,
        new Map([
          ["in0", true],
          ["in1", false],
        ]),
      ),
    ).toMatchInlineSnapshot(`
      Map {
        "out" => false,
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
        "out" => true,
      }
    `);
  });
});
