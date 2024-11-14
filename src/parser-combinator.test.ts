import { describe, expect, test } from "vitest";
import {
  anyChar,
  char,
  digit,
  eof,
  lowerAlphabet,
  mapResult,
  not,
  or,
  rep,
  seq,
  str,
  sub,
  symbol,
  upperAlphabet,
} from "./parser-combinator";

describe("anyChar", () => {
  test("succeeds with non-empty input", () => {
    expect(anyChar([..."abc"])).toMatchInlineSnapshot(`
      {
        "data": "a",
        "rest": [
          "b",
          "c",
        ],
        "success": true,
      }
    `);
  });

  test("succeeds with empty string input", () => {
    expect(anyChar([""])).toMatchInlineSnapshot(`
      {
        "data": "",
        "rest": [],
        "success": true,
      }
    `);
  });

  test("fails with empty input", () => {
    expect(anyChar([])).toMatchInlineSnapshot(`
      {
        "rest": [],
        "success": false,
      }
    `);
  });
});

describe("eof", () => {
  test("succeeds with empty input", () => {
    expect(eof([])).toMatchInlineSnapshot(`
      {
        "data": null,
        "rest": [],
        "success": true,
      }
    `);
  });

  test("fails with non-empty input", () => {
    expect(eof([..."abc"])).toMatchInlineSnapshot(`
      {
        "rest": [
          "a",
          "b",
          "c",
        ],
        "success": false,
      }
    `);
  });
});

describe("char", () => {
  test("succeeds when input matches target character", () => {
    const parser = char("a");
    expect(parser([..."abc"])).toMatchInlineSnapshot(`
      {
        "data": "a",
        "rest": [
          "b",
          "c",
        ],
        "success": true,
      }
    `);
  });

  test("fails when input does not match target character", () => {
    const parser = char("a");
    expect(parser([..."cba"])).toMatchInlineSnapshot(`
      {
        "rest": [
          "c",
          "b",
          "a",
        ],
        "success": false,
      }
    `);
  });

  test("fails with empty input", () => {
    const parser = char("a");
    expect(parser([])).toMatchInlineSnapshot(`
      {
        "rest": [],
        "success": false,
      }
    `);
  });
});

describe("or", () => {
  test("succeeds with first parser", () => {
    const parser = or(char("a"), char("b"));
    expect(parser([..."abc"])).toMatchInlineSnapshot(`
      {
        "data": "a",
        "rest": [
          "b",
          "c",
        ],
        "success": true,
      }
    `);
  });

  test("succeeds with second parser", () => {
    const parser = or(char("a"), char("b"));
    expect(parser([..."bca"])).toMatchInlineSnapshot(`
      {
        "data": "b",
        "rest": [
          "c",
          "a",
        ],
        "success": true,
      }
    `);
  });

  test("fails with empty input", () => {
    const parser = or(char("a"), char("b"));
    expect(parser([])).toMatchInlineSnapshot(`
      {
        "rest": [],
        "success": false,
      }
    `);
  });

  test("fails with no match", () => {
    const parser = or(char("a"), char("b"));
    expect(parser([..."cab"])).toMatchInlineSnapshot(`
      {
        "rest": [
          "c",
          "a",
          "b",
        ],
        "success": false,
      }
    `);
  });
});

describe("not", () => {
  test("succeeds when input does not match the target pattern", () => {
    const parser = not(char("a"));
    expect(parser([..."ba"])).toMatchInlineSnapshot(`
      {
        "data": null,
        "rest": [
          "b",
          "a",
        ],
        "success": true,
      }
    `);
  });

  test("fails when input matches the target pattern", () => {
    const parser = not(char("a"));
    expect(parser([..."abc"])).toMatchInlineSnapshot(`
      {
        "rest": [
          "a",
          "b",
          "c",
        ],
        "success": false,
      }
    `);
  });
});

describe("seq", () => {
  test("succeeds when input matches parser sequence", () => {
    const parser = seq(char("a"), char("b"), char("c"));
    expect(parser([..."abcde"])).toMatchInlineSnapshot(`
      {
        "data": [
          "a",
          "b",
          "c",
        ],
        "rest": [
          "d",
          "e",
        ],
        "success": true,
      }
    `);
  });

  test("fails when input is shorter than parser sequence", () => {
    const parser = seq(char("a"), char("b"), char("c"));
    expect(parser([..."ab"])).toMatchInlineSnapshot(`
      {
        "rest": [],
        "success": false,
      }
    `);
  });

  test("failed when input sequence has same kind of parser sequence but that is not same order", () => {
    const parser = seq(char("a"), char("b"), char("c"));
    expect(parser([..."cba"])).toMatchInlineSnapshot(`
      {
        "rest": [
          "c",
          "b",
          "a",
        ],
        "success": false,
      }
    `);
  });

  test("fails with empty input", () => {
    const parser = seq(char("a"), char("b"), char("c"));
    expect(parser([])).toMatchInlineSnapshot(`
      {
        "rest": [],
        "success": false,
      }
    `);
  });
});

describe("rep", () => {
  test("succeeds with repeated matches", () => {
    const parser = rep(char("a"));
    expect(parser([..."aaaaaaabcde"])).toMatchInlineSnapshot(`
      {
        "data": [
          "a",
          "a",
          "a",
          "a",
          "a",
          "a",
          "a",
        ],
        "rest": [
          "b",
          "c",
          "d",
          "e",
        ],
        "success": true,
      }
    `);
  });

  test("succeeds with min=0 for empty input", () => {
    const parser = rep(char("a"));
    expect(parser([])).toMatchInlineSnapshot(`
      {
        "data": [],
        "rest": [],
        "success": true,
      }
    `);
  });

  test("succeeds with min=3 matches", () => {
    const parser = rep(char("a"), 3);
    expect(parser([..."aaaa"])).toMatchInlineSnapshot(`
      {
        "data": [
          "a",
          "a",
          "a",
          "a",
        ],
        "rest": [],
        "success": true,
      }
    `);
    expect(parser([..."aaa"])).toMatchInlineSnapshot(`
      {
        "data": [
          "a",
          "a",
          "a",
        ],
        "rest": [],
        "success": true,
      }
    `);
    expect(parser([..."aa"])).toMatchInlineSnapshot(`
      {
        "rest": [
          "a",
          "a",
        ],
        "success": false,
      }
    `);
  });

  test("succeeds with min=0 and max=3 matches", () => {
    const parser = rep(char("a"), 0, 3);
    expect(parser([..."aaaa"])).toMatchInlineSnapshot(`
      {
        "data": [
          "a",
          "a",
          "a",
        ],
        "rest": [
          "a",
        ],
        "success": true,
      }
    `);
    expect(parser([..."aaa"])).toMatchInlineSnapshot(`
      {
        "data": [
          "a",
          "a",
          "a",
        ],
        "rest": [],
        "success": true,
      }
    `);
    expect(parser([..."aa"])).toMatchInlineSnapshot(`
      {
        "data": [
          "a",
          "a",
        ],
        "rest": [],
        "success": true,
      }
    `);
  });
});

describe("sub", () => {
  test("sub 0 from digit", () => {
    const parser = sub(digit, char("0"));
    expect(parser([..."123"])).toMatchInlineSnapshot(`
      {
        "data": "1",
        "rest": [
          "2",
          "3",
        ],
        "success": true,
      }
    `);
    expect(parser([..."0123"])).toMatchInlineSnapshot(`
      {
        "rest": [
          "0",
          "1",
          "2",
          "3",
        ],
        "success": false,
      }
    `);
  });
});

describe("str", () => {
  test("succeeds when input matches target string", () => {
    const parser = str("abc");
    expect(parser([..."abcde"])).toMatchInlineSnapshot(`
      {
        "data": "abc",
        "rest": [
          "d",
          "e",
        ],
        "success": true,
      }
    `);
  });

  test("fails with partial match", () => {
    const parser = str("abc");
    expect(parser([..."abac"])).toMatchInlineSnapshot(`
      {
        "rest": [
          "a",
          "c",
        ],
        "success": false,
      }
    `);
  });

  test("fails with empty input", () => {
    const parser = str("abc");
    expect(parser([])).toMatchInlineSnapshot(`
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

describe("mapResult", () => {
  test("apply fn when parse succeeded", () => {
    expect(mapResult(char("a"), (a) => a.repeat(10))([..."abcde"]))
      .toMatchInlineSnapshot(`
      {
        "data": "aaaaaaaaaa",
        "rest": [
          "b",
          "c",
          "d",
          "e",
        ],
        "success": true,
      }
    `);
  });
});

describe("symbol", () => {
  test("success with alphabet word", () => {
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

  test("success with underscore word", () => {
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
