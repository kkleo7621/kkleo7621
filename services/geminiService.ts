
import { GoogleGenAI, Type } from "@google/genai";
import { CoffeeParams, CoffeeRecipe, CalculationMode, Language } from "../types";

export const generateCoffeeRecipe = async (params: CoffeeParams, language: Language): Promise<CoffeeRecipe> => {
  // Access API Key directly.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Determine if we are in "Auto Mode" or "Locked Module Mode"
  const isAutoMode = params.championMethod.includes("AI") || params.championMethod.includes("Auto") || params.championMethod.includes("智能");
  const specificMethod = params.championMethod;

  // --- Date Logic Calculation (Fix for Future Date Bug) ---
  const today = new Date();
  const roastDateObj = new Date(params.roastDate);
  // Calculate difference in days
  const diffTime = today.getTime() - roastDateObj.getTime();
  // Math.ceil to handle partial days, Math.max(0, ...) to ensure no negative numbers (future dates become 0/Fresh)
  const daysOld = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  // --------------------------------------------------------

  let langInstruction = "";
  if (language === 'en') {
    langInstruction = "Please output all text fields in English.";
  } else if (language === 'ja') {
    langInstruction = "Please output all text fields in Japanese (日本語).";
  } else {
    langInstruction = "請回傳符合以下結構的 JSON，所有文字使用繁體中文 (Traditional Chinese)。";
  }

  // --- Logic Branch: Champion Mode vs Standard Mode ---
  let methodInstruction = "";

  if (params.isChampionMode) {
      // Enhanced Prompt logic with Full WBrC Knowledge Graph
      methodInstruction = isAutoMode ? `
        **Mode: AI Auto Match (Global WBrC Database 2014-2025)**
        You act as a World Brewers Cup Head Judge with access to the full history of champion techniques.
        
        **CRITICAL**: Do NOT default to Tetsu Kasuya unless the profile explicitly demands 4:6 structure. 
        **GOAL**: Match the bean's soul to the most fitting champion's philosophy.

        **WBrC Champion Selection Matrix (2014-2025):**

        1. **BEAN: High Acidity, Washed, Light Roast, Floral/Tea-like**
           -> **MATCH: Chad Wang (2017) or Matt Winton (2021)**
           *   *Chad Wang*: Immersion-like drip, center pour, ceramic dripper, focus on clean aromatics.
           *   *Matt Winton*: 5 pours (50g/60g/60g/60g/70g structure), high acidity, uses blind tasting logic.

        2. **BEAN: Natural, Anaerobic, Funky, Tropical Fruit, High Sweetness**
           -> **MATCH: Carlos Medina (2023) or Odd-Steinar Tøllefsen (2015)**
           *   *Carlos Medina*: 5 pours with specific intervals to maximize tropical notes, often uses Origami.
           *   *Odd-Steinar*: Techniques that highlight "Natural" characteristics, emphasizing dried fruit sweetness.

        3. **BEAN: Experimental Process, Complex, Requiring Balance**
           -> **MATCH: Sherry Hsu (2022) or Emi Fukahori (2018)**
           *   *Sherry Hsu*: "Hybrid Grind" concept (simulated by varying pouring aggression or temp), descending temperature (start hot, end cooler).
           *   *Emi Fukahori*: Variable temperature (Low temp bloom -> High temp extraction -> Low temp finish) to control extraction phases.

        4. **BEAN: High Clarity, Consistency, Flat Bottom / Low Agitation**
           -> **MATCH: Martin Wölfl (2024) or Du Jianing (2019)**
           *   *Martin Wölfl*: Melodrip / Low Agitation / No Bypass. Grind coarse, pour slow.
           *   *Du Jianing*: High flow rate, precision pouring, often fine grind with fast finish.

        5. **BEAN: Darker Roast, Heavy Body, Richness wanted**
           -> **MATCH: Tetsu Kasuya (2016) or Stefanos Domatiotis (2014)**
           *   *Tetsu Kasuya (4:6)*: Control balance (first 40%) and strength (last 60%). Good for bold flavors.
           *   *Stefanos*: Classic structure, consistent agitation.
      ` : `
        **Mode: Locked Module (${specificMethod})**
        Strictly follow the core structure and philosophy of the selected champion method (${specificMethod}). 
        *   If **Martin Wölfl** is selected: Emphasize low agitation.
        *   If **Sherry Hsu** is selected: Suggest temperature drops if possible.
        *   If **Emi Fukahori** is selected: Use variable temperature steps.
        *   If **Chad Wang** is selected: Use center pours.
        
        Adapt grind size and exact water amounts to the user's target dose/volume.
      `;
  } else {
      // STANDARD MODE (Non-Champion)
      methodInstruction = `
        **Mode: Standard Professional Brewing (SCA Gold Cup Standards)**
        You are a skilled Head Barista. Do NOT emulate a specific World Brewers Cup champion.
        Instead, create a **scientifically sound, balanced recipe** based on SCA standards.
        - **Objective**: Achieve an even extraction (18-22% extraction yield target conceptually).
        - **Structure**: Use a standard 2-pour or 3-pour structure (Bloom + 1 Pour OR Bloom + 2 Pours).
        - **Flavor**: Focus on balance, clarity, and sweetness appropriate for the roast level.
        - **Temperature**: 
            - Light: 92-94°C
            - Medium: 90-92°C
            - Dark: 85-88°C
        - **Champion Field**: In the output, set "championInspiration" to "SCA Standard / Gold Cup Logic".
      `;
  }

  // Construct Weather String with Exact Data if available
  const weatherString = (params.envTemp !== undefined && params.envHumidity !== undefined)
    ? `${params.weather} (Sensor Detected: ${params.envTemp}°C, ${params.envHumidity}% RH)`
    : params.weather;

  const prompt = `
    You are the "AI Master Brewing Engine".
    
    **User Language Constraint**: ${langInstruction}

    ${methodInstruction}

    **CONFLICT RESOLUTION & HIERARCHY (IMPORTANT)**:
    You are an intelligent consultant. Users may input contradictory parameters.
    
    **Resolve conflicts using this priority list:**
    1.  **PHYSICS (The Bean)**: You cannot force a Light Roast to taste like a Dark Roast.
    2.  **CHAMPION LOGIC (If Active)**: Champion Method structure overrides user structure preference.
    3.  **USER PREFERENCE**: Optimize strictly within the bounds of #1 and #2.

    **SENSORY TARGETING LOGIC (Flavor & Body)**:
    - **FLAVOR**: The user wants to emphasize either **ACIDITY (酸)** or **SWEETNESS (甜)**.
        - *To emphasize Acid*: Use slightly coarser grind, higher temperature (93-96°C), faster flow rate, or 1:16+ ratio.
        - *To emphasize Sweetness*: Use slightly finer grind, moderate temperature (90-92°C), or 1:13-1:15 ratio to increase concentration.
    - **BODY (MOUTHFEEL)**: The user wants **TEA-LIKE/WATERY (清爽/水感)** or **HEAVY/RICH (厚實)**.
        - *For Tea-like/Watery*: Use 1:16-1:18 ratio, coarser grind, bypass (adding water at end) if needed.
        - *For Heavy/Rich*: Use 1:10-1:13 ratio, finer grind, higher agitation.

    **BLOOMING (Pre-wetting) CALCULATION LOGIC**:
    You MUST adjust the blooming step (Step 1) based on the **calculated Bean Age** and **Roast Level**:
    1.  **Freshness (Bean Age: ${daysOld} days old)**:
        - If Bean Age is < 14 days: **EXTEND Bloom Time** (e.g., 40s-50s) to allow CO2 degassing. Mention "Degassing needed" in analysis.
        - If Bean Age is > 30 days: **SHORTEN Bloom Time** (e.g., 30s) as there is less gas.
    2.  **Roast Level (${params.roast})**:
        - Light Roast: Needs more time to saturate (denser bean).
        - Dark Roast: Absorbs water fast, needs less time but careful flow.

    **User Inputs**:
    1. Origin/Bean: ${params.origin} (${params.process}, ${params.roast})
    2. Environment: ${weatherString} (Roast Date: ${params.roastDate}, Age: ${daysOld} days)
    3. Equipment: Brewer [${params.brewer}], Grinder [${params.grinder}]
    4. Preferences: Flavor[${params.flavorPreference}] / Body[${params.notePreference}]
    5. Goal: ${params.calculationMode === CalculationMode.BY_DOSE ? `Dose ${params.userCoffeeWeight}g` : `Volume ${params.targetVolume}ml`}
    6. Structure Preference: ${params.structure}

    **Response Requirements**:
    Return JSON.
    1. \`variableAnalysis\`: (150-200 words) A professional Barista analysis. 
       - **CONFLICT CHECK**: Explicitly mention if you had to override a user preference due to conflicting physics or method logic.
       - Explain **WHY** this recipe structure was chosen.
       - Explain the Bloom Time logic based on freshness.
    2. \`grindSize\`: **CRITICAL** Provide specific click counts/settings for the user's grinder (${params.grinder}). e.g. "24 Clicks on Comandante".
    3. \`championInspiration\`: Name of the champion used (or "SCA Standard" if Standard Mode).
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
