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

export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}
