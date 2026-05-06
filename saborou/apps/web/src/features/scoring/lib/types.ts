export type ScoreSource = "AI_ESTIMATED" | "USER_PROVIDED" | "MANUALLY_ADJUSTED";

export interface DimensionScores {
  stakeholders: number;
  financialImpact: number;
  urgency: number;
  difficulty: number;
  uncertainty: number;
  reputationImpact: number;
}

export interface DimensionScoreRecord extends DimensionScores {
  id: string;
  taskId: string;
  source: ScoreSource;
  createdAt: string;
}

export interface FinalizedScore {
  id: string;
  taskId: string;
  userId: string;
  taskScore: number;
  elapsedPercentage: number;
  procrastinationScore: number;
  finalizedAt: string;
  weekKey: string;
}

export interface WeeklyAggregate {
  id: string;
  userId: string;
  weekKey: string;
  totalScore: number;
  taskCount: number;
}
