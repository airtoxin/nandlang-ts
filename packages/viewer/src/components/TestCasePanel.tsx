import type { TestCase } from "../hooks/useTestCases";

type Props = {
  testCases: TestCase[];
  inputNames: string[];
  outputNames: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onToggleInput: (index: number, name: string) => void;
  onToggleExpectedOutput: (index: number, name: string) => void;
  onRunAll: () => void;
};

function StatusBadge({ status }: { status: TestCase["status"] }) {
  if (status === "idle") return <span className="status-badge status-idle">-</span>;
  if (status === "pass") return <span className="status-badge status-pass">PASS</span>;
  return <span className="status-badge status-fail">FAIL</span>;
}

function BitButton({
  value,
  onClick,
  className,
}: {
  value: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      className={`bit-button ${value ? "bit-on" : "bit-off"} ${className ?? ""}`}
      onClick={onClick}
    >
      {value ? "1" : "0"}
    </button>
  );
}

function BitDisplay({
  value,
  match,
}: {
  value: boolean;
  match: boolean;
}) {
  return (
    <span className={`bit-display ${match ? "" : "bit-mismatch"}`}>
      {value ? "1" : "0"}
    </span>
  );
}

export function TestCasePanel({
  testCases,
  inputNames,
  outputNames,
  onAdd,
  onRemove,
  onToggleInput,
  onToggleExpectedOutput,
  onRunAll,
}: Props) {
  if (inputNames.length === 0 && outputNames.length === 0) return null;

  return (
    <div className="test-case-panel">
      <div className="test-case-header">
        <h3>Test Cases</h3>
        <div className="test-case-actions">
          <button className="action-btn add-btn" onClick={onAdd}>
            + Add
          </button>
          <button
            className="action-btn run-btn"
            onClick={onRunAll}
            disabled={testCases.length === 0}
          >
            Run All
          </button>
        </div>
      </div>
      {testCases.length === 0 ? (
        <p className="empty-message">
          Click "+ Add" to create a test case.
        </p>
      ) : (
        <div className="table-wrapper">
          <table>
            <tbody>
              {/* Status row */}
              <tr>
                <th className="row-header"></th>
                {testCases.map((tc, i) => (
                  <td key={i} className={`col-status test-col-${tc.status}`}>
                    <StatusBadge status={tc.status} />
                  </td>
                ))}
              </tr>
              {/* Input rows */}
              {inputNames.map((name) => (
                <tr key={`in-${name}`}>
                  <th className="row-header input-header">{name}</th>
                  {testCases.map((tc, i) => (
                    <td key={i} className={`test-col-${tc.status}`}>
                      <BitButton
                        value={tc.inputs.get(name) ?? false}
                        onClick={() => onToggleInput(i, name)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
              {/* Separator row */}
              <tr className="separator-row">
                <th className="row-header separator"></th>
                {testCases.map((_, i) => (
                  <td key={i} className="separator"></td>
                ))}
              </tr>
              {/* Expected output rows */}
              {outputNames.map((name) => (
                <tr key={`exp-${name}`}>
                  <th className="row-header expected-header">
                    {name}<br /><small>(expected)</small>
                  </th>
                  {testCases.map((tc, i) => (
                    <td key={i} className={`test-col-${tc.status}`}>
                      <BitButton
                        value={tc.expectedOutputs.get(name) ?? false}
                        onClick={() => onToggleExpectedOutput(i, name)}
                        className="expected-bit"
                      />
                    </td>
                  ))}
                </tr>
              ))}
              {/* Separator row */}
              <tr className="separator-row">
                <th className="row-header separator"></th>
                {testCases.map((_, i) => (
                  <td key={i} className="separator"></td>
                ))}
              </tr>
              {/* Actual output rows */}
              {outputNames.map((name) => (
                <tr key={`act-${name}`}>
                  <th className="row-header actual-header">
                    {name}<br /><small>(actual)</small>
                  </th>
                  {testCases.map((tc, i) => (
                    <td key={i} className={`test-col-${tc.status}`}>
                      {tc.actualOutputs ? (
                        <BitDisplay
                          value={tc.actualOutputs.get(name) ?? false}
                          match={
                            tc.actualOutputs.get(name) ===
                            tc.expectedOutputs.get(name)
                          }
                        />
                      ) : (
                        <span className="bit-display bit-empty">-</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              {/* Remove row */}
              <tr>
                <th className="row-header"></th>
                {testCases.map((_, i) => (
                  <td key={i}>
                    <button
                      className="remove-btn"
                      onClick={() => onRemove(i)}
                      title="Remove"
                    >
                      x
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
