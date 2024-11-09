import { describe, expect, test } from "vitest";
import { lex } from "./lexer";

describe("lex", () => {
  test("wiring", () => {
    const program = `\
      FROM a out TO x in
    `;
    expect(lex(program)).toMatchInlineSnapshot(`
      [
        {
          "destVariableName": "x",
          "destVariablePort": "in",
          "srcVariableName": "a",
          "srcVariablePort": "out",
          "type": "wire",
        },
      ]
    `);
  });

  test("var", () => {
    const program = `\
      VAR x NAND
    `;
    expect(lex(program)).toMatchInlineSnapshot(`
      [
        {
          "moduleName": "NAND",
          "name": "x",
          "type": "variable",
        },
      ]
    `);
  });

  test("module def", () => {
    const program = `\
      MOD START TRASH
        VAR in BITIN
      MOD END
    `;
    expect(lex(program)).toMatchInlineSnapshot(`
      [
        {
          "name": "TRASH",
          "type": "moduleStart",
        },
        {
          "moduleName": "BITIN",
          "name": "in",
          "type": "variable",
        },
        {
          "type": "moduleEnd",
        },
      ]
    `);
  });

  test("comment", () => {
    const program = `\
      # MOD START TRASH
      #  VAR in BITIN
      # MOD END
    `;
    expect(lex(program)).toMatchInlineSnapshot(`[]`);
  });
});
