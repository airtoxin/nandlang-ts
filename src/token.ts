export type Token = KeywordToken | SymbolToken | LineBreakToken | CommentToken;

export type KeywordToken = {
  type: "keyword";
  value: "VAR" | "FROM" | "TO" | "WIRE" | "MOD" | "START" | "END";
  line: number;
  position: number;
};

export type SymbolToken = {
  type: "symbol";
  value: string;
  line: number;
  position: number;
};

export type LineBreakToken = {
  type: "linebreak";
  line: number;
  position: number;
};

export type CommentToken = {
  type: "comment";
  line: number;
  position: number;
};
