import { expect, test } from "vitest";
import {
  bitinModule,
  bitoutModule,
  nandModule,
  run,
  secretBitinPort,
  secretBitoutPort,
} from "./module";

test("nandModule", () => {
  const nand = nandModule.createVariable("nand");

  nand.inPorts?.get("i0")?.set(false);
  nand.inPorts?.get("i1")?.set(false);
  expect(nand.outPorts?.get("o0")?.get()).toBe(true);

  nand.inPorts?.get("i0")?.set(true);
  nand.inPorts?.get("i1")?.set(false);
  expect(nand.outPorts?.get("o0")?.get()).toBe(true);

  nand.inPorts?.get("i0")?.set(false);
  nand.inPorts?.get("i1")?.set(true);
  expect(nand.outPorts?.get("o0")?.get()).toBe(true);

  nand.inPorts?.get("i0")?.set(true);
  nand.inPorts?.get("i1")?.set(true);
  expect(nand.outPorts?.get("o0")?.get()).toBe(false);
});

test("bitinModule", () => {
  const bitin = bitinModule.createVariable("in");

  expect(bitin.outPorts?.get("o0")?.get()).toBe(false);

  bitin[secretBitinPort]?.set(true);
  expect(bitin.outPorts?.get("o0")?.get()).toBe(true);

  bitin[secretBitinPort]?.set(false);
  expect(bitin.outPorts?.get("o0")?.get()).toBe(false);
});

test("bitoutModule", () => {
  const bitout = bitoutModule.createVariable("out");

  expect(bitout[secretBitoutPort]?.get()).toBe(false);

  bitout.inPorts?.get("i0")?.set(true);
  expect(bitout[secretBitoutPort]?.get()).toBe(true);

  bitout.inPorts?.get("i0")?.set(false);
  expect(bitout[secretBitoutPort]?.get()).toBe(false);
});

test("run", () => {
  expect(
    run(
      nandModule.createVariable("_"),
      new Map([
        ["i0", true],
        ["i1", true],
      ]),
    ),
  ).toEqual(new Map([["o0", false]]));
});
