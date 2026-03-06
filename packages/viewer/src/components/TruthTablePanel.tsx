import type { TruthTableRow } from "../hooks/useTruthTable";

type Props = {
  rows: TruthTableRow[];
  inputNames: string[];
  outputNames: string[];
  currentInputs: Map<string, boolean>;
  warning: string | null;
};

export function TruthTablePanel({
  rows,
  inputNames,
  outputNames,
  currentInputs,
  warning,
}: Props) {
  if (warning) {
    return (
      <div className="truth-table-panel">
        <h3>Truth Table</h3>
        <p className="warning">{warning}</p>
      </div>
    );
  }

  if (rows.length === 0) return null;

  const isCurrentRow = (row: TruthTableRow) =>
    inputNames.every(
      (name) => row.inputs.get(name) === (currentInputs.get(name) ?? false),
    );

  return (
    <div className="truth-table-panel">
      <h3>Truth Table</h3>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {inputNames.map((name) => (
                <th key={`in-${name}`} className="input-header">
                  {name}
                </th>
              ))}
              <th className="separator"></th>
              {outputNames.map((name) => (
                <th key={`out-${name}`} className="output-header">
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={isCurrentRow(row) ? "highlight" : ""}>
                {inputNames.map((name) => (
                  <td key={`in-${name}`}>{row.inputs.get(name) ? "1" : "0"}</td>
                ))}
                <td className="separator"></td>
                {outputNames.map((name) => (
                  <td key={`out-${name}`}>
                    {row.outputs.get(name) ? "1" : "0"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
