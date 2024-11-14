export type Program = {
  type: "program";
  statements: Statement[];
};

export type Statement = {
  type: "statement";
  subtype: SubStatement;
};

export type SubStatement =
  | { type: "moduleStatement" }
  | { type: "varStatement"; variableName: string; moduleName: string }
  | {
      type: "wireStatement";
      srcVariableName: string;
      srcPortName: string;
      destVariableName: string;
      destPortName: string;
    };
