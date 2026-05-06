export type CharacterType = "SABOROU" | "NAMAKEMONO_SENPAI" | "SABORIST";
export type ConversationType = "TASK_QUANTIFY" | "EXCUSE_GENERATION" | "PROVOCATION" | "OPEN_QUESTION";
export type MessageRole = "AI" | "USER";
export type ExcuseCategory = "BURDEN" | "TIME" | "IMPORTANCE" | "ABILITY";
export type UserReaction = "AGREE" | "DISAGREE" | "SKIP";

export interface Conversation {
  id: string;
  userId: string;
  taskId: string | null;
  characterType: CharacterType;
  conversationType: ConversationType;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface ExcusePattern {
  id: string;
  conversationId: string;
  category: ExcuseCategory;
  content: string;
  userReaction: UserReaction | null;
  createdAt: string;
}

export interface AICharacterConfig {
  type: CharacterType;
  name: string;
  description: string;
  systemPrompt: string;
}
