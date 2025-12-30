
import { Language } from "./types";

export const TRANSLATIONS = {
  'zh-TW': {
    title: 'AI Master Brewing Engine',
    subtitle: '專業手沖咖啡助手',
    loading: [
      "解析產區風土 (Terroir)...",
      "模擬 2025 George Peng 變溫萃取...",
      "計算 2017 Chad Wang 冷陶瓷參數...",
      "應用 2016 Tetsu Kasuya 4:6 法則...",
      "優化 2022 Sherry 混合研磨比例...",
      "平衡 2023 Carlos 多相品飲結構..."
    ],
    section_origin: '產區與豆況',
    section_method: '冠軍模組與參數',
    section_env: '環境與職人偏好',
    label_origin: '咖啡產區',
    label_process: '處理法',
    label_roast: '烘焙度',
    label_method: '冠軍手法模組 (核心)',
    method_hint_auto: '✨ AI 將根據您的豆況與天氣，自動媒合最適合的冠軍邏輯。',
    method_hint_lock: '🔒 已鎖定特定冠軍手法。AI 將維持該手法的核心架構，但會協助微調研磨度與水溫以適應豆況。',
    label_structure: '沖煮比例傾向',
    btn_dose: '鎖定粉重',
    btn_volume: '鎖定液量',
    label_dose: '粉重 (Dose)',
    label_volume: '液量 (Volume)',
    label_roast_date: '烘焙日期',
    label_weather: '目前天氣',
    label_flavor: '風味傾向',
    label_note: '口感重心',
    label_brewer: '專業濾杯選擇',
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
    timer_analysis: '職人變因分析報告',
    timer_champ: '冠軍手法融合說明',
    timer_steps: '沖煮流程詳解',
    timer_share: '生成分享卡',
    timer_reset: '重設',
    share_title: '職人分享卡 (2014-2025 WBrC)',
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
      "Simulating Variable Temp Extraction...",
      "Calculating Thermal Mass...",
      "Applying 4:6 Method Logic...",
      "Optimizing Hybrid Grind Size...",
      "Balancing Sensory Structure..."
    ],
    section_origin: 'Origin & Bean Status',
    section_method: 'Champion Module & Parameters',
    section_env: 'Environment & Preference',
    label_origin: 'Coffee Origin',
    label_process: 'Process Method',
    label_roast: 'Roast Level',
    label_method: 'Champion Method (Core)',
    method_hint_auto: '✨ AI will automatically match the best champion logic based on your bean and weather.',
    method_hint_lock: '🔒 Champion method locked. AI will maintain the core structure but fine-tune grind & temp.',
    label_structure: 'Brew Ratio Structure',
    btn_dose: 'Fixed Dose',
    btn_volume: 'Target Volume',
    label_dose: 'Dose (g)',
    label_volume: 'Volume (ml)',
    label_roast_date: 'Roast Date',
    label_weather: 'Current Weather',
    label_flavor: 'Flavor Goal',
    label_note: 'Body/Note Preference',
    label_brewer: 'Brewer Selection',
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
    timer_analysis: 'Master Variable Analysis',
    timer_champ: 'Champion Inspiration',
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
      "可変温度抽出をシミュレーション中...",
      "熱容量計算中...",
      "4:6メソッド適用中...",
      "挽き目分布を最適化中...",
      "官能構造バランス調整中..."
    ],
    section_origin: '産地と豆の状態',
    section_method: 'チャンピオンメソッド',
    section_env: '環境と好み',
    label_origin: 'コーヒー産地',
    label_process: '精製方法',
    label_roast: '焙煎度',
    label_method: '抽出理論 (コア)',
    method_hint_auto: '✨ AIが豆の状態と天候に基づいて、最適なチャンピオン理論を自動選択します。',
    method_hint_lock: '🔒 メソッド固定モード。AIは構造を維持しつつ、挽き目と湯温を微調整します。',
    label_structure: '抽出比率の傾向',
    btn_dose: '粉量固定',
    btn_volume: '抽出量固定',
    label_dose: '粉量 (g)',
    label_volume: '抽出量 (ml)',
    label_roast_date: '焙煎日',
    label_weather: '現在の天気',
    label_flavor: 'フレーバー傾向',
    label_note: '質感・ボディ',
    label_brewer: 'ドリッパー選択',
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
    timer_analysis: '変数分析レポート',
    timer_champ: '採用されたチャンピオン理論',
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

export const GET_OPTIONS = (lang: Language) => {
  const isEn = lang === 'en';
  const isJa = lang === 'ja';

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
    methods: isEn ? [
      "🤖 AI Auto Match", "Tetsu Kasuya (4:6 Method)", "Chad Wang (Center Pour)", "Matt Winton (5-Pour / Big Bloom)", "Emi Fukahori (Variable Temp)", "Sherry Hsu (Hybrid Grind)", "Martin Wölfl (Melodrip / No Bypass)"
    ] : isJa ? [
      "🤖 AI オートマッチ", "Tetsu Kasuya (4:6メソッド)", "Chad Wang (センタープア)", "Matt Winton (5投 / 蒸らし多め)", "Emi Fukahori (可変温度)", "Sherry Hsu (ハイブリッド挽き目)", "Martin Wölfl (Melodrip / 静音抽出)"
    ] : [
      "🤖 AI 智能媒合 (推薦)", "Tetsu Kasuya (4:6 法 / 酸甜可調)", "Chad Wang (陶瓷濾杯 / 中心注水)", "Matt Winton (五段式 / 大悶蒸)", "Emi Fukahori (多溫變奏)", "Sherry Hsu (混合研磨)", "Martin Wölfl (Melodrip 零擾動)"
    ],
    weather: isEn ? [
      "Sunny / Dry", "Rainy / Humid", "Cold", "Hot", "Normal / Controlled"
    ] : isJa ? [
      "晴れ / 乾燥", "雨 / 高湿度", "寒い", "暑い", "快適 / 空調あり"
    ] : [
      "晴朗乾燥 (低濕度)", "陰雨潮濕 (高濕度)", "寒流低溫 (失溫快)", "炎熱高溫", "舒適恆溫"
    ],
    flavor: isEn ? [
      "Acidity Focused", "Balanced", "Sweetness Focused"
    ] : isJa ? [
      "酸味重視", "バランス", "甘み重視"
    ] : [
      "強調明亮酸值", "酸甜平衡", "強調厚實甜感"
    ],
    notes: isEn ? [
      "Floral / Tea-like", "Balanced Structure", "Rich Body"
    ] : isJa ? [
      "フローラル / ティーライク", "バランス重視", "リッチ / ボディ感"
    ] : [
      "前段花香 / 小分子", "層次均衡", "後段醇厚 / 大分子"
    ],
    structure: isEn ? [
      "Standard (1:15)", "Rich / Strong (1:10-1:13)", "Tea-like (1:17+)", "Bypass (Dilution)"
    ] : isJa ? [
      "スタンダード (1:15)", "濃厚 (1:10-1:13)", "スッキリ (1:17+)", "バイパス (加水)"
    ] : [
      "經典平衡 (1:15 基準)", "極致濃郁 (1:10~1:13)", "茶感清爽 (1:17~1:19)", "Bypass 變奏 (高濃度萃取+補水)"
    ],
    brewers: isEn ? [
      "Hario V60", "Kalita Wave", "Origami", "Chemex", "Flat Bottom", "Custom"
    ] : [
      "Hario V60", "Kalita Wave (蛋糕濾杯)", "Origami (折紙濾杯)", "Chemex", "平底濾杯", "自定義"
    ]
  };
};
