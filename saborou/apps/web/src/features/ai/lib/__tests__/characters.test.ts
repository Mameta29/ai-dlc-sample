import { describe, it, expect } from "vitest";
import { AI_CHARACTERS, getCharacterConfig } from "../characters";
import type { CharacterType } from "../types";

describe("AI Characters", () => {
  const characterTypes: CharacterType[] = ["SABOROU", "NAMAKEMONO_SENPAI", "SABORIST"];

  it("should have all 3 character types defined", () => {
    expect(Object.keys(AI_CHARACTERS)).toHaveLength(3);
  });

  characterTypes.forEach((type) => {
    it(`should have valid config for ${type}`, () => {
      const config = getCharacterConfig(type);
      expect(config.type).toBe(type);
      expect(config.name).toBeTruthy();
      expect(config.description).toBeTruthy();
      expect(config.systemPrompt).toBeTruthy();
      expect(config.systemPrompt).toContain("日本語");
    });
  });

  it("SABORIST should have provocation instructions in system prompt", () => {
    const config = getCharacterConfig("SABORIST");
    expect(config.systemPrompt).toContain("煽り");
  });
});
