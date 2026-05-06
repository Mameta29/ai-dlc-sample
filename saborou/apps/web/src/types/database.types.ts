export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserStatus = "ACTIVE" | "PENDING_DELETION" | "DELETED";
export type DeletionStatus = "PENDING" | "CANCELLED" | "COMPLETED";
export type TaskStatus = "PROCRASTINATING" | "COMPLETED" | "EXPIRED";
export type ScoreSource = "AI_ESTIMATED" | "USER_PROVIDED" | "MANUALLY_ADJUSTED";
export type CharacterType = "SABOROU" | "NAMAKEMONO_SENPAI" | "SABORIST";
export type ConversationType = "TASK_QUANTIFY" | "EXCUSE_GENERATION" | "PROVOCATION" | "OPEN_QUESTION";
export type MessageRole = "AI" | "USER";
export type ExcuseCategory = "BURDEN" | "TIME" | "IMPORTANCE" | "ABILITY";
export type UserReaction = "AGREE" | "DISAGREE" | "SKIP";
export type AnalyticsEventType =
  | "ACCEPTANCE_PATTERN" | "SUBJECTIVE_WEIGHT" | "STAKEHOLDER_HIERARCHY"
  | "SELF_IDENTITY" | "IGNITION_THRESHOLD" | "LINGUISTIC_TRIGGER"
  | "BIORHYTHM" | "SELF_GENERATED_EXCUSE";

export type TypedSupabaseClient = ReturnType<typeof import("@supabase/supabase-js").createClient<Database>>;

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          avatar_url: string | null;
          status: UserStatus;
          created_at: string;
          updated_at: string;
          last_sign_in_at: string | null;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          avatar_url?: string | null;
          status?: UserStatus;
          created_at?: string;
          updated_at?: string;
          last_sign_in_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          status?: UserStatus;
          created_at?: string;
          updated_at?: string;
          last_sign_in_at?: string | null;
        };
        Relationships: [];
      };
      account_deletion_requests: {
        Row: {
          id: string;
          user_id: string;
          requested_at: string;
          scheduled_deletion_at: string;
          status: DeletionStatus;
          cancelled_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          requested_at?: string;
          scheduled_deletion_at: string;
          status?: DeletionStatus;
          cancelled_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          requested_at?: string;
          scheduled_deletion_at?: string;
          status?: DeletionStatus;
          cancelled_at?: string | null;
        };
        Relationships: [];
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          status: TaskStatus;
          deadline: string | null;
          task_score: number | null;
          procrastination_score: number | null;
          started_at: string;
          completed_at: string | null;
          expired_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          status?: TaskStatus;
          deadline?: string | null;
          task_score?: number | null;
          procrastination_score?: number | null;
          started_at?: string;
          completed_at?: string | null;
          expired_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          status?: TaskStatus;
          deadline?: string | null;
          task_score?: number | null;
          procrastination_score?: number | null;
          started_at?: string;
          completed_at?: string | null;
          expired_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      task_change_logs: {
        Row: {
          id: string;
          task_id: string;
          field_name: string;
          old_value: string | null;
          new_value: string | null;
          changed_at: string;
        };
        Insert: {
          id?: string;
          task_id: string;
          field_name: string;
          old_value?: string | null;
          new_value?: string | null;
          changed_at?: string;
        };
        Update: {
          id?: string;
          task_id?: string;
          field_name?: string;
          old_value?: string | null;
          new_value?: string | null;
          changed_at?: string;
        };
        Relationships: [];
      };
      dimension_scores: {
        Row: {
          id: string;
          task_id: string;
          stakeholders: number;
          financial_impact: number;
          urgency: number;
          difficulty: number;
          uncertainty: number;
          reputation_impact: number;
          source: ScoreSource;
          created_at: string;
        };
        Insert: {
          id?: string;
          task_id: string;
          stakeholders: number;
          financial_impact: number;
          urgency: number;
          difficulty: number;
          uncertainty: number;
          reputation_impact: number;
          source?: ScoreSource;
          created_at?: string;
        };
        Update: {
          id?: string;
          task_id?: string;
          stakeholders?: number;
          financial_impact?: number;
          urgency?: number;
          difficulty?: number;
          uncertainty?: number;
          reputation_impact?: number;
          source?: ScoreSource;
          created_at?: string;
        };
        Relationships: [];
      };
      finalized_scores: {
        Row: {
          id: string;
          task_id: string;
          user_id: string;
          task_score: number;
          elapsed_percentage: number;
          procrastination_score: number;
          finalized_at: string;
          week_key: string;
        };
        Insert: {
          id?: string;
          task_id: string;
          user_id: string;
          task_score: number;
          elapsed_percentage: number;
          procrastination_score: number;
          finalized_at?: string;
          week_key: string;
        };
        Update: {
          id?: string;
          task_id?: string;
          user_id?: string;
          task_score?: number;
          elapsed_percentage?: number;
          procrastination_score?: number;
          finalized_at?: string;
          week_key?: string;
        };
        Relationships: [];
      };
      weekly_aggregates: {
        Row: {
          id: string;
          user_id: string;
          week_key: string;
          total_score: number;
          task_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          week_key: string;
          total_score?: number;
          task_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          week_key?: string;
          total_score?: number;
          task_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      conversations: {
        Row: {
          id: string;
          user_id: string;
          task_id: string | null;
          character_type: CharacterType;
          conversation_type: ConversationType;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          task_id?: string | null;
          character_type?: CharacterType;
          conversation_type: ConversationType;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          task_id?: string | null;
          character_type?: CharacterType;
          conversation_type?: ConversationType;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: MessageRole;
          content: string;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          role: MessageRole;
          content: string;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          role?: MessageRole;
          content?: string;
          metadata?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
      excuse_patterns: {
        Row: {
          id: string;
          conversation_id: string;
          category: ExcuseCategory;
          content: string;
          user_reaction: UserReaction | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          category: ExcuseCategory;
          content: string;
          user_reaction?: UserReaction | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          category?: ExcuseCategory;
          content?: string;
          user_reaction?: UserReaction | null;
          created_at?: string;
        };
        Relationships: [];
      };
      analytics_events: {
        Row: {
          id: string;
          user_id: string;
          event_type: AnalyticsEventType;
          payload: Json;
          task_id: string | null;
          conversation_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          event_type: AnalyticsEventType;
          payload: Json;
          task_id?: string | null;
          conversation_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          event_type?: AnalyticsEventType;
          payload?: Json;
          task_id?: string | null;
          conversation_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      user_profiles_analysis: {
        Row: {
          id: string;
          user_id: string;
          acceptance_pattern: Json | null;
          subjective_weight_profile: Json | null;
          stakeholder_hierarchy: Json | null;
          self_identity: Json | null;
          ignition_threshold: Json | null;
          linguistic_triggers: Json | null;
          biorhythm_pattern: Json | null;
          generated_at: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          acceptance_pattern?: Json | null;
          subjective_weight_profile?: Json | null;
          stakeholder_hierarchy?: Json | null;
          self_identity?: Json | null;
          ignition_threshold?: Json | null;
          linguistic_triggers?: Json | null;
          biorhythm_pattern?: Json | null;
          generated_at?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          acceptance_pattern?: Json | null;
          subjective_weight_profile?: Json | null;
          stakeholder_hierarchy?: Json | null;
          self_identity?: Json | null;
          ignition_threshold?: Json | null;
          linguistic_triggers?: Json | null;
          biorhythm_pattern?: Json | null;
          generated_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      follows: {
        Row: {
          id: string;
          follower_id: string;
          following_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          follower_id: string;
          following_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          follower_id?: string;
          following_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      groups: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          owner_id: string;
          invite_code: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          owner_id: string;
          invite_code?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          owner_id?: string;
          invite_code?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      group_members: {
        Row: {
          id: string;
          group_id: string;
          user_id: string;
          joined_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          user_id: string;
          joined_at?: string;
        };
        Update: {
          id?: string;
          group_id?: string;
          user_id?: string;
          joined_at?: string;
        };
        Relationships: [];
      };
      feed_items: {
        Row: {
          id: string;
          user_id: string;
          actor_id: string;
          action: string;
          target_type: string | null;
          target_id: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          actor_id: string;
          action: string;
          target_type?: string | null;
          target_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          actor_id?: string;
          action?: string;
          target_type?: string | null;
          target_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
      reactions: {
        Row: {
          id: string;
          user_id: string;
          target_type: string;
          target_id: string;
          reaction_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          target_type: string;
          target_id: string;
          reaction_type?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          target_type?: string;
          target_id?: string;
          reaction_type?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      notification_settings: {
        Row: {
          id: string;
          user_id: string;
          push_enabled: boolean;
          reminder_frequency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          push_enabled?: boolean;
          reminder_frequency?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          push_enabled?: boolean;
          reminder_frequency?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      privacy_settings: {
        Row: {
          id: string;
          user_id: string;
          profile_visible: boolean;
          ranking_visible: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          profile_visible?: boolean;
          ranking_visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          profile_visible?: boolean;
          ranking_visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      push_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          endpoint: string;
          keys: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          endpoint: string;
          keys: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          endpoint?: string;
          keys?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      global_ranking: {
        Row: {
          user_id: string;
          display_name: string | null;
          avatar_url: string | null;
          total_score: number;
          task_count: number;
          week_key: string;
          rank_position: number;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: {
      user_status: UserStatus;
      deletion_status: DeletionStatus;
      task_status: TaskStatus;
      score_source: ScoreSource;
      character_type: CharacterType;
      conversation_type: ConversationType;
      message_role: MessageRole;
      excuse_category: ExcuseCategory;
      user_reaction: UserReaction;
      analytics_event_type: AnalyticsEventType;
    };
    CompositeTypes: Record<string, never>;
  };
}
