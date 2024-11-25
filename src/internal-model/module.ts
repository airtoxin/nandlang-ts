import { Reactive, reactive } from "@reactively/core";
import { nand } from "./gate";
import { Variable } from "./variable";
import { Statement, SubStatement } from "../parser/ast";
import invariant from "tiny-invariant";

export abstract class Module {
  constructor(public readonly name: string) {}

  public abstract createVariable(varName: string): Variable;
}

export class NandModule implements Module {
  public readonly name = "NAND";

  public createVariable(varName: string): Variable {
    const i0 = reactive(false);
    const i1 = reactive(false);
    const o0 = reactive(() => nand(i0.value, i1.value));
    return new Variable(
      varName,
      new Map([
        ["i0", i0],
        ["i1", i1],
      ]),
      new Map([["o0", o0]]),
    );
  }
}

export class BitinModule implements Module {
  public readonly name = "BITIN";

  public createVariable(varName: string): Variable {
    return new Variable(varName, new Map(), new Map([["o0", reactive(false)]]));
  }
}

export class BitoutModule implements Module {
  public readonly name = "BITOUT";

  public createVariable(varName: string): Variable {
    return new Variable(varName, new Map([["i0", reactive(false)]]), new Map());
  }
}

export class FlipflopModule implements Module {
  public readonly name = "FLIPFLOP";

  public createVariable(varName: string): Variable {
    const set = reactive(false);
    const reset = reactive(false);
    let state = false;
    const q = reactive(() => {
      if (set.value && reset.value) {
        throw new Error(`FLIPFLOP got set and reset signal`);
      } else if (set.value) {
        state = true;
      } else if (reset.value) {
        state = false;
      }
      return state;
    });
    return new Variable(
      varName,
      new Map([
        ["s", set],
        ["r", reset],
      ]),
      new Map([["q", q]]),
    );
  }
}

export const createModule = (
  moduleStatement: Extract<SubStatement, { type: "moduleStatement" }>,
  availableModules: Module[],
): new () => Module => {
  const C = class implements Module {
    public readonly name = moduleStatement.name;

    public createVariable(varName: string): Variable {
      const variables: Variable[] = [];
      const bitIns = new Map<string, Reactive<boolean>>();
      const bitOuts = new Map<string, Reactive<boolean>>();
      for (const statement of moduleStatement.definitionStatements) {
        if (statement.subtype.type === "varStatement") {
          const moduleName = statement.subtype.moduleName;
          const module = availableModules.find((m) => m.name === moduleName);
          invariant(
            module,
            `Can't find module definition ${moduleName} of variable ${statement.subtype.variableName}`,
          );

          const variable = module.createVariable(
            statement.subtype.variableName,
          );
          variables.push(variable);

          if (module instanceof BitinModule) {
            const port = variable.outPorts.get("o0");
            invariant(port, "Can't find port o0 of BITIN");
            bitIns.set(variable.name, port);
          } else if (module instanceof BitoutModule) {
            const port = variable.inPorts.get("i0");
            invariant(port, "Can't find port i0 of BITIN");
            bitOuts.set(variable.name, port);
          }
        } else if (statement.subtype.type === "wireStatement") {
          const {
            srcVariableName,
            srcPortName,
            destVariableName,
            destPortName,
          } = statement.subtype;

          const srcVar = variables.find((v) => v.name === srcVariableName);
          invariant(
            srcVar,
            `wire source variable not found: ${srcVariableName}`,
          );
          if (srcPortName === "_" && srcVar.outPorts.size !== 1)
            throw new Error(
              `Can't determine src port name of variable:${srcVar.name}`,
            );
          const fixedSrcPortName =
            srcPortName === "_"
              ? srcVar.outPorts.entries().next().value?.[0]
              : srcPortName;
          invariant(fixedSrcPortName, `Can't find source port ${srcPortName}`);
          const srcPort = srcVar.outPorts.get(fixedSrcPortName);
          invariant(
            srcPort,
            `Unknown port name of variable:${fixedSrcPortName}`,
          );

          const destVar = variables.find((v) => v.name === destVariableName);
          invariant(
            destVar,
            `wire destination variable not found: ${destVariableName}`,
          );
          if (destPortName === "_" && destVar.inPorts.size !== 1)
            throw new Error(
              `Can't determine dest port name of variable:${destVar.name}`,
            );
          const fixedDestPortName =
            destPortName === "_"
              ? destVar.inPorts.entries().next().value?.[0]
              : destPortName;
          invariant(
            fixedDestPortName,
            `Can't find source port ${destPortName}`,
          );
          const destPort = destVar.inPorts.get(fixedDestPortName);
          invariant(
            destPort,
            `Unknown port name of variable:${fixedDestPortName}`,
          );

          // TODO: Depends on the internal specifications of the reactively lib.
          if (destPort["fn"] != null)
            throw new Error(
              `destination port ${fixedDestPortName} of ${destVar.name} already wired`,
            );
          destPort.set(() => srcPort.value);
        }
      }

      return new Variable(varName, bitIns, bitOuts);
    }
  };
  Object.defineProperty(C, "name", { value: moduleStatement.name });
  return C;
};
