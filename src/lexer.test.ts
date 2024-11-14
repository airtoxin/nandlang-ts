import { describe, expect, test } from "vitest";
import { Lexer } from "./lexer";
import dedent from "dedent";

describe("Lexer", () => {
  test("lex", () => {
    const program = dedent`\
      FROM    a _      TO x _
      
      # COMMENT LINE
      FROM b _ TO y         _
    `;
    expect(Array.from(new Lexer(program).lex())).toMatchInlineSnapshot(`
      [
        {
          "line": 0,
          "position": 0,
          "type": "keyword",
          "value": "FROM",
        },
        {
          "line": 0,
          "position": 8,
          "type": "symbol",
          "value": "a",
        },
        {
          "line": 0,
          "position": 10,
          "type": "symbol",
          "value": "_",
        },
        {
          "line": 0,
          "position": 17,
          "type": "keyword",
          "value": "TO",
        },
        {
          "line": 0,
          "position": 20,
          "type": "symbol",
          "value": "x",
        },
        {
          "line": 0,
          "position": 22,
          "type": "symbol",
          "value": "_",
        },
        {
          "line": 0,
          "position": 23,
          "type": "linebreak",
        },
        {
          "line": 1,
          "position": 0,
          "type": "linebreak",
        },
        {
          "line": 2,
          "position": 0,
          "type": "comment",
        },
        {
          "line": 2,
          "position": 15,
          "type": "keyword",
          "value": "FROM",
        },
        {
          "line": 2,
          "position": 20,
          "type": "symbol",
          "value": "b",
        },
        {
          "line": 2,
          "position": 22,
          "type": "symbol",
          "value": "_",
        },
        {
          "line": 2,
          "position": 24,
          "type": "keyword",
          "value": "TO",
        },
        {
          "line": 2,
          "position": 27,
          "type": "symbol",
          "value": "y",
        },
        {
          "line": 2,
          "position": 37,
          "type": "symbol",
          "value": "_",
        },
        {
          "line": 2,
          "position": 38,
          "type": "eof",
        },
      ]
    `);
  });
});
