import type { Node, Edge } from "@xyflow/react";
import type { Program, SubStatement } from "@nandlang-ts/language/parser/ast";

type PortInfo = { inputs: string[]; outputs: string[] };

const BUILTIN_PORTS: Record<string, PortInfo> = {
  NAND: { inputs: ["i0", "i1"], outputs: ["o0"] },
  BITIN: { inputs: [], outputs: ["o0"] },
  BITOUT: { inputs: ["i0"], outputs: [] },
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
  value?: boolean;
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

  // Categorize vars for layout
  const bitins: SubStatement[] = [];
  const bitouts: SubStatement[] = [];
  const others: SubStatement[] = [];

  for (const st of subStatements) {
    if (st.type === "varStatement") {
      if (st.moduleName === "BITIN") bitins.push(st);
      else if (st.moduleName === "BITOUT") bitouts.push(st);
      else others.push(st);
    }
  }

  const COL_X = [50, 350, 650];
  const ROW_HEIGHT = 100;

  // Create nodes for BITINs (left column)
  bitins.forEach((st, i) => {
    if (st.type !== "varStatement") return;
    const ports = BUILTIN_PORTS.BITIN;
    varPorts.set(st.variableName, ports);
    inputNames.push(st.variableName);
    nodes.push({
      id: st.variableName,
      type: "bitinNode",
      position: { x: COL_X[0], y: i * ROW_HEIGHT + 50 },
      data: {
        label: st.variableName,
        moduleName: "BITIN",
        inputs: ports.inputs,
        outputs: ports.outputs,
      },
    });
  });

  // Create nodes for middle column
  others.forEach((st, i) => {
    if (st.type !== "varStatement") return;
    const ports = resolveModulePorts(st.moduleName, moduleDefs);
    varPorts.set(st.variableName, ports);

    let nodeType: string;
    if (st.moduleName === "NAND") nodeType = "nandNode";
    else if (st.moduleName === "FLIPFLOP") nodeType = "flipflopNode";
    else nodeType = "moduleNode";

    nodes.push({
      id: st.variableName,
      type: nodeType,
      position: { x: COL_X[1], y: i * ROW_HEIGHT + 50 },
      data: {
        label: st.variableName,
        moduleName: st.moduleName,
        inputs: ports.inputs,
        outputs: ports.outputs,
      },
    });
  });

  // Create nodes for BITOUTs (right column)
  bitouts.forEach((st, i) => {
    if (st.type !== "varStatement") return;
    const ports = BUILTIN_PORTS.BITOUT;
    varPorts.set(st.variableName, ports);
    outputNames.push(st.variableName);
    nodes.push({
      id: st.variableName,
      type: "bitoutNode",
      position: { x: COL_X[2], y: i * ROW_HEIGHT + 50 },
      data: {
        label: st.variableName,
        moduleName: "BITOUT",
        inputs: ports.inputs,
        outputs: ports.outputs,
      },
    });
  });

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

  return { nodes, edges, inputNames, outputNames };
}
