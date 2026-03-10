import { describe, expect, test } from "vitest";
import {
  anyChar,
  char,
  eof,
  mapResult,
  not,
  or,
  rep,
  seq,
  str,
  sub,
} from "./parser-combinator";
import { digit } from "../parser/parser";

describe("anyChar", () => {
  test("succeeds with non-empty input", () => {
    expect(anyChar("abc", 0)).toMatchInlineSnapshot(`
      {
        "data": "a",
        "pos": 1,
        "success": true,
      }
    `);
  });

  test("succeeds with empty string input", () => {
    expect(anyChar("x", 0)).toMatchInlineSnapshot(`
      {
        "data": "x",
        "pos": 1,
        "success": true,
      }
    `);
  });

  test("fails with empty input", () => {
    expect(anyChar("", 0)).toMatchInlineSnapshot(`
      {
        "pos": 0,
        "success": false,
      }
    `);
  });
});

describe("eof", () => {
  test("succeeds with empty input", () => {
    expect(eof("", 0)).toMatchInlineSnapshot(`
      {
        "data": null,
        "pos": 0,
        "success": true,
      }
    `);
  });

  test("fails with non-empty input", () => {
    expect(eof("abc", 0)).toMatchInlineSnapshot(`
      {
        "pos": 0,
        "success": false,
      }
    `);
  });
});

describe("char", () => {
  test("succeeds when input matches target character", () => {
    const parser = char("a");
    expect(parser("abc", 0)).toMatchInlineSnapshot(`
      {
        "data": "a",
        "pos": 1,
        "success": true,
      }
    `);
  });

  test("fails when input does not match target character", () => {
    const parser = char("a");
    expect(parser("cba", 0)).toMatchInlineSnapshot(`
      {
        "pos": 0,
        "success": false,
      }
    `);
  });

  test("fails with empty input", () => {
    const parser = char("a");
    expect(parser("", 0)).toMatchInlineSnapshot(`
      {
        "pos": 0,
        "success": false,
      }
    `);
  });
});

describe("or", () => {
  test("succeeds with first parser", () => {
    const parser = or(char("a"), char("b"));
    expect(parser("abc", 0)).toMatchInlineSnapshot(`
      {
        "data": "a",
        "pos": 1,
        "success": true,
      }
    `);
  });

  test("succeeds with second parser", () => {
    const parser = or(char("a"), char("b"));
    expect(parser("bca", 0)).toMatchInlineSnapshot(`
      {
        "data": "b",
        "pos": 1,
        "success": true,
      }
    `);
  });

  test("fails with empty input", () => {
    const parser = or(char("a"), char("b"));
    expect(parser("", 0)).toMatchInlineSnapshot(`
      {
        "pos": 0,
        "success": false,
      }
    `);
  });

  test("fails with no match", () => {
    const parser = or(char("a"), char("b"));
    expect(parser("cab", 0)).toMatchInlineSnapshot(`
      {
        "pos": 0,
        "success": false,
      }
    `);
  });
});

describe("not", () => {
  test("succeeds when input does not match the target pattern", () => {
    const parser = not(char("a"));
    expect(parser("ba", 0)).toMatchInlineSnapshot(`
      {
        "data": null,
        "pos": 0,
        "success": true,
      }
    `);
  });

  test("fails when input matches the target pattern", () => {
    const parser = not(char("a"));
    expect(parser("abc", 0)).toMatchInlineSnapshot(`
      {
        "pos": 0,
        "success": false,
      }
    `);
  });
});

describe("seq", () => {
  test("succeeds when input matches parser sequence", () => {
    const parser = seq(char("a"), char("b"), char("c"));
    expect(parser("abcde", 0)).toMatchInlineSnapshot(`
      {
        "data": [
          "a",
          "b",
          "c",
        ],
        "pos": 3,
        "success": true,
      }
    `);
  });

  test("fails when input is shorter than parser sequence", () => {
    const parser = seq(char("a"), char("b"), char("c"));
    expect(parser("ab", 0)).toMatchInlineSnapshot(`
      {
        "pos": 2,
        "success": false,
      }
    `);
  });

  test("failed when input sequence has same kind of parser sequence but that is not same order", () => {
    const parser = seq(char("a"), char("b"), char("c"));
    expect(parser("cba", 0)).toMatchInlineSnapshot(`
      {
        "pos": 0,
        "success": false,
      }
    `);
  });

  test("fails with empty input", () => {
    const parser = seq(char("a"), char("b"), char("c"));
    expect(parser("", 0)).toMatchInlineSnapshot(`
      {
        "pos": 0,
        "success": false,
      }
    `);
  });
});

describe("rep", () => {
  test("succeeds with repeated matches", () => {
    const parser = rep(char("a"));
    expect(parser("aaaaaaabcde", 0)).toMatchInlineSnapshot(`
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
        "pos": 7,
        "success": true,
      }
    `);
  });

  test("succeeds with min=0 for empty input", () => {
    const parser = rep(char("a"));
    expect(parser("", 0)).toMatchInlineSnapshot(`
      {
        "data": [],
        "pos": 0,
        "success": true,
      }
    `);
  });

  test("succeeds with min=3 matches", () => {
    const parser = rep(char("a"), 3);
    expect(parser("aaaa", 0)).toMatchInlineSnapshot(`
      {
        "data": [
          "a",
          "a",
          "a",
          "a",
        ],
        "pos": 4,
        "success": true,
      }
    `);
    expect(parser("aaa", 0)).toMatchInlineSnapshot(`
      {
        "data": [
          "a",
          "a",
          "a",
        ],
        "pos": 3,
        "success": true,
      }
    `);
    expect(parser("aa", 0)).toMatchInlineSnapshot(`
      {
        "pos": 0,
        "success": false,
      }
    `);
  });

  test("succeeds with min=0 and max=3 matches", () => {
    const parser = rep(char("a"), 0, 3);
    expect(parser("aaaa", 0)).toMatchInlineSnapshot(`
      {
        "data": [
          "a",
          "a",
          "a",
        ],
        "pos": 3,
        "success": true,
      }
    `);
    expect(parser("aaa", 0)).toMatchInlineSnapshot(`
      {
        "data": [
          "a",
          "a",
          "a",
        ],
        "pos": 3,
        "success": true,
      }
    `);
    expect(parser("aa", 0)).toMatchInlineSnapshot(`
      {
        "data": [
          "a",
          "a",
        ],
        "pos": 2,
        "success": true,
      }
    `);
  });
});

describe("sub", () => {
  test("sub 0 from digit", () => {
    const parser = sub(digit, char("0"));
    expect(parser("123", 0)).toMatchInlineSnapshot(`
      {
        "data": "1",
        "pos": 1,
        "success": true,
      }
    `);
    expect(parser("0123", 0)).toMatchInlineSnapshot(`
      {
        "pos": 0,
        "success": false,
      }
    `);
  });
});

describe("str", () => {
  test("succeeds when input matches target string", () => {
    const parser = str("abc");
    expect(parser("abcde", 0)).toMatchInlineSnapshot(`
      {
        "data": "abc",
        "pos": 3,
        "success": true,
      }
    `);
  });

  test("fails with partial match", () => {
    const parser = str("abc");
    expect(parser("abac", 0)).toMatchInlineSnapshot(`
      {
        "pos": 0,
        "success": false,
      }
    `);
  });

  test("fails with empty input", () => {
    const parser = str("abc");
    expect(parser("", 0)).toMatchInlineSnapshot(`
      {
        "pos": 0,
        "success": false,
      }
    `);
  });
});

describe("mapResult", () => {
  test("apply fn when parse succeeded", () => {
    expect(mapResult(char("a"), (a) => a.repeat(10))("abcde", 0))
      .toMatchInlineSnapshot(`
      {
        "data": "aaaaaaaaaa",
        "pos": 1,
        "success": true,
      }
    `);
  });
});
