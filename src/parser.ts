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

// To avoid a ReferenceError due to circular dependency between `statements` and `moduleStatement`,
// one of the definitions is wrapped in a function. This ensures that the variable
// is not accessed before it is fully initialized.
export const moduleStatement: () => Parser<Statement> = () =>
  mapResult(
    mapResultToNonNullableArray(
      seq<Statement[] | string | null>(
        whitespaces(),
        str("MOD"),
        whitespaces(false),
        str("START"),
        whitespaces(false),
        symbol,
        whitespaces(),
        linebreak,
        statements,
        whitespaces(),
        str("MOD"),
        whitespaces(false),
        str("END"),
        whitespaces(),
        linebreak,
      ),
    ),
    ([_, __, moduleName, definitionStatements]) => {
      if (typeof moduleName !== "string")
        throw new Error(`Unexpected input moduleName:${moduleName}`);
      if (!Array.isArray(definitionStatements))
        throw new Error(
          `Unexpected input definitionStatements:${definitionStatements}`,
        );
      return {
        type: "statement",
        subtype: {
          type: "moduleStatement",
          name: moduleName,
          definitionStatements,
        },
      };
    },
  );

export const emptyLine: Parser<null> = mapResult(
  seq(whitespaces(), linebreak),
  () => null,
);

export const statement: Parser<Statement> = or(
  variableStatement,
  wireStatement,
  // TODO: This allows to module statement in module statement
  // moduleStatement()
);

export const statements: Parser<Statement[]> = mapResultToNonNullableArray(
  rep(or(statement, emptyLine)),
);
