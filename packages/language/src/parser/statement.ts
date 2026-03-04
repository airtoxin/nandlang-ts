import {
  anyChar,
  char,
  mapResult,
  or,
  Parser,
  rep,
  seq,
  str,
  sub,
} from "../lib/parser-combinator";
import { Statement } from "./ast";
import {
  emptyLine,
  lazy,
  linebreak,
  mapResultToNonNullableArray,
  symbol,
  whitespaces,
} from "./parser";

export const commentStatement: Parser<null> = mapResult(
  seq<unknown>(
    whitespaces(),
    char("#"),
    rep(sub(anyChar, linebreak)),
    linebreak,
  ),
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

export const moduleStatement = lazy<Statement>();

export const statement: Parser<Statement | null> = or(
  commentStatement,
  variableStatement,
  wireStatement,
  moduleStatement,
  emptyLine,
);

export const statements: Parser<Statement[]> = mapResultToNonNullableArray(
  rep(statement),
);

moduleStatement.init(
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
  ),
);
