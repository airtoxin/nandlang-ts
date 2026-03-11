import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { NodeData } from "../../lib/astToGraph";
import "./nodeStyles.css";

export function ModuleNode({ data }: NodeProps & { data: NodeData }) {
  const inputs = data.inputs;
  const outputs = data.outputs;
  const byteInputs = data.byteInputs ?? [];
  const byteOutputs = data.byteOutputs ?? [];

  // Single bus handle per byte port
  const allInputHandles: { id: string; label: string; isByte: boolean }[] = [
    ...inputs.map((p) => ({ id: p, label: p, isByte: false })),
    ...byteInputs.map((name) => ({ id: name, label: name, isByte: true })),
  ];
  const allOutputHandles: { id: string; label: string; isByte: boolean }[] = [
    ...outputs.map((p) => ({ id: p, label: p, isByte: false })),
    ...byteOutputs.map((name) => ({ id: name, label: name, isByte: true })),
  ];

  const portLabels = [
    ...inputs,
    ...byteInputs,
  ];
  const outLabels = [
    ...outputs,
    ...byteOutputs,
  ];
  const maxPorts = Math.max(allInputHandles.length, allOutputHandles.length, 1);

  return (
    <div className="circuit-node module-node">
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
      {maxPorts > 1 && (
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#aaa", marginTop: 4 }}>
          <span>{portLabels.join(", ")}</span>
          <span>{outLabels.join(", ")}</span>
        </div>
      )}
      {allOutputHandles.map((handle, i) => (
        <Handle
          key={`out-${handle.id}`}
          type="source"
          position={Position.Right}
          id={handle.id}
          style={{
            top: `${((i + 1) / (allOutputHandles.length + 1)) * 100}%`,
            ...(handle.isByte ? { width: 10, height: 10, background: "#6366f1", border: "2px solid #4f46e5" } : {}),
          }}
        />
      ))}
    </div>
  );
}
