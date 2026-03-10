import { useState, useCallback, useRef, useEffect } from "react";
import { Vm } from "@nandlang-ts/language/vm";
import type { PuzzleTestCase } from "../lib/puzzles";

export type TestCase = {
  inputs: Map<string, boolean | number>;
  expectedOutputs: Map<string, boolean | number>;
  actualOutputs: Map<string, boolean | number> | null;
  status: "idle" | "pass" | "fail";
};

type OnTestRun = (
  inputs: Map<string, boolean | number>,
  outputs: Map<string, boolean | number>,
  allSignals: Map<string, boolean>,
) => void;

export function useTestCases(code: string | null, onTestRun?: OnTestRun) {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const testCasesRef = useRef<TestCase[]>([]);
  testCasesRef.current = testCases;

  const vmRef = useRef<Vm | null>(null);
  const indexRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onTestRunRef = useRef(onTestRun);
  onTestRunRef.current = onTestRun;

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

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const compileVm = useCallback((): boolean => {
    if (!code) return false;
    try {
      const vm = new Vm();
      vm.compile(code);
      vmRef.current = vm;
      return true;
    } catch {
      setTestCases((prev) =>
        prev.map((tc, i) =>
          i === 0
            ? { ...tc, actualOutputs: null, status: "fail" as const }
            : tc,
        ),
      );
      return false;
    }
  }, [code]);

  // Execute a single test case at the current index
  const executeStep = useCallback((): boolean => {
    const vm = vmRef.current;
    const idx = indexRef.current;
    if (!vm || idx >= testCasesRef.current.length) return false;

    const tc = testCasesRef.current[idx];
    const actualOutputs = vm.run(tc.inputs);
    const pass = [...tc.expectedOutputs.entries()].every(
      ([name, expected]) => actualOutputs.get(name) === expected,
    );

    setTestCases((prev) => {
      const result = [...prev];
      result[idx] = { ...tc, actualOutputs, status: pass ? "pass" : "fail" };
      return result;
    });

    onTestRunRef.current?.(tc.inputs, actualOutputs, vm.getAllSignals());

    if (pass && idx + 1 < testCasesRef.current.length) {
      indexRef.current = idx + 1;
      return true; // has next
    }
    return false; // done or failed
  }, []);

  const autoStep = useCallback(() => {
    const hasNext = executeStep();
    if (hasNext) {
      timerRef.current = setTimeout(autoStep, 100);
    } else {
      setIsRunning(false);
    }
  }, [executeStep]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  // > Step: execute one test case
  const runNext = useCallback(() => {
    if (!vmRef.current) {
      if (!compileVm()) return;
      indexRef.current = 0;
      setTestCases((prev) =>
        prev.map((tc) => ({ ...tc, actualOutputs: null, status: "idle" as const })),
      );
    }
    executeStep();
  }, [compileVm, executeStep]);

  // >> Run All: compile and auto-run all test cases
  const runAll = useCallback(() => {
    clearTimer();
    if (!compileVm()) return;
    indexRef.current = 0;
    setTestCases((prev) =>
      prev.map((tc) => ({ ...tc, actualOutputs: null, status: "idle" as const })),
    );
    setIsRunning(true);
    setIsPaused(false);
    timerRef.current = setTimeout(autoStep, 100);
  }, [compileVm, clearTimer, autoStep]);

  // || Pause: suspend auto-run, keep state
  const pause = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    setIsPaused(true);
  }, [clearTimer]);

  // >> Resume: continue auto-run from paused state
  const resume = useCallback(() => {
    if (!vmRef.current) return;
    setIsRunning(true);
    setIsPaused(false);
    timerRef.current = setTimeout(autoStep, 100);
  }, [autoStep]);

  // □ Stop: stop and reset all results
  const stop = useCallback(() => {
    clearTimer();
    vmRef.current = null;
    indexRef.current = 0;
    setIsRunning(false);
    setIsPaused(false);
    setTestCases((prev) =>
      prev.map((tc) => ({ ...tc, actualOutputs: null, status: "idle" as const })),
    );
  }, [clearTimer]);

  const resetResults = useCallback(() => {
    clearTimer();
    vmRef.current = null;
    indexRef.current = 0;
    setIsRunning(false);
    setIsPaused(false);
    setTestCases((prev) =>
      prev.map((tc) => ({ ...tc, actualOutputs: null, status: "idle" as const })),
    );
  }, [clearTimer]);

  const allPassed =
    testCases.length > 0 && testCases.every((tc) => tc.status === "pass");

  return {
    testCases,
    loadTestCases,
    runAll,
    runNext,
    pause,
    resume,
    stop,
    resetResults,
    allPassed,
    isRunning,
    isPaused,
  };
}
