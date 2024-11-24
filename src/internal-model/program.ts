import { Program as ProgramAst } from "../parser/ast";
import { reactive, Reactive } from "@reactively/core";
import { nand } from "../gate";
import invariant from "tiny-invariant";

export class Program {
  private bitIns: Map<string, Reactive<boolean>> = new Map();
  private bitOuts: Map<string, Reactive<boolean>> = new Map();
  private variables: Variable[] = [];
  private modules: Module[] = [
    new NandModule(),
    new BitinModule(),
    new BitoutModule(),
  ];

  constructor(private programAst: ProgramAst) {
    for (const statement of programAst.statements) {
      if (statement.subtype.type === "varStatement") {
        const moduleName = statement.subtype.moduleName;
        const module = this.modules.find((m) => m.name === moduleName);
        invariant(
          module,
          `Can't find module definition ${moduleName} of variable ${statement.subtype.variableName}`,
        );

        const variable = module.createVariable(statement.subtype.variableName);
        this.variables.push(variable);

        if (module instanceof BitinModule) {
          this.bitIns.set(variable.name, module.port);
        } else if (module instanceof BitoutModule) {
          this.bitOuts.set(variable.name, module.port);
        }
      } else if (statement.subtype.type === "wireStatement") {
        const { srcVariableName, srcPortName, destVariableName, destPortName } =
          statement.subtype;

        const srcVar = this.variables.find((v) => v.name === srcVariableName);
        invariant(srcVar, `wire source variable not found: ${srcVariableName}`);
        invariant(
          srcPortName === "_" && srcVar.outPorts.size !== 1,
          `Can't determine src port name of variable:${srcVar.name}`,
        );
        const fixedSrcPortName =
          srcPortName === "_"
            ? srcVar.outPorts.entries().next().value?.[0]
            : srcPortName;
        invariant(fixedSrcPortName, `Can't find source port ${srcPortName}`);
        const srcPort = srcVar.outPorts.get(fixedSrcPortName);
        invariant(srcPort, `Unknown port name of variable:${fixedSrcPortName}`);

        const destVar = this.variables.find((v) => v.name === destVariableName);
        invariant(
          destVar,
          `wire destination variable not found: ${destVariableName}`,
        );
        invariant(
          destPortName === "_" && destVar.inPorts.size !== 1,
          `Can't determine dest port name of variable:${destVar.name}`,
        );
        const fixedDestPortName =
          destPortName === "_"
            ? destVar.inPorts.entries().next().value?.[0]
            : destPortName;
        invariant(fixedDestPortName, `Can't find source port ${destPortName}`);
        const destPort = destVar.inPorts.get(fixedDestPortName);
        invariant(
          destPort,
          `Unknown port name of variable:${fixedDestPortName}`,
        );

        // TODO: Depends on the internal specifications of the reactively lib.
        invariant(
          destPort["fn"] != null,
          `destination port ${fixedDestPortName} of ${destVar.name} already wired`,
        );
        destPort.set(() => srcPort.value);
      }
    }
  }

  public run(inputSignals: Map<string, boolean>): Map<string, boolean> {
    for (const [name, value] of inputSignals.entries()) {
      this.bitIns.get(name)?.set(value);
    }

    const outputSignals = new Map<string, boolean>();
    for (const [name, port] of this.bitOuts) {
      outputSignals.set(name, port.value);
    }

    return outputSignals;
  }
}

export abstract class Module {
  constructor(public readonly name: string) {}
  public abstract createVariable(varName: string): Variable;
}

class NandModule implements Module {
  public readonly name = "NAND";
  public createVariable(varName: string): Variable {
    const i0 = reactive(false);
    const i1 = reactive(false);
    const o0 = reactive(() => nand(i0.value, i1.value));
    return new Variable(
      varName,
      this,
      new Map([
        ["i0", i0],
        ["i1", i1],
      ]),
      new Map([["o0", o0]]),
    );
  }
}

class BitinModule implements Module {
  public readonly name = "BITIN";
  public readonly port = reactive(false);
  public createVariable(varName: string): Variable {
    return new Variable(varName, this, new Map(), new Map([["o0", this.port]]));
  }
}

class BitoutModule implements Module {
  public readonly name = "BITOUT";
  public readonly port = reactive(false);
  public createVariable(varName: string): Variable {
    return new Variable(varName, this, new Map([["i0", this.port]]), new Map());
  }
}

export class Variable {
  constructor(
    public readonly name: string,
    public readonly module: Module,
    public readonly inPorts: Map<string, Reactive<boolean>>,
    public readonly outPorts: Map<string, Reactive<boolean>>,
  ) {}
}
