import { GoogleGenAI, Type } from "@google/genai";
import { CoffeeParams, CoffeeRecipe } from "../types";

export const generateCoffeeRecipe = async (params: CoffeeParams): Promise<CoffeeRecipe> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });
  const today = new Date().toISOString().split('T')[0];

  const prompt = `
    請作為「Alishan Drip」的首席職人咖啡師，為我設計一份**高度客製化**的手沖咖啡配方。

    **關鍵參數與用戶目標：**
    - 產區/豆種: ${params.origin}
    - 處理法: ${params.process}
    - 烘焙度: ${params.roast}
    - 濾杯: ${params.brewer === '自定義' ? params.brewerCustom : params.brewer}
    - 目標咖啡液量: ${params.targetVolume} cc
    - **風味目標**: ${params.flavorPreference}
    - **香氣/口感重心**: ${params.notePreference}
    
    **環境與豆況（重要變數）：**
    - 烘焙日期: ${params.roastDate} (今天是 ${today}) -> 請自行計算養豆天數。
    - 當地天氣: ${params.weather} (台灣北部氣候)

    **嚴格配方設計邏輯（請勿使用固定模板，需根據環境動態調整）：**

    1.  **養豆期 (Roast Age) 影響**：
        - 若 **< 7天 (極新鮮)**：氣體排放旺盛，請增加「悶蒸時間」(建議 40s+)，並建議更大力的擾動以幫助排氣。
        - 若 **> 30天 (老豆)**：氣體少，悶蒸時間可縮短，建議降低水溫 1-2度 以避免過度萃取雜味。

    2.  **天氣環境 (Weather) 影響**：
        - **潮濕/陰雨**：咖啡粉易吸濕，流速變慢，易造成堵塞或過萃。請建議**略粗一點的研磨度**，或加快注水節奏。
        - **寒流/低溫**：失溫快，請建議**提高水溫** (例如 +1~2°C) 並強調「溫杯」的重要性。
        - **乾燥/晴朗**：標準參數即可。

    3.  **風味目標調整**：
        - 根據「${params.flavorPreference}」與「${params.notePreference}」決定注水結構（分段數與比例）。

    **輸出語言要求：**
    - 所有回應內容（包含描述、風味筆記、Barista Notes）**必須完全使用繁體中文（Traditional Chinese）**。

    請提供精確的 JSON 格式回應：
    - Barista Notes: 必須清楚解釋「為什麼」這個配方（針對養豆天數與天氣做的具體調整）能達到最佳風味。

    回應格式 Schema：
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            coffeeWeight: { type: Type.NUMBER, description: "Coffee dose in grams" },
            waterRatio: { type: Type.STRING, description: "Coffee to water ratio, e.g. 1:15" },
            totalWater: { type: Type.NUMBER, description: "Total water input in grams" },
            temperature: { type: Type.NUMBER, description: "Water temperature in Celsius" },
            grindSize: { type: Type.STRING, description: "Specific grind size description in Traditional Chinese, considering humidity" },
            tastingNotes: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Expected flavors in Traditional Chinese" },
            baristaNotes: { type: Type.STRING, description: "Professional advice explaining adjustments for weather and roast date" },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  startTimeSec: { type: Type.NUMBER },
                  durationSec: { type: Type.NUMBER },
                  waterAmount: { type: Type.NUMBER, description: "Cumulative water weight at end of step" },
                  action: { type: Type.STRING, description: "Action name in Traditional Chinese" },
                  description: { type: Type.STRING, description: "Specific pouring technique in Traditional Chinese" },
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      const recipe = JSON.parse(response.text) as CoffeeRecipe;
      return recipe;
    } else {
      throw new Error("No response text from Gemini");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};