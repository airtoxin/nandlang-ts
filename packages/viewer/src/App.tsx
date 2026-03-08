import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { TitlePage } from "./pages/TitlePage";
import { LevelSelectPage } from "./pages/LevelSelectPage";
import { LevelPage } from "./pages/LevelPage";
import { SandboxPage } from "./pages/SandboxPage";
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
        <Route path="/levels" element={<LevelSelectPage />} />
        <Route path="/level/:id" element={<LevelPageWrapper />} />
        <Route path="/sandbox" element={<SandboxPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
