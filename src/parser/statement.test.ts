import { describe, expect, test } from "vitest";
import { statements, variableStatement, wireStatement } from "./statement";

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
