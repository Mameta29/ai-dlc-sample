export type AnalyticsEventType =
  | "ACCEPTANCE_PATTERN"
  | "SUBJECTIVE_WEIGHT"
  | "STAKEHOLDER_HIERARCHY"
  | "SELF_IDENTITY"
  | "IGNITION_THRESHOLD"
  | "LINGUISTIC_TRIGGER"
  | "BIORHYTHM"
  | "SELF_GENERATED_EXCUSE";

export interface AnalyticsEvent {
  id: string;
  userId: string;
  eventType: AnalyticsEventType;
  payload: Record<string, unknown>;
  taskId: string | null;
  conversationId: string | null;
  createdAt: string;
}

export interface UserProfileAnalysis {
  id: string;
  userId: string;
  acceptancePattern: Record<string, unknown> | null;
  subjectiveWeightProfile: Record<string, unknown> | null;
  stakeholderHierarchy: Record<string, unknown> | null;
  selfIdentity: Record<string, unknown> | null;
  ignitionThreshold: Record<string, unknown> | null;
  linguisticTriggers: Record<string, unknown> | null;
  biorhythmPattern: Record<string, unknown> | null;
  generatedAt: string | null;
}
