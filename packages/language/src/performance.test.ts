import { describe, expect, test } from "vitest";
import { program as parseProgram } from "./parser/program";
import { Vm } from "./vm";
import {
  NOT,
  AND,
  OR,
  NOR,
  XOR,
  XNOR,
  AND3,
  OR3,
  ADD,
  DEC,
  ENC,
  DLATCH,
} from "./code-fragments";

// Lv19 (Byte Memory) equivalent: the largest puzzle with ~11K chars, 49 module defs
const moduleDefs = `${NOT}${AND}${OR}${NOR}${XOR}${XNOR}${AND3}${OR3}${ADD}${DEC}${ENC}${DLATCH}`;
const lv19Code = `${moduleDefs}VAR d BYTEIN
VAR w BITIN
VAR q BYTEOUT
VAR ds BYTESPLIT
WIRE d _ TO ds _
VAR qm BYTEMERGE
WIRE qm _ TO q _
VAR dl0 DLATCH
WIRE ds o0 TO dl0 d
WIRE w _ TO dl0 e
WIRE dl0 _ TO qm i0
VAR dl1 DLATCH
WIRE ds o1 TO dl1 d
WIRE w _ TO dl1 e
WIRE dl1 _ TO qm i1
VAR dl2 DLATCH
WIRE ds o2 TO dl2 d
WIRE w _ TO dl2 e
WIRE dl2 _ TO qm i2
VAR dl3 DLATCH
WIRE ds o3 TO dl3 d
WIRE w _ TO dl3 e
WIRE dl3 _ TO qm i3
VAR dl4 DLATCH
WIRE ds o4 TO dl4 d
WIRE w _ TO dl4 e
WIRE dl4 _ TO qm i4
VAR dl5 DLATCH
WIRE ds o5 TO dl5 d
WIRE w _ TO dl5 e
WIRE dl5 _ TO qm i5
VAR dl6 DLATCH
WIRE ds o6 TO dl6 d
WIRE w _ TO dl6 e
WIRE dl6 _ TO qm i6
VAR dl7 DLATCH
WIRE ds o7 TO dl7 d
WIRE w _ TO dl7 e
WIRE dl7 _ TO qm i7
`;

describe("performance", () => {
  test("parse completes within 100ms for Lv19-scale code (~11K chars)", () => {
    const start = performance.now();
    const result = parseProgram(lv19Code);
    const elapsed = performance.now() - start;

    expect(result.success).toBe(true);
    expect(elapsed).toBeLessThan(100);
  });

  test("VM compile completes within 100ms for Lv19-scale code", () => {
    const vm = new Vm();
    const start = performance.now();
    vm.compile(lv19Code);
    const elapsed = performance.now() - start;

    expect(elapsed).toBeLessThan(100);
  });

  test("VM run completes within 10ms for Lv19-scale code", () => {
    const vm = new Vm();
    vm.compile(lv19Code);

    const inputs = new Map<string, boolean | number>([
      ["d", 42],
      ["w", true],
    ]);

    const start = performance.now();
    const outputs = vm.run(inputs);
    const elapsed = performance.now() - start;

    expect(outputs.get("q")).toBe(42);
    expect(elapsed).toBeLessThan(10);
  });

  test("full cycle (parse + compile + run) completes within 200ms", () => {
    const start = performance.now();

    const parseResult = parseProgram(lv19Code);
    expect(parseResult.success).toBe(true);

    const vm = new Vm();
    vm.compile(lv19Code);
    const outputs = vm.run(
      new Map<string, boolean | number>([
        ["d", 255],
        ["w", true],
      ]),
    );
    const elapsed = performance.now() - start;

    expect(outputs.get("q")).toBe(255);
    expect(elapsed).toBeLessThan(200);
  });
});
