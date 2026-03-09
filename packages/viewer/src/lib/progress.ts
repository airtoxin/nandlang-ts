import type { Puzzle } from "./puzzles";

const STORAGE_KEY = "nandlang-progress";

export type ProgressData = {
  completedLevels: number[];
};

function loadProgress(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.completedLevels)) {
        return { completedLevels: parsed.completedLevels };
      }
    }
  } catch {
    // ignore
  }
  return { completedLevels: [] };
}

function saveProgress(data: ProgressData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getProgress(): ProgressData {
  return loadProgress();
}

export function markLevelCompleted(puzzleId: number): ProgressData {
  const progress = loadProgress();
  if (!progress.completedLevels.includes(puzzleId)) {
    progress.completedLevels.push(puzzleId);
    saveProgress(progress);
  }
  return progress;
}

export function isLevelUnlocked(
  puzzleId: number,
  puzzles: Puzzle[],
  progress: ProgressData,
): boolean {
  const index = puzzles.findIndex((p) => p.id === puzzleId);
  if (index <= 0) return true; // First level is always unlocked
  const prevPuzzle = puzzles[index - 1];
  return progress.completedLevels.includes(prevPuzzle.id);
}

export function getUnlockedModules(
  puzzles: Puzzle[],
  progress: ProgressData,
): string[] {
  return puzzles
    .filter(
      (p) => p.unlocksModule && progress.completedLevels.includes(p.id),
    )
    .map((p) => p.unlocksModule!);
}

export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}
