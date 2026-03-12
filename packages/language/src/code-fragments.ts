export const ON = `\
MOD START ON
  VAR nand NAND
  VAR out BITOUT
  WIRE nand _ TO out _
MOD END
`;

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

export const ADD = `\
MOD START ADD
  ${XOR}
  ${AND}
  ${OR}
  VAR i0 BITIN
  VAR i1 BITIN
  VAR i2 BITIN
  VAR xor0 XOR
  WIRE i0 _ TO xor0 i0
  WIRE i1 _ TO xor0 i1
  VAR xor1 XOR
  WIRE xor0 _ TO xor1 i0
  WIRE i2 _ TO xor1 i1
  VAR o0 BITOUT
  WIRE xor1 _ TO o0 _
  VAR and0 AND
  WIRE i0 _ TO and0 i0
  WIRE i1 _ TO and0 i1
  VAR and1 AND
  WIRE xor0 _ TO and1 i0
  WIRE i2 _ TO and1 i1
  VAR or0 OR
  WIRE and0 _ TO or0 i0
  WIRE and1 _ TO or0 i1
  VAR o1 BITOUT
  WIRE or0 _ TO o1 _
MOD END
`;

export const DEC = `\
MOD START DEC
  ${NOT}
  ${AND3}
  VAR i0 BITIN
  VAR i1 BITIN
  VAR i2 BITIN
  VAR n0 NOT
  VAR n1 NOT
  VAR n2 NOT
  WIRE i0 _ TO n0 _
  WIRE i1 _ TO n1 _
  WIRE i2 _ TO n2 _
  VAR a0 AND3
  WIRE n0 _ TO a0 i0
  WIRE n1 _ TO a0 i1
  WIRE n2 _ TO a0 i2
  VAR o0 BITOUT
  WIRE a0 _ TO o0 _
  VAR a1 AND3
  WIRE i0 _ TO a1 i0
  WIRE n1 _ TO a1 i1
  WIRE n2 _ TO a1 i2
  VAR o1 BITOUT
  WIRE a1 _ TO o1 _
  VAR a2 AND3
  WIRE n0 _ TO a2 i0
  WIRE i1 _ TO a2 i1
  WIRE n2 _ TO a2 i2
  VAR o2 BITOUT
  WIRE a2 _ TO o2 _
  VAR a3 AND3
  WIRE i0 _ TO a3 i0
  WIRE i1 _ TO a3 i1
  WIRE n2 _ TO a3 i2
  VAR o3 BITOUT
  WIRE a3 _ TO o3 _
  VAR a4 AND3
  WIRE n0 _ TO a4 i0
  WIRE n1 _ TO a4 i1
  WIRE i2 _ TO a4 i2
  VAR o4 BITOUT
  WIRE a4 _ TO o4 _
  VAR a5 AND3
  WIRE i0 _ TO a5 i0
  WIRE n1 _ TO a5 i1
  WIRE i2 _ TO a5 i2
  VAR o5 BITOUT
  WIRE a5 _ TO o5 _
  VAR a6 AND3
  WIRE n0 _ TO a6 i0
  WIRE i1 _ TO a6 i1
  WIRE i2 _ TO a6 i2
  VAR o6 BITOUT
  WIRE a6 _ TO o6 _
  VAR a7 AND3
  WIRE i0 _ TO a7 i0
  WIRE i1 _ TO a7 i1
  WIRE i2 _ TO a7 i2
  VAR o7 BITOUT
  WIRE a7 _ TO o7 _
MOD END
`;

export const ENC = `\
MOD START ENC
  ${OR}
  VAR i0 BITIN
  VAR i1 BITIN
  VAR i2 BITIN
  VAR i3 BITIN
  VAR i4 BITIN
  VAR i5 BITIN
  VAR i6 BITIN
  VAR i7 BITIN
  VAR or00 OR
  WIRE i1 _ TO or00 i0
  WIRE i3 _ TO or00 i1
  VAR or01 OR
  WIRE i5 _ TO or01 i0
  WIRE i7 _ TO or01 i1
  VAR or02 OR
  WIRE or00 _ TO or02 i0
  WIRE or01 _ TO or02 i1
  VAR o0 BITOUT
  WIRE or02 _ TO o0 _
  VAR or10 OR
  WIRE i2 _ TO or10 i0
  WIRE i3 _ TO or10 i1
  VAR or11 OR
  WIRE i6 _ TO or11 i0
  WIRE i7 _ TO or11 i1
  VAR or12 OR
  WIRE or10 _ TO or12 i0
  WIRE or11 _ TO or12 i1
  VAR o1 BITOUT
  WIRE or12 _ TO o1 _
  VAR or20 OR
  WIRE i4 _ TO or20 i0
  WIRE i5 _ TO or20 i1
  VAR or21 OR
  WIRE i6 _ TO or21 i0
  WIRE i7 _ TO or21 i1
  VAR or22 OR
  WIRE or20 _ TO or22 i0
  WIRE or21 _ TO or22 i1
  VAR o2 BITOUT
  WIRE or22 _ TO o2 _
MOD END
`;

export const BYTEADD = `\
MOD START BYTEADD
  ${ADD}
  VAR a BYTEIN
  VAR b BYTEIN
  VAR sa BYTESPLIT
  WIRE a _ TO sa _
  VAR sb BYTESPLIT
  WIRE b _ TO sb _
  VAR add0 ADD
  WIRE sa o0 TO add0 i0
  WIRE sb o0 TO add0 i1
  VAR add1 ADD
  WIRE sa o1 TO add1 i0
  WIRE sb o1 TO add1 i1
  WIRE add0 o1 TO add1 i2
  VAR add2 ADD
  WIRE sa o2 TO add2 i0
  WIRE sb o2 TO add2 i1
  WIRE add1 o1 TO add2 i2
  VAR add3 ADD
  WIRE sa o3 TO add3 i0
  WIRE sb o3 TO add3 i1
  WIRE add2 o1 TO add3 i2
  VAR add4 ADD
  WIRE sa o4 TO add4 i0
  WIRE sb o4 TO add4 i1
  WIRE add3 o1 TO add4 i2
  VAR add5 ADD
  WIRE sa o5 TO add5 i0
  WIRE sb o5 TO add5 i1
  WIRE add4 o1 TO add5 i2
  VAR add6 ADD
  WIRE sa o6 TO add6 i0
  WIRE sb o6 TO add6 i1
  WIRE add5 o1 TO add6 i2
  VAR add7 ADD
  WIRE sa o7 TO add7 i0
  WIRE sb o7 TO add7 i1
  WIRE add6 o1 TO add7 i2
  VAR m BYTEMERGE
  WIRE add0 o0 TO m i0
  WIRE add1 o0 TO m i1
  WIRE add2 o0 TO m i2
  WIRE add3 o0 TO m i3
  WIRE add4 o0 TO m i4
  WIRE add5 o0 TO m i5
  WIRE add6 o0 TO m i6
  WIRE add7 o0 TO m i7
  VAR out BYTEOUT
  WIRE m _ TO out _
MOD END
`;

export const DLATCH = `\
MOD START DLATCH
  ${NOT}
  ${AND}
  VAR d BITIN
  VAR e BITIN
  VAR not NOT
  WIRE d _ TO not _
  VAR and_s AND
  WIRE d _ TO and_s i0
  WIRE e _ TO and_s i1
  VAR and_r AND
  WIRE not _ TO and_r i0
  WIRE e _ TO and_r i1
  VAR ff FLIPFLOP
  WIRE and_s _ TO ff s
  WIRE and_r _ TO ff r
  VAR q BITOUT
  WIRE ff _ TO q _
MOD END
`;

export const DECODER_3BIT = `\
MOD START DECODER_3BIT
  ${NOT}
  ${AND3}
  VAR i0 BITIN
  VAR i1 BITIN
  VAR i2 BITIN
  VAR n0 NOT
  VAR n1 NOT
  VAR n2 NOT
  WIRE i0 _ TO n0 _
  WIRE i1 _ TO n1 _
  WIRE i2 _ TO n2 _

  VAR and0 AND3
  WIRE n0 _ TO and0 i0
  WIRE n1 _ TO and0 i1
  WIRE n2 _ TO and0 i2
  VAR o0 BITOUT
  WIRE and0 _ TO o0 _

  VAR and1 AND3
  WIRE i0 _ TO and1 i0
  WIRE n1 _ TO and1 i1
  WIRE n2 _ TO and1 i2
  VAR o1 BITOUT
  WIRE and1 _ TO o1 _

  VAR and2 AND3
  WIRE n0 _ TO and2 i0
  WIRE i1 _ TO and2 i1
  WIRE n2 _ TO and2 i2
  VAR o2 BITOUT
  WIRE and2 _ TO o2 _

  VAR and3 AND3
  WIRE n0 _ TO and3 i0
  WIRE n1 _ TO and3 i1
  WIRE i2 _ TO and3 i2
  VAR o3 BITOUT
  WIRE and3 _ TO o3 _

  VAR and4 AND3
  WIRE i0 _ TO and4 i0
  WIRE i1 _ TO and4 i1
  WIRE n2 _ TO and4 i2
  VAR o4 BITOUT
  WIRE and4 _ TO o4 _

  VAR and5 AND3
  WIRE i0 _ TO and5 i0
  WIRE n1 _ TO and5 i1
  WIRE i2 _ TO and5 i2
  VAR o5 BITOUT
  WIRE and5 _ TO o5 _

  VAR and6 AND3
  WIRE n0 _ TO and6 i0
  WIRE i1 _ TO and6 i1
  WIRE i2 _ TO and6 i2
  VAR o6 BITOUT
  WIRE and6 _ TO o6 _

  VAR and7 AND3
  WIRE i0 _ TO and7 i0
  WIRE i1 _ TO and7 i1
  WIRE i2 _ TO and7 i2
  VAR o7 BITOUT
  WIRE and7 _ TO o7 _
MOD END
`;

export const MUX = `\
MOD START MUX
  ${NOT}
  ${AND}
  ${OR}
  VAR a BITIN
  VAR b BITIN
  VAR sel BITIN
  VAR nsel NOT
  WIRE sel _ TO nsel _
  VAR and0 AND
  WIRE a _ TO and0 i0
  WIRE nsel _ TO and0 i1
  VAR and1 AND
  WIRE b _ TO and1 i0
  WIRE sel _ TO and1 i1
  VAR or OR
  WIRE and0 _ TO or i0
  WIRE and1 _ TO or i1
  VAR out BITOUT
  WIRE or _ TO out _
MOD END
`;

export const DMUX = `\
MOD START DMUX
  ${NOT}
  ${AND}
  VAR in BITIN
  VAR sel BITIN
  VAR nsel NOT
  WIRE sel _ TO nsel _
  VAR and0 AND
  WIRE in _ TO and0 i0
  WIRE nsel _ TO and0 i1
  VAR a BITOUT
  WIRE and0 _ TO a _
  VAR and1 AND
  WIRE in _ TO and1 i0
  WIRE sel _ TO and1 i1
  VAR b BITOUT
  WIRE and1 _ TO b _
MOD END
`;
