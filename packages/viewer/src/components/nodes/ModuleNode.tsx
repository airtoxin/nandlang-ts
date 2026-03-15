import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { NodeData } from "../../lib/astToGraph";
import "./nodeStyles.css";

/**
 * Compress sequential port names like ["i0","i1","i2","i3"] → "i0~i3"
 * Falls back to comma-joined if ports are not sequential.
 */
function compressPortLabels(labels: string[]): string {
  if (labels.length <= 2) return labels.join(", ");
  // Check if all labels share a common prefix followed by sequential numbers
  const match0 = labels[0].match(/^(.+?)(\d+)$/);
  if (!match0) return labels.join(", ");
  const prefix = match0[1];
  const startNum = Number(match0[2]);
  for (let i = 1; i < labels.length; i++) {
    const m = labels[i].match(/^(.+?)(\d+)$/);
    if (!m || m[1] !== prefix || Number(m[2]) !== startNum + i) {
      return labels.join(", ");
    }
  }
  return `${labels[0]}~${labels[labels.length - 1]}`;
}

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
        <div style={{ fontSize: 9, color: "#aaa", marginTop: 4 }}>
          {portLabels.length > 0 && (
            <div style={{ textAlign: "left" }}>{compressPortLabels(portLabels)}</div>
          )}
          {outLabels.length > 0 && (
            <div style={{ textAlign: "right" }}>{compressPortLabels(outLabels)}</div>
          )}
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
