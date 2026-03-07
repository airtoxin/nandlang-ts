import { useState, useCallback, useRef } from "react";
import type { Node, Edge } from "@xyflow/react";
import { program as parseProgram } from "@nandlang-ts/language/parser/program";
import { Vm } from "@nandlang-ts/language/vm";
import { astToGraph, type NodeData } from "../lib/astToGraph";

export function useCircuit() {
  const [nodes, setNodes] = useState<Node<NodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [inputNames, setInputNames] = useState<string[]>([]);
  const [outputNames, setOutputNames] = useState<string[]>([]);
  const [inputSignals, setInputSignals] = useState<Map<string, boolean>>(
    new Map(),
  );
  const [outputSignals, setOutputSignals] = useState<Map<string, boolean>>(
    new Map(),
  );
  const [error, setError] = useState<string | null>(null);
  const vmRef = useRef<Vm | null>(null);

  const compile = useCallback((code: string) => {
    setError(null);
    try {
      const parseResult = parseProgram([...code]);
      if (!parseResult.success) {
        setError(
          `Parse error near: ...${parseResult.rest.slice(0, 30).join("")}...`,
        );
        return;
      }

      const graph = astToGraph(parseResult.data);
      setInputNames(graph.inputNames);
      setOutputNames(graph.outputNames);

      const initialInputs = new Map<string, boolean>();
      for (const name of graph.inputNames) {
        initialInputs.set(name, false);
      }
      setInputSignals(initialInputs);

      const vm = new Vm();
      vm.compile(code);
      vmRef.current = vm;

      const outputs = vm.run(initialInputs);
      setOutputSignals(outputs);

      // Update node data with output values
      const updatedNodes = graph.nodes.map((node) => {
        if (node.data.moduleName === "BITOUT") {
          return { ...node, data: { ...node.data, value: outputs.get(node.id) ?? false } };
        }
        if (node.data.moduleName === "BITIN") {
          return { ...node, data: { ...node.data, value: false } };
        }
        return node;
      });

      setNodes(updatedNodes);
      setEdges(graph.edges);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  const toggleInput = useCallback(
    (name: string) => {
      setInputSignals((prev) => {
        const next = new Map(prev);
        next.set(name, !prev.get(name));

        if (vmRef.current) {
          try {
            const outputs = vmRef.current.run(next);
            setOutputSignals(outputs);

            setNodes((prevNodes) =>
              prevNodes.map((node) => {
                if (node.data.moduleName === "BITOUT") {
                  return {
                    ...node,
                    data: { ...node.data, value: outputs.get(node.id) ?? false },
                  };
                }
                if (node.data.moduleName === "BITIN") {
                  return {
                    ...node,
                    data: { ...node.data, value: next.get(node.id) ?? false },
                  };
                }
                return node;
              }),
            );
          } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
          }
        }

        return next;
      });
    },
    [],
  );

  const updateNodeSignals = useCallback(
    (inputs: Map<string, boolean>, outputs: Map<string, boolean>) => {
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          if (node.data.moduleName === "BITIN") {
            return {
              ...node,
              data: { ...node.data, value: inputs.get(node.id) ?? false },
            };
          }
          if (node.data.moduleName === "BITOUT") {
            return {
              ...node,
              data: { ...node.data, value: outputs.get(node.id) ?? false },
            };
          }
          return node;
        }),
      );
    },
    [],
  );

  return {
    nodes,
    edges,
    inputNames,
    outputNames,
    inputSignals,
    outputSignals,
    error,
    compile,
    toggleInput,
    updateNodeSignals,
    setNodes,
    setEdges,
  };
}
