import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { NodeData } from "../../lib/astToGraph";
import "./nodeStyles.css";

export function ByteinNode({ data }: NodeProps & { data: NodeData }) {
  const value = typeof data.value === "number" ? data.value : 0;
  return (
    <div className="circuit-node bytein-node">
      <div className="node-label">{data.label}</div>
      <div className="node-type">BYTEIN</div>
      <div className="byte-value-display">{value}</div>
      <Handle
        type="source"
        position={Position.Right}
        id="byte"
        style={{ top: "50%", width: 10, height: 10, background: "#6366f1", border: "2px solid #4f46e5" }}
      />
    </div>
  );
}
