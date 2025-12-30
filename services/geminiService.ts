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

    **【WBrC 冠軍技術總集 (2014-2025) 深度解析】：**
    
    1.  **2014 Stefanos Domatiotis (希臘)**:
        *   **核心技術**: 雙壺技法 (Double Kettle)。一手注水，一手持壺備用，確保絕對的熱穩定性。
        *   **關鍵概念**: 強調「鎂離子」在水中對 Ninety Plus Gesha 風味的解鎖能力。
        *   **適用場景**: 極淺焙、需要極高溫穩定的豆子。

    2.  **2015 Odd-Steinar (挪威)**:
        *   **核心技術**: 日曬豆正名運動。使用天然極軟水 (Natural Soft Water) 來帶出日曬豆的乾淨層次，打破日曬豆雜味的刻板印象。
        *   **工具應用**: 首位使用 iPhone 連接 Acaia 電子秤即時監控注水流速曲線。
        *   **適用場景**: 優質日曬豆、強調乾淨度的萃取。

    3.  **2016 Tetsu Kasuya (日本)**:
        *   **核心技術**: 「4:6 沖煮法 (4:6 Method)」。前 40% 水量決定酸甜平衡，後 60% 決定濃度。
        *   **關鍵概念**: 粗研磨 (Coarse Grind) 搭配高濃度差斷水，使用 0.3 PPM 的極純水 (Pure Water) 來最大化萃取率而不苦澀。
        *   **適用場景**: 結構清晰、需要調整酸甜比的豆子。

    4.  **2017 Chad Wang (台灣)**:
        *   **核心技術**: 「冷陶瓷濾杯 (Cold Ceramic V60)」。不預熱濾杯，利用陶瓷的熱質量 (Thermal Mass) 吸收前段熱能，保留花香。
        *   **注水手法**: 極致的中心注水 (Center Pour)，減少 Bypass，保持水位高度一致。
        *   **適用場景**: 藝妓 (Geisha)、極致花香調、需要柔和酸值的豆子。

    5.  **2018 Emi Fukahori (瑞士)**:
        *   **核心技術**: 「混合萃取 (Hybrid Method)」(GINA 濾杯)。
        *   **手法細節**: 利用閥門切換「浸泡 (Immersion)」與「滴濾 (Drip)」模式。
        *   **特殊豆種**: 處理低咖啡因 Laurina 品種，利用浸泡增加醇厚度 (Body)。

    6.  **2019 Du Jianing (中國)**:
        *   **核心技術**: 極致的「二次研磨 (Double Grinding)」。第一次粗磨後篩除銀皮 (Chaff)，再進行第二次細磨。
        *   **烘焙概念**: 4分鐘極快烘焙 (Fast Roast) 保留酵素風味。
        *   **適用場景**: 追求極致乾淨度、無澀感的比賽級沖煮。

    7.  **2021 Matt Winton (瑞士)**:
        *   **核心技術**: 「物種拼配 (Species Blending)」。混合 Eugenoides (尤金諾伊第斯-高甜度) + Catucai (卡杜凱-高酸度)。
        *   **注水手法**: 5段式脈衝注水 (Pulse Pouring) 搭配大濾杯 (Orea Big Boy 前身概念)。

    8.  **2022 Sherry Hsu (台灣)**:
        *   **核心技術**: 「混合研磨 (Mixed Grind)」。75% 粗粉 (增加層次) + 25% 細粉 (增加香氣與 Body)。
        *   **變溫概念**: 70°C 低溫悶蒸 (保留揮發性香氣) -> 95°C 高溫萃取 (拉出酸值)。
        *   **適用場景**: 平底濾杯 (Orea/Kalita)、提升層次感。

    9.  **2023 Carlos Medina (智利)**:
        *   **核心技術**: 「多相品飲 (Polyphasic Tasting)」。
        *   **濾杯選擇**: Origami Air S (樹脂版) 減少失溫。
        *   **風味引導**: 針對 熱 (Hot)、溫 (Warm)、冷 (Cold) 設計不同的風味主軸，並引導評審在特定溫度飲用。

    10. **2024 Martin Wölfl (奧地利)**:
        *   **核心技術**: 台上即時研磨 (On-stage Grinding) 確保香氣最大化。
        *   **注水工具**: Melodrip 搭配 Orea V4，追求「零擾動 (Zero Agitation)」萃取，只依靠擴散作用。
        *   **適用場景**: 極致乾淨、口感絲滑的現代淺焙。

    11. **2025 George Peng (中國)**:
        *   **核心技術**: 「三段式烘焙拼配」。同一支豆子，分三鍋不同出豆溫 (例如 198°C/203°C/206°C) 以 1:1:1 混合，同時獲得花香、果酸與醇厚度。
        *   **極端變溫萃取**: 96°C 高溫衝擊香氣 -> 中段降溫 -> 80°C 收尾避免雜味。
        *   **品飲窗口**: 強調 50°C 是風味爆發的黃金品飲窗口。

    **【當前參數設定】：**
    - 產區: ${params.origin} | 處理法: ${params.process} | 烘焙: ${params.roast}
    - 模式: ${params.calculationMode === CalculationMode.BY_DOSE ? `固定粉重 ${params.userCoffeeWeight}g` : `目標液量 ${params.targetVolume}cc`}
    - 架構偏好: ${params.structure} | 風味偏好: ${params.flavorPreference}
    - 濾杯: ${params.brewer === '自定義' ? params.brewerCustom : params.brewer}

    **【生成要求】：**
    1.  **策略選擇**: 請從上述 2014-2025 冠軍資料庫中，根據用戶的豆子特性，選出 **1-2 個最核心的技術** 應用於配方中 (例如：若選日曬豆，可結合 2015 水質概念 + 2022 混合研磨)。
    2.  **Champion Inspiration**: 在 JSON 的 \`championInspiration\` 欄位中，清楚說明是使用了哪位冠軍的什麼技術 (例如："參考 2025 George Peng 的三段變溫法：高溫激發香氣，低溫避免苦澀")。
    3.  **Flavor Summary**: 請撰寫一段具備「展演感」的描述，特別著重於 **溫度變化** 帶來的風味旅程 (參考 2023 Carlos Medina)。
    4.  **Steps**: 步驟必須精確，若有變溫或特殊工具 (Melodrip) 需標註。

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