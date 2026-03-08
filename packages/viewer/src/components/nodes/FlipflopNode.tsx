import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { NodeData } from "../../lib/astToGraph";
import "./nodeStyles.css";

export function FlipflopNode({ data }: NodeProps & { data: NodeData }) {
  const q = data.value;
  return (
    <div className={`circuit-node flipflop-node ${q ? "active" : ""}`}>
      <Handle type="target" position={Position.Left} id="s" style={{ top: "30%" }} />
      <Handle type="target" position={Position.Left} id="r" style={{ top: "70%" }} />
      <div className="node-label">{data.label}</div>
      <div className="node-type">FLIPFLOP</div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#aaa" }}>
        <span>s/r</span>
        <span>q={q !== undefined ? (q ? "1" : "0") : "?"}</span>
      </div>
      <Handle type="source" position={Position.Right} id="q" />
    </div>
  );
}
