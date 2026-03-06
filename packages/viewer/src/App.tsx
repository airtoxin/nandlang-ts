import { useCallback, useEffect, useState } from "react";
import { applyNodeChanges, applyEdgeChanges } from "@xyflow/react";
import type { NodeChange, EdgeChange } from "@xyflow/react";
import { CodeEditorPanel } from "./components/CodeEditorPanel";
import { CircuitDiagramPanel } from "./components/CircuitDiagramPanel";
import { TruthTablePanel } from "./components/TruthTablePanel";
import { useCircuit } from "./hooks/useCircuit";
import { useTruthTable } from "./hooks/useTruthTable";
import { examples } from "./utils/examples";
import "./App.css";

function App() {
  const circuit = useCircuit();
  const [compiledCode, setCompiledCode] = useState<string | null>(null);

  const handleCompile = useCallback(
    (code: string) => {
      circuit.compile(code);
      setCompiledCode(code);
    },
    [circuit],
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

  const { rows, warning } = useTruthTable(
    compiledCode,
    circuit.inputNames,
    circuit.outputNames,
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
      <TruthTablePanel
        rows={rows}
        inputNames={circuit.inputNames}
        outputNames={circuit.outputNames}
        currentInputs={circuit.inputSignals}
        warning={warning}
      />
    </div>
  );
}

export default App;
