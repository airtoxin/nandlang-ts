import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { NodeData } from "../../lib/astToGraph";
import "./nodeStyles.css";

export function BitoutNode({ data }: NodeProps & { data: NodeData }) {
  const active = data.value ?? false;
  return (
    <div className={`circuit-node bitout-node ${active ? "active" : ""}`}>
      <Handle type="target" position={Position.Left} id="i0" />
      <div className="node-label">{data.label}</div>
      <div className="node-type">{active ? "1" : "0"}</div>
    </div>
  );
}
