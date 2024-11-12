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

type Scope = {
  inPorts: Map<string, Reactive<boolean>>;
  outPorts: Map<string, Reactive<boolean>>;
  modules: Map<string, Module>;
  variables: Map<string, Variable>;
};

export class Vm {
  private tokens: Token[];
  private scopes: Scope[];
  constructor(private program: string) {
    this.tokens = lex(this.program);
    this.scopes = [
      {
        inPorts: new Map(),
        outPorts: new Map(),
        modules: new Map<string, Module>([
          ["NAND", nandModule],
          ["BITIN", bitinModule],
          ["BITOUT", bitoutModule],
        ]),
        variables: new Map(),
      },
    ];
  }

  public compile(): Module {
    return this._compile("GLOBAL");
  }

  private _compile(moduleName: string): Module {
    const currentScope = this.scopes.at(-1)!; // scopesはNonEmptyListなのでキャスト可能
    while (this.tokens.length > 0) {
      const token = this.tokens.shift();
      if (token == null) break;
      if (token.type === "variable") {
        const mod = this.findModule(token.moduleName);
        if (mod == null)
          throw new Error(`Unknown module name: ${token.moduleName}`);
        const variable = mod.createVariable(token.name);
        currentScope.variables.set(token.name, variable);
        if (mod.name === "BITIN") {
          const port = variable[secretBitinPort];
          if (port == null) throw new Error(`Unexpected BITIN port`);
          currentScope.inPorts.set(variable.name, port);
        } else if (mod.name === "BITOUT") {
          const port = variable[secretBitoutPort];
          if (port == null) throw new Error(`Unexpected BITOUT port`);
          currentScope.outPorts.set(variable.name, port);
        }
      } else if (token.type === "wire") {
        const srcOutPorts = this.findVariable(token.srcVariableName)?.outPorts;
        const srcPort =
          token.srcVariablePort === "_"
            ? srcOutPorts?.values().next().value
            : srcOutPorts?.get(token.srcVariablePort);
        const destInPorts = this.findVariable(token.destVariableName)?.inPorts;
        const destPort =
          token.destVariablePort === "_"
            ? destInPorts?.values().next().value
            : destInPorts?.get(token.destVariablePort);
        if (srcPort == null || destPort == null)
          throw new Error(`Unknown wiring port. ${JSON.stringify(token)}`);
        destPort.set(() => srcPort.get());
      } else if (token.type === "moduleStart") {
        this.scopes.push({
          inPorts: new Map(),
          outPorts: new Map(),
          modules: new Map(),
          variables: new Map(),
        });
      } else if (token.type === "moduleEnd") {
        const scope = this.scopes.pop();
        if (scope == null) throw new Error(`Unexpected scope stack: undefined`);
        return {
          name: moduleName,
          modules: [],
          createVariable: (name) => {
            console.log("@scope", scope);
            return {
              name,
              inPorts: scope.inPorts,
              outPorts: scope.outPorts,
            };
          },
        };
      }
    }

    const scope = this.scopes.pop();
    if (scope == null) throw new Error(`Unexpected scope stack: undefined`);
    return {
      name: moduleName,
      modules: [],
      createVariable: (name) => {
        return {
          name,
          inPorts: scope.inPorts,
          outPorts: scope.outPorts,
        };
      },
    };
  }

  private findModule(moduleName: string): Module | undefined {
    return this.scopes
      .toReversed()
      .flatMap((scope) => Array.from(scope.modules.entries()))
      .find((entry) => entry?.[0] === moduleName)?.[1];
  }

  private findVariable(variableName: string): Variable | undefined {
    return this.scopes
      .toReversed()
      .flatMap((scope) => Array.from(scope.variables.entries()))
      .find((entry) => entry?.[0] === variableName)?.[1];
  }
}
