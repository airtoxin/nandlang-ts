import { reactive, Reactive } from "@reactively/core";
import { nand } from "./gate";

export type Module = {
  name: string;
  modules?: Module[];
  createVariable: (name: string) => Variable;
};

export const secretBitinPort = Symbol();
export const secretBitoutPort = Symbol();

export type Variable = {
  name: string;
  inPorts?: Map<string, Reactive<boolean>>;
  outPorts?: Map<string, Reactive<boolean>>;
  [secretBitinPort]?: Reactive<boolean>;
  [secretBitoutPort]?: Reactive<boolean>;
};

export const nandModule: Module = {
  name: "NAND",
  createVariable: (name) => {
    const nandIn0 = reactive(false);
    const nandIn1 = reactive(false);
    return {
      name,
      inPorts: new Map([
        ["i0", nandIn0],
        ["i1", nandIn1],
      ]),
      outPorts: new Map([
        ["o0", reactive(() => nand(nandIn0.get(), nandIn1.get()))],
      ]),
    };
  },
};

export const bitinModule: Module = {
  name: "BITIN",
  createVariable: (name) => {
    const port = reactive(false);
    return {
      name,
      [secretBitinPort]: port,
      outPorts: new Map([["o0", port]]),
    };
  },
};

export const bitoutModule: Module = {
  name: "BITOUT",
  createVariable: (name) => {
    const port = reactive(false);
    return {
      name,
      inPorts: new Map([["i0", port]]),
      [secretBitoutPort]: port,
    };
  },
};

export const run = (
  variable: Variable,
  portSignals: Map<string, boolean>,
): Map<string, boolean> => {
  for (const [portName, signal] of portSignals.entries()) {
    variable.inPorts?.get(portName)?.set(signal);
  }

  return new Map(
    Array.from(variable.outPorts?.entries() ?? []).map(
      ([portName, reactive]) => [portName, reactive.get()],
    ),
  );
};
