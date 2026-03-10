import { eof, mapResult, seq } from "../lib/parser-combinator";
import { statements } from "./statement";
import { whitespaces } from "./parser";
import { Program } from "./ast";

export type ProgramParseResult =
  | { success: true; data: Program; rest: string }
  | { success: false; rest: string };

const programParser = mapResult(seq(statements, whitespaces(true), eof), ([s]) => {
  if (!Array.isArray(s)) throw new Error(`Unexpected input statements:${s}`);
  return {
    type: "program" as const,
    statements: s,
  };
});

export const program = (input: string | string[]): ProgramParseResult => {
  const inputStr = Array.isArray(input) ? input.join("") : input;
  const source = inputStr + "\n"; // Ensure EOF with line break
  const result = programParser(source, 0);
  if (result.success) {
    return { success: true, data: result.data, rest: source.slice(result.pos) };
  }
  return { success: false, rest: source.slice(result.pos) };
};
