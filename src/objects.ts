import { reactive, Reactive } from "@reactively/core";
import { nand } from "./gate";

export type Module = {
  name: string;
  createVariable: (name: string) => Variable;
};

const bitinIn = Symbol();
const bitoutOut = Symbol();

export type Variable = {
  name: string;
  inPorts?: Map<string, Reactive<boolean>>;
  outPorts?: Map<string, Reactive<boolean>>;
  [bitinIn]?: Reactive<boolean>;
  [bitoutOut]?: Reactive<boolean>;
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
      [bitinIn]: port,
      outPorts: new Map([["o0", port]]),
    };
  },
};

export const getSecretInPort = (
  bitinVar: Variable,
): Reactive<boolean> | undefined => bitinVar[bitinIn];

export const bitoutModule: Module = {
  name: "BITOUT",
  createVariable: (name) => {
    const port = reactive(false);
    return {
      name,
      inPorts: new Map([["i0", port]]),
      [bitoutOut]: port,
    };
  },
};

export const getSecretOutPort = (
  bitoutVar: Variable,
): Reactive<boolean> | undefined => bitoutVar[bitoutOut];
