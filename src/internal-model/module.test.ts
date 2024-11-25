import { describe, expect, test } from "vitest";
import { FlipflopModule, NandModule } from "./module";

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
