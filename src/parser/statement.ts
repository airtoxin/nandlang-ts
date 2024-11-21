import { mapResult, or, Parser, rep, seq, str } from "../lib/parser-combinator";
import { Statement } from "./ast";
import {
  emptyLine,
  linebreak,
  mapResultToNonNullableArray,
  symbol,
  whitespaces,
} from "./parser";

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

export const statement: Parser<Statement | null> = or(
  variableStatement,
  wireStatement,
  // TODO: This allows to module statement in module statement
  // moduleStatement,
  emptyLine,
);

export const statements: Parser<Statement[]> = mapResultToNonNullableArray(
  rep(statement),
);
