import { useState } from "react";
import type { Puzzle } from "../lib/puzzles";

type Props = {
  onCompile: (code: string) => void;
  onDirty?: () => void;
  error: string | null;
  puzzle?: Puzzle;
  initialCode?: string;
};

export function CodeEditorPanel({ onCompile, onDirty, error, puzzle, initialCode = "" }: Props) {
  const [code, setCode] = useState(puzzle?.editableCode ?? initialCode);

  const handleChange = (value: string) => {
    setCode(value);
    onDirty?.();
  };

  const fullCode = puzzle ? `${puzzle.fixedCode}\n${code}` : code;

  return (
    <div className="code-editor-panel">
      {puzzle && (
        <>
          <div className="panel-header">
            <h3>{puzzle.title}</h3>
          </div>
          <div className="puzzle-description">{puzzle.description}</div>
          <pre className="fixed-code">{puzzle.fixedCode}</pre>
        </>
      )}
      {!puzzle && (
        <div className="panel-header">
          <h3>Sandbox</h3>
        </div>
      )}
      <textarea
        value={code}
        onChange={(e) => handleChange(e.target.value)}
        spellCheck={false}
      />
      <button className="compile-btn" onClick={() => onCompile(fullCode)}>
        Compile
      </button>
      {error && <div className="error-display">{error}</div>}
    </div>
  );
}
