import { useCallback, useEffect, useState } from "react";
import { applyNodeChanges, applyEdgeChanges } from "@xyflow/react";
import type { NodeChange, EdgeChange } from "@xyflow/react";
import { CodeEditorPanel } from "./components/CodeEditorPanel";
import { CircuitDiagramPanel } from "./components/CircuitDiagramPanel";
import { TestCasePanel } from "./components/TestCasePanel";
import { useCircuit } from "./hooks/useCircuit";
import { useTestCases } from "./hooks/useTestCases";
import { puzzles } from "./lib/puzzles";
import "./App.css";

function App() {
  const circuit = useCircuit();
  const [compiledCode, setCompiledCode] = useState<string | null>(null);
  const [currentLevel, setCurrentLevel] = useState(0);
  const currentPuzzle = puzzles[currentLevel];

  const tc = useTestCases(compiledCode);

  const handleCompile = useCallback(
    (code: string) => {
      circuit.compile(code);
      setCompiledCode(code);
      tc.resetResults();
    },
    [circuit, tc],
  );

  const handleLevelChange = useCallback(
    (level: number) => {
      setCurrentLevel(level);
      const puzzle = puzzles[level];
      tc.loadTestCases(puzzle.testCases);
      handleCompile(puzzle.starterCode);
    },
    [tc, handleCompile],
  );

  const handleNextLevel = useCallback(() => {
    if (currentLevel < puzzles.length - 1) {
      handleLevelChange(currentLevel + 1);
    }
  }, [currentLevel, handleLevelChange]);

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

  // Auto-load first puzzle on mount
  useEffect(() => {
    tc.loadTestCases(currentPuzzle.testCases);
    handleCompile(currentPuzzle.starterCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app-layout">
      <CodeEditorPanel
        onCompile={handleCompile}
        error={circuit.error}
        puzzle={currentPuzzle}
      />
      <CircuitDiagramPanel
        nodes={circuit.nodes}
        edges={circuit.edges}
        onNodeClick={circuit.toggleInput}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      />
      <TestCasePanel
        testCases={tc.testCases}
        inputNames={currentPuzzle.inputNames}
        outputNames={currentPuzzle.outputNames}
        onRunAll={tc.runAll}
        allPassed={tc.allPassed}
        onNextLevel={handleNextLevel}
        isLastLevel={currentLevel >= puzzles.length - 1}
      />
    </div>
  );
}

export default App;
