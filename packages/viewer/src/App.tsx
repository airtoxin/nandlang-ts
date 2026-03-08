import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { TitlePage } from "./pages/TitlePage";
import { LevelPage } from "./pages/LevelPage";
import "./App.css";

// key={id} forces remount when navigating between levels
function LevelPageWrapper() {
  const { id } = useParams<{ id: string }>();
  return <LevelPage key={id} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TitlePage />} />
        <Route path="/levels" element={<Navigate to="/level/1" replace />} />
        <Route path="/level/:id" element={<LevelPageWrapper />} />
        <Route path="/sandbox" element={<Navigate to="/level/1" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
