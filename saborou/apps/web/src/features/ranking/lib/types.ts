export interface RankEntry {
  userId: string;
  displayName: string | null;
  avatarUrl: string | null;
  totalScore: number;
  taskCount: number;
  weekKey: string;
  rankPosition: number;
}

export interface RankPosition {
  rank: number;
  totalScore: number;
  totalUsers: number;
}

export type RankType = "global" | "group";
