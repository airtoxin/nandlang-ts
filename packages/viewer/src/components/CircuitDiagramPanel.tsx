import { useEffect } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  useReactFlow,
  type Node,
  type Edge,
  type NodeTypes,
  type OnNodesChange,
  type OnEdgesChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { BitinNode } from "./nodes/BitinNode";
import { BitoutNode } from "./nodes/BitoutNode";
import { ByteinNode } from "./nodes/ByteinNode";
import { ByteoutNode } from "./nodes/ByteoutNode";
import { NandNode } from "./nodes/NandNode";
import { FlipflopNode } from "./nodes/FlipflopNode";
import { ModuleNode } from "./nodes/ModuleNode";
import type { NodeData } from "../lib/astToGraph";

const nodeTypes: NodeTypes = {
  bitinNode: BitinNode,
  bitoutNode: BitoutNode,
  byteinNode: ByteinNode,
  byteoutNode: ByteoutNode,
  nandNode: NandNode,
  flipflopNode: FlipflopNode,
  moduleNode: ModuleNode,
};

type Props = {
  nodes: Node<NodeData>[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  fitViewTrigger: number;
};

function CircuitDiagramInner({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  fitViewTrigger,
}: Props) {
  const { fitView } = useReactFlow();

  useEffect(() => {
    const timer = setTimeout(() => fitView(), 50);
    return () => clearTimeout(timer);
  }, [fitViewTrigger, fitView]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodesConnectable={false}
      edgesReconnectable={false}
      proOptions={{ hideAttribution: true }}
      fitView
    >
      <Background />
      <Controls showInteractive={false} />
    </ReactFlow>
  );
}

export function CircuitDiagramPanel(props: Props) {
  return (
    <div className="circuit-diagram-panel">
      <ReactFlowProvider>
        <CircuitDiagramInner {...props} />
      </ReactFlowProvider>
    </div>
  );
}
