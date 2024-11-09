import { describe, expect, test } from "vitest";
import { Vm } from "./vm";

describe("vm", () => {
  test("test", () => {
    const vm = new Vm();
    const program = `\
      VAR in0 BITIN
      VAR in1 BITIN
      VAR out BITOUT
      
      MOD START NOT
        VAR in BITIN
        VAR out BITOUT
        VAR nand NAND
        FROM in o0 TO nand i0
        FROM in o0 TO nand i1
        FROM nand o0 TO out i0 
      MOD END
      
      VAR nand NAND
      VAR not NOT
      
      FROM in0 o0 TO nand i0
      FROM in1 o0 TO nand i1
      FROM nand o0 TO not in
      FROM not out TO out i0
    `;
    vm.parse(program);

    expect(vm["modules"]).toMatchInlineSnapshot(`
      [
        {
          "modules": [
            {
              "modules": [],
              "name": "NAND",
              "vars": [
                {
                  "moduleName": "BITIN",
                  "name": "i0",
                },
                {
                  "moduleName": "BITIN",
                  "name": "i1",
                },
                {
                  "moduleName": "BITOUT",
                  "name": "o0",
                },
              ],
              "wires": [],
            },
            {
              "modules": [],
              "name": "BITIN",
              "vars": [
                {
                  "moduleName": "BITOUT",
                  "name": "o0",
                },
              ],
              "wires": [],
            },
            {
              "modules": [],
              "name": "BITOUT",
              "vars": [
                {
                  "moduleName": "BITIN",
                  "name": "i0",
                },
              ],
              "wires": [],
            },
            {
              "modules": [],
              "name": "NOT",
              "vars": [
                {
                  "moduleName": "BITIN",
                  "name": "in",
                },
                {
                  "moduleName": "BITOUT",
                  "name": "out",
                },
                {
                  "moduleName": "NAND",
                  "name": "nand",
                },
              ],
              "wires": [
                {
                  "destPortName": "i0",
                  "destVarName": "nand",
                  "srcPortName": "o0",
                  "srcVarName": "in",
                },
                {
                  "destPortName": "i1",
                  "destVarName": "nand",
                  "srcPortName": "o0",
                  "srcVarName": "in",
                },
                {
                  "destPortName": "i0",
                  "destVarName": "out",
                  "srcPortName": "o0",
                  "srcVarName": "nand",
                },
              ],
            },
          ],
          "name": "Global",
          "vars": [
            {
              "moduleName": "BITIN",
              "name": "in0",
            },
            {
              "moduleName": "BITIN",
              "name": "in1",
            },
            {
              "moduleName": "BITOUT",
              "name": "out",
            },
            {
              "moduleName": "NAND",
              "name": "nand",
            },
            {
              "moduleName": "NOT",
              "name": "not",
            },
          ],
          "wires": [
            {
              "destPortName": "i0",
              "destVarName": "nand",
              "srcPortName": "o0",
              "srcVarName": "in0",
            },
            {
              "destPortName": "i1",
              "destVarName": "nand",
              "srcPortName": "o0",
              "srcVarName": "in1",
            },
            {
              "destPortName": "in",
              "destVarName": "not",
              "srcPortName": "o0",
              "srcVarName": "nand",
            },
            {
              "destPortName": "i0",
              "destVarName": "out",
              "srcPortName": "out",
              "srcVarName": "not",
            },
          ],
        },
      ]
    `);
  });
});
