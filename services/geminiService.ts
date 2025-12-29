import { GoogleGenAI, Type } from "@google/genai";
import { CoffeeParams, CoffeeRecipe, CalculationMode, RecipeStructure } from "../types";

export const generateCoffeeRecipe = async (params: CoffeeParams): Promise<CoffeeRecipe> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });
  const today = new Date().toISOString().split('T')[0];

  // Logic to determine the core constraint
  let quantityConstraint = "";
  if (params.calculationMode === CalculationMode.BY_DOSE) {
    quantityConstraint = `**核心限制：固定粉重 ${params.userCoffeeWeight}g**。請根據「架構設定」決定粉水比，計算總水量。`;
  } else {
    quantityConstraint = `**核心限制：固定目標咖啡液量 ${params.targetVolume} cc**。請計算適合的粉重與總注水量。`;
  }

  // Define Structure Logic for Gemini with BALANCE focus
  let structureLogic = "";
  if (params.structure === RecipeStructure.BYPASS) {
    structureLogic = `
      **架構要求：Bypass 變奏 (高濃度萃取+補水)**
      1. 前段萃取請使用較濃的粉水比 (例如 1:10 ~ 1:12) 提取核心風味。
      2. 萃取結束後，必須增加一個步驟：「移開濾杯，直接往咖啡液加入熱水 (Bypass)」。
      3. **關鍵目標**：利用 Bypass 降低濃度但不稀釋甜感，創造出極致乾淨且平衡的口感。補水後的濃度必須適口，不能造成水感太重。
      4. 總水量 (Total Water) 應包含沖煮用水 + Bypass 用水。
    `;
  } else if (params.structure === RecipeStructure.RICH) {
    structureLogic = `
      **架構要求：極致濃郁**
      1. 粉水比控制在 1:10 到 1:13 之間。
      2. **關鍵目標**：追求厚實口感(Body)的同時，**必須避免過度萃取帶來的苦澀**。請透過調整水溫(可能略降)或研磨度，確保入口依然圓潤平衡。
    `;
  } else if (params.structure === RecipeStructure.TEA_LIKE) {
    structureLogic = `
      **架構要求：茶感清爽**
      1. 粉水比拉大至 1:16 到 1:19。
      2. **關鍵目標**：追求花草茶般的通透感，但**必須保留核心甜感**，不可只有酸或產生「水味」。請透過提高水溫或調整研磨來維持萃取率。
    `;
  } else {
    structureLogic = `**架構要求：經典平衡** (粉水比約 1:14 ~ 1:16)，這是最安全的甜蜜點，追求酸質與甜感的完美平衡。`;
  }

  const prompt = `
    請作為「Alishan Drip」的首席職人咖啡師，為我設計一份**高度客製化**的手沖咖啡配方。

    **最高指導原則：**
    **「平衡 (Balance) 與好喝」是最終目標。**
    即使使用者選擇了極端的架構（如極濃或極淡），你必須透過其他變因（水溫、研磨度、注水手法）來修飾，**絕不能給出難以入口的極端配方**。配方應具備職人的細膩度，而非單純的數學計算。

    **核心參數：**
    - ${quantityConstraint}
    - 產區/豆種: ${params.origin}
    - 處理法: ${params.process}
    - 烘焙度: ${params.roast}
    - 濾杯: ${params.brewer === '自定義' ? params.brewerCustom : params.brewer}
    
    **用戶偏好與環境：**
    - **沖煮架構 (Structure)**: ${params.structure} -> ${structureLogic}
    - 風味目標: ${params.flavorPreference}
    - 烘焙日期: ${params.roastDate} (今天是 ${today})
    - 天氣: ${params.weather}

    **設計邏輯與物理限制：**

    1.  **動態平衡機制 (Dynamic Balancing)**：
        - 若粉水比很濃 (Rich)，請考慮稍微調粗研磨或降低水溫，避免過苦。
        - 若粉水比很淡 (Tea-like)，請考慮細研磨或高溫，確保萃取率足夠。
        - 若天氣潮濕且選擇了細研磨，請務必提醒使用者注意流速，避免堵塞。
    2.  **Bypass 處理**：若為 Bypass 模式，最後一個步驟必須是 "Action: Bypass 加水", "WaterAmount: 最終總水量 (含補水)"，並在 Description 說明「移開濾杯，加入 X cc 熱水至總量，調整濃度至適口狀態」。
    3.  **養豆期修正**：
        - 新鮮豆 (<7天)：增加悶蒸時間。
        - 老豆 (>1個月)：降低水溫。

    **輸出語言要求：**
    - 所有內容 **必須完全使用繁體中文**。

    請提供精確的 JSON 格式回應。
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
            coffeeWeight: { type: Type.NUMBER, description: "Coffee dose in grams." },
            waterRatio: { type: Type.STRING, description: "Effective brewing ratio (before bypass if applicable), e.g. 1:10" },
            totalWater: { type: Type.NUMBER, description: "Total liquid output target (brewing water + bypass water)" },
            temperature: { type: Type.NUMBER, description: "Water temperature in Celsius" },
            grindSize: { type: Type.STRING, description: "Specific grind size description" },
            tastingNotes: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Expected flavors" },
            baristaNotes: { type: Type.STRING, description: "Explain the choice of Ratio and Structure with focus on balance" },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  startTimeSec: { type: Type.NUMBER },
                  durationSec: { type: Type.NUMBER },
                  waterAmount: { type: Type.NUMBER, description: "Cumulative water weight (scale reading)" },
                  action: { type: Type.STRING, description: "Action name (e.g., 悶蒸, Bypass加水)" },
                  description: { type: Type.STRING, description: "Specific instruction" },
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