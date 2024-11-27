export const NOT = `\
MOD START NOT
  VAR in BITIN
  VAR nand NAND
  WIRE in _ TO nand i0
  WIRE in _ TO nand i1
  VAR out BITOUT
  WIRE nand _ TO out _
MOD END
`;

export const AND = `\
MOD START AND
  ${NOT}
  VAR i0 BITIN
  VAR i1 BITIN  
  VAR nand NAND
  WIRE i0 _ TO nand i0
  WIRE i1 _ TO nand i1
  VAR not NOT
  WIRE nand _ TO not _
  VAR o0 BITOUT
  WIRE not _ TO o0 _
MOD END
`;

export const AND3 = `\
MOD START AND3
  ${AND}
  VAR i0 BITIN
  VAR i1 BITIN
  VAR a0 AND
  WIRE i0 _ TO a0 i0
  WIRE i1 _ TO a0 i1
  VAR i2 BITIN
  VAR a1 AND
  WIRE a0 _ TO a1 i0
  WIRE i2 _ TO a1 i1
  VAR o0 BITOUT
  WIRE a1 _ TO o0 _
MOD END
`;

export const OR = `\
MOD START OR
  ${NOT}
  VAR i0 BITIN
  VAR n0 NOT
  WIRE i0 _ TO n0 _
  VAR i1 BITIN
  VAR n1 NOT
  WIRE i1 _ TO n1 _
  VAR nand NAND
  WIRE n0 _ TO nand i0
  WIRE n1 _ TO nand i1
  VAR o0 BITOUT
  WIRE nand _ TO o0 _
MOD END
`;

export const NOR = `\
MOD START NOR
  ${NOT}
  ${OR}
  VAR i0 BITIN
  VAR i1 BITIN
  VAR or OR
  WIRE i0 _ TO or i0
  WIRE i1 _ TO or i1
  VAR not NOT
  WIRE or _ TO not _
  VAR o0 BITOUT
  WIRE not _ TO o0 _
MOD END
`;

export const XOR = `\
MOD START XOR
  ${OR}
  ${AND}
  VAR i0 BITIN
  VAR i1 BITIN
  VAR nand NAND
  WIRE i0 _ TO nand i0
  WIRE i1 _ TO nand i1
  VAR or OR
  WIRE i0 _ TO or i0
  WIRE i1 _ TO or i1
  VAR and AND
  WIRE nand _ TO and i0
  WIRE or _ TO and i1
  VAR o0 BITOUT
  WIRE and _ TO o0 _
MOD END
`;

export const XNOR = `\
MOD START XNOR
  ${XOR}
  ${NOT}
  VAR i0 BITIN
  VAR i1 BITIN
  VAR xor XOR
  WIRE i0 _ TO xor i0
  WIRE i1 _ TO xor i1
  VAR not NOT
  WIRE xor _ TO not _
  VAR o0 BITOUT
  WIRE not _ TO o0 _
MOD END
`;
