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

    **【WBrC 冠軍技術總集 (2014-2025)】：**
    - **2014 Stefanos Domatiotis (希臘)**: 雙壺技法 (Double Kettle) 確保熱穩定性，強調鎂離子對 Ninety Plus Gesha 的風味解鎖。
    - **2015 Odd-Steinar (挪威)**: 日曬豆正名，使用 iPhone 即時監控數據，天然極軟水帶出日曬豆的乾淨層次。
    - **2016 Tetsu Kasuya (日本)**: 「4:6 沖煮法」，粗研磨+高濃度差斷水，0.3 PPM 極純水應用。
    - **2017 Chad Wang (台灣)**: 「冷陶瓷濾杯 (Cold Ceramic V60)」概念，利用熱質量吸收前段熱能，中心注水減少 Bypass。
    - **2018 Emi Fukahori (瑞士)**: 「混合萃取 (Hybrid Method)」(GINA濾杯)，浸泡與滴濾切換，處理低咖啡因 Laurina 品種。
    - **2019 Du Jianing (中國)**: Origami 濾杯，極致的「二次研磨 (Double Grinding)」去除銀皮，4分鐘極快烘焙。
    - **2021 Matt Winton (瑞士)**: 「物種拼配 (Species Blending)」(Eugenoides + Catucai)，5段式脈衝注水 (Pulse Pouring)。
    - **2022 Sherry Hsu (台灣)**: 平底濾杯 (Orea)，「混合研磨 (Mixed Grind)」(75%粗/25%細)，70°C 低溫悶蒸 -> 95°C 高溫萃取。
    - **2023 Carlos Medina (智利)**: 「多相品飲 (Polyphasic Tasting)」，Origami Air S，針對熱/溫/冷不同溫度的風味引導。
    - **2024 Martin Wölfl (奧地利)**: 台上即時研磨 (On-stage Grinding)，Melodrip 搭配 Orea V4 減少擾動。
    - **2025 George Peng (中國)**: 「三段式烘焙拼配」(同豆種不同出豆溫 1:1:1)，極端變溫萃取 (96°C 榨取香氣 -> 80°C 避免雜味)，50°C 黃金品飲窗口。

    **【當前參數設定】：**
    - 產區: ${params.origin} | 處理法: ${params.process} | 烘焙: ${params.roast}
    - 模式: ${params.calculationMode === CalculationMode.BY_DOSE ? `固定粉重 ${params.userCoffeeWeight}g` : `目標液量 ${params.targetVolume}cc`}
    - 架構偏好: ${params.structure} | 風味偏好: ${params.flavorPreference}
    - 濾杯: ${params.brewer === '自定義' ? params.brewerCustom : params.brewer}

    **【生成要求】：**
    1. **技術融合**：請根據用戶的豆況，選擇上述 1-2 個最適合的冠軍技術融入步驟中（例如：若選淺焙日曬，可參考 2015 或 2022 的低溫悶蒸技巧）。
    2. **風味口感總結 (flavorSummary)**：請撰寫一段具備「展演感」的感官總結。描述咖啡在熱 (Hot)、溫 (Warm)、冷 (Cold) 不同階段的具體風味變化 (參考 2023 Carlos Medina)。
    3. **大賽靈感 (championInspiration)**：明確指出本配方參考了哪位冠軍的哪項技術 (如：參考 2025 George Peng 的變溫手法)。
    4. **詳細步驟**：若使用變溫或特殊注水（如中心注水、Melodrip），請在步驟描述中標註。

    請輸出繁體中文 JSON。
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
          temperature: { type: Type.NUMBER, description: "起始水溫" },
          grindSize: { type: Type.STRING },
          tastingNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
          flavorSummary: { type: Type.STRING, description: "熱/溫/冷 三段式風味描述" },
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