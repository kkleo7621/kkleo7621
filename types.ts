export enum RoastLevel {
  LIGHT = '淺焙',
  MEDIUM_LIGHT = '淺中焙',
  MEDIUM = '中焙',
  MEDIUM_DARK = '中深焙',
  DARK = '深焙',
}

export enum ProcessMethod {
  WASHED = '水洗',
  NATURAL = '日曬',
  HONEY = '蜜處理',
  ANAEROBIC = '厭氧發酵',
  OTHER = '其他實驗性處理',
}

export enum BrewerType {
  V60 = 'Hario V60',
  KALITA = 'Kalita Wave (蛋糕濾杯)',
  ORIGAMI = 'Origami (折紙濾杯)',
  CHEMEX = 'Chemex',
  FLAT_BOTTOM = '平底濾杯',
  CUSTOM = '自定義',
}

export enum FlavorPreference {
  ACIDITY = '強調明亮酸值',
  BALANCED = '酸甜平衡',
  SWEETNESS = '強調厚實甜感',
}

export enum NotePreference {
  FLORAL = '前段花香 / 小分子',
  BALANCED = '層次均衡',
  BODY = '後段醇厚 / 大分子',
}

export enum WeatherCondition {
  SUNNY_DRY = '晴朗乾燥 (低濕度)',
  RAINY_HUMID = '陰雨潮濕 (高濕度)',
  COLD = '寒流低溫 (失溫快)',
  HOT = '炎熱高溫',
  NORMAL = '舒適恆溫',
}

export interface CoffeeParams {
  origin: string;
  process: string;
  roast: RoastLevel;
  targetVolume: number;
  brewer: BrewerType;
  brewerCustom: string;
  flavorPreference: FlavorPreference;
  notePreference: NotePreference;
  roastDate: string; // YYYY-MM-DD
  weather: WeatherCondition;
}

export interface RecipeStep {
  startTimeSec: number;
  durationSec: number;
  waterAmount: number; // Target cumulative water weight at end of step
  action: string;
  description: string;
}

export interface CoffeeRecipe {
  coffeeWeight: number; // grams
  waterRatio: string; // e.g. "1:15"
  totalWater: number; // grams
  temperature: number; // Celsius
  grindSize: string; // Descriptive
  tastingNotes: string[];
  baristaNotes: string; // Explanation of the recipe logic
  steps: RecipeStep[];
}