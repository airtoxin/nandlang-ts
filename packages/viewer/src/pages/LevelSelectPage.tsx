import { useState } from "react";
import { Link } from "react-router-dom";
import { puzzles } from "../lib/puzzles";
import {
  getProgress,
  isLevelUnlocked,
  resetProgress,
} from "../lib/progress";
import "./LevelSelectPage.css";

export function LevelSelectPage() {
  const [progress, setProgress] = useState(getProgress);

  const handleReset = () => {
    resetProgress();
    setProgress({ completedLevels: [] });
  };

  return (
    <div className="level-select-page">
      <div className="level-select-header">
        <Link to="/" className="back-link">
          &larr; Back
        </Link>
        <h1>Puzzles</h1>
        <button className="reset-progress-btn" onClick={handleReset}>
          進捗リセット
        </button>
      </div>
      <div className="level-grid">
        {puzzles.map((puzzle) => {
          const unlocked = isLevelUnlocked(puzzle.id, puzzles, progress);
          const completed = progress.completedLevels.includes(puzzle.id);

          if (!unlocked) {
            return (
              <div key={puzzle.id} className="level-card level-card-locked">
                <span className="level-card-title">{puzzle.title}</span>
                <span className="level-card-desc">🔒</span>
              </div>
            );
          }

          return (
            <Link
              key={puzzle.id}
              to={`/level/${puzzle.id}`}
              className={`level-card ${completed ? "level-card-completed" : ""}`}
            >
              <span className="level-card-title">
                {completed && <span className="level-card-check">✓ </span>}
                {puzzle.title}
              </span>
              <span className="level-card-desc">{puzzle.description}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
