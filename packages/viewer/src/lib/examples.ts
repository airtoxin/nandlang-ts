import { NOT, AND, OR, XOR, NOR, XNOR } from "@nandlang-ts/language/code-fragments";

export const examples = [
  {
    label: "NAND",
    code: `VAR i0 BITIN
VAR i1 BITIN
VAR nand NAND
WIRE i0 _ TO nand i0
WIRE i1 _ TO nand i1
VAR o0 BITOUT
WIRE nand _ TO o0 _`,
  },
  {
    label: "NOT",
    code: `${NOT}
VAR in BITIN
VAR not NOT
WIRE in _ TO not _
VAR out BITOUT
WIRE not _ TO out _`,
  },
  {
    label: "AND",
    code: `${AND}
VAR i0 BITIN
VAR i1 BITIN
VAR and AND
WIRE i0 _ TO and i0
WIRE i1 _ TO and i1
VAR o0 BITOUT
WIRE and _ TO o0 _`,
  },
  {
    label: "OR",
    code: `${OR}
VAR i0 BITIN
VAR i1 BITIN
VAR or OR
WIRE i0 _ TO or i0
WIRE i1 _ TO or i1
VAR o0 BITOUT
WIRE or _ TO o0 _`,
  },
  {
    label: "XOR",
    code: `${XOR}
VAR i0 BITIN
VAR i1 BITIN
VAR xor XOR
WIRE i0 _ TO xor i0
WIRE i1 _ TO xor i1
VAR o0 BITOUT
WIRE xor _ TO o0 _`,
  },
  {
    label: "NOR",
    code: `${NOR}
VAR i0 BITIN
VAR i1 BITIN
VAR nor NOR
WIRE i0 _ TO nor i0
WIRE i1 _ TO nor i1
VAR o0 BITOUT
WIRE nor _ TO o0 _`,
  },
  {
    label: "XNOR",
    code: `${XNOR}
VAR i0 BITIN
VAR i1 BITIN
VAR xnor XNOR
WIRE i0 _ TO xnor i0
WIRE i1 _ TO xnor i1
VAR o0 BITOUT
WIRE xnor _ TO o0 _`,
  },
];
