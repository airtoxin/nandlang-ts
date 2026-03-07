import { useState, useEffect } from "react";
import type { Puzzle } from "../lib/puzzles";

type Props = {
  onCompile: (code: string) => void;
  error: string | null;
  puzzle: Puzzle;
};

export function CodeEditorPanel({ onCompile, error, puzzle }: Props) {
  const [code, setCode] = useState(puzzle.editableCode);

  useEffect(() => {
    setCode(puzzle.editableCode);
  }, [puzzle]);

  const fullCode = `${puzzle.fixedCode}\n${code}`;

  return (
    <div className="code-editor-panel">
      <div className="panel-header">
        <h3>{puzzle.title}</h3>
      </div>
      <div className="puzzle-description">{puzzle.description}</div>
      <pre className="fixed-code">{puzzle.fixedCode}</pre>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
      />
      <button className="compile-btn" onClick={() => onCompile(fullCode)}>
        Compile & Run
      </button>
      {error && <div className="error-display">{error}</div>}
    </div>
  );
}
