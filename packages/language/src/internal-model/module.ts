import { Reactive, reactive } from "@reactively/core";
import { nand } from "./gate";
import { Variable } from "./variable";
import { SubStatement } from "../parser/ast";
import invariant from "tiny-invariant";

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

export class ByteinModule implements Module {
  public readonly name = "BYTEIN";

  public createVariable(varName: string): Variable {
    const bytePorts: Reactive<boolean>[] = [];
    for (let i = 0; i < 8; i++) {
      bytePorts.push(reactive(false));
    }
    return new Variable(
      varName, new Map(), new Map(), [],
      new Map(), new Map([["byte", bytePorts]]),
    );
  }
}

export class ByteoutModule implements Module {
  public readonly name = "BYTEOUT";

  public createVariable(varName: string): Variable {
    const bytePorts: Reactive<boolean>[] = [];
    for (let i = 0; i < 8; i++) {
      bytePorts.push(reactive(false));
    }
    return new Variable(
      varName, new Map(), new Map(), [],
      new Map([["byte", bytePorts]]), new Map(),
    );
  }
}

export class BytesplitModule implements Module {
  public readonly name = "BYTESPLIT";

  public createVariable(varName: string): Variable {
    const byteIn: Reactive<boolean>[] = [];
    const outPorts = new Map<string, Reactive<boolean>>();
    for (let i = 0; i < 8; i++) {
      const inBit = reactive(false);
      byteIn.push(inBit);
      outPorts.set(`o${i}`, reactive(() => inBit.value));
    }
    return new Variable(
      varName, new Map(), outPorts, [],
      new Map([["byte", byteIn]]), new Map(),
    );
  }
}

export class BytemergeModule implements Module {
  public readonly name = "BYTEMERGE";

  public createVariable(varName: string): Variable {
    const inPorts = new Map<string, Reactive<boolean>>();
    const byteOut: Reactive<boolean>[] = [];
    for (let i = 0; i < 8; i++) {
      const inBit = reactive(false);
      inPorts.set(`i${i}`, inBit);
      byteOut.push(reactive(() => inBit.value));
    }
    return new Variable(
      varName, inPorts, new Map(), [],
      new Map(), new Map([["byte", byteOut]]),
    );
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

export class CounterModule implements Module {
  public readonly name = "COUNTER";

  public createVariable(varName: string): Variable {
    const reset = reactive(false);
    const inc = reactive(false);
    const loadBits: Reactive<boolean>[] = [];
    for (let i = 0; i < 8; i++) {
      loadBits.push(reactive(false));
    }

    let state = 0;

    const countBits: Reactive<boolean>[] = [];
    for (let i = 0; i < 8; i++) {
      countBits.push(reactive(false));
    }

    const variable = new Variable(
      varName,
      new Map([
        ["reset", reset],
        ["inc", inc],
      ]),
      new Map(),
      [],
      new Map([["load", loadBits]]),
      new Map([["count", countBits]]),
    );

    variable.onBeforeRead = () => {
      const r = reset.value;
      const n = inc.value;
      let loadVal = 0;
      for (let j = 0; j < 8; j++) {
        if (loadBits[j].value) loadVal |= (1 << j);
      }

      if (r) {
        state = 0;
      } else if (loadVal !== 0) {
        state = loadVal;
      } else if (n) {
        state = (state + 1) & 0xFF;
      }

      for (let i = 0; i < 8; i++) {
        const bit = ((state >> i) & 1) === 1;
        countBits[i].set(() => bit);
      }
    };

    return variable;
  }
}

export class RamModule implements Module {
  public readonly name: string;
  private readonly addressBits: number;

  constructor(addressBits: number) {
    this.addressBits = addressBits;
    this.name = "RAM" + (1 << addressBits);
  }

  public createVariable(varName: string): Variable {
    const addrPorts: Reactive<boolean>[] = [];
    for (let i = 0; i < this.addressBits; i++) {
      addrPorts.push(reactive(false));
    }
    const we = reactive(false);

    const dataBits: Reactive<boolean>[] = [];
    for (let i = 0; i < 8; i++) {
      dataBits.push(reactive(false));
    }

    const outBits: Reactive<boolean>[] = [];
    for (let i = 0; i < 8; i++) {
      outBits.push(reactive(false));
    }

    const memory = new Uint8Array(1 << this.addressBits);

    const inPorts = new Map<string, Reactive<boolean>>();
    for (let i = 0; i < this.addressBits; i++) {
      inPorts.set(`a${i}`, addrPorts[i]);
    }
    inPorts.set("we", we);

    const variable = new Variable(
      varName,
      inPorts,
      new Map(),
      [],
      new Map([["data", dataBits]]),
      new Map([["out", outBits]]),
    );

    variable.onBeforeRead = () => {
      let addr = 0;
      for (let i = 0; i < this.addressBits; i++) {
        if (addrPorts[i].value) addr |= (1 << i);
      }

      if (we.value) {
        let dataVal = 0;
        for (let j = 0; j < 8; j++) {
          if (dataBits[j].value) dataVal |= (1 << j);
        }
        memory[addr] = dataVal;
      }

      const val = memory[addr];
      for (let i = 0; i < 8; i++) {
        const bit = ((val >> i) & 1) === 1;
        outBits[i].set(() => bit);
      }
    };

    variable.getMemoryDump = () => new Uint8Array(memory);

    return variable;
  }
}

export const createModule = (
  moduleStatement: Extract<SubStatement, { type: "moduleStatement" }>,
  availableModules: Module[],
): new () => Module => {
  const modules = [...availableModules];
  const C = class implements Module {
    public readonly name = moduleStatement.name;

    public createVariable(varName: string): Variable {
      const variables: Variable[] = [];
      const bitIns = new Map<string, Reactive<boolean>>();
      const bitOuts = new Map<string, Reactive<boolean>>();
      const byteIns = new Map<string, Reactive<boolean>[]>();
      const byteOuts = new Map<string, Reactive<boolean>[]>();
      for (const statement of moduleStatement.definitionStatements) {
        if (statement.subtype.type === "varStatement") {
          const moduleName = statement.subtype.moduleName;
          const module = modules.find((m) => m.name === moduleName);
          invariant(
            module,
            `Can't find module definition ${moduleName} of variable ${statement.subtype.variableName}`,
          );

          const variable = module.createVariable(
            statement.subtype.variableName,
          );
          variables.push(variable);

          if (module instanceof BitinModule) {
            const port = variable.outPorts.get("o0");
            invariant(port, "Can't find port o0 of BITIN");
            bitIns.set(variable.name, port);
          } else if (module instanceof BitoutModule) {
            const port = variable.inPorts.get("i0");
            invariant(port, "Can't find port i0 of BITIN");
            bitOuts.set(variable.name, port);
          } else if (module instanceof ByteinModule) {
            const ports = variable.byteOutPorts.get("byte");
            invariant(ports, `Can't find byte port of BYTEIN`);
            byteIns.set(variable.name, ports);
          } else if (module instanceof ByteoutModule) {
            const ports = variable.byteInPorts.get("byte");
            invariant(ports, `Can't find byte port of BYTEOUT`);
            byteOuts.set(variable.name, ports);
          }
        } else if (statement.subtype.type === "wireStatement") {
          const {
            srcVariableName,
            srcPortName,
            destVariableName,
            destPortName,
          } = statement.subtype;

          const srcVar = variables.find((v) => v.name === srcVariableName);
          invariant(
            srcVar,
            `wire source variable not found: ${srcVariableName}`,
          );
          const destVar = variables.find((v) => v.name === destVariableName);
          invariant(
            destVar,
            `wire destination variable not found: ${destVariableName}`,
          );

          // Resolve source port(s) - may be BIT (single) or BYTE (8-bit array)
          const srcResolved = resolveSrcPort(srcVar, srcPortName);

          if (srcResolved.type === "bit") {
            // BIT wire: resolve destination as BIT
            const destPort = resolveDestBitPort(destVar, destPortName);
            // TODO: Depends on the internal specifications of the reactively lib.
            if (destPort["fn"] != null)
              throw new Error(
                `destination port ${destPortName} of ${destVar.name} already wired`,
              );
            destPort.set(() => srcResolved.port.value);
          } else {
            // BYTE wire: resolve destination as BYTE
            const destPorts = resolveDestBytePorts(destVar, destPortName);
            for (let i = 0; i < 8; i++) {
              // TODO: Depends on the internal specifications of the reactively lib.
              if (destPorts[i]["fn"] != null)
                throw new Error(
                  `destination byte port bit ${i} of ${destVar.name} already wired`,
                );
              const srcBit = srcResolved.ports[i];
              destPorts[i].set(() => srcBit.value);
            }
          }
        } else if (statement.subtype.type === "moduleStatement") {
          const Udm = createModule(statement.subtype, [...modules]);
          modules.push(new Udm());
        }
      }

      return new Variable(varName, bitIns, bitOuts, variables, byteIns, byteOuts);
    }
  };
  Object.defineProperty(C, "name", { value: moduleStatement.name });
  return C;
};

type BitPort = { type: "bit"; port: Reactive<boolean> };
type BytePort = { type: "byte"; ports: Reactive<boolean>[] };

function resolveSrcPort(
  srcVar: Variable,
  portName: string,
): BitPort | BytePort {
  if (portName !== "_") {
    const bitPort = srcVar.outPorts.get(portName);
    if (bitPort) return { type: "bit", port: bitPort };
    const bytePorts = srcVar.byteOutPorts.get(portName);
    if (bytePorts) return { type: "byte", ports: bytePorts };
    throw new Error(`Unknown output port name: ${portName} of variable: ${srcVar.name}`);
  }
  // Wildcard "_": determine unambiguously
  const bitCount = srcVar.outPorts.size;
  const byteCount = srcVar.byteOutPorts.size;
  if (bitCount === 1 && byteCount === 0) {
    return { type: "bit", port: srcVar.outPorts.values().next().value! };
  }
  if (byteCount === 1 && bitCount === 0) {
    return { type: "byte", ports: srcVar.byteOutPorts.values().next().value! };
  }
  throw new Error(`Can't determine src port name of variable: ${srcVar.name}`);
}

function resolveDestBitPort(
  destVar: Variable,
  portName: string,
): Reactive<boolean> {
  if (portName !== "_") {
    const port = destVar.inPorts.get(portName);
    if (port) return port;
    // Check if the port name matches a byte port → type mismatch
    if (destVar.byteInPorts.has(portName)) {
      throw new Error(`Type mismatch: cannot wire BIT source to BYTE port "${portName}" of ${destVar.name}`);
    }
    throw new Error(`Unknown input port name: ${portName} of variable: ${destVar.name}`);
  }
  if (destVar.inPorts.size === 1 && destVar.byteInPorts.size === 0) {
    return destVar.inPorts.values().next().value!;
  }
  if (destVar.inPorts.size === 0 && destVar.byteInPorts.size > 0) {
    throw new Error(`Type mismatch: cannot wire BIT source to BYTE destination ${destVar.name} (use BYTEMERGE to convert)`);
  }
  throw new Error(`Can't determine dest port name of variable: ${destVar.name}`);
}

function resolveDestBytePorts(
  destVar: Variable,
  portName: string,
): Reactive<boolean>[] {
  if (portName !== "_") {
    const bytePorts = destVar.byteInPorts.get(portName);
    if (bytePorts) return bytePorts;
    // Check if the port name matches a bit port → type mismatch
    if (destVar.inPorts.has(portName)) {
      throw new Error(`Type mismatch: cannot wire BYTE source to BIT port "${portName}" of ${destVar.name}`);
    }
    throw new Error(`Unknown byte input port name: ${portName} of variable: ${destVar.name}`);
  }
  if (destVar.byteInPorts.size === 1) {
    return destVar.byteInPorts.values().next().value!;
  }
  if (destVar.byteInPorts.size === 0 && destVar.inPorts.size > 0) {
    throw new Error(`Type mismatch: cannot wire BYTE source to BIT destination ${destVar.name} (use BYTESPLIT to convert)`);
  }
  throw new Error(`Can't determine byte dest port name of variable: ${destVar.name}`);
}
