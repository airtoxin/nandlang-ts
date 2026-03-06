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
import type { NodeData } from "../utils/astToGraph";

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
  onNodeClick: (nodeId: string) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
};

export function CircuitDiagramPanel({
  nodes,
  edges,
  onNodeClick,
  onNodesChange,
  onEdgesChange,
}: Props) {
  return (
    <div className="circuit-diagram-panel">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={(_event, node) => {
          if (node.data.moduleName === "BITIN") {
            onNodeClick(node.id);
          }
        }}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
