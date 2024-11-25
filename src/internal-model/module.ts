import { reactive } from "@reactively/core";
import { nand } from "./gate";
import { Variable } from "./variable";

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
