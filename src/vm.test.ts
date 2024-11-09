import { describe, expect, test } from "vitest";
import { Vm } from "./vm";
import { run } from "./module";

describe("vm", () => {
  test("test", () => {
    const vm = new Vm();
    const program = `\
      VAR in0 BITIN
      VAR in1 BITIN
      VAR out BITOUT
      
      VAR nand NAND
      
      FROM in0 o0 TO nand i0
      FROM in1 o0 TO nand i1
      FROM nand o0 TO out i0
    `;
    const global = vm.compile(program);

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
});
