import {
  ModuleEndToken,
  ModuleStartToken,
  Token,
  VariableToken,
  WireToken,
} from "./token";

export const lex = (program: string): Token[] => {
  const tokens: Token[] = [];
  for (const line of program.split("\n")) {
    const words = line.trim().split(/\s+/);
    if (words[0] === "VAR" && words.length === 3) {
      const token: VariableToken = {
        type: "variable",
        name: words[1],
        module_name: words[2],
      };
      tokens.push(token);
    } else if (words[0] === "FROM" && words[3] === "TO" && words.length === 6) {
      const token: WireToken = {
        type: "wire",
        src_variable_name: words[1],
        src_variable_port: words[2],
        dest_variable_name: words[4],
        dest_variable_port: words[5],
      };
      tokens.push(token);
    } else if (
      words[0] === "MOD" &&
      words[1] === "START" &&
      words.length === 3
    ) {
      const token: ModuleStartToken = {
        type: "moduleStart",
        name: words[2],
      };
      tokens.push(token);
    } else if (words[0] === "MOD" && words[1] === "END" && words.length === 2) {
      const token: ModuleEndToken = {
        type: "moduleEnd",
      };
      tokens.push(token);
    } else if (words[0] === "#") {
      // ignore comment line
    }
  }

  return tokens;
};
