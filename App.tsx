
import React, { useState, useEffect } from 'react';
import { RetroButton, RetroInput, RetroSelect, RetroCard, RetroSlider } from './components/RetroUI';
import { BREWER_OPTIONS, PROCESS_OPTIONS, ROAST_OPTIONS, FLAVOR_OPTIONS, NOTE_OPTIONS, WEATHER_OPTIONS, STRUCTURE_OPTIONS, CHAMPION_OPTIONS, WATER_OPTIONS } from './constants';
import { BrewerType, CoffeeParams, CoffeeRecipe, ProcessMethod, RoastLevel, FlavorPreference, NotePreference, WeatherCondition, CalculationMode, RecipeStructure, ChampionMethod, WaterStrategy } from './types';
import { generateCoffeeRecipe } from './services/geminiService';
import BrewTimer from './components/BrewTimer';

const ORIGIN_OPTIONS = [
  "衣索比亞 耶加雪菲", "衣索比亞 西達摩", "衣索比亞 古吉", "肯亞", "哥倫比亞", "巴西", "瓜地馬拉", "哥斯大黎加", "巴拿馬 藝妓", "印尼 曼特寧", "薩爾瓦多", "宏都拉斯", "台灣 阿里山", "越南", "其他 (自定義)"
];

const LOADING_MESSAGES = [
  "解析產區風土 (Terroir)...",
  "計算水質離子萃取動力學...",
  "平衡鎂鈣離子鍵結能...",
  "模擬 2025 George Peng 變溫萃取...",
  "計算 2017 Chad Wang 冷陶瓷參數...",
  "應用 2016 Tetsu Kasuya 4:6 法則...",
  "優化 2022 Sherry 混合研磨比例...",
  "平衡 2023 Carlos 多相品飲結構..."
];

const App: React.FC = () => {
  const [params, setParams] = useState<CoffeeParams>({
    origin: '衣索比亞 耶加雪菲',
    process: ProcessMethod.WASHED,
    roast: RoastLevel.LIGHT,
    targetVolume: 300,
    userCoffeeWeight: 20,
    calculationMode: CalculationMode.BY_DOSE, 
    structure: RecipeStructure.STANDARD,
    championMethod: ChampionMethod.AUTO, 
    waterStrategy: WaterStrategy.DEFAULT, // Default
    brewer: BrewerType.V60,
    brewerCustom: '',
    flavorPreference: FlavorPreference.BALANCED,
    notePreference: NotePreference.BALANCED,
    roastDate: new Date().toISOString().split('T')[0],
    weather: WeatherCondition.NORMAL, 
  });

  const [recipe, setRecipe] = useState<CoffeeRecipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'form' | 'timer'>('form');

  useEffect(() => {
    let interval: number;
    if (loading) {
      setLoadingMsgIndex(0);
      interval = window.setInterval(() => {
        setLoadingMsgIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const generatedRecipe = await generateCoffeeRecipe(params);
      setRecipe(generatedRecipe);
      setViewMode('timer');
    } catch (err) {
      console.error(err);
      setError("職人配方生成失敗。請檢查連線或稍後再試。");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-[#0f172a] p-6 md:p-12 font-body text-[#f1f5f9] flex flex-col items-center selection:bg-retro-accent selection:text-retro-bg">
      
      {/* Header */}
      <header className="mb-12 w-full max-w-lg flex flex-col items-center text-center animate-fade-in relative z-10">
        
        {/* Premium Icon - High Dynamic Pouring Action */}
        <div className="relative mb-8 group cursor-default">
           {/* Glow Effect */}
           <div className="absolute inset-0 bg-retro-accent/20 blur-2xl rounded-full group-hover:bg-retro-accent/30 transition-all duration-700"></div>
           
           {/* Card Container */}
           <div className="relative w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-[#1e293b] to-[#020617] border border-white/10 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] flex items-center justify-center transform rotate-0 hover:-rotate-3 transition-all duration-500 ease-out overflow-hidden ring-1 ring-white/5 group-hover:scale-105 group-hover:shadow-[0_25px_50px_-12px_rgba(251,191,36,0.15)]">
              
              {/* Internal Sheen/Reflection */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-100"></div>
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-white/5 blur-xl rounded-full"></div>
              
              {/* SVG Icon: Dynamic Pouring Action */}
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 translate-y-1">
                
                {/* 1. The Kettle Spout (Gooseneck) - Strong metallic curve */}
                <path d="M21 3C20 3 17 4 16.5 7.5C15.5 11 13.5 10 12.5 10" className="text-slate-300 drop-shadow-md" strokeWidth="1.8" />
                
                {/* 2. The Water Stream - Core (Gold) */}
                <path d="M12.5 10.5V20" className="text-[#fbbf24] drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]" strokeWidth="2.2" />
                
                {/* 3. The Water Stream - Flow Motion (White Dash Animation) */}
                <path d="M12.5 10.5V20" className="text-white animate-pour opacity-90" strokeWidth="1.2" strokeDasharray="3 3" />
                
                {/* 4. The Impact / Coffee Bed - Ripples expanding */}
                <path d="M8 17Q12.5 19.5 17 17" className="text-retro-accent opacity-50" strokeWidth="1.2" />
                <path d="M9 16Q12.5 18 16 16" className="text-retro-accent opacity-30" strokeWidth="1" />
                
                {/* 5. Dripper Context (Subtle V Shape) */}
                <path d="M4 12L12.5 21L21 12" className="text-slate-600 opacity-40" strokeWidth="1" />
                <path d="M4 12H21" className="text-slate-600 opacity-30" strokeWidth="0.5" />

                {/* 6. Steam / Heat - Rising up */}
                <path d="M7 7Q6 5 7 3" className="text-white opacity-20" strokeWidth="1" />
              </svg>
           </div>
        </div>

        <h1 className="font-serif text-4xl md:text-5xl font-black tracking-tight text-white mb-3 leading-tight drop-shadow-lg">
           AI Master<br className="md:hidden"/> Brewing Engine
        </h1>
        
        <div className="px-5 py-2 bg-[#1e293b]/50 backdrop-blur-md border border-white/5 rounded-full shadow-inner mt-2">
            <span className="text-retro-accent font-black tracking-[0.2em] text-[10px] uppercase flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-retro-accent animate-pulse"></span>
               Professional Pour-Over Assistant
            </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-lg relative pb-12">
        
        {/* Loading Overlay */}
        {loading && (
            <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                <div className="w-full max-w-sm p-10 bg-retro-surface rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
                        <div className="h-full bg-retro-accent animate-[width_2s_ease-in-out_infinite] shadow-[0_0_15px_#FBBF24]" style={{width: '40%'}}></div>
                     </div>
                     <div className="mb-8 text-5xl animate-bounce">⚖️</div>
                     <p className="font-serif text-2xl font-black text-white leading-relaxed">
                        {LOADING_MESSAGES[loadingMsgIndex]}
                     </p>
                </div>
            </div>
        )}

        {viewMode === 'form' && (
          <div className="animate-fade-in space-y-8">
            <RetroCard className="!p-8">
                <div className="mb-8 flex items-center gap-4">
                    <div className="w-1.5 h-8 bg-retro-accent rounded-full"></div>
                    <h2 className="font-serif font-black text-2xl text-white">產區與豆況</h2>
                </div>
                <RetroSelect label="咖啡產區" name="origin" value={params.origin} onChange={handleInputChange} options={ORIGIN_OPTIONS} />
                <div className="grid grid-cols-2 gap-6">
                    <RetroSelect label="處理法" name="process" value={params.process} onChange={handleInputChange} options={PROCESS_OPTIONS} />
                    <RetroSelect label="烘焙度" name="roast" value={params.roast} onChange={handleInputChange} options={ROAST_OPTIONS} />
                </div>
            </RetroCard>

            <RetroCard className="!p-8">
                <div className="mb-8 flex items-center gap-4">
                    <div className="w-1.5 h-8 bg-retro-secondary rounded-full"></div>
                    <h2 className="font-serif font-black text-2xl text-white">冠軍模組與參數</h2>
                </div>
                
                {/* Champion Method Selector */}
                <div className="mb-6 p-1 bg-gradient-to-r from-retro-accent/20 to-transparent rounded-2xl border border-retro-accent/20">
                    <div className="bg-[#0f172a]/80 backdrop-blur rounded-xl p-2">
                       <RetroSelect label="冠軍手法模組 (核心)" name="championMethod" value={params.championMethod} onChange={handleInputChange} options={CHAMPION_OPTIONS} />
                       <p className="text-[10px] text-retro-mute px-2 -mt-2 mb-2 leading-relaxed">
                          {params.championMethod === ChampionMethod.AUTO 
                            ? "✨ AI 將根據您的豆況與天氣，自動媒合最適合的冠軍邏輯。" 
                            : "🔒 已鎖定特定冠軍手法。AI 將維持該手法的核心架構，但會協助微調研磨度與水溫以適應豆況。"}
                       </p>
                    </div>
                </div>

                <div className="mb-8">
                     <RetroSelect label="沖煮比例傾向" name="structure" value={params.structure} onChange={handleInputChange} options={STRUCTURE_OPTIONS} />
                </div>
                
                <div className="mb-4">
                     <div className="flex bg-[#0f172a] p-1.5 rounded-[1.5rem] border border-white/10 mb-8">
                        <button onClick={() => setParams(p => ({...p, calculationMode: CalculationMode.BY_DOSE}))} className={`flex-1 py-3 px-3 text-xs font-black rounded-[1rem] transition-all ${params.calculationMode === CalculationMode.BY_DOSE ? 'bg-retro-surface text-white shadow-lg' : 'text-retro-mute'}`}>鎖定粉重</button>
                        <button onClick={() => setParams(p => ({...p, calculationMode: CalculationMode.BY_VOLUME}))} className={`flex-1 py-3 px-3 text-xs font-black rounded-[1rem] transition-all ${params.calculationMode === CalculationMode.BY_VOLUME ? 'bg-retro-surface text-white shadow-lg' : 'text-retro-mute'}`}>鎖定液量</button>
                     </div>
                     {params.calculationMode === CalculationMode.BY_DOSE ? (
                         <RetroSlider label="粉重 (Dose)" min="10" max="40" step="0.5" value={params.userCoffeeWeight} onChange={(e) => setParams(p => ({...p, userCoffeeWeight: parseFloat(e.target.value)}))} displayValue={`${params.userCoffeeWeight} g`} />
                     ) : (
                        <RetroSlider label="液量 (Volume)" min="200" max="600" step="10" value={params.targetVolume} onChange={(e) => setParams(p => ({...p, targetVolume: parseInt(e.target.value)}))} displayValue={`${params.targetVolume} cc`} />
                     )}
                </div>
            </RetroCard>

            <RetroCard className="!p-8">
                <div className="mb-8 flex items-center gap-4">
                    <div className="w-1.5 h-8 bg-blue-500 rounded-full"></div>
                    <h2 className="font-serif font-black text-2xl text-white">環境與水質化學</h2>
                </div>
                
                {/* Water Strategy Selector */}
                <div className="mb-8 border-b border-white/5 pb-6">
                    <div className="flex items-center gap-2 mb-2">
                         <span className="text-xl">💧</span>
                         <label className="font-serif font-bold text-retro-mute text-sm">沖煮用水策略 (Water Chemistry)</label>
                    </div>
                    <RetroSelect label="" name="waterStrategy" value={params.waterStrategy} onChange={handleInputChange} options={WATER_OPTIONS} />
                    <p className="text-[10px] text-retro-mute px-1 mt-[-10px] leading-relaxed">
                        *不同水質將改變 AI 對研磨度與溫度的運算邏輯 (例如：軟水需加強物理萃取)。
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                    <RetroInput type="date" label="烘焙日期" name="roastDate" value={params.roastDate} onChange={handleInputChange} style={{ colorScheme: 'dark' }} />
                    <RetroSelect label="目前天氣" name="weather" value={params.weather} onChange={handleInputChange} options={WEATHER_OPTIONS} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <RetroSelect label="風味傾向" name="flavorPreference" value={params.flavorPreference} onChange={handleInputChange} options={FLAVOR_OPTIONS} />
                    <RetroSelect label="口感重心" name="notePreference" value={params.notePreference} onChange={handleInputChange} options={NOTE_OPTIONS} />
                </div>
            </RetroCard>

            <RetroCard className="!p-8">
                <RetroSelect label="專業濾杯選擇" name="brewer" value={params.brewer} onChange={handleInputChange} options={BREWER_OPTIONS} />
                {params.brewer === BrewerType.CUSTOM && (
                    <RetroInput label="自定義濾杯" name="brewerCustom" value={params.brewerCustom} onChange={handleInputChange} placeholder="例如：Orea V4" />
                )}
            </RetroCard>

            {error && <div className="p-6 rounded-[1.5rem] bg-red-900/20 border border-red-500/30 text-red-200 font-black text-sm text-center">⚠️ {error}</div>}

            <RetroButton onClick={handleGenerate} className="w-full text-xl font-black py-6 shadow-glow">
                ✨ 生成 2014-2025 職人配方
            </RetroButton>
          </div>
        )}

        {viewMode === 'timer' && recipe && (
            <BrewTimer recipe={recipe} onReset={() => setViewMode('form')} />
        )}

      </main>

      <footer className="mt-12 mb-12 text-center w-full max-w-lg border-t border-white/5 pt-10 flex flex-col items-center gap-4">
         <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-retro-mute opacity-60">
            <span>TAIPEI &copy; 2025</span>
            <span>WBrc ANALYTICS</span>
         </div>
         <p className="text-[9px] text-retro-mute/40 max-w-[280px] leading-relaxed">
            POWERED BY GEMINI PRO PREVIEW. DATA INSIGHTS FROM WORLD BREWERS CUP CHAMPIONS 2014-2025.
         </p>
      </footer>
    </div>
  );
};

export default App;
