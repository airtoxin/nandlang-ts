export type Token =
  | VariableToken
  | WireToken
  | ModuleStartToken
  | ModuleEndToken;

export type VariableToken = {
  type: "variable";
  name: string;
  moduleName: string;
};

export type WireToken = {
  type: "wire";
  srcVariableName: string;
  srcVariablePort: string;
  destVariableName: string;
  destVariablePort: string;
};

export type ModuleStartToken = {
  type: "moduleStart";
  name: string;
};

export type ModuleEndToken = {
  type: "moduleEnd";
};
