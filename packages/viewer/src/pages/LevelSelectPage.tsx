import { Link } from "react-router-dom";
import { puzzles } from "../lib/puzzles";
import "./LevelSelectPage.css";

export function LevelSelectPage() {
  return (
    <div className="level-select-page">
      <div className="level-select-header">
        <Link to="/" className="back-link">
          &larr; Back
        </Link>
        <h1>Puzzles</h1>
      </div>
      <div className="level-grid">
        {puzzles.map((puzzle) => (
          <Link
            key={puzzle.id}
            to={`/level/${puzzle.id}`}
            className="level-card"
          >
            <span className="level-card-title">{puzzle.title}</span>
            <span className="level-card-desc">{puzzle.description}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
