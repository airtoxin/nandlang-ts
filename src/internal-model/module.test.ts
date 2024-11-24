import { describe, expect, test } from "vitest";
import { NandModule } from "./module";

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
