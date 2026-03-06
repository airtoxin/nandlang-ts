import { useCallback, useEffect, useState } from "react";
import { applyNodeChanges, applyEdgeChanges } from "@xyflow/react";
import type { NodeChange, EdgeChange } from "@xyflow/react";
import { CodeEditorPanel } from "./components/CodeEditorPanel";
import { CircuitDiagramPanel } from "./components/CircuitDiagramPanel";
import { TestCasePanel } from "./components/TestCasePanel";
import { useCircuit } from "./hooks/useCircuit";
import { useTestCases } from "./hooks/useTestCases";
import { examples } from "./lib/examples";
import "./App.css";

function App() {
  const circuit = useCircuit();
  const [compiledCode, setCompiledCode] = useState<string | null>(null);

  const tc = useTestCases(
    compiledCode,
    circuit.inputNames,
    circuit.outputNames,
  );

  const handleCompile = useCallback(
    (code: string) => {
      circuit.compile(code);
      setCompiledCode(code);
      tc.resetResults();
    },
    [circuit, tc],
  );

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

  // Auto-compile default example on mount
  useEffect(() => {
    handleCompile(examples[0].code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app-layout">
      <CodeEditorPanel onCompile={handleCompile} error={circuit.error} />
      <CircuitDiagramPanel
        nodes={circuit.nodes}
        edges={circuit.edges}
        onNodeClick={circuit.toggleInput}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      />
      <TestCasePanel
        testCases={tc.testCases}
        inputNames={circuit.inputNames}
        outputNames={circuit.outputNames}
        onAdd={tc.addTestCase}
        onRemove={tc.removeTestCase}
        onToggleInput={tc.toggleInput}
        onToggleExpectedOutput={tc.toggleExpectedOutput}
        onRunAll={tc.runAll}
      />
    </div>
  );
}

export default App;
