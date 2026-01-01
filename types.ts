
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

export enum CalculationMode {
  BY_VOLUME = '鎖定液量 (Target Volume)',
  BY_DOSE = '鎖定粉重 (Fixed Dose)',
}

export interface CoffeeParams {
  origin: string;
  process: string;
  roast: string;
  targetVolume: number;
  userCoffeeWeight: number;
  calculationMode: CalculationMode;
  brewer: string;
  brewerCustom: string;
  grinder: string;
  flavorPreference: string;
  notePreference: string;
  roastDate: string;
  weather: string;
  envTemp?: number; // Real-time Temperature
  envHumidity?: number; // Real-time Humidity
  structure: string;
  championMethod: string;
  isChampionMode: boolean;
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
