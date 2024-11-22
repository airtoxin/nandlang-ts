import { describe, expect, test } from "vitest";
import { program } from "./program";
import dedent from "dedent";

describe("program", () => {
  test("succeeds with program", () => {
    const p = dedent`
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

    expect(program([...p])).toMatchInlineSnapshot(`
      {
        "data": {
          "statements": [
            {
              "subtype": {
                "definitionStatements": [
                  {
                    "subtype": {
                      "moduleName": "BITIN",
                      "type": "varStatement",
                      "variableName": "i0",
                    },
                    "type": "statement",
                  },
                  {
                    "subtype": {
                      "moduleName": "BITIN",
                      "type": "varStatement",
                      "variableName": "i1",
                    },
                    "type": "statement",
                  },
                  {
                    "subtype": {
                      "moduleName": "NAND",
                      "type": "varStatement",
                      "variableName": "nand",
                    },
                    "type": "statement",
                  },
                  {
                    "subtype": {
                      "destPortName": "i0",
                      "destVariableName": "nand",
                      "srcPortName": "_",
                      "srcVariableName": "i0",
                      "type": "wireStatement",
                    },
                    "type": "statement",
                  },
                  {
                    "subtype": {
                      "destPortName": "i1",
                      "destVariableName": "nand",
                      "srcPortName": "_",
                      "srcVariableName": "i1",
                      "type": "wireStatement",
                    },
                    "type": "statement",
                  },
                  {
                    "subtype": {
                      "moduleName": "NAND",
                      "type": "varStatement",
                      "variableName": "not",
                    },
                    "type": "statement",
                  },
                  {
                    "subtype": {
                      "destPortName": "i0",
                      "destVariableName": "not",
                      "srcPortName": "_",
                      "srcVariableName": "nand",
                      "type": "wireStatement",
                    },
                    "type": "statement",
                  },
                  {
                    "subtype": {
                      "destPortName": "i1",
                      "destVariableName": "not",
                      "srcPortName": "_",
                      "srcVariableName": "nand",
                      "type": "wireStatement",
                    },
                    "type": "statement",
                  },
                  {
                    "subtype": {
                      "moduleName": "BITOUT",
                      "type": "varStatement",
                      "variableName": "o0",
                    },
                    "type": "statement",
                  },
                  {
                    "subtype": {
                      "destPortName": "_",
                      "destVariableName": "o0",
                      "srcPortName": "_",
                      "srcVariableName": "not",
                      "type": "wireStatement",
                    },
                    "type": "statement",
                  },
                ],
                "name": "AND",
                "type": "moduleStatement",
              },
              "type": "statement",
            },
            {
              "subtype": {
                "definitionStatements": [
                  {
                    "subtype": {
                      "moduleName": "BITIN",
                      "type": "varStatement",
                      "variableName": "i0",
                    },
                    "type": "statement",
                  },
                  {
                    "subtype": {
                      "moduleName": "BITIN",
                      "type": "varStatement",
                      "variableName": "i1",
                    },
                    "type": "statement",
                  },
                  {
                    "subtype": {
                      "moduleName": "NAND",
                      "type": "varStatement",
                      "variableName": "nand0",
                    },
                    "type": "statement",
                  },
                  {
                    "subtype": {
                      "destPortName": "i0",
                      "destVariableName": "nand0",
                      "srcPortName": "_",
                      "srcVariableName": "i0",
                      "type": "wireStatement",
                    },
                    "type": "statement",
                  },
                  {
                    "subtype": {
                      "destPortName": "i1",
                      "destVariableName": "nand0",
                      "srcPortName": "_",
                      "srcVariableName": "i1",
                      "type": "wireStatement",
                    },
                    "type": "statement",
                  },
                  {
                    "subtype": {
                      "moduleName": "NAND",
                      "type": "varStatement",
                      "variableName": "nand1",
                    },
                    "type": "statement",
                  },
                  {
                    "subtype": {
                      "destPortName": "i0",
                      "destVariableName": "nand1",
                      "srcPortName": "_",
                      "srcVariableName": "i0",
                      "type": "wireStatement",
                    },
                    "type": "statement",
                  },
                  {
                    "subtype": {
                      "destPortName": "i1",
                      "destVariableName": "nand1",
                      "srcPortName": "_",
                      "srcVariableName": "nand0",
                      "type": "wireStatement",
                    },
                    "type": "statement",
                  },
                  {
                    "subtype": {
                      "moduleName": "NAND",
                      "type": "varStatement",
                      "variableName": "nand2",
                    },
                    "type": "statement",
                  },
                  {
                    "subtype": {
                      "destPortName": "i0",
                      "destVariableName": "nand2",
                      "srcPortName": "_",
                      "srcVariableName": "nand0",
                      "type": "wireStatement",
                    },
                    "type": "statement",
                  },
                  {
                    "subtype": {
                      "destPortName": "i1",
                      "destVariableName": "nand2",
                      "srcPortName": "_",
                      "srcVariableName": "i1",
                      "type": "wireStatement",
                    },
                    "type": "statement",
                  },
                  {
                    "subtype": {
                      "moduleName": "NAND",
                      "type": "varStatement",
                      "variableName": "nand3",
                    },
                    "type": "statement",
                  },
                  {
                    "subtype": {
                      "destPortName": "i0",
                      "destVariableName": "nand3",
                      "srcPortName": "_",
                      "srcVariableName": "nand1",
                      "type": "wireStatement",
                    },
                    "type": "statement",
                  },
                  {
                    "subtype": {
                      "destPortName": "i1",
                      "destVariableName": "nand3",
                      "srcPortName": "_",
                      "srcVariableName": "nand2",
                      "type": "wireStatement",
                    },
                    "type": "statement",
                  },
                  {
                    "subtype": {
                      "moduleName": "BITOUT",
                      "type": "varStatement",
                      "variableName": "o0",
                    },
                    "type": "statement",
                  },
                  {
                    "subtype": {
                      "destPortName": "_",
                      "destVariableName": "o0",
                      "srcPortName": "_",
                      "srcVariableName": "nand3",
                      "type": "wireStatement",
                    },
                    "type": "statement",
                  },
                ],
                "name": "XOR",
                "type": "moduleStatement",
              },
              "type": "statement",
            },
            {
              "subtype": {
                "moduleName": "BITIN",
                "type": "varStatement",
                "variableName": "a",
              },
              "type": "statement",
            },
            {
              "subtype": {
                "moduleName": "BITIN",
                "type": "varStatement",
                "variableName": "b",
              },
              "type": "statement",
            },
            {
              "subtype": {
                "moduleName": "XOR",
                "type": "varStatement",
                "variableName": "xor",
              },
              "type": "statement",
            },
            {
              "subtype": {
                "moduleName": "AND",
                "type": "varStatement",
                "variableName": "and",
              },
              "type": "statement",
            },
            {
              "subtype": {
                "moduleName": "BITOUT",
                "type": "varStatement",
                "variableName": "sum",
              },
              "type": "statement",
            },
            {
              "subtype": {
                "destPortName": "i0",
                "destVariableName": "xor",
                "srcPortName": "_",
                "srcVariableName": "a",
                "type": "wireStatement",
              },
              "type": "statement",
            },
            {
              "subtype": {
                "destPortName": "i1",
                "destVariableName": "xor",
                "srcPortName": "_",
                "srcVariableName": "b",
                "type": "wireStatement",
              },
              "type": "statement",
            },
            {
              "subtype": {
                "destPortName": "_",
                "destVariableName": "sum",
                "srcPortName": "_",
                "srcVariableName": "xor",
                "type": "wireStatement",
              },
              "type": "statement",
            },
            {
              "subtype": {
                "moduleName": "BITOUT",
                "type": "varStatement",
                "variableName": "car",
              },
              "type": "statement",
            },
            {
              "subtype": {
                "destPortName": "i0",
                "destVariableName": "and",
                "srcPortName": "_",
                "srcVariableName": "a",
                "type": "wireStatement",
              },
              "type": "statement",
            },
            {
              "subtype": {
                "destPortName": "i1",
                "destVariableName": "and",
                "srcPortName": "_",
                "srcVariableName": "b",
                "type": "wireStatement",
              },
              "type": "statement",
            },
            {
              "subtype": {
                "destPortName": "_",
                "destVariableName": "car",
                "srcPortName": "_",
                "srcVariableName": "and",
                "type": "wireStatement",
              },
              "type": "statement",
            },
          ],
          "type": "program",
        },
        "rest": [],
        "success": true,
      }
    `);
  });

  test("succeeds with empty program", () => {
    const p = `
    
    `;
    expect(program([...p])).toMatchInlineSnapshot(`
      {
        "data": {
          "statements": [],
          "type": "program",
        },
        "rest": [],
        "success": true,
      }
    `);
  });
});
