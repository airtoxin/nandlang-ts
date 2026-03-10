import { describe, expect, test } from "vitest";
import {
  commentStatement,
  moduleStatement,
  statements,
  variableStatement,
  wireStatement,
} from "./statement";

describe("commentStatement", () => {
  test("succeeds with comment line", () => {
    const input = `# this is comment\nfoo`;
    expect(commentStatement(input, 0)).toMatchInlineSnapshot(`
      {
        "data": null,
        "pos": 18,
        "success": true,
      }
    `);
  });

  test("fails with inline comment", () => {
    const input = `VAR in BITIN # this is comment\nfoo`;
    expect(commentStatement(input, 0)).toMatchInlineSnapshot(`
      {
        "pos": 0,
        "success": false,
      }
    `);
  });
});

describe("variableStatement", () => {
  test("succeeds with variable statement", () => {
    const input = "   VAR nand  NAND  \nfoo";
    expect(variableStatement(input, 0)).toMatchInlineSnapshot(`
      {
        "data": {
          "subtype": {
            "moduleName": "NAND",
            "type": "varStatement",
            "variableName": "nand",
          },
          "type": "statement",
        },
        "pos": 20,
        "success": true,
      }
    `);
  });

  test("fails", () => {
    const input = "   var nand  NAND  \nfoo";
    expect(variableStatement(input, 0)).toMatchInlineSnapshot(`
      {
        "pos": 3,
        "success": false,
      }
    `);
  });
});

describe("wireStatement", () => {
  test("succeeds with wire statement", () => {
    const input = "   WIRE nand  _ TO out _in\nfoo";
    expect(wireStatement(input, 0)).toMatchInlineSnapshot(`
      {
        "data": {
          "subtype": {
            "destPortName": "_in",
            "destVariableName": "out",
            "srcPortName": "_",
            "srcVariableName": "nand",
            "type": "wireStatement",
          },
          "type": "statement",
        },
        "pos": 27,
        "success": true,
      }
    `);
  });

  test("fails", () => {
    const input = "   wire nand  _ TO out _in\nfoo";
    expect(wireStatement(input, 0)).toMatchInlineSnapshot(`
      {
        "pos": 3,
        "success": false,
      }
    `);
  });
});

describe("statements", () => {
  test("succeeds with statements", () => {
    const input = `VAR nand  NAND

            WIRE nand  _ TO out _in
            rest`;
    expect(statements(input, 0)).toMatchInlineSnapshot(`
      {
        "data": [
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
              "destPortName": "_in",
              "destVariableName": "out",
              "srcPortName": "_",
              "srcVariableName": "nand",
              "type": "wireStatement",
            },
            "type": "statement",
          },
        ],
        "pos": 52,
        "success": true,
      }
    `);
  });
});

describe("moduleStatement", () => {
  test("succeeds with statement", () => {
    const moduleDef = `\
      MOD START NONE
        VAR in BITIN
        VAR out BITOUT
      MOD END
      rest
    `;
    expect(moduleStatement(moduleDef, 0)).toMatchInlineSnapshot(`
      {
        "data": {
          "subtype": {
            "definitionStatements": [
              {
                "subtype": {
                  "moduleName": "BITIN",
                  "type": "varStatement",
                  "variableName": "in",
                },
                "type": "statement",
              },
              {
                "subtype": {
                  "moduleName": "BITOUT",
                  "type": "varStatement",
                  "variableName": "out",
                },
                "type": "statement",
              },
            ],
            "name": "NONE",
            "type": "moduleStatement",
          },
          "type": "statement",
        },
        "pos": 79,
        "success": true,
      }
    `);
  });

  test("succeeds with module in module", () => {
    const moduleDef = `\
      MOD START NONE
        VAR in BITIN
        VAR out BITOUT
        MOD START INTERNAL
          VAR out BITOUT
        MOD END
      MOD END
      rest
    `;
    expect(moduleStatement(moduleDef, 0)).toMatchInlineSnapshot(`
      {
        "data": {
          "subtype": {
            "definitionStatements": [
              {
                "subtype": {
                  "moduleName": "BITIN",
                  "type": "varStatement",
                  "variableName": "in",
                },
                "type": "statement",
              },
              {
                "subtype": {
                  "moduleName": "BITOUT",
                  "type": "varStatement",
                  "variableName": "out",
                },
                "type": "statement",
              },
              {
                "subtype": {
                  "definitionStatements": [
                    {
                      "subtype": {
                        "moduleName": "BITOUT",
                        "type": "varStatement",
                        "variableName": "out",
                      },
                      "type": "statement",
                    },
                  ],
                  "name": "INTERNAL",
                  "type": "moduleStatement",
                },
                "type": "statement",
              },
            ],
            "name": "NONE",
            "type": "moduleStatement",
          },
          "type": "statement",
        },
        "pos": 147,
        "success": true,
      }
    `);
  });
});
