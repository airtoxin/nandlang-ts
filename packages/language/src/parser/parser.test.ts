import { describe, expect, test } from "vitest";
import {
  digit,
  emptyLine,
  lazy,
  linebreak,
  lowerAlphabet,
  symbol,
  upperAlphabet,
  whitespaces,
} from "./parser";
import { char } from "../lib/parser-combinator";

describe("whitespaces", () => {
  test("succeeds with spaces and tabs", () => {
    expect(whitespaces()("  \t \t\t     s", 0)).toMatchInlineSnapshot(`
      {
        "data": null,
        "pos": 11,
        "success": true,
      }
    `);
  });

  test("succeeds with empty", () => {
    expect(whitespaces()("", 0)).toMatchInlineSnapshot(`
      {
        "data": null,
        "pos": 0,
        "success": true,
      }
    `);
  });

  test("fails with empty with allowEmpty=false option", () => {
    expect(whitespaces(false)("", 0)).toMatchInlineSnapshot(`
      {
        "pos": 0,
        "success": false,
      }
    `);
  });
});

describe("digit", () => {
  test("succeeds when input start with digit", () => {
    expect(digit("3qn4", 0)).toMatchInlineSnapshot(`
      {
        "data": "3",
        "pos": 1,
        "success": true,
      }
    `);
  });

  test("fails when input start with non-digit characters", () => {
    expect(digit("yuk1", 0)).toMatchInlineSnapshot(`
      {
        "pos": 0,
        "success": false,
      }
    `);
  });

  test("fails when input is empty", () => {
    expect(digit("", 0)).toMatchInlineSnapshot(`
      {
        "pos": 0,
        "success": false,
      }
    `);
  });
});

describe("lowerAlphabet", () => {
  test("succeeds when input start with lowerAlphabet", () => {
    expect(lowerAlphabet("start", 0)).toMatchInlineSnapshot(`
      {
        "data": "s",
        "pos": 1,
        "success": true,
      }
    `);
  });

  test("fails when input start with non-lowerAlphabet characters", () => {
    expect(lowerAlphabet("4yg", 0)).toMatchInlineSnapshot(`
      {
        "pos": 0,
        "success": false,
      }
    `);
  });

  test("fails when input is empty", () => {
    expect(lowerAlphabet("", 0)).toMatchInlineSnapshot(`
      {
        "pos": 0,
        "success": false,
      }
    `);
  });
});

describe("upperAlphabet", () => {
  test("succeeds when input start with upperAlphabet", () => {
    expect(upperAlphabet("Start", 0)).toMatchInlineSnapshot(`
      {
        "data": "S",
        "pos": 1,
        "success": true,
      }
    `);
  });

  test("fails when input start with non-upperAlphabet characters", () => {
    expect(upperAlphabet("4yg", 0)).toMatchInlineSnapshot(`
      {
        "pos": 0,
        "success": false,
      }
    `);
  });

  test("fails when input is empty", () => {
    expect(upperAlphabet("", 0)).toMatchInlineSnapshot(`
      {
        "pos": 0,
        "success": false,
      }
    `);
  });
});

describe("symbol", () => {
  test("succeeds with alphabet word", () => {
    expect(symbol("hE110 world", 0)).toMatchInlineSnapshot(`
      {
        "data": "hE110",
        "pos": 5,
        "success": true,
      }
    `);
  });

  test("succeeds with underscore word", () => {
    expect(symbol("__hE110 world", 0)).toMatchInlineSnapshot(`
      {
        "data": "__hE110",
        "pos": 7,
        "success": true,
      }
    `);
  });

  test("fails when input start with digit", () => {
    expect(symbol("9_hE110 world", 0)).toMatchInlineSnapshot(`
      {
        "pos": 0,
        "success": false,
      }
    `);
  });
});

describe("linebreak", () => {
  test("succeeds with linebreak", () => {
    expect(linebreak("\na", 0)).toEqual({
      data: null,
      pos: 1,
      success: true,
    });
    expect(linebreak("\r\na", 0)).toEqual({
      data: null,
      pos: 2,
      success: true,
    });
  });

  test("fails with carriage return only linebreak", () => {
    expect(linebreak("\ra", 0)).toEqual({
      pos: 0,
      success: false,
    });
  });
});

describe("emptyLine", () => {
  test("succeeds with empty line", () => {
    expect(emptyLine("            \n", 0)).toMatchInlineSnapshot(`
      {
        "data": null,
        "pos": 13,
        "success": true,
      }
    `);
  });
});

describe("lazy", () => {
  test("succeeds with lazy initialized parser", () => {
    const parser = lazy<string>();
    parser.init(char("@"));
    expect(parser("@abc", 0)).toMatchInlineSnapshot(`
      {
        "data": "@",
        "pos": 1,
        "success": true,
      }
    `);
  });

  test("fails with not initialized", () => {
    const parser = lazy<string>();
    expect(() => parser("@abc", 0)).toThrowError();
  });
});
