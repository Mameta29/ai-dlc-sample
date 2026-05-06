import type { DimensionScores } from "./types";

export function calculateTaskScore(dimensions: DimensionScores): number {
  const sum =
    dimensions.stakeholders +
    dimensions.financialImpact +
    dimensions.urgency +
    dimensions.difficulty +
    dimensions.uncertainty +
    dimensions.reputationImpact;

  const average = sum / 6;
  const score = Math.round(average * 20);

  return Math.max(1, Math.min(100, score));
}

export function calculateProcrastinationScore(
  taskScore: number,
  elapsedPercentage: number
): number {
  if (taskScore <= 0 || elapsedPercentage <= 0) return 0;

  const score = (taskScore * elapsedPercentage) / 100;
  return Math.round(score * 100) / 100;
}

export function getWeekKey(date: Date = new Date()): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  const weekNum =
    1 +
    Math.round(
      ((d.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    );
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}
