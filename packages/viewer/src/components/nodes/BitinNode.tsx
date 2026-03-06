import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { NodeData } from "../../lib/astToGraph";
import "./nodeStyles.css";

export function BitinNode({ data }: NodeProps & { data: NodeData }) {
  const active = data.value ?? false;
  return (
    <div className={`circuit-node bitin-node ${active ? "active" : ""}`}>
      <div className="node-label">{data.label}</div>
      <div className="node-type">{active ? "ON" : "OFF"}</div>
      <Handle type="source" position={Position.Right} id="o0" />
    </div>
  );
}
