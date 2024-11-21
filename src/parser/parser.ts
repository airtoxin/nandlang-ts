import {
  char,
  eof,
  mapResult,
  or,
  Parser,
  rep,
  seq,
  str,
  sub,
} from "../lib/parser-combinator";
import { Statement } from "./ast";
import { moduleStatement } from "./module";
import { variableStatement, wireStatement } from "./statement";

export const whitespaces = (allowEmpty = true): Parser<null> =>
  mapResult(rep(or(char(" "), char("\t")), allowEmpty ? 0 : 1), () => null);

export const digit: Parser<string> = or(
  ..."0123456789".split("").map((d) => char(d)),
);

export const lowerAlphabet: Parser<string> = or(
  ..."abcdefghijklmnopqrstuvwxyz".split("").map((w) => char(w)),
);

export const upperAlphabet: Parser<string> = or(
  ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((w) => char(w)),
);

export const mapResultArrayToString = (
  parser: Parser<string[]>,
): Parser<string> => mapResult(parser, (strs) => strs.join(""));

export const mapResultToNonNullableArray = <T>(
  parser: Parser<(T | null)[]>,
): Parser<T[]> =>
  mapResult(parser, (values) => values.filter((v) => v != null));

export const symbol: Parser<string> = sub(
  mapResultArrayToString(
    rep(or(digit, lowerAlphabet, upperAlphabet, char("_")), 1),
  ),
  digit,
);

export const linebreak: Parser<null> = mapResult(
  or(str("\r\n"), char("\n")),
  () => null,
);

export const emptyLine: Parser<null> = mapResult(
  seq(whitespaces(), linebreak),
  () => null,
);
