
import { GoogleGenAI, Type } from "@google/genai";
import { CoffeeParams, CoffeeRecipe, CalculationMode, ChampionMethod } from "../types";

export const generateCoffeeRecipe = async (params: CoffeeParams): Promise<CoffeeRecipe> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Determine if we are in "Auto Mode" or "Locked Module Mode"
  const isAutoMode = params.championMethod === ChampionMethod.AUTO;
  const specificMethod = params.championMethod;

  let methodInstruction = "";

  if (isAutoMode) {
    methodInstruction = `
    **模式：AI 智能媒合 (Auto Match)**
    請從以下 WBrC 冠軍技術庫中，根據使用者的豆況與環境，挑選「最適合」的一個邏輯來生成配方：
    - Tetsu Kasuya (2016): 4:6 分段概念 (適合調整酸甜比)。
    - Chad Wang (2017): 強調瓷濾杯保溫與中心注水 (適合乾淨度)。
    - Matt Winton (2021): 五段式注水 (Big Bloom)。
    - Sherry (2022): 混合研磨度 (Hybrid Grind)。
    - Martin Wölfl (2024): Melodrip/零擾動 (適合極淺焙)。
    
    *媒合原則*：
    - 若豆子極淺焙/難萃取，優先考慮 Martin (零擾動) 或 Matt (大悶蒸)。
    - 若需要調整酸甜感，優先考慮 Tetsu 4:6。
    - 若追求極致乾淨度，優先考慮 Chad Wang。
    `;
  } else {
    methodInstruction = `
    **模式：指定冠軍模組鎖定 (Locked Module: ${specificMethod})**
    
    使用者已明確指定使用 **${specificMethod}** 的手法。
    
    **重要指令：**
    1. **架構鎖定**：你必須嚴格遵守 ${specificMethod} 的核心注水段數與邏輯 (例如：Tetsu 4:6 必須是 5 段注水；Chad Wang 必須是少段數中心注水)。不要隨意更換成別的冠軍手法。
    2. **參數適應 (Parameter Adaptation)**：雖然架構鎖定，但你必須調整「研磨度」、「水溫」與「每段注水量比例」來適應使用者的豆子 (${params.origin}, ${params.roast}) 與天氣 (${params.weather})。
       - *範例*：使用者選了 4:6 法 (通常粗研磨)，但豆子是「極淺焙」(難萃取)。你應該在保持 5 段注水架構的同時，建議「比原版 4:6 更細的研磨」或「更高的水溫 (93-94°C)」，而非死守原版參數。
    `;
  }

  const prompt = `
    你現在是「AI Master Brewing Engine」的核心運算中樞。
    
    ${methodInstruction}

    **【使用者變因參數 (User Inputs)】**
    1. **豆況**：${params.origin} (${params.process}, ${params.roast})。
    2. **環境**：${params.weather} (烘焙日: ${params.roastDate})。
    3. **器材**：${params.brewer} (${params.brewerCustom})。
    4. **偏好**：${params.flavorPreference} / ${params.notePreference}。
    5. **目標**：${params.calculationMode === CalculationMode.BY_DOSE ? `粉重 ${params.userCoffeeWeight}g (請自動推算水量)` : `總液量 ${params.targetVolume}ml (請自動推算粉重)`}。
    6. **整體架構傾向**：${params.structure}。

    **【輸出 JSON 要求】**
    請回傳符合以下結構的 JSON，所有文字使用繁體中文 (Traditional Chinese)：

    1. \`variableAnalysis\` (重要)：約 150 字。
       - 若是指定模式，請解釋：「如何調整了 ${specificMethod} 的研磨或水溫來適應這支 ${params.roast} 豆」。
       - 若是自動模式，請解釋：「為何選擇了這位冠軍的手法來對應這支豆子」。
    2. \`grindSize\`：請給出具體建議 (例如: "中細研磨 C40: 24 clicks")。
    3. \`championInspiration\`：明確寫出使用了哪位冠軍的邏輯 (若是指定模式，請顯示該冠軍名字)。
    4. \`steps\`：
       - \`waterAmount\` 必須是 **電子秤累計總顯示數字 (Cumulative Scale Reading)**。
       - 時間安排必須合理。

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
          grindSize: { type: Type.STRING, description: "修正後的研磨度建議" },
          tastingNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
          flavorSummary: { type: Type.STRING },
          variableAnalysis: { type: Type.STRING, description: "解釋如何根據變因修改冠軍手法的邏輯" },
          baristaNotes: { type: Type.STRING },
          championInspiration: { type: Type.STRING, description: "提及參考了哪位冠軍的邏輯" },
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                startTimeSec: { type: Type.NUMBER },
                durationSec: { type: Type.NUMBER },
                waterAmount: { type: Type.NUMBER, description: "累計總水量 (Scale Reading)" },
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
