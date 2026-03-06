import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { NodeData } from "../../lib/astToGraph";
import "./nodeStyles.css";

export function NandNode({ data }: NodeProps & { data: NodeData }) {
  return (
    <div className="circuit-node nand-node">
      <Handle type="target" position={Position.Left} id="i0" style={{ top: "30%" }} />
      <Handle type="target" position={Position.Left} id="i1" style={{ top: "70%" }} />
      <div className="node-label">{data.label}</div>
      <div className="node-type">NAND</div>
      <Handle type="source" position={Position.Right} id="o0" />
    </div>
  );
}
