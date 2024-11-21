// To avoid a ReferenceError due to circular dependency between `statements` and `moduleStatement`,
// one of the definitions is wrapped in a function. This ensures that the variable
// is not accessed before it is fully initialized.
import { mapResult, Parser, seq, str } from "../lib/parser-combinator";
import { Statement } from "./ast";
import {
  linebreak,
  mapResultToNonNullableArray,
  symbol,
  whitespaces,
} from "./parser";
import { statements } from "./statement";

export const moduleStatement: Parser<Statement> = mapResult(
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
