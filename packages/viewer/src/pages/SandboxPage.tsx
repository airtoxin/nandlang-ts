import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { applyNodeChanges, applyEdgeChanges } from "@xyflow/react";
import type { NodeChange, EdgeChange } from "@xyflow/react";
import { CodeEditorPanel } from "../components/CodeEditorPanel";
import { CircuitDiagramPanel } from "../components/CircuitDiagramPanel";
import { useCircuit } from "../hooks/useCircuit";
import {
  ON, NOT, AND, AND3, OR, OR3, NOR, XOR, XNOR,
  ADD, DEC, ENC, BYTEADD, DLATCH,
} from "@nandlang-ts/language/code-fragments";
import "./SandboxPage.css";

const PRELOADED_MODULES = `${ON}${NOT}${AND}${AND3}${OR}${OR3}${NOR}${XOR}${XNOR}${ADD}${DEC}${ENC}${BYTEADD}${DLATCH}`;

const AVAILABLE_MODULE_NAMES = [
  "ON", "NOT", "AND", "AND3", "OR", "OR3", "NOR", "XOR", "XNOR",
  "ADD", "DEC", "ENC", "BYTEADD", "DLATCH",
];

const DEFAULT_CODE = `VAR a BITIN
VAR b BITIN
VAR out BITOUT
VAR nand NAND
WIRE a _ TO nand i0
WIRE b _ TO nand i1
WIRE nand _ TO out _
`;

export function SandboxPage() {
  const circuit = useCircuit();
  const [fitViewTrigger, setFitViewTrigger] = useState(0);

  const handleCompile = useCallback(
    (code: string) => {
      circuit.compile(`${PRELOADED_MODULES}${code}`);
      setFitViewTrigger((c) => c + 1);
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

  return (
    <div className="sandbox-layout">
      <div className="sandbox-sidebar">
        <Link to="/" className="back-link">
          &larr; Back
        </Link>
        <CodeEditorPanel
          onCompile={handleCompile}
          error={circuit.error}
          initialCode={DEFAULT_CODE}
          availableModules={AVAILABLE_MODULE_NAMES}
        />
      </div>
      <CircuitDiagramPanel
        nodes={circuit.nodes}
        edges={circuit.edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitViewTrigger={fitViewTrigger}
      />
    </div>
  );
}
