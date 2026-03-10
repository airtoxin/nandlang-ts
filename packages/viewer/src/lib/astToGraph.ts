import type { Node, Edge } from "@xyflow/react";
import type { Program, SubStatement } from "@nandlang-ts/language/parser/ast";
import dagre from "dagre";

type PortInfo = { inputs: string[]; outputs: string[] };

const BUILTIN_PORTS: Record<string, PortInfo> = {
  NAND: { inputs: ["i0", "i1"], outputs: ["o0"] },
  BITIN: { inputs: [], outputs: ["o0"] },
  BITOUT: { inputs: ["i0"], outputs: [] },
  BYTEIN: { inputs: [], outputs: ["o0", "o1", "o2", "o3", "o4", "o5", "o6", "o7"] },
  BYTEOUT: { inputs: ["i0", "i1", "i2", "i3", "i4", "i5", "i6", "i7"], outputs: [] },
  FLIPFLOP: { inputs: ["s", "r"], outputs: ["q"] },
};

function resolveModulePorts(
  moduleName: string,
  moduleDefs: Map<string, PortInfo>,
): PortInfo {
  if (BUILTIN_PORTS[moduleName]) return BUILTIN_PORTS[moduleName];
  const info = moduleDefs.get(moduleName);
  if (info) return info;
  return { inputs: [], outputs: [] };
}

function collectModuleDefs(
  statements: SubStatement[],
  moduleDefs: Map<string, PortInfo>,
): void {
  for (const st of statements) {
    if (st.type === "moduleStatement") {
      const inputs: string[] = [];
      const outputs: string[] = [];
      for (const defSt of st.definitionStatements) {
        if (
          defSt.subtype.type === "varStatement" &&
          defSt.subtype.moduleName === "BITIN"
        ) {
          inputs.push(defSt.subtype.variableName);
        } else if (
          defSt.subtype.type === "varStatement" &&
          defSt.subtype.moduleName === "BITOUT"
        ) {
          outputs.push(defSt.subtype.variableName);
        } else if (defSt.subtype.type === "moduleStatement") {
          collectModuleDefs([defSt.subtype], moduleDefs);
        }
      }
      moduleDefs.set(st.name, { inputs, outputs });
      // Recurse for nested module defs
      collectModuleDefs(
        st.definitionStatements.map((s) => s.subtype),
        moduleDefs,
      );
    }
  }
}

export type NodeData = {
  label: string;
  moduleName: string;
  inputs: string[];
  outputs: string[];
  value?: boolean | number;
};

export function astToGraph(ast: Program): {
  nodes: Node<NodeData>[];
  edges: Edge[];
  inputNames: string[];
  outputNames: string[];
} {
  const nodes: Node<NodeData>[] = [];
  const edges: Edge[] = [];
  const inputNames: string[] = [];
  const outputNames: string[] = [];

  const moduleDefs = new Map<string, PortInfo>();
  const subStatements = ast.statements.map((s) => s.subtype);

  // First pass: collect all module definitions
  collectModuleDefs(subStatements, moduleDefs);

  // Track variable info for port resolution
  const varPorts = new Map<string, PortInfo>();

  const NODE_WIDTH = 120;
  const NODE_HEIGHT = 60;

  // Create nodes for all vars (positions will be set by dagre)
  for (const st of subStatements) {
    if (st.type !== "varStatement") continue;
    const ports = resolveModulePorts(st.moduleName, moduleDefs);
    varPorts.set(st.variableName, ports);

    if (st.moduleName === "BITIN" || st.moduleName === "BYTEIN") inputNames.push(st.variableName);
    if (st.moduleName === "BITOUT" || st.moduleName === "BYTEOUT") outputNames.push(st.variableName);

    let nodeType: string;
    if (st.moduleName === "BITIN") nodeType = "bitinNode";
    else if (st.moduleName === "BITOUT") nodeType = "bitoutNode";
    else if (st.moduleName === "BYTEIN") nodeType = "byteinNode";
    else if (st.moduleName === "BYTEOUT") nodeType = "byteoutNode";
    else if (st.moduleName === "NAND") nodeType = "nandNode";
    else if (st.moduleName === "FLIPFLOP") nodeType = "flipflopNode";
    else nodeType = "moduleNode";

    nodes.push({
      id: st.variableName,
      type: nodeType,
      position: { x: 0, y: 0 },
      data: {
        label: st.variableName,
        moduleName: st.moduleName,
        inputs: ports.inputs,
        outputs: ports.outputs,
      },
    });
  }

  // Create edges from wire statements
  for (const st of subStatements) {
    if (st.type !== "wireStatement") continue;

    let srcHandle = st.srcPortName;
    let destHandle = st.destPortName;

    // Resolve "_" port
    if (srcHandle === "_") {
      const ports = varPorts.get(st.srcVariableName);
      if (ports && ports.outputs.length === 1) srcHandle = ports.outputs[0];
    }
    if (destHandle === "_") {
      const ports = varPorts.get(st.destVariableName);
      if (ports && ports.inputs.length === 1) destHandle = ports.inputs[0];
    }

    edges.push({
      id: `${st.srcVariableName}.${srcHandle}-${st.destVariableName}.${destHandle}`,
      source: st.srcVariableName,
      sourceHandle: srcHandle,
      target: st.destVariableName,
      targetHandle: destHandle,
      animated: true,
    });
  }

  // Apply dagre layout
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "LR", nodesep: 50, ranksep: 100 });
  g.setDefaultEdgeLabel(() => ({}));

  for (const node of nodes) {
    const isByte = node.type === "byteinNode" || node.type === "byteoutNode";
    g.setNode(node.id, { width: NODE_WIDTH, height: isByte ? 200 : NODE_HEIGHT });
  }
  for (const edge of edges) {
    g.setEdge(edge.source, edge.target);
  }
  // Add dummy edges from BITIN to BITOUT to ensure rank separation
  // when no real edges exist (e.g. before user writes code)
  for (const inName of inputNames) {
    for (const outName of outputNames) {
      if (!g.hasEdge(inName, outName)) {
        g.setEdge(inName, outName);
      }
    }
  }

  dagre.layout(g);

  for (const node of nodes) {
    const pos = g.node(node.id);
    node.position = { x: pos.x - NODE_WIDTH / 2, y: pos.y - NODE_HEIGHT / 2 };
  }

  return { nodes, edges, inputNames, outputNames };
}
