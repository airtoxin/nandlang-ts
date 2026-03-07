import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  type NodeTypes,
  type OnNodesChange,
  type OnEdgesChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { BitinNode } from "./nodes/BitinNode";
import { BitoutNode } from "./nodes/BitoutNode";
import { NandNode } from "./nodes/NandNode";
import { FlipflopNode } from "./nodes/FlipflopNode";
import { ModuleNode } from "./nodes/ModuleNode";
import type { NodeData } from "../lib/astToGraph";

const nodeTypes: NodeTypes = {
  bitinNode: BitinNode,
  bitoutNode: BitoutNode,
  nandNode: NandNode,
  flipflopNode: FlipflopNode,
  moduleNode: ModuleNode,
};

type Props = {
  nodes: Node<NodeData>[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
};

export function CircuitDiagramPanel({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
}: Props) {
  return (
    <div className="circuit-diagram-panel">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodesDraggable={false}
        nodesConnectable={false}
        edgesReconnectable={false}
        proOptions={{ hideAttribution: true }}
        fitView
      >
        <Background />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
