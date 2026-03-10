import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { NodeData } from "../../lib/astToGraph";
import "./nodeStyles.css";

const PORTS = ["i0", "i1", "i2", "i3", "i4", "i5", "i6", "i7"];

export function ByteoutNode({ data }: NodeProps & { data: NodeData }) {
  const value = typeof data.value === "number" ? data.value : 0;
  return (
    <div className="circuit-node byteout-node">
      <div className="byte-value-display">{value}</div>
      <div className="byte-ports">
        {PORTS.map((port, i) => (
          <div key={port} className="byte-port-row byte-port-in">
            <Handle
              type="target"
              position={Position.Left}
              id={port}
              style={{ top: `${((i + 1) / (PORTS.length + 1)) * 100}%` }}
            />
            <span className="port-label">{port}</span>
          </div>
        ))}
      </div>
      <div className="node-label">{data.label}</div>
      <div className="node-type">BYTEOUT</div>
    </div>
  );
}
