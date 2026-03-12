import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { applyNodeChanges, applyEdgeChanges } from "@xyflow/react";
import type { NodeChange, EdgeChange } from "@xyflow/react";
import { CodeEditorPanel } from "../components/CodeEditorPanel";
import { CircuitDiagramPanel } from "../components/CircuitDiagramPanel";
import { useCircuit } from "../hooks/useCircuit";
import {
  ON, NOT, AND, AND3, OR, OR3, NOR, XOR, XNOR,
  ADD, DEC, ENC, BYTEADD, DLATCH, MUX, DMUX,
} from "@nandlang-ts/language/code-fragments";
import "./SandboxPage.css";

const PRELOADED_MODULES = `${ON}${NOT}${AND}${AND3}${OR}${OR3}${NOR}${XOR}${XNOR}${ADD}${DEC}${ENC}${BYTEADD}${DLATCH}${MUX}${DMUX}`;

const AVAILABLE_MODULE_NAMES = [
  "ON", "NOT", "AND", "AND3", "OR", "OR3", "NOR", "XOR", "XNOR",
  "ADD", "DEC", "ENC", "BYTEADD", "DLATCH", "MUX", "DMUX",
  "RAM2", "RAM4", "RAM8", "RAM16",
];

const DEFAULT_CODE = `# RAM4 を使った簡易メモリ回路
# a0,a1でアドレス指定、weで書き込み、dataで値を入力
VAR a0 BITIN
VAR a1 BITIN
VAR we BITIN
VAR data BYTEIN
VAR out BYTEOUT

VAR ram RAM4
WIRE a0 _ TO ram a0
WIRE a1 _ TO ram a1
WIRE we _ TO ram we
WIRE data _ TO ram data
WIRE ram out TO out _
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
