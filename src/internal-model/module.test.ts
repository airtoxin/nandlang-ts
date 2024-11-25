import { describe, expect, test } from "vitest";
import {
  BitinModule,
  BitoutModule,
  createModule,
  FlipflopModule,
  NandModule,
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
