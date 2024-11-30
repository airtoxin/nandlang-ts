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

export const OR3 = `\
MOD START OR3
  ${OR}
  VAR i0 BITIN
  VAR i1 BITIN
  VAR i2 BITIN
  VAR or0 OR
  VAR or1 OR
  WIRE i0 _ TO or0 i0
  WIRE i1 _ TO or0 i1
  WIRE or0 _ TO or1 i0
  WIRE i2 _ TO or1 i1
  VAR o0 BITOUT
  WIRE or1 _ TO o0 _
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

export const DECODER_3BIT = `\
MOD START DECODER_3BIT
  ${NOT}
  ${AND}
  VAR i0 BITIN
  VAR i1 BITIN
  VAR i2 BITIN
  VAR n0 NOT
  VAR n1 NOT
  VAR n2 NOT
  VAR and0 AND
  VAR and1 AND
  VAR and2 AND
  VAR and3 AND
  VAR and4 AND
  VAR and5 AND
  VAR and6 AND
  VAR and7 AND
  VAR o0 BITOUT
  VAR o1 BITOUT
  VAR o2 BITOUT
  VAR o3 BITOUT
  VAR o4 BITOUT
  VAR o5 BITOUT
  VAR o6 BITOUT
  VAR o7 BITOUT
  WIRE i0 _ TO n0 _
  WIRE i1 _ TO n1 _
  WIRE i2 _ TO n2 _
MOD END
`;
