import { useState } from "react";
import type { Puzzle } from "../lib/puzzles";

type Props = {
  onCompile: (code: string) => void;
  onDirty?: () => void;
  error: string | null;
  puzzle?: Puzzle;
  initialCode?: string;
};

/** Extract only VAR lines from fixedCode, hiding MOD blocks */
function getDisplayFixedCode(fixedCode: string): string {
  const lines = fixedCode.split("\n");
  const result: string[] = [];
  let inMod = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("MOD START")) {
      inMod = true;
      continue;
    }
    if (trimmed === "MOD END") {
      inMod = false;
      continue;
    }
    if (!inMod && trimmed !== "") {
      result.push(trimmed);
    }
  }
  return result.join("\n");
}

export function CodeEditorPanel({ onCompile, onDirty, error, puzzle, initialCode = "" }: Props) {
  const [code, setCode] = useState(puzzle?.editableCode ?? initialCode);
  const [showModDetails, setShowModDetails] = useState(false);

  const handleChange = (value: string) => {
    setCode(value);
    onDirty?.();
  };

  const fullCode = puzzle ? `${puzzle.fixedCode}\n${code}` : code;
  const displayFixed = puzzle ? getDisplayFixedCode(puzzle.fixedCode) : "";
  const hasModules = puzzle?.availableModules && puzzle.availableModules.length > 0;

  return (
    <div className="code-editor-panel">
      {puzzle && (
        <>
          <div className="panel-header">
            <h3>{puzzle.title}</h3>
          </div>
          <div className="puzzle-description">{puzzle.description}</div>
          {hasModules && (
            <div className="available-modules">
              <span className="available-modules-label">利用可能モジュール: </span>
              <span className="available-modules-list">
                NAND, {puzzle.availableModules!.join(", ")}
              </span>
              <button
                className="mod-details-toggle"
                onClick={() => setShowModDetails(!showModDetails)}
              >
                {showModDetails ? "定義を隠す" : "定義を見る"}
              </button>
            </div>
          )}
          {showModDetails && (
            <pre className="fixed-code mod-details">{puzzle.fixedCode}</pre>
          )}
          <pre className="fixed-code">{displayFixed}</pre>
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
