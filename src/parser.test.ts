import { describe, expect, it } from "vitest";
import {
  parseComment,
  parseEof,
  parseProgram,
  parseStatement,
  parseVarStatement,
  parseWireStatement,
} from "./parser";
import { Token } from "./token";

describe("parseProgram", () => {
  it("should parse Program", () => {
    const tokens: Token[] = [
      { type: "keyword", value: "VAR", line: 0, position: 0 },
      { type: "symbol", value: "nand", line: 0, position: 4 },
      { type: "symbol", value: "NAND", line: 0, position: 9 },
      { type: "linebreak", line: 0, position: 10 },
      { type: "comment", line: 1, position: 0 },
      { type: "eof", line: 2, position: 0 },
    ];
    expect(parseProgram(tokens)).toMatchInlineSnapshot(`
      {
        "statements": [
          {
            "subtype": {
              "moduleName": "NAND",
              "type": "varStatement",
              "variableName": "nand",
            },
            "type": "statement",
          },
        ],
        "type": "program",
      }
    `);
  });
});

describe("parseVarStatement", () => {
  it("should parse VarStatement and consume tokens", () => {
    const tokens: Token[] = [
      { type: "keyword", value: "VAR", line: 0, position: 0 },
      { type: "symbol", value: "nand", line: 0, position: 4 },
      { type: "symbol", value: "NAND", line: 0, position: 9 },
      { type: "linebreak", line: 0, position: 10 },
      { type: "comment", line: 1, position: 0 },
    ];
    expect(parseVarStatement(tokens)).toEqual([
      [{ type: "comment", line: 1, position: 0 }],
      {
        subtype: {
          moduleName: "NAND",
          type: "varStatement",
          variableName: "nand",
        },
        type: "statement",
      },
    ]);
  });

  it("should fail parsing", () => {
    const tokens: Token[] = [
      { type: "comment", line: 0, position: 0 },
      { type: "keyword", value: "VAR", line: 1, position: 0 },
      { type: "symbol", value: "nand", line: 1, position: 4 },
      { type: "symbol", value: "NAND", line: 1, position: 9 },
      { type: "linebreak", line: 1, position: 10 },
    ];
    expect(parseVarStatement(tokens)).toEqual([tokens, null]);
  });
});

describe("parseWireStatement", () => {
  it("should parse WireStatement and consume tokens", () => {
    const tokens: Token[] = [
      { type: "keyword", value: "WIRE", line: 0, position: 0 },
      { type: "symbol", value: "nand0", line: 0, position: 10 },
      { type: "symbol", value: "_", line: 0, position: 20 },
      { type: "keyword", value: "TO", line: 0, position: 30 },
      { type: "symbol", value: "nand1", line: 0, position: 40 },
      { type: "symbol", value: "_", line: 0, position: 50 },
      { type: "linebreak", line: 0, position: 60 },
      { type: "comment", line: 1, position: 0 },
    ];
    expect(parseWireStatement(tokens)).toEqual([
      [{ type: "comment", line: 1, position: 0 }],
      {
        type: "statement",
        subtype: {
          type: "wireStatement",
          srcVariableName: "nand0",
          srcPortName: "_",
          destVariableName: "nand1",
          destPortName: "_",
        },
      },
    ]);
  });

  it("should fail parsing", () => {
    const tokens: Token[] = [
      { type: "comment", line: 0, position: 0 },
      { type: "keyword", value: "WIRE", line: 1, position: 0 },
      { type: "symbol", value: "nand0", line: 1, position: 10 },
      { type: "symbol", value: "_", line: 1, position: 20 },
      { type: "keyword", value: "TO", line: 1, position: 30 },
      { type: "symbol", value: "nand1", line: 1, position: 40 },
      { type: "symbol", value: "_", line: 1, position: 50 },
      { type: "linebreak", line: 1, position: 60 },
    ];
    expect(parseWireStatement(tokens)).toEqual([tokens, null]);
  });
});

describe("parseStatement", () => {
  it("should parse VarStatement and consume tokens", () => {
    const tokens: Token[] = [
      { type: "keyword", value: "VAR", line: 0, position: 0 },
      { type: "symbol", value: "nand", line: 0, position: 4 },
      { type: "symbol", value: "NAND", line: 0, position: 9 },
      { type: "linebreak", line: 0, position: 10 },
      { type: "comment", line: 1, position: 0 },
    ];
    expect(parseStatement(tokens)).toEqual([
      [{ type: "comment", line: 1, position: 0 }],
      {
        subtype: {
          moduleName: "NAND",
          type: "varStatement",
          variableName: "nand",
        },
        type: "statement",
      },
    ]);
  });

  it("should parse WireStatement and consume tokens", () => {
    const tokens: Token[] = [
      { type: "keyword", value: "WIRE", line: 0, position: 0 },
      { type: "symbol", value: "nand0", line: 0, position: 10 },
      { type: "symbol", value: "_", line: 0, position: 20 },
      { type: "keyword", value: "TO", line: 0, position: 30 },
      { type: "symbol", value: "nand1", line: 0, position: 40 },
      { type: "symbol", value: "_", line: 0, position: 50 },
      { type: "linebreak", line: 0, position: 60 },
      { type: "comment", line: 1, position: 0 },
    ];
    expect(parseStatement(tokens)).toEqual([
      [{ type: "comment", line: 1, position: 0 }],
      {
        type: "statement",
        subtype: {
          type: "wireStatement",
          srcVariableName: "nand0",
          srcPortName: "_",
          destVariableName: "nand1",
          destPortName: "_",
        },
      },
    ]);
  });
});

describe("parseComment", () => {
  it("consume comment token", () => {
    const tokens: Token[] = [
      { type: "comment", line: 0, position: 0 },
      { type: "keyword", value: "VAR", line: 0, position: 10 },
    ];
    expect(parseComment(tokens)).toEqual([
      [{ type: "keyword", value: "VAR", line: 0, position: 10 }],
      true,
    ]);
  });

  it("should fail parsing", () => {
    const tokens: Token[] = [
      { type: "keyword", value: "WIRE", line: 1, position: 0 },
    ];
    expect(parseComment(tokens)).toEqual([tokens, null]);
  });
});

describe("parseEof", () => {
  it("should detect eof token", () => {
    const tokens: Token[] = [{ type: "eof", line: 10, position: 0 }];
    expect(parseEof(tokens)).toEqual([[], true]);
  });

  it("should throw error when tokens has multiple tokens", () => {
    const tokens: Token[] = [
      { type: "eof", line: 10, position: 0 },
      { type: "eof", line: 11, position: 0 },
      { type: "eof", line: 12, position: 0 },
    ];
    expect(() => parseEof(tokens)).toThrowError(SyntaxError);
  });

  it("should throw error when empty tokens", () => {
    const tokens: Token[] = [];
    expect(() => parseEof(tokens)).toThrowError(SyntaxError);
  });
});
