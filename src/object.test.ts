import { expect, test } from "vitest";
import {
  bitinModule,
  bitoutModule,
  getSecretInPort,
  getSecretOutPort,
  nandModule,
} from "./objects";

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

  getSecretInPort(bitin)?.set(true);
  expect(bitin.outPorts?.get("o0")?.get()).toBe(true);

  getSecretInPort(bitin)?.set(false);
  expect(bitin.outPorts?.get("o0")?.get()).toBe(false);
});

test("bitoutModule", () => {
  const bitout = bitoutModule.createVariable("out");

  expect(getSecretOutPort(bitout)?.get()).toBe(false);

  bitout.inPorts?.get("i0")?.set(true);
  expect(getSecretOutPort(bitout)?.get()).toBe(true);

  bitout.inPorts?.get("i0")?.set(false);
  expect(getSecretOutPort(bitout)?.get()).toBe(false);
});
