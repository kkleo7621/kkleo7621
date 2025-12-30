
import { GoogleGenAI, Type } from "@google/genai";
import { CoffeeParams, CoffeeRecipe, CalculationMode, ChampionMethod, WaterStrategy } from "../types";

export const generateCoffeeRecipe = async (params: CoffeeParams): Promise<CoffeeRecipe> => {
  // Initialize GoogleGenAI with the API key directly from process.env.
  // We bypass assigning it to a const variable to avoid "Missing initializer" syntax errors
  // that can occur if build tools strip or replace the variable incorrectly.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Determine if we are in "Auto Mode" or "Locked Module Mode"
  const isAutoMode = params.championMethod === ChampionMethod.AUTO;
  const specificMethod = params.championMethod;

  let methodInstruction = "";

  if (isAutoMode) {
    methodInstruction = `
    **模式：AI 智能媒合 (Auto Match)**
    請從以下 WBrC 冠軍技術庫中，根據使用者的豆況、環境與「水質策略」，挑選「最適合」的一個邏輯來生成配方：
    - Tetsu Kasuya (2016): 4:6 分段概念 (適合調整酸甜比)。
    - Chad Wang (2017): 強調瓷濾杯保溫與中心注水 (適合乾淨度)。
    - Matt Winton (2021): 五段式注水 (Big Bloom)。
    - Sherry (2022): 混合研磨度 (Hybrid Grind)。
    - Martin Wölfl (2024): Melodrip/零擾動 (適合極淺焙)。
    
    *媒合原則*：
    - 若豆子極淺焙且使用「極軟水」(Nordic Soft)，優先考慮 Martin (零擾動) 或 Matt (大悶蒸)。
    - 若使用「RO純水」，務必使用 Tetsu 4:6 邏輯（高擾動補償萃取不足）。
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
    你現在是「AI Master Brewing Engine」的核心運算中樞。你具備 2014-2025 WBrC 世界沖煮大賽等級的化學知識。
    
    **【關鍵水質化學知識庫 (Water Chemistry Knowledge Base)】**
    請依據以下理論分析使用者的水質策略：
    1. **離子功能性 (Ion Specificity)**:
       - **鎂 ($Mg^{2+}$)**: 風味抓手。結合能強，專門提取小分子有機酸（花果香、明亮酸值）。適合淺焙、藝妓。
       - **鈣 ($Ca^{2+}$)**: 結構支撐。提取大分子物質，提供甜感、奶油感 (Creamy) 與體脂感 (Body)。過多會遮蔽花香。
       - **碳酸氫根 ($HCO_3^-$, Buffer)**: 酸質調節閥。高 KH 會中和果酸，使風味呆板 (Flat)；低 KH 能展現酸質，但過低易尖銳。
    2. **WBrC 歷史趨勢 (Trend Analysis)**:
       - **SCA 傳統 (Old School)**: TDS 150ppm / KH 40ppm。適合中深焙，對淺焙太重口味。
       - **現代競賽 (Modern Competition)**: 低 TDS (40-80ppm) / 低 KH (<25ppm)。追求產地風味透明度 (Transparency)。
       - **極端軟水/純水**: Tetsu Kasuya (2016) 使用 0.3ppm 純水 + 粗研磨 + 高擾動。
       - **功能性模組**: Martin Wölfl (2024) 使用 APAX Lab (Tonik/Jamm/Lylac) 針對性強化酸/甜/花香。
    3. **物理化學補償原則 (Compensation Principle)**:
       - **軟水/純水 (Low TDS)**: 化學萃取力弱。**必須**透過物理手段補償：提高水溫 (>93°C)、調細研磨、或增加注水段數 (Agitation)。
       - **硬水/高緩衝 (High TDS/Buffer)**: 化學萃取力強且容易中和酸。**必須**降低水溫 (<90°C)、調粗研磨、或減少擾動 (Center Pour) 以避免過萃與苦澀。

    ${methodInstruction}

    **【使用者變因參數 (User Inputs)】**
    1. **豆況**：${params.origin} (${params.process}, ${params.roast})。
    2. **水質策略**：${params.waterStrategy}。
       - *請特別注意*：若使用者選擇了與豆況「不合」的水（例如極淺焙配硬水），請在 `variableAnalysis` 中提出修正參數的理由。
    3. **環境**：${params.weather} (烘焙日: ${params.roastDate})。
    4. **器材**：${params.brewer} (${params.brewerCustom})。
    5. **偏好**：${params.flavorPreference} / ${params.notePreference}。
    6. **目標**：${params.calculationMode === CalculationMode.BY_DOSE ? `粉重 ${params.userCoffeeWeight}g (請自動推算水量)` : `總液量 ${params.targetVolume}ml (請自動推算粉重)`}。
    7. **整體架構傾向**：${params.structure}。

    **【輸出 JSON 要求】**
    請回傳符合以下結構的 JSON，所有文字使用繁體中文 (Traditional Chinese)：

    1. \`variableAnalysis\` (重要)：約 200 字。
       - 必須包含 **「水質化學分析」**：解釋選用的水 (${params.waterStrategy}) 中的離子（鎂/鈣/緩衝）如何與這支豆子交互作用。
       - 解釋如何調整研磨度或水溫來配合這個水質（例如：「因使用極軟水，化學萃取力不足，故提高水溫至 95°C 並增加擾動...」）。
    2. \`grindSize\`：請給出具體建議 (例如: "中細研磨 C40: 24 clicks")。
    3. \`championInspiration\`：明確寫出使用了哪位冠軍的邏輯。
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
          variableAnalysis: { type: Type.STRING, description: "解釋水質、豆況與冠軍手法的綜合分析" },
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
