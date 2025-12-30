
export type Language = 'zh-TW' | 'en' | 'ja';

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

export enum CalculationMode {
  BY_VOLUME = '鎖定液量 (Target Volume)',
  BY_DOSE = '鎖定粉重 (Fixed Dose)',
}

export enum RecipeStructure {
  STANDARD = '經典平衡 (1:15 基準)',
  RICH = '極致濃郁 (1:10~1:13)',
  TEA_LIKE = '茶感清爽 (1:17~1:19)',
  BYPASS = 'Bypass 變奏 (高濃度萃取+補水)',
}

export enum ChampionMethod {
  AUTO = '🤖 AI 智能媒合 (推薦)',
  TETSU_46 = 'Tetsu Kasuya (4:6 法 / 酸甜可調)',
  CHAD_WANG = 'Chad Wang (陶瓷濾杯 / 中心注水)',
  MATT_WINTON = 'Matt Winton (五段式 / 大悶蒸)',
  EMI_FUKAHORI = 'Emi Fukahori (多溫變奏)',
  SHERRY_HSU = 'Sherry Hsu (混合研磨)',
  MARTIN_WOLFL = 'Martin Wölfl (Melodrip 零擾動)',
}

export interface CoffeeParams {
  origin: string;
  process: string;
  roast: string; // Changed from Enum to string to support multi-language input
  targetVolume: number;
  userCoffeeWeight: number;
  calculationMode: CalculationMode;
  brewer: string; // Changed to string
  brewerCustom: string;
  flavorPreference: string; // Changed to string
  notePreference: string; // Changed to string
  roastDate: string;
  weather: string; // Changed to string
  structure: string; // Changed to string
  championMethod: string; // Changed to string
}

export interface RecipeStep {
  startTimeSec: number;
  durationSec: number;
  waterAmount: number;
  waterTemp?: number;
  action: string;
  description: string;
}

export interface CoffeeRecipe {
  coffeeWeight: number;
  waterRatio: string;
  totalWater: number;
  temperature: number;
  grindSize: string;
  tastingNotes: string[];
  flavorSummary: string;
  variableAnalysis: string; 
  baristaNotes: string;
  championInspiration?: string; 
  steps: RecipeStep[];
}
