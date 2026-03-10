import type { TestCase } from "../hooks/useTestCases";

const IconStep = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <polygon points="3,1 13,8 3,15" />
  </svg>
);

const IconRunAll = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <polygon points="1,1 9,8 1,15" />
    <polygon points="8,1 16,8 8,15" />
  </svg>
);

const IconPause = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <rect x="2" y="1" width="4" height="14" />
    <rect x="10" y="1" width="4" height="14" />
  </svg>
);

const IconStop = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <rect x="2" y="2" width="12" height="12" />
  </svg>
);

type Props = {
  testCases: TestCase[];
  inputNames: string[];
  outputNames: string[];
  onRunAll: () => void;
  onRunNext: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  allPassed: boolean;
  onNextLevel: () => void;
  isLastLevel: boolean;
  disabled?: boolean;
  isRunning?: boolean;
  isPaused?: boolean;
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
  value: boolean | number;
  className?: string;
}) {
  if (typeof value === "number") {
    return (
      <span className={`bit-value byte-value ${className ?? ""}`}>
        {value}
      </span>
    );
  }
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
  value: boolean | number;
  match: boolean;
}) {
  if (typeof value === "number") {
    return (
      <span className={`bit-display ${match ? "" : "bit-mismatch"}`}>
        {value}
      </span>
    );
  }
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
  onPause,
  onResume,
  onStop,
  allPassed,
  onNextLevel,
  isLastLevel,
  disabled = false,
  isRunning = false,
  isPaused = false,
}: Props) {
  if (inputNames.length === 0 && outputNames.length === 0) return null;

  const hasStarted = testCases.some((tc) => tc.status !== "idle");
  const noTestCases = testCases.length === 0;

  return (
    <div className="test-case-panel">
      <div className="test-case-header">
        <h3>Test Cases</h3>
        <div className="test-case-actions">
          <button
            className="action-btn step-btn"
            onClick={onRunNext}
            disabled={disabled || isRunning || noTestCases}
            title="Step"
          >
            <IconStep />
          </button>
          {isRunning ? (
            <button
              className="action-btn pause-btn"
              onClick={onPause}
              title="Pause"
            >
              <IconPause />
            </button>
          ) : isPaused ? (
            <button
              className="action-btn run-btn"
              onClick={onResume}
              disabled={disabled || noTestCases}
              title="Resume"
            >
              <IconRunAll />
            </button>
          ) : (
            <button
              className="action-btn run-btn"
              onClick={onRunAll}
              disabled={disabled || noTestCases}
              title="Run All"
            >
              <IconRunAll />
            </button>
          )}
          <button
            className="action-btn stop-btn"
            onClick={onStop}
            disabled={disabled || (!isRunning && !isPaused && !hasStarted) || noTestCases}
            title="Stop"
          >
            <IconStop />
          </button>
          {allPassed && !isLastLevel && (
            <button className="next-level-btn" onClick={onNextLevel}>
              Next Level &rarr;
            </button>
          )}
        </div>
      </div>
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
                      <BitValue value={tc.inputs.get(name) ?? 0} />
                    </td>
                  ))}
                </tr>
              ))}
              {/* Output rows (expected → actual) */}
              {outputNames.map((name) => (
                <tr key={`out-${name}`}>
                  <th className="row-header output-header">{name}</th>
                  {testCases.map((tc, i) => (
                    <td key={i} className={`test-col-${tc.status}`}>
                      <div className="output-cell">
                        <BitValue
                          value={tc.expectedOutputs.get(name) ?? 0}
                          className="expected-bit"
                        />
                        {tc.actualOutputs ? (
                          <BitDisplay
                            value={tc.actualOutputs.get(name) ?? 0}
                            match={
                              tc.actualOutputs.get(name) ===
                              tc.expectedOutputs.get(name)
                            }
                          />
                        ) : (
                          <span className="bit-display bit-empty">-</span>
                        )}
                      </div>
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
