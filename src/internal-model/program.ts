import { Program as ProgramAst } from "../parser/ast";
import { Reactive } from "@reactively/core";
import invariant from "tiny-invariant";
import {
  BitinModule,
  BitoutModule,
  createModule,
  Module,
  NandModule,
} from "./module";
import { Variable } from "./variable";

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
    for (const statement of this.programAst.statements) {
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
          const port = variable.outPorts.get("o0");
          invariant(port, "Can't find port o0 of BITIN");
          this.bitIns.set(variable.name, port);
        } else if (module instanceof BitoutModule) {
          const port = variable.inPorts.get("i0");
          invariant(port, "Can't find port i0 of BITIN");
          this.bitOuts.set(variable.name, port);
        }
      } else if (statement.subtype.type === "wireStatement") {
        const { srcVariableName, srcPortName, destVariableName, destPortName } =
          statement.subtype;

        const srcVar = this.variables.find((v) => v.name === srcVariableName);
        invariant(srcVar, `wire source variable not found: ${srcVariableName}`);
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
        invariant(srcPort, `Unknown port name of variable:${fixedSrcPortName}`);

        const destVar = this.variables.find((v) => v.name === destVariableName);
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
        invariant(fixedDestPortName, `Can't find source port ${destPortName}`);
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
      } else if (statement.subtype.type === "moduleStatement") {
        const Udm = createModule(statement.subtype, this.modules);
        this.modules.push(new Udm());
      }
    }
  }

  public run(inputSignals: Map<string, boolean>): Map<string, boolean> {
    for (const [name, value] of inputSignals.entries()) {
      this.bitIns.get(name)?.set(() => value);
    }

    const outputSignals = new Map<string, boolean>();
    for (const [name, port] of this.bitOuts) {
      outputSignals.set(name, port.value);
    }

    return outputSignals;
  }
}
