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
          "dest_variable_name": "x",
          "dest_variable_port": "in",
          "src_variable_name": "a",
          "src_variable_port": "out",
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
          "module_name": "NAND",
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
          "module_name": "BITIN",
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
