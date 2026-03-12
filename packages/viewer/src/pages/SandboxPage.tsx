import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { applyNodeChanges, applyEdgeChanges } from "@xyflow/react";
import type { NodeChange, EdgeChange } from "@xyflow/react";
import { CodeEditorPanel } from "../components/CodeEditorPanel";
import { CircuitDiagramPanel } from "../components/CircuitDiagramPanel";
import { useCircuit } from "../hooks/useCircuit";
import {
  ON, NOT, AND, AND3, OR, OR3, NOR, XOR, XNOR,
  ADD, DEC, ENC, BYTEADD, DLATCH, REG, BYTEREG, MUX, DMUX,
} from "@nandlang-ts/language/code-fragments";
import "./SandboxPage.css";

const PRELOADED_MODULES = `${ON}${NOT}${AND}${AND3}${OR}${OR3}${NOR}${XOR}${XNOR}${ADD}${DEC}${ENC}${BYTEADD}${DLATCH}${REG}${BYTEREG}${MUX}${DMUX}`;

const AVAILABLE_MODULE_NAMES = [
  // 組み込みモジュール
  "NAND", "BITIN", "BITOUT", "BYTEIN", "BYTEOUT",
  "BYTESPLIT", "BYTEMERGE", "FLIPFLOP", "COUNTER",
  "RAM2", "RAM4", "RAM8", "RAM16",
  // コード定義モジュール
  "ON", "NOT", "AND", "AND3", "OR", "OR3", "NOR", "XOR", "XNOR",
  "ADD", "DEC", "ENC", "BYTEADD", "DLATCH", "REG", "BYTEREG", "MUX", "DMUX",
];

const DEFAULT_CODE = `# 全モジュールショーケース
VAR a BITIN
VAR b BITIN
VAR c BITIN
VAR din BYTEIN
VAR out1 BITOUT
VAR out2 BITOUT
VAR bout BYTEOUT

# 基本ゲート
VAR g_nand NAND
WIRE a _ TO g_nand i0
WIRE b _ TO g_nand i1
VAR g_on ON
VAR g_not NOT
WIRE g_nand _ TO g_not _
VAR g_and AND
WIRE a _ TO g_and i0
WIRE b _ TO g_and i1
VAR g_or OR
WIRE a _ TO g_or i0
WIRE b _ TO g_or i1
VAR g_nor NOR
WIRE a _ TO g_nor i0
WIRE b _ TO g_nor i1
VAR g_xor XOR
WIRE a _ TO g_xor i0
WIRE b _ TO g_xor i1
VAR g_xnor XNOR
WIRE a _ TO g_xnor i0
WIRE b _ TO g_xnor i1
VAR g_and3 AND3
WIRE a _ TO g_and3 i0
WIRE b _ TO g_and3 i1
WIRE c _ TO g_and3 i2
VAR g_or3 OR3
WIRE a _ TO g_or3 i0
WIRE b _ TO g_or3 i1
WIRE c _ TO g_or3 i2

# MUX/DMUX
VAR g_mux MUX
WIRE a _ TO g_mux a
WIRE b _ TO g_mux b
WIRE c _ TO g_mux sel
VAR g_dmux DMUX
WIRE g_mux _ TO g_dmux in
WIRE c _ TO g_dmux sel

# 加算器
VAR g_add ADD
WIRE a _ TO g_add i0
WIRE b _ TO g_add i1
WIRE c _ TO g_add i2
WIRE g_add o0 TO out1 _

# デコーダ/エンコーダ
VAR g_dec DEC
WIRE a _ TO g_dec i0
WIRE b _ TO g_dec i1
WIRE c _ TO g_dec i2
VAR g_enc ENC
WIRE g_dec o0 TO g_enc i0
WIRE g_dec o1 TO g_enc i1
WIRE g_dec o2 TO g_enc i2
WIRE g_dec o3 TO g_enc i3
WIRE g_dec o4 TO g_enc i4
WIRE g_dec o5 TO g_enc i5
WIRE g_dec o6 TO g_enc i6
WIRE g_dec o7 TO g_enc i7

# 記憶素子
VAR g_ff FLIPFLOP
WIRE a _ TO g_ff s
WIRE b _ TO g_ff r
VAR g_dl DLATCH
WIRE g_ff _ TO g_dl d
WIRE c _ TO g_dl e
VAR g_reg REG
WIRE g_dl _ TO g_reg d
WIRE c _ TO g_reg clk
WIRE g_reg _ TO out2 _

# バイト系
VAR g_split BYTESPLIT
WIRE din _ TO g_split _
VAR g_merge BYTEMERGE
WIRE g_split o0 TO g_merge i0
WIRE g_split o1 TO g_merge i1
WIRE g_split o2 TO g_merge i2
WIRE g_split o3 TO g_merge i3
WIRE g_split o4 TO g_merge i4
WIRE g_split o5 TO g_merge i5
WIRE g_split o6 TO g_merge i6
WIRE g_split o7 TO g_merge i7

# BYTEADD
VAR g_badd BYTEADD
WIRE g_merge _ TO g_badd a
WIRE din _ TO g_badd b

# BYTEREG
VAR g_breg BYTEREG
WIRE g_badd _ TO g_breg d
WIRE c _ TO g_breg clk

# COUNTER
VAR g_ctr COUNTER
WIRE a _ TO g_ctr reset
WIRE g_breg _ TO g_ctr load
WIRE b _ TO g_ctr inc

# RAM
VAR g_ram2 RAM2
WIRE a _ TO g_ram2 a0
WIRE b _ TO g_ram2 we
WIRE g_ctr count TO g_ram2 data
VAR g_ram4 RAM4
WIRE a _ TO g_ram4 a0
WIRE b _ TO g_ram4 a1
WIRE c _ TO g_ram4 we
WIRE g_ram2 out TO g_ram4 data
VAR g_ram8 RAM8
WIRE a _ TO g_ram8 a0
WIRE b _ TO g_ram8 a1
WIRE c _ TO g_ram8 a2
WIRE g_on _ TO g_ram8 we
WIRE g_ram4 out TO g_ram8 data
VAR g_ram16 RAM16
WIRE a _ TO g_ram16 a0
WIRE b _ TO g_ram16 a1
WIRE c _ TO g_ram16 a2
WIRE g_not _ TO g_ram16 a3
WIRE g_on _ TO g_ram16 we
WIRE g_ram8 out TO g_ram16 data
WIRE g_ram16 out TO bout _
`;

export function SandboxPage() {
  const circuit = useCircuit();
  const [fitViewTrigger, setFitViewTrigger] = useState(0);

  const handleCompile = useCallback(
    (code: string) => {
      circuit.compile(`${PRELOADED_MODULES}${code}`);
      setFitViewTrigger((c) => c + 1);
    },
    [circuit],
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      circuit.setNodes((nds) => applyNodeChanges(changes, nds) as typeof nds);
    },
    [circuit],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      circuit.setEdges((eds) => applyEdgeChanges(changes, eds) as typeof eds);
    },
    [circuit],
  );

  return (
    <div className="sandbox-layout">
      <div className="sandbox-sidebar">
        <Link to="/" className="back-link">
          &larr; Back
        </Link>
        <CodeEditorPanel
          onCompile={handleCompile}
          error={circuit.error}
          initialCode={DEFAULT_CODE}
          availableModules={AVAILABLE_MODULE_NAMES}
        />
      </div>
      <CircuitDiagramPanel
        nodes={circuit.nodes}
        edges={circuit.edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitViewTrigger={fitViewTrigger}
      />
    </div>
  );
}
