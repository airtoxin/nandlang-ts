import { describe, expect, test } from "vitest";
import {
  BitinModule,
  BitoutModule,
  createModule,
  FlipflopModule,
  NandModule,
  RamModule,
} from "./module";
import { nand } from "./gate";

describe("NandModule", () => {
  test("succeeds with nand conditions", () => {
    const nandModule = new NandModule();
    const nandVar = nandModule.createVariable("nand");
    // false,false -> true
    nandVar.inPorts.get("i0")!.set(false);
    nandVar.inPorts.get("i1")!.set(false);
    expect(nandVar.outPorts.get("o0")!.value).toBe(true);
    // false,true -> true
    nandVar.inPorts.get("i0")!.set(false);
    nandVar.inPorts.get("i1")!.set(true);
    expect(nandVar.outPorts.get("o0")!.value).toBe(true);
    // true,true -> false
    nandVar.inPorts.get("i0")!.set(true);
    nandVar.inPorts.get("i1")!.set(true);
    expect(nandVar.outPorts.get("o0")!.value).toBe(false);
  });
});

describe("FlipflopModule", () => {
  test("succeeds with flipflop state", () => {
    const ffModule = new FlipflopModule();
    const ffVar = ffModule.createVariable("ff");
    // s=false,r=false -> false
    ffVar.inPorts.get("s")!.set(false);
    ffVar.inPorts.get("r")!.set(false);
    expect(ffVar.outPorts.get("q")!.value).toBe(false);
    // s=true,r=false -> true (set true)
    ffVar.inPorts.get("s")!.set(true);
    ffVar.inPorts.get("r")!.set(false);
    expect(ffVar.outPorts.get("q")!.value).toBe(true);
    // s=false,r=false -> true (hold true)
    ffVar.inPorts.get("s")!.set(false);
    ffVar.inPorts.get("r")!.set(false);
    expect(ffVar.outPorts.get("q")!.value).toBe(true);
    // s=false,r=false -> true (hold true)
    ffVar.inPorts.get("s")!.set(false);
    ffVar.inPorts.get("r")!.set(false);
    expect(ffVar.outPorts.get("q")!.value).toBe(true);
    // s=false,r=true -> false (set false)
    ffVar.inPorts.get("s")!.set(false);
    ffVar.inPorts.get("r")!.set(true);
    expect(ffVar.outPorts.get("q")!.value).toBe(false);
    // s=false,r=false -> true (hold false)
    ffVar.inPorts.get("s")!.set(false);
    ffVar.inPorts.get("r")!.set(false);
    expect(ffVar.outPorts.get("q")!.value).toBe(false);
    // s=false,r=false -> true (hold false)
    ffVar.inPorts.get("s")!.set(false);
    ffVar.inPorts.get("r")!.set(false);
    expect(ffVar.outPorts.get("q")!.value).toBe(false);
    // s=true,r=true -> ERROR
    ffVar.inPorts.get("s")!.set(true);
    ffVar.inPorts.get("r")!.set(true);
    expect(() => ffVar.outPorts.get("q")!.value).toThrowError();
  });
});

describe("RamModule", () => {
  function setAddr(v: ReturnType<RamModule["createVariable"]>, bits: boolean[]) {
    for (let i = 0; i < bits.length; i++) {
      v.inPorts.get(`a${i}`)!.set(bits[i]);
    }
  }

  function setData(v: ReturnType<RamModule["createVariable"]>, val: number) {
    const ports = v.byteInPorts.get("data")!;
    for (let i = 0; i < 8; i++) {
      ports[i].set(() => ((val >> i) & 1) === 1);
    }
  }

  function readOut(v: ReturnType<RamModule["createVariable"]>): number {
    v.invokeBeforeRead();
    const ports = v.byteOutPorts.get("out")!;
    let val = 0;
    for (let i = 0; i < 8; i++) {
      if (ports[i].value) val |= (1 << i);
    }
    return val;
  }

  test("RAM2: initial value is 0", () => {
    const mod = new RamModule(1);
    const v = mod.createVariable("ram");
    setAddr(v, [false]);
    v.inPorts.get("we")!.set(false);
    expect(readOut(v)).toBe(0);
    setAddr(v, [true]);
    expect(readOut(v)).toBe(0);
  });

  test("RAM2: write and read", () => {
    const mod = new RamModule(1);
    const v = mod.createVariable("ram");
    // Write 42 to addr 0
    setAddr(v, [false]);
    setData(v, 42);
    v.inPorts.get("we")!.set(true);
    expect(readOut(v)).toBe(42);
    // Read addr 0 without write
    v.inPorts.get("we")!.set(false);
    expect(readOut(v)).toBe(42);
    // Write 99 to addr 1
    setAddr(v, [true]);
    setData(v, 99);
    v.inPorts.get("we")!.set(true);
    expect(readOut(v)).toBe(99);
    // Read addr 0 still has 42
    setAddr(v, [false]);
    v.inPorts.get("we")!.set(false);
    expect(readOut(v)).toBe(42);
    // Read addr 1 still has 99
    setAddr(v, [true]);
    expect(readOut(v)).toBe(99);
  });

  test("RAM2: we=0 does not write", () => {
    const mod = new RamModule(1);
    const v = mod.createVariable("ram");
    setAddr(v, [false]);
    setData(v, 123);
    v.inPorts.get("we")!.set(false);
    expect(readOut(v)).toBe(0);
  });

  test("RAM4: multiple addresses are independent", () => {
    const mod = new RamModule(2);
    const v = mod.createVariable("ram");
    // Write different values to all 4 addresses
    for (let addr = 0; addr < 4; addr++) {
      setAddr(v, [(addr & 1) === 1, (addr & 2) === 2]);
      setData(v, (addr + 1) * 10);
      v.inPorts.get("we")!.set(true);
      readOut(v);
    }
    // Read back and verify
    v.inPorts.get("we")!.set(false);
    for (let addr = 0; addr < 4; addr++) {
      setAddr(v, [(addr & 1) === 1, (addr & 2) === 2]);
      expect(readOut(v)).toBe((addr + 1) * 10);
    }
  });

  test("RAM16: write and read across addresses", () => {
    const mod = new RamModule(4);
    const v = mod.createVariable("ram");
    // Write to addr 15
    setAddr(v, [true, true, true, true]);
    setData(v, 255);
    v.inPorts.get("we")!.set(true);
    expect(readOut(v)).toBe(255);
    // Addr 0 is still 0
    setAddr(v, [false, false, false, false]);
    v.inPorts.get("we")!.set(false);
    expect(readOut(v)).toBe(0);
    // Addr 15 still has 255
    setAddr(v, [true, true, true, true]);
    expect(readOut(v)).toBe(255);
  });
});

describe("createModule", () => {
  test("succeeds with custom module", () => {
    const DynamicModule = createModule(
      {
        type: "moduleStatement",
        name: "DYNAMIC_IO",
        definitionStatements: [
          {
            type: "statement",
            subtype: {
              type: "varStatement",
              variableName: "in",
              moduleName: "BITIN",
            },
          },
          {
            type: "statement",
            subtype: {
              type: "varStatement",
              variableName: "out",
              moduleName: "BITOUT",
            },
          },
          {
            type: "statement",
            subtype: {
              type: "wireStatement",
              srcVariableName: "in",
              srcPortName: "_",
              destVariableName: "out",
              destPortName: "_",
            },
          },
        ],
      },
      [new NandModule(), new BitinModule(), new BitoutModule()],
    );
    const dynamicModule = new DynamicModule();
    expect(dynamicModule).toMatchInlineSnapshot(`
      DYNAMIC_IO {
        "name": "DYNAMIC_IO",
      }
    `);
    const dyn = dynamicModule.createVariable("dyn");
    dyn.inPorts.get("in")?.set(true);
    expect(dyn.outPorts.get("out")?.value).toBe(true);
    dyn.inPorts.get("in")?.set(false);
    expect(dyn.outPorts.get("out")?.value).toBe(false);
  });
});
