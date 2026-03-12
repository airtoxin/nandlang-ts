import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { NodeData } from "../../lib/astToGraph";
import "./nodeStyles.css";

export function RamNode({ data }: NodeProps & { data: NodeData }) {
  const inputs = data.inputs;
  const byteInputs = data.byteInputs ?? [];
  const byteOutputs = data.byteOutputs ?? [];
  const dump = data.memoryDump;

  // Determine grid size from module name (RAM2=2, RAM4=4, RAM8=8, RAM16=16)
  const size = parseInt(data.moduleName.replace("RAM", ""), 10) || 2;
  const cols = size <= 2 ? 2 : 4;
  const placeholder = Array.from({ length: size }, () => 0);
  const cells = dump ?? placeholder;

  const allInputHandles: { id: string; isByte: boolean }[] = [
    ...inputs.map((p) => ({ id: p, isByte: false })),
    ...byteInputs.map((name) => ({ id: name, isByte: true })),
  ];
  const allOutputHandles: { id: string; isByte: boolean }[] = [
    ...byteOutputs.map((name) => ({ id: name, isByte: true })),
  ];

  return (
    <div className="circuit-node ram-node">
      {allInputHandles.map((handle, i) => (
        <Handle
          key={`in-${handle.id}`}
          type="target"
          position={Position.Left}
          id={handle.id}
          style={{
            top: `${((i + 1) / (allInputHandles.length + 1)) * 100}%`,
            ...(handle.isByte ? { width: 10, height: 10, background: "#6366f1", border: "2px solid #4f46e5" } : {}),
          }}
        />
      ))}
      <div className="node-label">{data.label}</div>
      <div className="node-type">{data.moduleName}</div>
      <div className="ram-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {cells.map((val, i) => (
          <div key={i} className={`ram-cell ${val !== 0 ? "ram-cell-active" : ""}`}>{val}</div>
        ))}
      </div>
      {allOutputHandles.map((handle, i) => (
        <Handle
          key={`out-${handle.id}`}
          type="source"
          position={Position.Right}
          id={handle.id}
          style={{
            top: `${((i + 1) / (allOutputHandles.length + 1)) * 100}%`,
            width: 10, height: 10, background: "#6366f1", border: "2px solid #4f46e5",
          }}
        />
      ))}
    </div>
  );
}
