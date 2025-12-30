
import { GoogleGenAI, Type } from "@google/genai";
import { CoffeeParams, CoffeeRecipe, CalculationMode, ChampionMethod, Language } from "../types";

export const generateCoffeeRecipe = async (params: CoffeeParams, language: Language): Promise<CoffeeRecipe> => {
  // Access API Key directly.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Determine if we are in "Auto Mode" or "Locked Module Mode"
  // Note: params.championMethod is now a localized string, so we assume "Auto" if it contains "AI" or "Auto"
  // or we can rely on the index if we had it, but simpler to check for the AI keyword.
  const isAutoMode = params.championMethod.includes("AI") || params.championMethod.includes("Auto") || params.championMethod.includes("智能");
  const specificMethod = params.championMethod;

  let langInstruction = "";
  if (language === 'en') {
    langInstruction = "Please output all text fields in English.";
  } else if (language === 'ja') {
    langInstruction = "Please output all text fields in Japanese (日本語).";
  } else {
    langInstruction = "請回傳符合以下結構的 JSON，所有文字使用繁體中文 (Traditional Chinese)。";
  }

  const methodInstruction = isAutoMode ? `
    **Mode: AI Auto Match**
    Select the best logic from WBrC champions (2014-2025) based on bean status and environment:
    - Tetsu Kasuya (4:6 method, acidity/sweetness balance)
    - Chad Wang (Center pour, ceramic heat retention)
    - Matt Winton (5 pours, big bloom)
    - Sherry Hsu (Hybrid grind)
    - Martin Wölfl (No bypass/Melodrip)
    
    *Principles*:
    - Light Roast + Soft Water -> Martin or Matt.
    - RO Water -> Tetsu 4:6 (high agitation).
    - Cleanliness -> Chad Wang.
  ` : `
    **Mode: Locked Module (${specificMethod})**
    Strictly follow the core structure of the selected champion method, but adapt grind size and temp for the specific bean.
  `;

  const prompt = `
    You are the "AI Master Brewing Engine".
    
    **User Language Constraint**: ${langInstruction}

    ${methodInstruction}

    **User Inputs**:
    1. Origin/Bean: ${params.origin} (${params.process}, ${params.roast})
    2. Environment: ${params.weather} (Roast Date: ${params.roastDate})
    3. Brewer: ${params.brewer} (${params.brewerCustom})
    4. Preferences: ${params.flavorPreference} / ${params.notePreference}
    5. Goal: ${params.calculationMode === CalculationMode.BY_DOSE ? `Dose ${params.userCoffeeWeight}g` : `Volume ${params.targetVolume}ml`}
    6. Structure: ${params.structure}

    **Response Requirements**:
    Return JSON.
    1. \`variableAnalysis\`: Analyze why this specific method/parameter was chosen based on water chemistry and bean status.
    2. \`grindSize\`: Specific recommendation (e.g., "Medium-Fine, Comandante 24 clicks").
    3. \`championInspiration\`: Name of the champion.
    4. \`steps\`: \`waterAmount\` is the CUMULATIVE scale reading.
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
          variableAnalysis: { type: Type.STRING },
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
