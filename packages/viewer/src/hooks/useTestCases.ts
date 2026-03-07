import { useState, useCallback, useRef, useEffect } from "react";
import { Vm } from "@nandlang-ts/language/vm";
import type { PuzzleTestCase } from "../lib/puzzles";

export type TestCase = {
  inputs: Map<string, boolean>;
  expectedOutputs: Map<string, boolean>;
  actualOutputs: Map<string, boolean> | null;
  status: "idle" | "pass" | "fail";
};

export function useTestCases(code: string | null) {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const vmRef = useRef<Vm | null>(null);

  const loadTestCases = useCallback((puzzleTestCases: PuzzleTestCase[]) => {
    setTestCases(
      puzzleTestCases.map((ptc) => ({
        inputs: new Map(ptc.inputs),
        expectedOutputs: new Map(ptc.expectedOutputs),
        actualOutputs: null,
        status: "idle" as const,
      })),
    );
  }, []);

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

  const allPassed =
    testCases.length > 0 && testCases.every((tc) => tc.status === "pass");

  return {
    testCases,
    loadTestCases,
    runAll,
    resetResults,
    allPassed,
  };
}
