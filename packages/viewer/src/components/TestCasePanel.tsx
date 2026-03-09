import type { TestCase } from "../hooks/useTestCases";

type Props = {
  testCases: TestCase[];
  inputNames: string[];
  outputNames: string[];
  onRunAll: () => void;
  onRunNext: () => void;
  allPassed: boolean;
  onNextLevel: () => void;
  isLastLevel: boolean;
  disabled?: boolean;
};

function StatusBadge({ status }: { status: TestCase["status"] }) {
  if (status === "idle") return <span className="status-badge status-idle">-</span>;
  if (status === "pass") return <span className="status-badge status-pass">PASS</span>;
  return <span className="status-badge status-fail">FAIL</span>;
}

function BitValue({
  value,
  className,
}: {
  value: boolean;
  className?: string;
}) {
  return (
    <span
      className={`bit-value ${value ? "bit-on" : "bit-off"} ${className ?? ""}`}
    >
      {value ? "1" : "0"}
    </span>
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
  onRunAll,
  onRunNext,
  allPassed,
  onNextLevel,
  isLastLevel,
  disabled = false,
}: Props) {
  if (inputNames.length === 0 && outputNames.length === 0) return null;

  return (
    <div className="test-case-panel">
      <div className="test-case-header">
        <h3>Test Cases</h3>
        <div className="test-case-actions">
          <button
            className="action-btn step-btn"
            onClick={onRunNext}
            disabled={disabled || testCases.length === 0}
          >
            Step
          </button>
          <button
            className="action-btn run-btn"
            onClick={onRunAll}
            disabled={disabled || testCases.length === 0}
          >
            Run All
          </button>
        </div>
      </div>
      {allPassed && (
        <div className="success-banner">
          All tests passed!
          {!isLastLevel && (
            <button className="next-level-btn" onClick={onNextLevel}>
              Next Level &rarr;
            </button>
          )}
        </div>
      )}
      {testCases.length === 0 ? (
        <p className="empty-message">No test cases.</p>
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
                      <BitValue value={tc.inputs.get(name) ?? false} />
                    </td>
                  ))}
                </tr>
              ))}
              {/* Expected output rows */}
              {outputNames.map((name) => (
                <tr key={`exp-${name}`}>
                  <th className="row-header expected-header">
                    {name}<br /><small>(expected)</small>
                  </th>
                  {testCases.map((tc, i) => (
                    <td key={i} className={`test-col-${tc.status}`}>
                      <BitValue
                        value={tc.expectedOutputs.get(name) ?? false}
                        className="expected-bit"
                      />
                    </td>
                  ))}
                </tr>
              ))}
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
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
