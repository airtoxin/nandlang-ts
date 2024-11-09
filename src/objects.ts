export type Module = {
  name: string;
  modules: Module[];
  vars: Variable[];
  wires: Wire[];
};

export type Variable = {
  name: string;
  moduleName: string;
};

export type Wire = {
  srcVarName: string;
  srcPortName: string;
  destVarName: string;
  destPortName: string;
};
