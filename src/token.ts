export type Token = KeywordToken | SymbolToken | CommentToken;

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

export type CommentToken = {
  type: "comment";
  line: string;
};
