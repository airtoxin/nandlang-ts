import { useState, useCallback, useRef, useEffect } from "react";
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

  const runIndexRef = useRef<number | null>(null);
  const runVmRef = useRef<Vm | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runStep = useCallback(() => {
    const idx = runIndexRef.current;
    const vm = runVmRef.current;
    if (idx === null || !vm) return;

    setTestCases((prev) => {
      if (idx >= prev.length) {
        runIndexRef.current = null;
        return prev;
      }
      const tc = prev[idx];
      const actualOutputs = vm.run(tc.inputs);
      const pass = [...tc.expectedOutputs.entries()].every(
        ([name, expected]) => actualOutputs.get(name) === expected,
      );
      const result = [...prev];
      result[idx] = { ...tc, actualOutputs, status: pass ? "pass" : "fail" };

      if (pass && idx + 1 < prev.length) {
        runIndexRef.current = idx + 1;
        timerRef.current = setTimeout(runStep, 50);
      } else {
        runIndexRef.current = null;
      }

      return result;
    });
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const runAll = useCallback(() => {
    if (!code) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    try {
      const vm = new Vm();
      vm.compile(code);
      vmRef.current = vm;
      runVmRef.current = vm;

      // Reset all to idle before starting
      setTestCases((prev) =>
        prev.map((tc) => ({ ...tc, actualOutputs: null, status: "idle" as const })),
      );
      runIndexRef.current = 0;
      timerRef.current = setTimeout(runStep, 50);
    } catch {
      setTestCases((prev) =>
        prev.map((tc, i) =>
          i === 0
            ? { ...tc, actualOutputs: null, status: "fail" as const }
            : tc,
        ),
      );
    }
  }, [code, runStep]);

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
