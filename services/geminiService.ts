import { GoogleGenAI, Type } from "@google/genai";
import { CoffeeParams, CoffeeRecipe, CalculationMode } from "../types";

export const generateCoffeeRecipe = async (params: CoffeeParams): Promise<CoffeeRecipe> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    請作為「AI Master Brewing Engine」的首席職人咖啡師，運用 2014-2025 年 WBrC 世界冠軍的技術數據庫，為我設計一份極致的沖煮配方。

    **【全變因深度總結 (Variable Synthesis Logic)】：**
    作為大師，你必須在輸出中的 \`variableAnalysis\` 欄位提供「全變因深度分析」。請結合以下變數進行邏輯推導：
    1. **產區與處理法**：根據 ${params.origin} 的海拔與 ${params.process} 的發酵度決定萃取效率。
    2. **烘焙新鮮度 (烘焙日期: ${params.roastDate})**：分析排氣狀況，決定悶蒸(Bloom)的強度與擾動。
    3. **環境變數 (${params.weather})**：考慮目前的溫濕度對濾杯散熱與水溫流失的補償。
    4. **物理結構 (${params.brewer})**：針對濾杯的流速特性做出水量分配調整。
    5. **個人偏好 (${params.flavorPreference}, ${params.notePreference})**：調整酸甜比例與口感重心。

    **【WBrC 冠軍技術資料庫 (2014-2025)】：**
    請靈活運用 2014 Stefanos (雙壺/熱穩定)、2016 Tetsu (4:6)、2017 Chad (冷陶瓷/香氣鎖死)、2022 Sherry (混合研磨/變溫)、2024 Martin (零擾動/Melodrip)、2025 George Peng (三段烘焙拼配/三段變溫) 等核心技術。

    **【輸出 JSON 要求】：**
    - \`variableAnalysis\`：請撰寫一段具備科學邏輯的文字，解釋你為何根據「當前天氣」與「豆子新鮮度」等變數，對沖煮法做出了具體的調整（例如：因天氣冷而提高悶蒸溫度、因新鮮度高而增強擾動等）。
    - \`championInspiration\`：清楚說明融合了哪幾位冠軍的手法。
    - \`steps\`：必須包含精確的注水時間、水量與動作。
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          coffeeWeight: { type: Type.NUMBER },
          waterRatio: { type: Type.STRING },
          totalWater: { type: Type.NUMBER },
          temperature: { type: Type.NUMBER },
          grindSize: { type: Type.STRING },
          tastingNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
          flavorSummary: { type: Type.STRING },
          variableAnalysis: { type: Type.STRING, description: "全變因聯動分析與沖煮邏輯總結" },
          baristaNotes: { type: Type.STRING },
          championInspiration: { type: Type.STRING },
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                startTimeSec: { type: Type.NUMBER },
                durationSec: { type: Type.NUMBER },
                waterAmount: { type: Type.NUMBER },
                waterTemp: { type: Type.NUMBER },
                action: { type: Type.STRING },
                description: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });

  return JSON.parse(response.text) as CoffeeRecipe;
};