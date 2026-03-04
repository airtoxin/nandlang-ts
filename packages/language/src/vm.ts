import { program as parseProgram } from "./parser/program";
import { Program } from "./internal-model/program";

export class Vm {
  private program: Program | null = null;

  public compile(programString: string): void {
    const parseResult = parseProgram([...programString]);
    if (!parseResult.success)
      throw new Error(
        `Program parse error, near ...${parseResult.rest.slice(0, 20).join("")}...`,
      );

    this.program = new Program(parseResult.data);
  }

  public run(inputSignals: Map<string, boolean>): Map<string, boolean> {
    if (this.program == null) throw new Error(`No program compiled to run`);
    return this.program.run(inputSignals);
  }
}
