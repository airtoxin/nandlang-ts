import { useMemo } from "react";
import { Vm } from "@nandlang-ts/language/vm";

export type TruthTableRow = {
  inputs: Map<string, boolean>;
  outputs: Map<string, boolean>;
};

export function useTruthTable(
  code: string | null,
  inputNames: string[],
  outputNames: string[],
): { rows: TruthTableRow[]; warning: string | null } {
  return useMemo(() => {
    if (!code || inputNames.length === 0 || outputNames.length === 0) {
      return { rows: [], warning: null };
    }

    if (inputNames.length > 8) {
      return {
        rows: [],
        warning: `Input count (${inputNames.length}) exceeds 8. Truth table would have ${2 ** inputNames.length} rows.`,
      };
    }

    const totalCombinations = 2 ** inputNames.length;
    const rows: TruthTableRow[] = [];

    try {
      const vm = new Vm();
      vm.compile(code);

      for (let i = 0; i < totalCombinations; i++) {
        const inputs = new Map<string, boolean>();
        for (let bit = 0; bit < inputNames.length; bit++) {
          inputs.set(inputNames[bit], Boolean((i >> (inputNames.length - 1 - bit)) & 1));
        }
        const outputs = vm.run(inputs);
        rows.push({ inputs, outputs });
      }
    } catch {
      return { rows: [], warning: null };
    }

    return { rows, warning: null };
  }, [code, inputNames, outputNames]);
}
