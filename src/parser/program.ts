import { eof, mapResult, Parser, seq } from "../lib/parser-combinator";
import { statements } from "./statement";
import { whitespaces } from "./parser";
import { Program } from "./ast";

export const program: Parser<Program> = (inputs) =>
  mapResult(seq(statements, whitespaces(true), eof), ([s]) => {
    if (!Array.isArray(s)) throw new Error(`Unexpected input statements:${s}`);
    return {
      type: "program" as const,
      statements: s,
    };
  })(inputs.concat("\n")); // Ensure EOF with line break
