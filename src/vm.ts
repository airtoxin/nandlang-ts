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
import { Token } from "./token";

export class Vm {
  private tokens: Token[];
  constructor(private program: string) {
    this.tokens = lex(this.program);
  }

  public compile(): Module {
    const globalModules = new Map<string, Module>([
      ["NAND", nandModule],
      ["BITIN", bitinModule],
      ["BITOUT", bitoutModule],
    ]);
    return this._compile("GLOBAL", globalModules, new Map());
  }

  private _compile(
    moduleName: string,
    parentModules: Map<string, Module>,
    parentVariables: Map<string, Variable>,
  ): Module {
    const inPorts = new Map<string, Reactive<boolean>>();
    const outPorts = new Map<string, Reactive<boolean>>();
    const modules = new Map<string, Module>();
    const variables = new Map<string, Variable>(parentVariables);

    while (this.tokens.length > 0) {
      const token = this.tokens.shift();
      if (token == null) break;

      if (token.type === "variable") {
        const mod =
          modules.get(token.moduleName) ?? parentModules.get(token.moduleName);
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
      } else if (token.type === "moduleStart") {
        modules.set(
          token.name,
          this._compile(
            token.name,
            new Map([...parentModules.entries(), ...modules.entries()]),
            variables,
          ),
        );
      } else if (token.type === "moduleEnd") {
        return {
          name: moduleName,
          modules: [],
          createVariable: (name) => {
            return {
              name,
              inPorts,
              outPorts,
            };
          },
        };
      }
    }

    return {
      name: moduleName,
      modules: [],
      createVariable: (name) => {
        return {
          name,
          inPorts,
          outPorts,
        };
      },
    };
  }
}
