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
    expect(commentStatement([...`# this is comment\nfoo`]))
      .toMatchInlineSnapshot(`
      {
        "data": null,
        "rest": [
          "f",
          "o",
          "o",
        ],
        "success": true,
      }
    `);
  });

  test("fails with inline comment", () => {
    expect(commentStatement([...`VAR in BITIN # this is comment\nfoo`]))
      .toMatchInlineSnapshot(`
        {
          "rest": [
            "V",
            "A",
            "R",
            " ",
            "i",
            "n",
            " ",
            "B",
            "I",
            "T",
            "I",
            "N",
            " ",
            "#",
            " ",
            "t",
            "h",
            "i",
            "s",
            " ",
            "i",
            "s",
            " ",
            "c",
            "o",
            "m",
            "m",
            "e",
            "n",
            "t",
            "
        ",
            "f",
            "o",
            "o",
          ],
          "success": false,
        }
      `);
  });
});

describe("variableStatement", () => {
  test("succeeds with variable statement", () => {
    expect(variableStatement([..."   VAR nand  NAND  \nfoo"]))
      .toMatchInlineSnapshot(`
        {
          "data": {
            "subtype": {
              "moduleName": "NAND",
              "type": "varStatement",
              "variableName": "nand",
            },
            "type": "statement",
          },
          "rest": [
            "f",
            "o",
            "o",
          ],
          "success": true,
        }
      `);
  });

  test("fails", () => {
    expect(variableStatement([..."   var nand  NAND  \nfoo"]))
      .toMatchInlineSnapshot(`
        {
          "rest": [
            "v",
            "a",
            "r",
            " ",
            "n",
            "a",
            "n",
            "d",
            " ",
            " ",
            "N",
            "A",
            "N",
            "D",
            " ",
            " ",
            "
        ",
            "f",
            "o",
            "o",
          ],
          "success": false,
        }
      `);
  });
});

describe("wireStatement", () => {
  test("succeeds with wire statement", () => {
    expect(wireStatement([..."   WIRE nand  _ TO out _in\nfoo"]))
      .toMatchInlineSnapshot(`
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
          "rest": [
            "f",
            "o",
            "o",
          ],
          "success": true,
        }
      `);
  });

  test("fails", () => {
    expect(wireStatement([..."   wire nand  _ TO out _in\nfoo"]))
      .toMatchInlineSnapshot(`
        {
          "rest": [
            "w",
            "i",
            "r",
            "e",
            " ",
            "n",
            "a",
            "n",
            "d",
            " ",
            " ",
            "_",
            " ",
            "T",
            "O",
            " ",
            "o",
            "u",
            "t",
            " ",
            "_",
            "i",
            "n",
            "
        ",
            "f",
            "o",
            "o",
          ],
          "success": false,
        }
      `);
  });
});

describe("statements", () => {
  test("succeeds with statements", () => {
    expect(
      statements([
        ...`VAR nand  NAND   
         
            WIRE nand  _ TO out _in
            rest`,
      ]),
    ).toMatchInlineSnapshot(`
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
        "rest": [
          " ",
          " ",
          " ",
          " ",
          " ",
          " ",
          " ",
          " ",
          " ",
          " ",
          " ",
          " ",
          "r",
          "e",
          "s",
          "t",
        ],
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
    expect(moduleStatement([...moduleDef])).toMatchInlineSnapshot(`
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
        "rest": [
          " ",
          " ",
          " ",
          " ",
          " ",
          " ",
          "r",
          "e",
          "s",
          "t",
          "
      ",
          " ",
          " ",
          " ",
          " ",
        ],
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
    expect(moduleStatement([...moduleDef])).toMatchInlineSnapshot(`
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
        "rest": [
          " ",
          " ",
          " ",
          " ",
          " ",
          " ",
          "r",
          "e",
          "s",
          "t",
          "
      ",
          " ",
          " ",
          " ",
          " ",
        ],
        "success": true,
      }
    `);
  });
});
