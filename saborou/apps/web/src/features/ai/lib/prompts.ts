import type { CharacterType, ExcuseCategory } from "./types";
import { getCharacterConfig } from "./characters";

export function buildTaskQuantifyPrompt(
  characterType: CharacterType,
  taskTitle: string,
  dimension: string,
  dimensionIndex: number
): string {
  const char = getCharacterConfig(characterType);
  const dimensionQuestions: Record<string, string> = {
    stakeholders: "このタスク、関わる人は何人くらい？（1:自分だけ 〜 5:大勢に影響）",
    financialImpact: "お金的なインパクトはどのくらい？（1:ほぼなし 〜 5:めちゃくちゃデカい）",
    urgency: "期日のプレッシャーはどのくらい？（1:全然余裕 〜 5:ヤバい）",
    difficulty: "難しさはどのくらい？（1:楽勝 〜 5:めちゃくちゃ難しい）",
    uncertainty: "未知の要素はどのくらいある？（1:全部わかってる 〜 5:何もわからん）",
    reputationImpact: "これやらないと評価にどのくらい影響する？（1:関係なし 〜 5:致命的）",
  };

  return `${char.systemPrompt}

今ユーザーは「${taskTitle}」というタスクについて話しています。
${dimensionIndex + 1}/6の質問です。

以下の質問を、あなたのキャラクターの口調で聞いてください:
「${dimensionQuestions[dimension]}」

1〜5の数字で答えてもらってください。スキップも可能です。
短く、1〜2文で聞いてください。`;
}

export function buildExcuseGenerationPrompt(
  characterType: CharacterType,
  taskTitle: string,
  previousExcuses: string[]
): string {
  const char = getCharacterConfig(characterType);
  const prevText = previousExcuses.length > 0
    ? `\n\n前回提示した言い訳（重複を避けてください）:\n${previousExcuses.join("\n")}`
    : "";

  return `${char.systemPrompt}

ユーザーは「${taskTitle}」を先延ばし中です。
以下の4カテゴリから、それぞれ1つずつ言い訳を生成してください:
1. 迷惑系（他の人に迷惑かけるかも...）
2. 時間系（まだ時間あるし...）
3. 重要性系（そこまで重要じゃないし...）
4. 能力系（今の自分には難しいし...）

あなたのキャラクターの口調で、共感的に提示してください。
各言い訳は1〜2文で。${prevText}

JSON形式で返してください:
[{"category":"BURDEN","content":"..."},{"category":"TIME","content":"..."},{"category":"IMPORTANCE","content":"..."},{"category":"ABILITY","content":"..."}]`;
}

export function buildProvocationPrompt(
  taskTitle: string,
  level: number
): string {
  const levels = [
    "軽く茶化す程度。「まぁ、やらなくても世界は回るけどね」くらい。",
    "少し突っ込む。「本当にそれでいいの？自分で決めたことじゃなかった？」くらい。",
    "核心を突く。「先延ばしする自分と、本当になりたい自分、どっちが本物？」くらい。",
  ];

  return `${getCharacterConfig("SABORIST").systemPrompt}

ユーザーは「${taskTitle}」を先延ばし中です。
煽りレベル: ${level}/3
${levels[level - 1]}

ユーザーの「いや、本当は…」という反応を引き出すような発言をしてください。
不快にならない程度に。1〜2文で。`;
}

export function buildOpenQuestionPrompt(
  characterType: CharacterType,
  taskTitle: string
): string {
  const char = getCharacterConfig(characterType);

  return `${char.systemPrompt}

ユーザーは「${taskTitle}」を先延ばし中です。
「今日やらなくていい理由ある？」という趣旨のオープンな質問をしてください。
あなたのキャラクターの口調で、1〜2文で。`;
}
