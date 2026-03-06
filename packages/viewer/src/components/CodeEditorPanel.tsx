import { useState } from "react";
import { examples } from "../lib/examples";

type Props = {
  onCompile: (code: string) => void;
  error: string | null;
};

export function CodeEditorPanel({ onCompile, error }: Props) {
  const [code, setCode] = useState(examples[0].code);

  return (
    <div className="code-editor-panel">
      <div className="panel-header">
        <h3>Code Editor</h3>
        <select
          onChange={(e) => {
            const example = examples[Number(e.target.value)];
            if (example) {
              setCode(example.code);
              onCompile(example.code);
            }
          }}
        >
          {examples.map((ex, i) => (
            <option key={ex.label} value={i}>
              {ex.label}
            </option>
          ))}
        </select>
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
      />
      <button className="compile-btn" onClick={() => onCompile(code)}>
        Compile & Run
      </button>
      {error && <div className="error-display">{error}</div>}
    </div>
  );
}
