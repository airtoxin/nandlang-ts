import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { NodeData } from "../../lib/astToGraph";
import "./nodeStyles.css";

const PORTS = ["o0", "o1", "o2", "o3", "o4", "o5", "o6", "o7"];

export function ByteinNode({ data }: NodeProps & { data: NodeData }) {
  const value = typeof data.value === "number" ? data.value : 0;
  return (
    <div className="circuit-node bytein-node">
      <div className="node-label">{data.label}</div>
      <div className="node-type">BYTEIN</div>
      <div className="byte-value-display">{value}</div>
      <div className="byte-ports">
        {PORTS.map((port, i) => (
          <div key={port} className="byte-port-row byte-port-out">
            <span className="port-label">{port}</span>
            <Handle
              type="source"
              position={Position.Right}
              id={port}
              style={{ top: `${((i + 1) / (PORTS.length + 1)) * 100}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
