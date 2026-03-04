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
    expect(whitespaces()([..."  \t \t\t     s"])).toMatchInlineSnapshot(`
      {
        "data": null,
        "rest": [
          "s",
        ],
        "success": true,
      }
    `);
  });

  test("succeeds with empty", () => {
    expect(whitespaces()([...""])).toMatchInlineSnapshot(`
      {
        "data": null,
        "rest": [],
        "success": true,
      }
    `);
  });

  test("fails with empty with allowEmpty=false option", () => {
    expect(whitespaces(false)([...""])).toMatchInlineSnapshot(`
      {
        "rest": [],
        "success": false,
      }
    `);
  });
});

describe("digit", () => {
  test("succeeds when input start with digit", () => {
    expect(digit([..."3qn4"])).toMatchInlineSnapshot(`
      {
        "data": "3",
        "rest": [
          "q",
          "n",
          "4",
        ],
        "success": true,
      }
    `);
  });

  test("fails when input start with non-digit characters", () => {
    expect(digit([..."yuk1"])).toMatchInlineSnapshot(`
      {
        "rest": [
          "y",
          "u",
          "k",
          "1",
        ],
        "success": false,
      }
    `);
  });

  test("fails when input is empty", () => {
    expect(digit([])).toMatchInlineSnapshot(`
      {
        "rest": [],
        "success": false,
      }
    `);
  });
});

describe("lowerAlphabet", () => {
  test("succeeds when input start with lowerAlphabet", () => {
    expect(lowerAlphabet([..."start"])).toMatchInlineSnapshot(`
      {
        "data": "s",
        "rest": [
          "t",
          "a",
          "r",
          "t",
        ],
        "success": true,
      }
    `);
  });

  test("fails when input start with non-lowerAlphabet characters", () => {
    expect(lowerAlphabet([..."4yg"])).toMatchInlineSnapshot(`
      {
        "rest": [
          "4",
          "y",
          "g",
        ],
        "success": false,
      }
    `);
  });

  test("fails when input is empty", () => {
    expect(lowerAlphabet([])).toMatchInlineSnapshot(`
      {
        "rest": [],
        "success": false,
      }
    `);
  });
});

describe("upperAlphabet", () => {
  test("succeeds when input start with upperAlphabet", () => {
    expect(upperAlphabet([..."Start"])).toMatchInlineSnapshot(`
      {
        "data": "S",
        "rest": [
          "t",
          "a",
          "r",
          "t",
        ],
        "success": true,
      }
    `);
  });

  test("fails when input start with non-upperAlphabet characters", () => {
    expect(upperAlphabet([..."4yg"])).toMatchInlineSnapshot(`
      {
        "rest": [
          "4",
          "y",
          "g",
        ],
        "success": false,
      }
    `);
  });

  test("fails when input is empty", () => {
    expect(upperAlphabet([])).toMatchInlineSnapshot(`
      {
        "rest": [],
        "success": false,
      }
    `);
  });
});

describe("symbol", () => {
  test("succeeds with alphabet word", () => {
    expect(symbol([..."hE110 world"])).toMatchInlineSnapshot(`
      {
        "data": "hE110",
        "rest": [
          " ",
          "w",
          "o",
          "r",
          "l",
          "d",
        ],
        "success": true,
      }
    `);
  });

  test("succeeds with underscore word", () => {
    expect(symbol([..."__hE110 world"])).toMatchInlineSnapshot(`
      {
        "data": "__hE110",
        "rest": [
          " ",
          "w",
          "o",
          "r",
          "l",
          "d",
        ],
        "success": true,
      }
    `);
  });

  test("fails when input start with digit", () => {
    expect(symbol([..."9_hE110 world"])).toMatchInlineSnapshot(`
      {
        "rest": [
          "9",
          "_",
          "h",
          "E",
          "1",
          "1",
          "0",
          " ",
          "w",
          "o",
          "r",
          "l",
          "d",
        ],
        "success": false,
      }
    `);
  });
});

describe("linebreak", () => {
  test("succeeds with linebreak", () => {
    expect(linebreak([..."\na"])).toEqual({
      data: null,
      rest: ["a"],
      success: true,
    });
    expect(linebreak([..."\r\na"])).toEqual({
      data: null,
      rest: ["a"],
      success: true,
    });
  });

  test("fails with carriage return only linebreak", () => {
    expect(linebreak([..."\ra"])).toEqual({
      rest: ["\r", "a"],
      success: false,
    });
  });
});

describe("emptyLine", () => {
  test("succeeds with empty line", () => {
    expect(emptyLine([..."            \n"])).toMatchInlineSnapshot(`
      {
        "data": null,
        "rest": [],
        "success": true,
      }
    `);
  });
});

describe("lazy", () => {
  test("succeeds with lazy initialized parser", () => {
    const parser = lazy<string>();
    parser.init(char("@"));
    expect(parser([..."@abc"])).toMatchInlineSnapshot(`
      {
        "data": "@",
        "rest": [
          "a",
          "b",
          "c",
        ],
        "success": true,
      }
    `);
  });

  test("fails with not initialized", () => {
    const parser = lazy<string>();
    expect(() => parser([..."@abc"])).toThrowError();
  });
});
