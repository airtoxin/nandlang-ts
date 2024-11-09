export type Token =
  | VariableToken
  | WireToken
  | ModuleStartToken
  | ModuleEndToken;

export type VariableToken = {
  type: "variable";
  name: string;
  module_name: string;
};

export type WireToken = {
  type: "wire";
  src_variable_name: string;
  src_variable_port: string;
  dest_variable_name: string;
  dest_variable_port: string;
};

export type ModuleStartToken = {
  type: "moduleStart";
  name: string;
};

export type ModuleEndToken = {
  type: "moduleEnd";
};
