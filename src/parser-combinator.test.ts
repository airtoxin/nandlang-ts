import { describe, expect, test } from "vitest";
import { anyChar, char, eof, or, rep, seq, str } from "./parser-combinator";

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
