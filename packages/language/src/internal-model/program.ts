import { Program as ProgramAst } from "../parser/ast";
import { BitinModule, BitoutModule, createModule, FlipflopModule, NandModule } from "./module";
import { Variable } from "./variable";

export class Program {
  private variable: Variable;

  constructor(private programAst: ProgramAst) {
    const ProgramModule = createModule(
      {
        type: "moduleStatement",
        name: "Program",
        definitionStatements: this.programAst.statements,
      },
      [new NandModule(), new BitinModule(), new BitoutModule(), new FlipflopModule()],
    );
    this.variable = new ProgramModule().createVariable("PROGRAM");
  }

  public run(inputSignals: Map<string, boolean>): Map<string, boolean> {
    for (const [name, value] of inputSignals.entries()) {
      this.variable.inPorts.get(name)?.set(() => value);
    }

    const outputSignals = new Map<string, boolean>();
    for (const [name, port] of this.variable.outPorts.entries()) {
      outputSignals.set(name, port.value);
    }

    return outputSignals;
  }

  public getAllSignals(): Map<string, boolean> {
    const signals = new Map<string, boolean>();
    for (const child of this.variable.children) {
      for (const [portName, port] of child.outPorts.entries()) {
        signals.set(`${child.name}.${portName}`, port.value);
      }
    }
    return signals;
  }
}
