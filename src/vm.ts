import { lex } from "./lexer";
import { Module, Variable } from "./objects";

export class Vm {
  private modules: Module[];

  constructor() {
    const globalModule: Module = {
      name: "Global",
      modules: [
        {
          name: "NAND",
          modules: [],
          vars: [
            { name: "i0", moduleName: "BITIN" },
            { name: "i1", moduleName: "BITIN" },
            { name: "o0", moduleName: "BITOUT" },
          ],
          wires: [],
        },
        {
          name: "BITIN",
          modules: [],
          vars: [{ name: "o0", moduleName: "BITOUT" }],
          wires: [],
        },
        {
          name: "BITOUT",
          modules: [],
          vars: [{ name: "i0", moduleName: "BITIN" }],
          wires: [],
        },
      ],
      vars: [],
      wires: [],
    };
    this.modules = [globalModule];
  }

  public parse(program: string) {
    const tokens = lex(program);
    for (const token of tokens) {
      const currentModule = this.modules.at(-1)!; // 常にトップレベルのGlobalモジュールがあるので!キャスト可能
      if (token.type === "variable") {
        const mod = this.findModule(token.moduleName);
        if (mod == null)
          throw new Error(`Unknown module name: ${token.moduleName}`);
        currentModule.vars.push({
          name: token.name,
          moduleName: mod.name,
        });
      } else if (token.type === "wire") {
        const srcVar = this.findVar(token.srcVariableName);
        if (srcVar == null)
          throw new Error(`Unknown variable name: ${token.srcVariableName}`);
        const srcMod = this.findModule(srcVar.moduleName);
        if (srcMod == null)
          throw new Error(`Unknown variable module: ${srcVar.moduleName}`);
        const srcPort = srcMod.vars.find(
          (v) => v.moduleName === "BITOUT" && v.name === token.srcVariablePort,
        );
        if (srcPort == null)
          throw new Error(`Unknown src port: ${token.srcVariablePort}`);
        const destVar = this.findVar(token.destVariableName);
        if (destVar == null)
          throw new Error(`Unknown variable name: ${token.destVariableName}`);
        const destMod = this.findModule(destVar.moduleName);
        if (destMod == null)
          throw new Error(`Unknown variable module: ${destVar.moduleName}`);
        const destPort = destMod.vars.find(
          (v) => v.moduleName === "BITIN" && v.name === token.destVariablePort,
        );
        if (destPort == null)
          throw new Error(`Unknown dest port: ${token.destVariablePort}`);
        currentModule.wires.push({
          srcVarName: srcVar.name,
          srcPortName: srcPort.name,
          destVarName: destVar.name,
          destPortName: destPort.name,
        });
      } else if (token.type === "moduleStart") {
        const newModule: Module = {
          name: token.name,
          modules: [],
          vars: [],
          wires: [],
        };
        this.modules.push(newModule);
      } else if (token.type === "moduleEnd") {
        const newModule = this.modules.pop()!;
        this.modules.at(-1)!.modules.push(newModule);
      }
    }
  }

  public run(inputs: BitIo): BitIo {}

  private findModule(moduleName: string): Module | null {
    const flatten = (module: Module): Module[] => {
      return [...module.modules.flatMap((m) => flatten(m)), module];
    };
    const flatModules = this.modules.toReversed().flatMap(flatten);

    return flatModules.find((m) => m.name === moduleName) ?? null;
  }

  private findVar(varName: string): Variable | null {
    const flatten = (module: Module): Variable[] => {
      return [...module.modules.flatMap((m) => flatten(m)), ...module.vars];
    };
    const flatVars = this.modules.toReversed().flatMap(flatten);

    return flatVars.find((v) => v.name === varName) ?? null;
  }
}

export type BitIo = {
  [variableName: string]: boolean;
};
