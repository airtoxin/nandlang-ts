import type { Node, Edge } from "@xyflow/react";
import type { Program, SubStatement } from "@nandlang-ts/language/parser/ast";
import dagre from "dagre";

type PortInfo = { inputs: string[]; outputs: string[]; byteInputs: string[]; byteOutputs: string[] };

const BUILTIN_PORTS: Record<string, PortInfo> = {
  NAND: { inputs: ["i0", "i1"], outputs: ["o0"], byteInputs: [], byteOutputs: [] },
  BITIN: { inputs: [], outputs: ["o0"], byteInputs: [], byteOutputs: [] },
  BITOUT: { inputs: ["i0"], outputs: [], byteInputs: [], byteOutputs: [] },
  BYTEIN: { inputs: [], outputs: [], byteInputs: [], byteOutputs: ["byte"] },
  BYTEOUT: { inputs: [], outputs: [], byteInputs: ["byte"], byteOutputs: [] },
  BYTESPLIT: { inputs: [], outputs: ["o0", "o1", "o2", "o3", "o4", "o5", "o6", "o7"], byteInputs: ["byte"], byteOutputs: [] },
  BYTEMERGE: { inputs: ["i0", "i1", "i2", "i3", "i4", "i5", "i6", "i7"], outputs: [], byteInputs: [], byteOutputs: ["byte"] },
  FLIPFLOP: { inputs: ["s", "r"], outputs: ["q"], byteInputs: [], byteOutputs: [] },
  COUNTER: { inputs: ["reset", "inc"], outputs: [], byteInputs: ["load"], byteOutputs: ["count"] },
  RAM2: { inputs: ["a0", "we"], outputs: [], byteInputs: ["data"], byteOutputs: ["out"] },
  RAM4: { inputs: ["a0", "a1", "we"], outputs: [], byteInputs: ["data"], byteOutputs: ["out"] },
  RAM8: { inputs: ["a0", "a1", "a2", "we"], outputs: [], byteInputs: ["data"], byteOutputs: ["out"] },
  RAM16: { inputs: ["a0", "a1", "a2", "a3", "we"], outputs: [], byteInputs: ["data"], byteOutputs: ["out"] },
};

function resolveModulePorts(
  moduleName: string,
  moduleDefs: Map<string, PortInfo>,
): PortInfo {
  if (BUILTIN_PORTS[moduleName]) return BUILTIN_PORTS[moduleName];
  const info = moduleDefs.get(moduleName);
  if (info) return info;
  return { inputs: [], outputs: [], byteInputs: [], byteOutputs: [] };
}

function collectModuleDefs(
  statements: SubStatement[],
  moduleDefs: Map<string, PortInfo>,
): void {
  for (const st of statements) {
    if (st.type === "moduleStatement") {
      const inputs: string[] = [];
      const outputs: string[] = [];
      const byteInputs: string[] = [];
      const byteOutputs: string[] = [];
      for (const defSt of st.definitionStatements) {
        if (defSt.subtype.type === "varStatement") {
          const mod = defSt.subtype.moduleName;
          const name = defSt.subtype.variableName;
          if (mod === "BITIN") inputs.push(name);
          else if (mod === "BITOUT") outputs.push(name);
          else if (mod === "BYTEIN") byteInputs.push(name);
          else if (mod === "BYTEOUT") byteOutputs.push(name);
        } else if (defSt.subtype.type === "moduleStatement") {
          collectModuleDefs([defSt.subtype], moduleDefs);
        }
      }
      moduleDefs.set(st.name, { inputs, outputs, byteInputs, byteOutputs });
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
  byteInputs: string[];
  byteOutputs: string[];
  value?: boolean | number;
  memoryDump?: number[];
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
    else if (st.moduleName.startsWith("RAM")) nodeType = "ramNode";
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
        byteInputs: ports.byteInputs,
        byteOutputs: ports.byteOutputs,
      },
    });
  }

  // Create edges from wire statements
  for (const st of subStatements) {
    if (st.type !== "wireStatement") continue;

    const srcPorts = varPorts.get(st.srcVariableName);
    const destPorts = varPorts.get(st.destVariableName);

    let srcHandle = st.srcPortName;
    let destHandle = st.destPortName;

    // Determine if this is a byte wire
    const isByteWire = isResolvedAsByteWire(srcHandle, srcPorts, destHandle, destPorts);

    if (isByteWire) {
      // Generate single bus edge for BYTE wire
      const srcBusHandle = resolveByteSourceBusHandle(srcHandle, srcPorts);
      const destBusHandle = resolveByteDestBusHandle(destHandle, destPorts);
      edges.push({
        id: `${st.srcVariableName}.${srcBusHandle}-${st.destVariableName}.${destBusHandle}`,
        source: st.srcVariableName,
        sourceHandle: srcBusHandle,
        target: st.destVariableName,
        targetHandle: destBusHandle,
        animated: true,
        style: { strokeWidth: 3, stroke: "#6366f1" },
      });
    } else {
      // Resolve "_" port for BIT wire
      if (srcHandle === "_") {
        if (srcPorts && srcPorts.outputs.length === 1) srcHandle = srcPorts.outputs[0];
      }
      if (destHandle === "_") {
        if (destPorts && destPorts.inputs.length === 1) destHandle = destPorts.inputs[0];
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
  }

  // Apply dagre layout
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "LR", nodesep: 50, ranksep: 100 });
  g.setDefaultEdgeLabel(() => ({}));

  for (const node of nodes) {
    const data = node.data as NodeData;
    const maxHandles = Math.max(
      data.inputs.length + data.byteInputs.length,
      data.outputs.length + data.byteOutputs.length,
      1,
    );
    const nodeHeight = Math.max(NODE_HEIGHT, maxHandles * 30);
    g.setNode(node.id, { width: NODE_WIDTH, height: nodeHeight });
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

function isSrcByte(handle: string, ports: PortInfo | undefined): boolean {
  if (!ports) return false;
  if (handle !== "_") {
    return ports.byteOutputs.includes(handle);
  }
  return ports.byteOutputs.length === 1 && ports.outputs.length === 0;
}

function isDestByte(handle: string, ports: PortInfo | undefined): boolean {
  if (!ports) return false;
  if (handle !== "_") {
    return ports.byteInputs.includes(handle);
  }
  return ports.byteInputs.length === 1 && ports.inputs.length === 0;
}

function isResolvedAsByteWire(
  srcHandle: string,
  srcPorts: PortInfo | undefined,
  destHandle: string,
  destPorts: PortInfo | undefined,
): boolean {
  return isSrcByte(srcHandle, srcPorts) && isDestByte(destHandle, destPorts);
}

function resolveByteSourceBusHandle(handle: string, ports: PortInfo | undefined): string {
  return handle === "_" ? ports?.byteOutputs[0] ?? handle : handle;
}

function resolveByteDestBusHandle(handle: string, ports: PortInfo | undefined): string {
  return handle === "_" ? ports?.byteInputs[0] ?? handle : handle;
}
