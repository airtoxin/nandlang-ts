import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { applyNodeChanges, applyEdgeChanges } from "@xyflow/react";
import type { NodeChange, EdgeChange } from "@xyflow/react";
import { CodeEditorPanel } from "../components/CodeEditorPanel";
import { CircuitDiagramPanel } from "../components/CircuitDiagramPanel";
import { TestCasePanel } from "../components/TestCasePanel";
import { useCircuit } from "../hooks/useCircuit";
import { useTestCases } from "../hooks/useTestCases";
import { puzzles } from "../lib/puzzles";
import {
  getProgress,
  isLevelUnlocked,
  markLevelCompleted,
} from "../lib/progress";

export function LevelPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const levelIndex = useMemo(
    () => puzzles.findIndex((p) => p.id === Number(id)),
    [id],
  );
  const currentPuzzle = levelIndex !== -1 ? puzzles[levelIndex] : null;

  const circuit = useCircuit();
  const [compiledCode, setCompiledCode] = useState<string | null>(null);
  const [fitViewTrigger, setFitViewTrigger] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [unlockMessage, setUnlockMessage] = useState<string | null>(null);

  const tc = useTestCases(compiledCode, circuit.updateNodeSignals);

  // Check if level is locked
  const progress = useMemo(() => getProgress(), []);
  const isUnlocked = currentPuzzle
    ? isLevelUnlocked(currentPuzzle.id, puzzles, progress)
    : false;

  const handleCompile = useCallback(
    (code: string) => {
      circuit.compile(code);
      setCompiledCode(code);
      setFitViewTrigger((c) => c + 1);
      setDirty(false);
      tc.resetResults();
    },
    [circuit, tc],
  );

  const handleNextLevel = useCallback(() => {
    if (levelIndex < puzzles.length - 1) {
      const nextPuzzle = puzzles[levelIndex + 1];
      navigate(`/level/${nextPuzzle.id}`);
    }
  }, [levelIndex, navigate]);

  // Mark level completed when all tests pass
  useEffect(() => {
    if (tc.allPassed && currentPuzzle) {
      markLevelCompleted(currentPuzzle.id);
      if (currentPuzzle.unlocksModule) {
        setUnlockMessage(
          `${currentPuzzle.unlocksModule} モジュールが解放されました！`,
        );
      }
      // Clear unlock message after a delay
      const timer = setTimeout(() => setUnlockMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [tc.allPassed, currentPuzzle]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      circuit.setNodes((nds) => applyNodeChanges(changes, nds) as typeof nds);
    },
    [circuit],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      circuit.setEdges((eds) => applyEdgeChanges(changes, eds) as typeof eds);
    },
    [circuit],
  );

  // Auto-load puzzle on mount
  useEffect(() => {
    if (!currentPuzzle) return;
    tc.loadTestCases(currentPuzzle.testCases);
    handleCompile(`${currentPuzzle.moduleDefs}${currentPuzzle.fixedCode}\n${currentPuzzle.editableCode}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redirect locked levels
  if (!currentPuzzle || !isUnlocked) {
    return <Navigate to="/levels" replace />;
  }

  return (
    <div className="app-layout">
      <CodeEditorPanel
        onCompile={handleCompile}
        onDirty={() => setDirty(true)}
        error={circuit.error}
        puzzle={currentPuzzle}
      />
      <CircuitDiagramPanel
        nodes={circuit.nodes}
        edges={circuit.edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitViewTrigger={fitViewTrigger}
      />
      <TestCasePanel
        testCases={tc.testCases}
        inputNames={currentPuzzle.inputNames}
        outputNames={currentPuzzle.outputNames}
        onRunAll={tc.runAll}
        onRunNext={tc.runNext}
        allPassed={tc.allPassed}
        onNextLevel={handleNextLevel}
        isLastLevel={levelIndex >= puzzles.length - 1}
        disabled={dirty}
      />
      {unlockMessage && (
        <div className="unlock-message">{unlockMessage}</div>
      )}
    </div>
  );
}
