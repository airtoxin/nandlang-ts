import { Program as ProgramAst } from "../parser/ast";
import { BitinModule, BitoutModule, ByteinModule, BytemergeModule, ByteoutModule, BytesplitModule, createModule, FlipflopModule, NandModule } from "./module";
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
      [new NandModule(), new BitinModule(), new BitoutModule(), new ByteinModule(), new ByteoutModule(), new BytesplitModule(), new BytemergeModule(), new FlipflopModule()],
    );
    this.variable = new ProgramModule().createVariable("PROGRAM");
  }

  public run(inputSignals: Map<string, boolean | number>): Map<string, boolean | number> {
    for (const [name, value] of inputSignals.entries()) {
      if (typeof value === "boolean") {
        this.variable.inPorts.get(name)?.set(() => value);
      } else {
        const ports = this.variable.byteInPorts.get(name);
        if (ports) {
          for (let i = 0; i < 8; i++) {
            const bit = ((value >> i) & 1) === 1;
            ports[i].set(() => bit);
          }
        }
      }
    }

    const outputSignals = new Map<string, boolean | number>();
    for (const [name, port] of this.variable.outPorts.entries()) {
      outputSignals.set(name, port.value);
    }
    for (const [name, ports] of this.variable.byteOutPorts.entries()) {
      let value = 0;
      for (let i = 0; i < 8; i++) {
        if (ports[i].value) value |= (1 << i);
      }
      outputSignals.set(name, value);
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
