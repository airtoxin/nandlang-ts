import { Link } from "react-router-dom";
import "./TitlePage.css";

export function TitlePage() {
  return (
    <div className="title-page">
      <div className="title-content">
        <h1 className="title-logo">nandlang</h1>
        <p className="title-tagline">
          Build logic from nothing but NAND gates.
        </p>
        <nav className="title-nav">
          <Link to="/levels" className="title-link title-link-primary">
            Puzzles
          </Link>
          <Link to="/sandbox" className="title-link title-link-secondary">
            Sandbox
          </Link>
        </nav>
      </div>
    </div>
  );
}
