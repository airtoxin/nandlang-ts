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
  const [varKeyword, varName, moduleName, newline, ...restTokens] = tokens;
  if (varKeyword?.type !== "keyword" || varKeyword.value !== "VAR")
    return [tokens, null];
  if (varName?.type !== "symbol") return [tokens, null];
  if (moduleName?.type !== "symbol") return [tokens, null];
  if (newline?.type !== "linebreak") return [tokens, null];

  const statement: Statement = {
    type: "statement",
    subtype: {
      type: "varStatement",
      variableName: varName.value,
      moduleName: moduleName.value,
    },
  };
  return [restTokens, statement];
};

export const parseWireStatement: Parser<Statement> = (tokens) => {
  const [
    wireKeyword,
    srcVarName,
    srcPortName,
    toKeyword,
    destVarName,
    destPortName,
    newline,
    ...restTokens
  ] = tokens;
  if (wireKeyword?.type !== "keyword" || wireKeyword.value !== "WIRE")
    return [tokens, null];
  if (srcVarName?.type !== "symbol") return [tokens, null];
  if (srcPortName?.type !== "symbol") return [tokens, null];
  if (toKeyword?.type !== "keyword" || toKeyword.value !== "TO")
    return [tokens, null];
  if (destVarName?.type !== "symbol") return [tokens, null];
  if (destPortName?.type !== "symbol") return [tokens, null];
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
  return [restTokens, statement];
};

export const parseModuleStatement: Parser<Statement> = (tokens) => {
  const [
    moduleKeywordToken,
    startKeywordToken,
    moduleNameToken,
    ...restTokens
  ] = tokens;
};

export const parseComment: Parser<true> = (tokens) => {
  const [commentToken, ...restTokens] = tokens;
  if (commentToken?.type !== "comment") return [tokens, null];
  return [restTokens, true];
};

export const parseEof: Parser<true> = (tokens) => {
  const [eof, ...restTokens] = tokens;
  if (eof?.type !== "eof" || restTokens.length !== 0)
    throw new SyntaxError(`Expect eof but got ${tokens}`);
  return [[], true];
};
