import { Token } from "./token";
import { Program, Statement } from "./ast";

type Parser<T> = (tokens: Token[]) => [Token[], T | null];

export const parseProgram = (tokens: Token[]): Program => {
  let restTokens = tokens;
  const statements: Statement[] = [];
  while (true) {
    const [statementRestTokens, statement] = parseStatement(restTokens);
    if (statement != null) {
      statements.push(statement);
      restTokens = statementRestTokens;
      continue;
    }

    const [commentRestTokens, parsed] = parseComment(statementRestTokens);
    if (parsed) {
      restTokens = commentRestTokens;
      continue;
    }

    parseEof(commentRestTokens);
    break;
  }

  return {
    type: "program",
    statements,
  };
};

export const parseStatement: Parser<Statement> = (tokens) => {
  const varResult = parseVarStatement(tokens);
  if (varResult[1] != null) return varResult;
  const wireResult = parseWireStatement(varResult[0]);
  if (wireResult[1] != null) return wireResult;
  return [tokens, null];
};

export const parseVarStatement: Parser<Statement> = (tokens) => {
  const varKeyword = tokens[0];
  if (varKeyword?.type !== "keyword" || varKeyword.value !== "VAR")
    return [tokens, null];

  const varName = tokens[1];
  if (varName?.type !== "symbol") return [tokens, null];

  const moduleName = tokens[2];
  if (moduleName?.type !== "symbol") return [tokens, null];

  const newline = tokens[3];
  if (newline?.type !== "linebreak") return [tokens, null];

  const statement: Statement = {
    type: "statement",
    subtype: {
      type: "varStatement",
      variableName: varName.value,
      moduleName: moduleName.value,
    },
  };
  return [tokens.slice(4), statement];
};

export const parseWireStatement: Parser<Statement> = (tokens) => {
  const wireKeyword = tokens[0];
  if (wireKeyword?.type !== "keyword" || wireKeyword.value !== "WIRE")
    return [tokens, null];

  const srcVarName = tokens[1];
  if (srcVarName?.type !== "symbol") return [tokens, null];

  const srcPortName = tokens[2];
  if (srcPortName?.type !== "symbol") return [tokens, null];

  const toKeyword = tokens[3];
  if (toKeyword?.type !== "keyword" || toKeyword.value !== "TO")
    return [tokens, null];

  const destVarName = tokens[4];
  if (destVarName?.type !== "symbol") return [tokens, null];

  const destPortName = tokens[5];
  if (destPortName?.type !== "symbol") return [tokens, null];

  const newline = tokens[6];
  if (newline?.type !== "linebreak") return [tokens, null];

  const statement: Statement = {
    type: "statement",
    subtype: {
      type: "wireStatement",
      srcVariableName: srcVarName.value,
      srcPortName: srcPortName.value,
      destVariableName: destVarName.value,
      destPortName: destPortName.value,
    },
  };
  return [tokens.slice(7), statement];
};

export const parseComment: Parser<true> = (tokens) => {
  const [commentToken, ...restTokens] = tokens;
  if (commentToken?.type !== "comment") return [tokens, null];
  return [restTokens, true];
};

export const parseEof: Parser<true> = (tokens) => {
  if (tokens.length !== 1 || tokens[0]?.type !== "eof")
    throw new SyntaxError(`Expect eof but got ${tokens}`);
  return [[], true];
};
