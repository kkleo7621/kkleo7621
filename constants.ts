import { BrewerType, ProcessMethod, RoastLevel, FlavorPreference, NotePreference, WeatherCondition, RecipeStructure } from "./types";

export const BREWER_OPTIONS = Object.values(BrewerType);
export const ROAST_OPTIONS = Object.values(RoastLevel);
export const PROCESS_OPTIONS = Object.values(ProcessMethod);
export const FLAVOR_OPTIONS = Object.values(FlavorPreference);
export const NOTE_OPTIONS = Object.values(NotePreference);
export const WEATHER_OPTIONS = Object.values(WeatherCondition);
export const STRUCTURE_OPTIONS = Object.values(RecipeStructure);

export const MOCK_RECIPE = {
  coffeeWeight: 20,
  waterRatio: "1:15",
  totalWater: 300,
  temperature: 92,
  grindSize: "中細研磨 (類似二號砂糖)",
  tastingNotes: ["茉莉花香", "佛手柑", "檸檬"],
  steps: [
    { startTimeSec: 0, durationSec: 40, waterAmount: 40, action: "悶蒸", description: "快速注入 40g 水，確保所有咖啡粉濕潤。" },
    { startTimeSec: 40, durationSec: 40, waterAmount: 120, action: "第一段注水", description: "以小水流中心繞圈注水至 120g。" },
    { startTimeSec: 80, durationSec: 40, waterAmount: 220, action: "第二段注水", description: "平穩注水至 220g，增加擾動。" },
    { startTimeSec: 120, durationSec: 30, waterAmount: 300, action: "最後注水", description: "注水至 300g，等待流乾。" },
  ]
};