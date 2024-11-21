import { describe, expect, test } from "vitest";
import { moduleStatement } from "./module";

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
});
