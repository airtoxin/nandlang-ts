declare module "@nandlang-ts/language/vm" {
  export class Vm {
    compile(programString: string): void;
    run(inputSignals: Map<string, boolean | number>): Map<string, boolean | number>;
    getAllSignals(): Map<string, boolean>;
    getMemoryDumps(): Map<string, Uint8Array>;
  }
}

declare module "@nandlang-ts/language/parser/ast" {
  export type Program = {
    type: "program";
    statements: Statement[];
  };

  export type Statement = {
    type: "statement";
    subtype: SubStatement;
  };

  export type SubStatement =
    | {
        type: "moduleStatement";
        name: string;
        definitionStatements: Statement[];
      }
    | { type: "varStatement"; variableName: string; moduleName: string }
    | {
        type: "wireStatement";
        srcVariableName: string;
        srcPortName: string;
        destVariableName: string;
        destPortName: string;
      };
}

declare module "@nandlang-ts/language/parser/program" {
  import type { Program } from "@nandlang-ts/language/parser/ast";

  type ProgramParseResult =
    | { success: true; data: Program; rest: string }
    | { success: false; rest: string };

  export const program: (input: string | string[]) => ProgramParseResult;
}

declare module "@nandlang-ts/language/code-fragments" {
  export const ON: string;
  export const NOT: string;
  export const AND: string;
  export const AND3: string;
  export const OR: string;
  export const OR3: string;
  export const NOR: string;
  export const XOR: string;
  export const XNOR: string;
  export const ADD: string;
  export const DEC: string;
  export const ENC: string;
  export const DLATCH: string;
  export const REG: string;
  export const BYTEREG: string;
  export const BYTEADD: string;
  export const DECODER_3BIT: string;
  export const MUX: string;
  export const DMUX: string;
}
