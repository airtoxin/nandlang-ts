import { useState } from "react";
import type { Puzzle } from "../lib/puzzles";
import { HelpManual } from "./HelpManual";

type Props = {
  onCompile: (code: string) => void;
  onDirty?: () => void;
  error: string | null;
  puzzle?: Puzzle;
  initialCode?: string;
};

export function CodeEditorPanel({ onCompile, onDirty, error, puzzle, initialCode = "" }: Props) {
  const [code, setCode] = useState(puzzle?.editableCode ?? initialCode);
  const [showHelp, setShowHelp] = useState(false);

  const handleChange = (value: string) => {
    setCode(value);
    onDirty?.();
  };

  const fullCode = puzzle
    ? `${puzzle.moduleDefs}${puzzle.fixedCode}\n${code}`
    : code;
  const hasModules = puzzle?.availableModules && puzzle.availableModules.length > 0;

  return (
    <div className="code-editor-panel">
      {puzzle && (
        <>
          <div className="panel-header">
            <h3>{puzzle.title}</h3>
            <button
              className="help-btn"
              onClick={() => setShowHelp(!showHelp)}
              title="マニュアルを開く"
            >
              ?
            </button>
          </div>
          <div className="puzzle-description">{puzzle.description}</div>
          {hasModules && (
            <div className="available-modules">
              <span className="available-modules-label">利用可能モジュール: </span>
              <span className="available-modules-list">
                {puzzle.availableModules!.join(", ")}
              </span>
            </div>
          )}
          <pre className="fixed-code">{puzzle.fixedCode}</pre>
        </>
      )}
      {!puzzle && (
        <div className="panel-header">
          <h3>Sandbox</h3>
          <button
            className="help-btn"
            onClick={() => setShowHelp(!showHelp)}
            title="マニュアルを開く"
          >
            ?
          </button>
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
      {showHelp && (
        <HelpManual
          onClose={() => setShowHelp(false)}
          highlightSections={puzzle?.helpSections}
        />
      )}
    </div>
  );
}
