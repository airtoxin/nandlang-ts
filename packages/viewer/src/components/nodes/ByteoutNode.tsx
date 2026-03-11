import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { NodeData } from "../../lib/astToGraph";
import "./nodeStyles.css";

export function ByteoutNode({ data }: NodeProps & { data: NodeData }) {
  const value = typeof data.value === "number" ? data.value : 0;
  return (
    <div className="circuit-node byteout-node">
      <Handle
        type="target"
        position={Position.Left}
        id="byte"
        style={{ top: "50%", width: 10, height: 10, background: "#6366f1", border: "2px solid #4f46e5" }}
      />
      <div className="byte-value-display">{value}</div>
      <div className="node-label">{data.label}</div>
      <div className="node-type">BYTEOUT</div>
    </div>
  );
}
