
import { Language } from "./types";

export const TRANSLATIONS = {
  'zh-TW': {
    title: 'AI Master Brewing Engine',
    subtitle: '專業手沖咖啡助手',
    loading: [
      "解析產區風土 (Terroir)...",
      "回溯 2016 Tetsu Kasuya 4:6 數據...",
      "計算 CO2 悶蒸排氣速率 (Degassing)...",
      "模擬 2019 Du Jianing 精準注水...",
      "計算 2017 Chad Wang 冷陶瓷參數...",
      "應用 2024 Martin Wölfl 零擾動理論...",
      "優化 2023 Carlos Medina 變溫結構..."
    ],
    section_origin: '產區與豆況',
    section_method: '萃取理論模型',
    section_env: '環境與感官目標',
    label_origin: '咖啡產區',
    label_process: '處理法',
    label_roast: '烘焙度',
    label_method: '冠軍手法模組 (核心)',
    label_champ_switch: '啟用 WBrC 冠軍資料庫',
    label_champ_on: 'ON',
    label_champ_off: 'OFF',
    method_hint_auto: '✨ AI 將分析您的豆況，從 2014-2025 歷屆冠軍資料庫中，媒合最適合的萃取邏輯。',
    method_hint_lock: '🔒 已鎖定特定冠軍手法。AI 將維持該手法的核心架構，但會協助微調研磨度與水溫以適應豆況。',
    method_hint_standard: '⚖️ 使用 SCA 標準金杯萃取邏輯。不套用特殊流派，專注於物理萃取的均勻度與平衡性。',
    label_structure: '沖煮比例傾向',
    btn_dose: '鎖定粉重',
    btn_volume: '鎖定液量',
    label_dose: '粉重 (Dose)',
    label_volume: '液量 (Volume)',
    label_roast_date: '烘焙日期',
    label_weather: '目前天氣',
    btn_auto_weather: '📍 自動偵測', // New
    label_flavor: '風味光譜 (Flavor)',
    label_note: '口感光譜 (Body/Mouthfeel)',
    label_brewer: '濾杯 (Dripper)',
    label_grinder: '磨豆機 (Grinder)',
    label_custom_brewer: '自定義濾杯',
    btn_generate: '✨ 生成職人配方',
    error_msg: '職人配方生成失敗。請檢查連線或稍後再試。',
    footer_text: 'POWERED BY GEMINI PRO PREVIEW. DATA INSIGHTS FROM WORLD BREWERS CUP CHAMPIONS 2014-2025.',
    // Timer
    timer_brewing: 'Brewing Real-time',
    timer_start: '開始沖煮',
    timer_pause: '暫停',
    timer_resume: '繼續',
    timer_done: '已完成',
    timer_next: 'Next Action',
    timer_temp: 'Water Temp',
    timer_total: 'Total Water',
    timer_ratio: 'Ratio',
    timer_grind: 'Recommended Grind Setting',
    timer_analysis: '冠軍媒合分析報告',
    timer_champ: '採用萃取理論',
    timer_steps: '沖煮流程詳解',
    timer_share: '生成分享卡',
    timer_reset: '重設',
    share_title: 'Barista Log (WBrC)',
    share_subtitle: '點擊下方按鈕將配方導出為專業影像',
    share_save: '📥 另存圖片到相簿',
    share_back: '← 返回計時器介面',
    step_water_to: '注水至'
  },
  'en': {
    title: 'AI Master Brewing Engine',
    subtitle: 'Professional Pour-Over Assistant',
    loading: [
      "Analyzing Terroir & Origin...",
      "Retrieving 2016 Tetsu Data...",
      "Calculating CO2 Degassing Rate...",
      "Simulating 2019 Du Jianing Precision...",
      "Calculating Thermal Mass...",
      "Applying 2024 Martin Wölfl Logic...",
      "Optimizing Variable Temp Structure..."
    ],
    section_origin: 'Origin & Bean Status',
    section_method: 'Extraction Model',
    section_env: 'Environment & Goal',
    label_origin: 'Coffee Origin',
    label_process: 'Process Method',
    label_roast: 'Roast Level',
    label_method: 'Champion Method (Core)',
    label_champ_switch: 'Enable WBrC Champion Database',
    label_champ_on: 'ON',
    label_champ_off: 'OFF',
    method_hint_auto: '✨ AI will match the best champion logic from the 2014-2025 database based on your bean.',
    method_hint_lock: '🔒 Champion method locked. AI will maintain the core structure but fine-tune grind & temp.',
    method_hint_standard: '⚖️ Using SCA Standard Gold Cup Logic. Focuses on balanced, consistent physical extraction without specific champion styles.',
    label_structure: 'Brew Ratio Structure',
    btn_dose: 'Fixed Dose',
    btn_volume: 'Target Volume',
    label_dose: 'Dose (g)',
    label_volume: 'Volume (ml)',
    label_roast_date: 'Roast Date',
    label_weather: 'Current Weather',
    btn_auto_weather: '📍 Auto Detect', // New
    label_flavor: 'Flavor Spectrum',
    label_note: 'Body/Mouthfeel',
    label_brewer: 'Brewer (Dripper)',
    label_grinder: 'Grinder',
    label_custom_brewer: 'Custom Brewer',
    btn_generate: '✨ Generate Master Recipe',
    error_msg: 'Failed to generate recipe. Please check connection.',
    footer_text: 'POWERED BY GEMINI PRO PREVIEW. DATA INSIGHTS FROM WORLD BREWERS CUP CHAMPIONS 2014-2025.',
    // Timer
    timer_brewing: 'Brewing Real-time',
    timer_start: 'Start Brew',
    timer_pause: 'Pause',
    timer_resume: 'Resume',
    timer_done: 'Finished',
    timer_next: 'Next Action',
    timer_temp: 'Water Temp',
    timer_total: 'Total Water',
    timer_ratio: 'Ratio',
    timer_grind: 'Recommended Grind Setting',
    timer_analysis: 'Champion Match Analysis',
    timer_champ: 'Extraction Theory',
    timer_steps: 'Brewing Steps',
    timer_share: 'Create Share Card',
    timer_reset: 'Reset',
    share_title: 'Barista Log (WBrC)',
    share_subtitle: 'Export recipe as professional image',
    share_save: '📥 Save to Photos',
    share_back: '← Back to Timer',
    step_water_to: 'Pour to'
  },
  'ja': {
    title: 'AI Master Brewing Engine',
    subtitle: 'プロフェッショナル・ハンドドリップ・アシスタント',
    loading: [
      "テロワール分析中...",
      "2016 粕谷哲 4:6メソッド検索中...",
      "CO2 ガス放出率を計算中...",
      "2019 杜嘉寧 精密抽出シミュレーション...",
      "熱容量計算中...",
      "2024 Martin Wölfl 静音抽出適用中...",
      "可変温度構造を最適化中..."
    ],
    section_origin: '産地と豆の状態',
    section_method: '抽出理論モデル',
    section_env: '環境とターゲット',
    label_origin: 'コーヒー産地',
    label_process: '精製方法',
    label_roast: '焙煎度',
    label_method: '抽出理論 (コア)',
    label_champ_switch: 'WBrC チャンピオンDBを有効化',
    label_champ_on: 'ON',
    label_champ_off: 'OFF',
    method_hint_auto: '✨ AIが豆の状態に基づき、2014-2025年の歴代チャンピオンから最適な理論を自動選択します。',
    method_hint_lock: '🔒 メソッド固定モード。AIは構造を維持しつつ、挽き目と湯温を微調整します。',
    method_hint_standard: '⚖️ SCA標準ゴールドカップ理論を使用。特定の流派に偏らず、物理的な抽出効率とバランスを重視します。',
    label_structure: '抽出比率の傾向',
    btn_dose: '粉量固定',
    btn_volume: '抽出量固定',
    label_dose: '粉量 (g)',
    label_volume: '抽出量 (ml)',
    label_roast_date: '焙煎日',
    label_weather: '現在の天気',
    btn_auto_weather: '📍 自動検出', // New
    label_flavor: 'フレーバー (酸味/甘み)',
    label_note: 'ボディ (質感)',
    label_brewer: 'ドリッパー選択',
    label_grinder: 'グラインダー (ミル)',
    label_custom_brewer: 'カスタムドリッパー',
    btn_generate: '✨ レシピ生成',
    error_msg: 'レシピの生成に失敗しました。接続を確認してください。',
    footer_text: 'POWERED BY GEMINI PRO PREVIEW. DATA INSIGHTS FROM WORLD BREWERS CUP CHAMPIONS 2014-2025.',
    // Timer
    timer_brewing: 'Brewing Real-time',
    timer_start: '抽出開始',
    timer_pause: '一時停止',
    timer_resume: '再開',
    timer_done: '抽出完了',
    timer_next: 'Next Action',
    timer_temp: 'Water Temp',
    timer_total: 'Total Water',
    timer_ratio: 'Ratio',
    timer_grind: 'Recommended Grind Setting',
    timer_analysis: 'チャンピオン選定分析',
    timer_champ: '採用された理論',
    timer_steps: '抽出ステップ詳細',
    timer_share: 'シェアカード作成',
    timer_reset: 'リセット',
    share_title: 'Barista Log (WBrC)',
    share_subtitle: 'レシピを画像として保存',
    share_save: '📥 画像を保存',
    share_back: '← タイマーに戻る',
    step_water_to: '注水量'
  }
};

// 30+ Common Grinders
const GRINDERS_LIST = [
  "Comandante C40 MK3/MK4 (Red Clix)",
  "Comandante C40 MK3/MK4 (Standard)",
  "1Zpresso K-Ultra / K-Max",
  "1Zpresso ZP6 Special",
  "1Zpresso J-Max / J-Ultra",
  "1Zpresso Q2 / Q-Air (Heptagonal)",
  "1Zpresso X-Pro / X-Ultra",
  "Timemore C2 / C3 / C3 ESP",
  "Fellow Ode Gen 2",
  "Fellow Ode Gen 1 (SSP Burrs)",
  "Fellow Opus",
  "Baratza Encore / Encore ESP",
  "Baratza Vario / Forte",
  "Mahlkönig EK43 / EK43S",
  "Niche Zero",
  "Niche Duo",
  "Wilfa Svart (Uniform)",
  "Lagom P64",
  "Lagom Mini",
  "Weber Workshops EG-1",
  "Weber Key",
  "Kinu M47 (Classic/Simplicity)",
  "Kingrinder K4 / K6",
  "Fuji Royal R-220 (小富士)",
  "Kalita Nice Cut G",
  "Varia VS3",
  "DF64 (G-iota) Gen 2",
  "Eureka Mignon (Filtro/Cronos)",
  "Mazzer Philos",
  "Hario MSS-1B / Skerton",
  "Porlex Mini / Tall",
  "Etzinger EtzMAX",
  "Option-O Lagom 01",
  "Generic Flat Burr (平刀)",
  "Generic Conical Burr (錐刀)"
];

// 30+ Common Brewers
const BREWERS_LIST = [
  "Hario V60 (01/02 Ceramic/Plastic)",
  "Hario Switch (Immersion)",
  "Hario Mugen",
  "Kalita Wave 155/185 (Metal)",
  "Kalita Wave (Glass/Ceramic)",
  "Origami Dripper S/M",
  "Chemex (3/6/8 Cup)",
  "Fellow Stagg [X]",
  "Fellow Stagg [XF]",
  "AeroPress / AeroPress Go",
  "Kono Meimon (Classic)",
  "April Brewer (Glass/Plastic)",
  "Orea V3 / V4",
  "Torch Mountain",
  "Cafec Flower Dripper",
  "Blue Bottle Dripper",
  "Loveramics (Mellow/Smooth/Strong)",
  "Saint Anthony C70",
  "Clever Dripper (聰明濾杯)",
  "Bee House",
  "Phoenix 70",
  "GINA (Goat Story)",
  "Melitta (Classic)",
  "Sanyo Sangyo Flower",
  "Timemore Crystal Eye",
  "Brewista Tornado",
  "December Dripper (Variable)",
  "Graycano",
  "Sibarist FAST",
  "Munieq Tetra Drip",
  "Custom / Other"
];

export const GET_OPTIONS = (lang: Language) => {
  const isEn = lang === 'en';
  const isJa = lang === 'ja';

  const wbrc_methods = [
    { name_en: "🤖 AI Auto Match (2014-2025)", name_ja: "🤖 AI オートマッチ (2014-2025)", name_zh: "🤖 AI 智能媒合 (歷屆冠軍資料庫)" },
    { name_en: "2024 Martin Wölfl (Melodrip/Bypass)", name_ja: "2024 Martin Wölfl (Melodrip/加水)", name_zh: "2024 Martin Wölfl (Melodrip/零擾動)" },
    { name_en: "2023 Carlos Medina (Tropical/Origami)", name_ja: "2023 Carlos Medina (トロピカル/Origami)", name_zh: "2023 Carlos Medina (熱帶發酵/Origami)" },
    { name_en: "2022 Sherry Hsu (Hybrid Grind)", name_ja: "2022 Sherry Hsu (ハイブリッド挽き目)", name_zh: "2022 Sherry Hsu (混合研磨/降溫)" },
    { name_en: "2021 Matt Winton (5-Pour/Big Bloom)", name_ja: "2021 Matt Winton (5投/蒸らし多め)", name_zh: "2021 Matt Winton (五段式/大悶蒸)" },
    { name_en: "2019 Du Jianing (Precision/High Flow)", name_ja: "2019 Du Jianing (超精密/高流速)", name_zh: "2019 Du Jianing (極致勻萃/高流速)" },
    { name_en: "2018 Emi Fukahori (Variable Temp)", name_ja: "2018 Emi Fukahori (可変温度)", name_zh: "2018 Emi Fukahori (多溫變奏/浸泡)" },
    { name_en: "2017 Chad Wang (Ceramic/Center Pour)", name_ja: "2017 Chad Wang (陶器/センタープア)", name_zh: "2017 Chad Wang (陶瓷濾杯/中心注水)" },
    { name_en: "2016 Tetsu Kasuya (4:6 Method)", name_ja: "2016 粕谷哲 (4:6メソッド)", name_zh: "2016 Tetsu Kasuya (4:6 法/酸甜可調)" },
    { name_en: "2015 Odd-Steinar (Natural Process Focus)", name_ja: "2015 Odd-Steinar (ナチュラル重視)", name_zh: "2015 Odd-Steinar (日曬豆專門/V60)" },
    { name_en: "2014 Stefanos Domatiotis (Structure)", name_ja: "2014 Stefanos Domatiotis (構造重視)", name_zh: "2014 Stefanos Domatiotis (經典架構)" }
  ];

  return {
    origins: isEn ? [
      "Ethiopia Yirgacheffe", "Ethiopia Sidamo", "Ethiopia Guji", "Kenya", "Colombia", "Brazil", "Guatemala", "Costa Rica", "Panama Geisha", "Indonesia Mandheling", "El Salvador", "Honduras", "Taiwan Alishan", "Vietnam", "Other (Custom)"
    ] : isJa ? [
      "エチオピア イルガチェフェ", "エチオピア シダモ", "エチオピア グジ", "ケニア", "コロンビア", "ブラジル", "グアテマラ", "コスタリカ", "パナマ ゲイシャ", "インドネシア マンデリン", "エルサルバドル", "ホンジュラス", "台湾 阿里山", "ベトナム", "その他 (カスタム)"
    ] : [
      "衣索比亞 耶加雪菲", "衣索比亞 西達摩", "衣索比亞 古吉", "肯亞", "哥倫比亞", "巴西", "瓜地馬拉", "哥斯大黎加", "巴拿馬 藝妓", "印尼 曼特寧", "薩爾瓦多", "宏都拉斯", "台灣 阿里山", "越南", "其他 (自定義)"
    ],
    process: isEn ? [
      "Washed", "Natural", "Honey", "Anaerobic", "Experimental"
    ] : isJa ? [
      "ウォッシュド (水洗)", "ナチュラル (日干し)", "ハニー", "アナエロビック (嫌気性発酵)", "その他実験的製法"
    ] : [
      "水洗", "日曬", "蜜處理", "厭氧發酵", "其他實驗性處理"
    ],
    roast: isEn ? [
      "Light", "Medium-Light", "Medium", "Medium-Dark", "Dark"
    ] : isJa ? [
      "ライトロースト (浅煎り)", "ミディアムライト", "ミディアム (中煎り)", "ミディアムダーク", "ダーク (深煎り)"
    ] : [
      "淺焙", "淺中焙", "中焙", "中深焙", "深焙"
    ],
    methods: wbrc_methods.map(m => isEn ? m.name_en : isJa ? m.name_ja : m.name_zh),
    weather: isEn ? [
      "Sunny / Dry", "Rainy / Humid", "Cold", "Hot", "Comfortable / Normal"
    ] : isJa ? [
      "晴れ / 乾燥", "雨 / 高湿度", "寒い", "暑い", "快適 / 普通"
    ] : [
      "晴朗乾燥 (低濕度)", "陰雨潮濕 (高濕度)", "寒流低溫 (失溫快)", "炎熱高溫", "舒適恆溫"
    ],
    // UPDATED FLAVOR OPTIONS
    flavor: isEn ? [
      "Highlight Acidity", "Balanced", "Maximize Sweetness"
    ] : isJa ? [
      "酸味を強調 (Acidity)", "バランス (Balanced)", "甘みを最大化 (Sweetness)"
    ] : [
      "強調明亮酸質 (Acidity)", "酸甜平衡 (Balanced)", "飽滿甜感 (Sweetness)"
    ],
    // UPDATED BODY OPTIONS
    notes: isEn ? [
      "Tea-like / Clean", "Medium Body", "Rich / Heavy Body"
    ] : isJa ? [
      "お茶のような質感 (Watery)", "ミディアムボディ", "厚みのある質感 (Heavy)"
    ] : [
      "清爽水感 (Tea-like)", "層次適中 (Medium)", "厚實口感 (Heavy)"
    ],
    structure: isEn ? [
      "Standard (1:15)", "Rich / Strong (1:10-1:13)", "Tea-like (1:17+)", "Bypass (Dilution)"
    ] : isJa ? [
      "スタンダード (1:15)", "濃厚 (1:10-1:13)", "スッキリ (1:17+)", "バイパス (加水)"
    ] : [
      "經典平衡 (1:15 基準)", "極致濃郁 (1:10~1:13)", "茶感清爽 (1:17~1:19)", "Bypass 變奏 (高濃度萃取+補水)"
    ],
    brewers: BREWERS_LIST,
    grinders: GRINDERS_LIST
  };
};
