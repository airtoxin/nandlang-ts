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
} from "./parser-combinator";
import { Statement } from "./ast";

const lazy = <T>(parserFn: () => Parser<T>): Parser<T> => parserFn();

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

export const variableStatement: Parser<Statement> = mapResult(
  mapResultToNonNullableArray(
    seq(
      whitespaces(),
      str("VAR"),
      whitespaces(false),
      symbol,
      whitespaces(false),
      symbol,
      whitespaces(),
      linebreak,
    ),
  ),
  ([_, variableName, moduleName]) => {
    if (variableName == null || moduleName == null)
      throw new Error(
        `Unexpected input variableName:${variableName} or moduleName:${moduleName} is nullish`,
      );
    return {
      type: "statement",
      subtype: {
        type: "varStatement",
        variableName,
        moduleName,
      },
    };
  },
);

export const wireStatement: Parser<Statement> = mapResult(
  mapResultToNonNullableArray(
    seq(
      whitespaces(),
      str("WIRE"),
      whitespaces(false),
      symbol,
      whitespaces(false),
      symbol,
      whitespaces(false),
      str("TO"),
      whitespaces(false),
      symbol,
      whitespaces(false),
      symbol,
      whitespaces(),
      linebreak,
    ),
  ),
  ([_, srcVariableName, srcPortName, __, destVariableName, destPortName]) => {
    if (srcVariableName == null || srcPortName == null)
      throw new Error(
        `Unexpected input srcVariableName:${srcVariableName} or srcPortName:${srcPortName} is nullish`,
      );
    if (destVariableName == null || destPortName == null)
      throw new Error(
        `Unexpected input destVariableName:${destVariableName} or destPortName:${destPortName} is nullish`,
      );
    return {
      type: "statement",
      subtype: {
        type: "wireStatement",
        srcVariableName,
        srcPortName,
        destVariableName,
        destPortName,
      },
    };
  },
);

export const moduleStatement: Parser<Statement> = lazy(() =>
  mapResult(
    mapResultToNonNullableArray(
      seq<Statement[] | string | null>(
        whitespaces(),
        str("MOD START"),
        whitespaces(false),
        symbol,
        whitespaces(),
        linebreak,
        statements,
        whitespaces(),
        str("MOD END"),
        whitespaces(),
        linebreak,
      ),
    ),
    (tokens) => {
      console.log("@tokens", tokens);
      return {
        type: "statement",
        subtype: {
          type: "moduleStatement",
          name: "TEST",
          definitionStatements: [],
        },
      };
    },
  ),
);

export const emptyLine: Parser<null> = mapResult(
  seq(whitespaces(), linebreak),
  () => null,
);

export const statement: Parser<Statement> = or(
  variableStatement,
  wireStatement,
);

export const statements: Parser<Statement[]> = mapResultToNonNullableArray(
  rep(or(statement, emptyLine)),
);
