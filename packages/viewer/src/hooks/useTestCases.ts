import { useState, useCallback, useRef } from "react";
import { Vm } from "@nandlang-ts/language/vm";

export type TestCase = {
  inputs: Map<string, boolean>;
  expectedOutputs: Map<string, boolean>;
  actualOutputs: Map<string, boolean> | null;
  status: "idle" | "pass" | "fail";
};

export function useTestCases(
  code: string | null,
  inputNames: string[],
  outputNames: string[],
) {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const vmRef = useRef<Vm | null>(null);

  const addTestCase = useCallback(() => {
    const inputs = new Map<string, boolean>();
    for (const name of inputNames) inputs.set(name, false);
    const expectedOutputs = new Map<string, boolean>();
    for (const name of outputNames) expectedOutputs.set(name, false);
    setTestCases((prev) => [
      ...prev,
      { inputs, expectedOutputs, actualOutputs: null, status: "idle" },
    ]);
  }, [inputNames, outputNames]);

  const removeTestCase = useCallback((index: number) => {
    setTestCases((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const toggleInput = useCallback(
    (index: number, name: string) => {
      setTestCases((prev) =>
        prev.map((tc, i) => {
          if (i !== index) return tc;
          const inputs = new Map(tc.inputs);
          inputs.set(name, !inputs.get(name));
          return { ...tc, inputs, actualOutputs: null, status: "idle" as const };
        }),
      );
    },
    [],
  );

  const toggleExpectedOutput = useCallback(
    (index: number, name: string) => {
      setTestCases((prev) =>
        prev.map((tc, i) => {
          if (i !== index) return tc;
          const expectedOutputs = new Map(tc.expectedOutputs);
          expectedOutputs.set(name, !expectedOutputs.get(name));
          return { ...tc, expectedOutputs, actualOutputs: null, status: "idle" as const };
        }),
      );
    },
    [],
  );

  const runAll = useCallback(() => {
    if (!code) return;
    try {
      const vm = new Vm();
      vm.compile(code);
      vmRef.current = vm;

      setTestCases((prev) =>
        prev.map((tc) => {
          const actualOutputs = vm.run(tc.inputs);
          const pass = [...tc.expectedOutputs.entries()].every(
            ([name, expected]) => actualOutputs.get(name) === expected,
          );
          return {
            ...tc,
            actualOutputs,
            status: pass ? ("pass" as const) : ("fail" as const),
          };
        }),
      );
    } catch {
      // compilation error — mark all as fail
      setTestCases((prev) =>
        prev.map((tc) => ({ ...tc, actualOutputs: null, status: "fail" as const })),
      );
    }
  }, [code]);

  const resetResults = useCallback(() => {
    setTestCases((prev) =>
      prev.map((tc) => ({ ...tc, actualOutputs: null, status: "idle" as const })),
    );
  }, []);

  return {
    testCases,
    addTestCase,
    removeTestCase,
    toggleInput,
    toggleExpectedOutput,
    runAll,
    resetResults,
  };
}
