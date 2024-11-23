import { Program as ProgramAst, Statement, SubStatement } from "../parser/ast";
import { reactive, Reactive } from "@reactively/core";
import { nand } from "../gate";

export class Program {
  private bitIns: Map<string, Reactive<boolean>> = new Map();
  private bitOuts: Map<string, Reactive<boolean>> = new Map();
  private variables: Variable[] = [];

  constructor(private programAst: ProgramAst) {
    for (const statement of programAst.statements) {
      if (statement.subtype.type === "varStatement") {
        const variable = new Variable(statement.subtype);
        this.variables.push(variable);

        if (variable.module.isBitin()) {
          const port = reactive(false);
          this.bitIns.set(variable.name, port);
          variable.outPorts.set("o0", port);
        } else if (variable.module.isBitout()) {
          const port = reactive(false);
          variable.inPorts.set("i0", port);
          this.bitOuts.set(variable.name, port);
        } else if (variable.module.isNand()) {
          const i0 = reactive(false);
          const i1 = reactive(false);
          const o0 = reactive(() => nand(i0.value, i1.value));
          variable.inPorts.set("i0", i0);
          variable.inPorts.set("i1", i1);
          variable.outPorts.set("o0", o0);
        }
      } else if (statement.subtype.type === "wireStatement") {
        const { srcVariableName, srcPortName, destVariableName, destPortName } =
          statement.subtype;

        const srcVar = this.variables.find((v) => v.name === srcVariableName);
        if (srcVar == null)
          throw new Error(`wire source variable not found: ${srcVariableName}`);
        if (srcPortName === "_" && srcVar.outPorts.size !== 1)
          throw new Error(
            `Can't determine src port name of variable:${srcVar.name}`,
          );
        const fixedSrcPortName =
          srcPortName === "_"
            ? srcVar.outPorts.entries().next().value?.[0]
            : srcPortName;
        if (fixedSrcPortName == null) throw new Error(`Unexpected`);
        const srcPort = srcVar.outPorts.get(fixedSrcPortName);
        if (srcPort == null)
          throw new Error(`Unknown port name of variable:${fixedSrcPortName}`);

        const destVar = this.variables.find((v) => v.name === destVariableName);
        if (destVar == null)
          throw new Error(
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
        if (fixedDestPortName == null) throw new Error(`Unexpected`);
        const destPort = destVar.inPorts.get(fixedDestPortName);
        if (destPort == null)
          throw new Error(`Unknown port name of variable:${fixedDestPortName}`);

        // TODO: Depends on the internal specifications of the reactively lib.
        if (destPort["fn"] != null)
          throw new Error(
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

export class Module {
  constructor(
    public readonly name: string,
    private definitionStatements?: Statement[],
  ) {}

  public isNand(): boolean {
    return this.name === "NAND" && this.definitionStatements == null;
  }

  public isBitin(): boolean {
    return this.name === "BITIN" && this.definitionStatements == null;
  }

  public isBitout(): boolean {
    return this.name === "BITOUT" && this.definitionStatements == null;
  }

  public isFlipflop(): boolean {
    return this.name === "FLIPFLOP" && this.definitionStatements == null;
  }

  public isUserDefined(): boolean {
    return (this.definitionStatements?.length ?? 0) > 0;
  }
}

export class Variable {
  public readonly name: string;
  public readonly module: Module;
  public readonly inPorts: Map<string, Reactive<boolean>> = new Map();
  public readonly outPorts: Map<string, Reactive<boolean>> = new Map();

  constructor(
    private variableStatement: Extract<SubStatement, { type: "varStatement" }>,
  ) {
    this.name = variableStatement.variableName;
    // TODO: module definition statements
    this.module = new Module(variableStatement.moduleName);
  }
}
