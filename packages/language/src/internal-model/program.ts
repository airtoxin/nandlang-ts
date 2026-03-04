import { Program as ProgramAst } from "../parser/ast";
import { BitinModule, BitoutModule, createModule, NandModule } from "./module";
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
      [new NandModule(), new BitinModule(), new BitoutModule()],
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
}
