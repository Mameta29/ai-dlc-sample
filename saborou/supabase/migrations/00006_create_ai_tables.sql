-- Create AI-related enums
CREATE TYPE public.character_type AS ENUM ('SABOROU', 'NAMAKEMONO_SENPAI', 'SABORIST');
CREATE TYPE public.conversation_type AS ENUM ('TASK_QUANTIFY', 'EXCUSE_GENERATION', 'PROVOCATION', 'OPEN_QUESTION');
CREATE TYPE public.message_role AS ENUM ('AI', 'USER');
CREATE TYPE public.excuse_category AS ENUM ('BURDEN', 'TIME', 'IMPORTANCE', 'ABILITY');
CREATE TYPE public.user_reaction AS ENUM ('AGREE', 'DISAGREE', 'SKIP');

-- Create conversations table
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  character_type public.character_type NOT NULL DEFAULT 'SABOROU',
  conversation_type public.conversation_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_conversations_user ON public.conversations(user_id);
CREATE INDEX idx_conversations_task ON public.conversations(task_id);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own conversations"
  ON public.conversations FOR ALL
  USING (auth.uid() = user_id);

CREATE TRIGGER on_conversations_updated
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  role public.message_role NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON public.messages(conversation_id, created_at);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own messages"
  ON public.messages FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.conversations WHERE conversations.id = messages.conversation_id AND conversations.user_id = auth.uid())
  );

-- Create excuse_patterns table
CREATE TABLE public.excuse_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  category public.excuse_category NOT NULL,
  content TEXT NOT NULL,
  user_reaction public.user_reaction,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_excuse_patterns_conversation ON public.excuse_patterns(conversation_id);

ALTER TABLE public.excuse_patterns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own excuse patterns"
  ON public.excuse_patterns FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.conversations WHERE conversations.id = excuse_patterns.conversation_id AND conversations.user_id = auth.uid())
  );
