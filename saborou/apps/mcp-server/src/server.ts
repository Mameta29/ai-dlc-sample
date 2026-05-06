import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const server = new McpServer({
  name: "saborou-mcp",
  version: "0.1.0",
});

// Tool: Get user's self-manual (自己取扱説明書)
server.tool(
  "get_self_manual",
  "ユーザーの自己取扱説明書データを取得します",
  { api_key: z.string().describe("SABOROU API Key") },
  async ({ api_key }) => {
    // Validate API key and get user
    const { data: keyData } = await supabase
      .from("api_keys" as any)
      .select("user_id")
      .eq("key", api_key)
      .single();

    if (!keyData) {
      return { content: [{ type: "text" as const, text: "Invalid API key" }] };
    }

    const { data: profile } = await supabase
      .from("user_profiles_analysis")
      .select("*")
      .eq("user_id", keyData.user_id)
      .single();

    if (!profile) {
      return { content: [{ type: "text" as const, text: "No profile analysis available yet" }] };
    }

    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({
          acceptancePattern: profile.acceptance_pattern,
          subjectiveWeight: profile.subjective_weight_profile,
          stakeholderHierarchy: profile.stakeholder_hierarchy,
          selfIdentity: profile.self_identity,
          ignitionThreshold: profile.ignition_threshold,
          linguisticTriggers: profile.linguistic_triggers,
          biorhythm: profile.biorhythm_pattern,
          generatedAt: profile.generated_at,
        }, null, 2),
      }],
    };
  }
);

// Tool: Get prompt template for AI agents
server.tool(
  "get_prompt_template",
  "ユーザーの自己取扱説明書をAIプロンプトテンプレートとして取得します",
  { api_key: z.string().describe("SABOROU API Key") },
  async ({ api_key }) => {
    const { data: keyData } = await supabase
      .from("api_keys" as any)
      .select("user_id")
      .eq("key", api_key)
      .single();

    if (!keyData) {
      return { content: [{ type: "text" as const, text: "Invalid API key" }] };
    }

    const { data: profile } = await supabase
      .from("user_profiles_analysis")
      .select("*")
      .eq("user_id", keyData.user_id)
      .single();

    if (!profile) {
      return { content: [{ type: "text" as const, text: "No profile available" }] };
    }

    const template = `# このユーザーの自己取扱説明書

## 受容パターン
${JSON.stringify(profile.acceptance_pattern)}

## 主観的重さプロファイル
${JSON.stringify(profile.subjective_weight_profile)}

## 着火閾値（行動を起こすトリガー）
${JSON.stringify(profile.ignition_threshold)}

## 言語的トリガー（効く言葉/効かない言葉）
${JSON.stringify(profile.linguistic_triggers)}

## 生体リズム（活動パターン）
${JSON.stringify(profile.biorhythm_pattern)}

このデータを参考に、ユーザーに合わせたコミュニケーションを行ってください。`;

    return { content: [{ type: "text" as const, text: template }] };
  }
);

// Tool: Get task summary
server.tool(
  "get_task_summary",
  "ユーザーのタスクサマリーを取得します",
  { api_key: z.string().describe("SABOROU API Key") },
  async ({ api_key }) => {
    const { data: keyData } = await supabase
      .from("api_keys" as any)
      .select("user_id")
      .eq("key", api_key)
      .single();

    if (!keyData) {
      return { content: [{ type: "text" as const, text: "Invalid API key" }] };
    }

    const { data: tasks } = await supabase
      .from("tasks")
      .select("title, status, task_score, procrastination_score, deadline")
      .eq("user_id", keyData.user_id)
      .order("created_at", { ascending: false })
      .limit(20);

    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify(tasks ?? [], null, 2),
      }],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
