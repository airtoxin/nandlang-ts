import { describe, expect, test } from "vitest";
import { program } from "./program";
import dedent from "dedent";

describe("program", () => {
  test("succeeds with program", () => {
    const p = dedent`
      MOD START AND
          VAR i0 BITIN
          VAR i1 BITIN
          VAR nand NAND
          WIRE i0 _ TO nand i0
          WIRE i1 _ TO nand i1
          VAR not NAND
          WIRE nand _ TO not i0
          WIRE nand _ TO not i1
          VAR o0 BITOUT
          WIRE not _ TO o0 _
      MOD END

      MOD START XOR
          VAR i0 BITIN
          VAR i1 BITIN

          VAR nand0 NAND
          WIRE i0 _ TO nand0 i0
          WIRE i1 _ TO nand0 i1

          VAR nand1 NAND
          WIRE i0 _ TO nand1 i0
          WIRE nand0 _ TO nand1 i1

          VAR nand2 NAND
          WIRE nand0 _ TO nand2 i0
          WIRE i1 _ TO nand2 i1

          VAR nand3 NAND
          WIRE nand1 _ TO nand3 i0
          WIRE nand2 _ TO nand3 i1

          VAR o0 BITOUT
          WIRE nand3 _ TO o0 _
      MOD END

      # HALF ADDER
      VAR a BITIN
      VAR b BITIN
      VAR xor XOR
      VAR and AND

      # SUM
      VAR sum BITOUT
      WIRE a _ TO xor i0
      WIRE b _ TO xor i1
      WIRE xor _ TO sum _

      # CARRY
      VAR car BITOUT
      WIRE a _ TO and i0
      WIRE b _ TO and i1
      WIRE and _ TO car _
    `;

    const result = program(p);
    expect(result.success).toBe(true);
    expect(result.rest).toBe("");
    if (result.success) {
      expect(result.data.type).toBe("program");
      expect(result.data.statements).toHaveLength(14);
    }
  });

  test("succeeds with empty program", () => {
    const p = `

    `;
    expect(program(p)).toMatchInlineSnapshot(`
      {
        "data": {
          "statements": [],
          "type": "program",
        },
        "rest": "",
        "success": true,
      }
    `);
  });
});
