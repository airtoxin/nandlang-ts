import { lex } from "./lexer";
import {
  bitinModule,
  bitoutModule,
  Module,
  nandModule,
  secretBitinPort,
  secretBitoutPort,
  Variable,
} from "./module";
import { Reactive } from "@reactively/core";

export class Vm {
  public compile(program: string): Variable {
    const tokens = lex(program);

    const inPorts = new Map<string, Reactive<boolean>>();
    const outPorts = new Map<string, Reactive<boolean>>();
    const modules = new Map<string, Module>([
      ["NAND", nandModule],
      ["BITIN", bitinModule],
      ["BITOUT", bitoutModule],
    ]);
    const variables = new Map<string, Variable>();

    for (const token of tokens) {
      if (token.type === "variable") {
        const mod = modules.get(token.moduleName);
        if (mod == null)
          throw new Error(`Unknown module name: ${token.moduleName}`);
        const variable = mod.createVariable(token.name);
        variables.set(token.name, variable);
        if (mod.name === "BITIN") {
          const port = variable[secretBitinPort];
          if (port == null) throw new Error(`Unexpected BITIN port`);
          inPorts.set(variable.name, port);
        } else if (mod.name === "BITOUT") {
          const port = variable[secretBitoutPort];
          if (port == null) throw new Error(`Unexpected BITOUT port`);
          outPorts.set(variable.name, port);
        }
      } else if (token.type === "wire") {
        const srcPort = variables
          .get(token.srcVariableName)
          ?.outPorts?.get(token.srcVariablePort);
        const destPort = variables
          .get(token.destVariableName)
          ?.inPorts?.get(token.destVariablePort);
        if (srcPort == null || destPort == null)
          throw new Error(`Unknown wiring port. ${JSON.stringify(token)}`);
        destPort.set(() => srcPort.get());
      }
    }

    return {
      name: "GLOBAL",
      inPorts,
      outPorts,
    };
  }
}
