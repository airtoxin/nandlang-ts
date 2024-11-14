import { Token } from "./token";

export class Lexer {
  private line = 0;
  private position = 0;
  private index = 0;
  constructor(private program: string) {}

  public *lex(): IterableIterator<Token> {
    while (this.index < this.program.length) {
      const char = this.getChar();
      if (char == null) break;

      if (char === " " || char === "\t") {
        this.index++;
        this.position++;
        continue;
      }
      if (char === "\r") {
        yield {
          type: "linebreak",
          line: this.line,
          position: this.position,
        };
        this.index++;
        if (this.getChar() === "\n") this.index++;
        this.line++;
        this.position = 0;
        continue;
      }
      if (char === "\n") {
        yield {
          type: "linebreak",
          line: this.line,
          position: this.position,
        };
        this.line++;
        this.position = 0;
        this.index++;
        continue;
      }

      if (char === "#") {
        const currentPosition: ProgramPosition = {
          line: this.line,
          position: this.position,
        };
        const line = this.readLine();
        yield {
          type: "comment",
          ...currentPosition,
        };
        continue;
      }

      const currentPosition: ProgramPosition = {
        line: this.line,
        position: this.position,
      };
      const word = this.readWord();
      if (
        word === "VAR" ||
        word === "FROM" ||
        word === "TO" ||
        word === "WIRE" ||
        word === "MOD" ||
        word === "START" ||
        word === "END"
      ) {
        yield {
          type: "keyword",
          value: word,
          ...currentPosition,
        };
      } else {
        yield {
          type: "symbol",
          value: word,
          ...currentPosition,
        };
      }
    }
    yield { type: "eof", line: this.line, position: this.position };
  }

  private getChar(): string | undefined {
    return this.program[this.index];
  }

  private readWord(): string {
    let word = "";
    while (this.isLetter(this.getChar())) {
      word += this.getChar();
      this.index++;
      this.position++;
    }
    return word;
  }

  private isLetter(ch: unknown): boolean {
    return (
      typeof ch === "string" &&
      (("a" <= ch && ch <= "z") ||
        ("0" <= ch && ch <= "9") ||
        ("A" <= ch && ch <= "Z") ||
        ch === "_")
    );
  }

  private readLine(): string {
    let line = "";
    while (this.getChar() !== "\r" && this.getChar() !== "\n") {
      line += this.getChar();
      this.index++;
      this.position++;
    }
    if (this.getChar() === "\n") {
      this.index++;
      this.position++;
    }
    return line;
  }
}

type ProgramPosition = {
  line: number;
  position: number;
};
