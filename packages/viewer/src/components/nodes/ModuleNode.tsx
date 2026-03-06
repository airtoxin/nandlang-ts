import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { NodeData } from "../../lib/astToGraph";
import "./nodeStyles.css";

export function ModuleNode({ data }: NodeProps & { data: NodeData }) {
  const inputs = data.inputs;
  const outputs = data.outputs;
  const maxPorts = Math.max(inputs.length, outputs.length, 1);

  return (
    <div className="circuit-node module-node">
      {inputs.map((port, i) => (
        <Handle
          key={`in-${port}`}
          type="target"
          position={Position.Left}
          id={port}
          style={{ top: `${((i + 1) / (inputs.length + 1)) * 100}%` }}
        />
      ))}
      <div className="node-label">{data.label}</div>
      <div className="node-type">{data.moduleName}</div>
      {maxPorts > 1 && (
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#aaa", marginTop: 4 }}>
          <span>{inputs.join(", ")}</span>
          <span>{outputs.join(", ")}</span>
        </div>
      )}
      {outputs.map((port, i) => (
        <Handle
          key={`out-${port}`}
          type="source"
          position={Position.Right}
          id={port}
          style={{ top: `${((i + 1) / (outputs.length + 1)) * 100}%` }}
        />
      ))}
    </div>
  );
}
