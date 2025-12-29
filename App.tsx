import React, { useState, useEffect } from 'react';
import { RetroButton, RetroInput, RetroSelect, RetroCard, RetroSlider } from './components/RetroUI';
import { BREWER_OPTIONS, PROCESS_OPTIONS, ROAST_OPTIONS, FLAVOR_OPTIONS, NOTE_OPTIONS, WEATHER_OPTIONS, STRUCTURE_OPTIONS } from './constants';
import { BrewerType, CoffeeParams, CoffeeRecipe, ProcessMethod, RoastLevel, FlavorPreference, NotePreference, WeatherCondition, CalculationMode, RecipeStructure } from './types';
import { generateCoffeeRecipe } from './services/geminiService';
import BrewTimer from './components/BrewTimer';

const ORIGIN_OPTIONS = [
  "衣索比亞 耶加雪菲", 
  "衣索比亞 西達摩", 
  "衣索比亞 古吉", 
  "肯亞", 
  "哥倫比亞", 
  "巴西", 
  "瓜地馬拉", 
  "哥斯大黎加", 
  "巴拿馬 藝妓", 
  "印尼 曼特寧", 
  "薩爾瓦多", 
  "宏都拉斯", 
  "台灣 阿里山", 
  "越南", 
  "其他 (自定義)"
];

const LOADING_MESSAGES = [
  "解析豆種與養豆天數...",
  "計算極致粉水比與濃度...",
  "規劃 Bypass 稀釋比例...",
  "調整悶蒸時間與擾動...",
  "建構職人沖煮曲線..."
];

const App: React.FC = () => {
  // State
  const [params, setParams] = useState<CoffeeParams>({
    origin: '衣索比亞 耶加雪菲',
    process: ProcessMethod.WASHED,
    roast: RoastLevel.LIGHT,
    targetVolume: 300,
    userCoffeeWeight: 20, // Default dose
    calculationMode: CalculationMode.BY_DOSE, 
    structure: RecipeStructure.STANDARD, // Default structure
    brewer: BrewerType.V60,
    brewerCustom: '',
    flavorPreference: FlavorPreference.BALANCED,
    notePreference: NotePreference.BALANCED,
    roastDate: new Date().toISOString().split('T')[0], // Default to today
    weather: WeatherCondition.RAINY_HUMID, 
  });

  const [recipe, setRecipe] = useState<CoffeeRecipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'form' | 'timer'>('form');

  // Loading Message Cycle
  useEffect(() => {
    let interval: number;
    if (loading) {
      setLoadingMsgIndex(0);
      interval = window.setInterval(() => {
        setLoadingMsgIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
      }, 1500); // Change message every 1.5s
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Handlers
  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const generatedRecipe = await generateCoffeeRecipe(params);
      setRecipe(generatedRecipe);
      setViewMode('timer');
    } catch (err) {
      setError("配方生成失敗，請檢查 API 金鑰或網路連線。");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleModeChange = (mode: CalculationMode) => {
    setParams(prev => ({
      ...prev,
      calculationMode: mode
    }));
  };

  return (
    <div className="min-h-screen bg-retro-bg p-4 md:p-8 font-body text-retro-dark flex flex-col items-center">
      
      {/* Header */}
      <header className="mb-10 w-full max-w-lg flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-retro-accent to-orange-600 mb-4 shadow-glow flex items-center justify-center">
            <span className="text-2xl">☕</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-white mb-2 leading-tight">
           AI Professional Brewing Assistant
        </h1>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-lg relative pb-12">
        
        {/* Loading Overlay */}
        {loading && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                <div className="w-full max-w-sm border border-retro-border p-8 bg-retro-surface rounded-3xl shadow-soft relative overflow-hidden">
                     {/* Animated Gradient Bar */}
                     <div className="absolute top-0 left-0 w-full h-1 bg-retro-bg">
                        <div className="h-full bg-retro-accent animate-[width_2s_ease-in-out_infinite] shadow-[0_0_10px_#FBBF24]" style={{width: '30%'}}></div>
                     </div>
                     <div className="mb-4 text-4xl animate-bounce">☕</div>
                     <p className="font-serif text-xl font-bold text-white animate-pulse leading-loose">
                        {LOADING_MESSAGES[loadingMsgIndex]}
                     </p>
                </div>
            </div>
        )}

        {/* VIEW: FORM */}
        {viewMode === 'form' && (
          <div className="animate-fade-in space-y-6">
            
            <RetroCard>
                <div className="mb-6 flex items-center gap-2">
                    <div className="w-1 h-6 bg-retro-accent rounded-full"></div>
                    <h2 className="font-serif font-bold text-xl text-white">基本豆況</h2>
                </div>

                <RetroSelect 
                    label="咖啡產區 (Origin)" 
                    name="origin" 
                    value={params.origin} 
                    onChange={handleInputChange} 
                    options={ORIGIN_OPTIONS}
                />
                
                <div className="grid grid-cols-2 gap-4">
                    <RetroSelect 
                        label="處理法" 
                        name="process" 
                        value={params.process} 
                        onChange={handleInputChange} 
                        options={PROCESS_OPTIONS}
                    />
                    <RetroSelect 
                        label="烘焙度" 
                        name="roast" 
                        value={params.roast} 
                        onChange={handleInputChange} 
                        options={ROAST_OPTIONS}
                    />
                </div>
            </RetroCard>

            <RetroCard>
                 <div className="mb-6 flex items-center gap-2">
                    <div className="w-1 h-6 bg-retro-secondary rounded-full"></div>
                    <h2 className="font-serif font-bold text-xl text-white">架構與比例</h2>
                </div>

                <div className="mb-6">
                     <RetroSelect 
                        label="沖煮架構 (Structure)" 
                        name="structure" 
                        value={params.structure} 
                        onChange={handleInputChange} 
                        options={STRUCTURE_OPTIONS}
                    />
                    <div className="bg-retro-bg/50 p-3 rounded-xl border border-retro-border/50">
                        <p className="text-xs text-retro-mute font-body">
                            💡 選擇 <strong>Bypass</strong> 將採用高濃度萃取後加水，可大幅降低雜味，保留乾淨甜感。
                        </p>
                    </div>
                </div>

                {/* Volume/Dose Toggle Section */}
                <div className="mb-6">
                     <label className="font-serif font-bold text-retro-mute text-sm ml-2 mb-2 block">計算模式</label>
                     <div className="flex bg-[#0f172a] p-1 rounded-2xl border border-retro-border mb-4">
                        <button 
                            type="button"
                            onClick={() => handleModeChange(CalculationMode.BY_DOSE)}
                            className={`flex-1 py-3 px-3 text-sm font-bold rounded-xl transition-all ${params.calculationMode === CalculationMode.BY_DOSE ? 'bg-retro-surface text-white shadow-md' : 'text-retro-mute hover:text-white'}`}
                        >
                            鎖定粉重
                        </button>
                        <button 
                            type="button"
                            onClick={() => handleModeChange(CalculationMode.BY_VOLUME)}
                            className={`flex-1 py-3 px-3 text-sm font-bold rounded-xl transition-all ${params.calculationMode === CalculationMode.BY_VOLUME ? 'bg-retro-surface text-white shadow-md' : 'text-retro-mute hover:text-white'}`}
                        >
                            鎖定液量
                        </button>
                     </div>

                     {params.calculationMode === CalculationMode.BY_DOSE ? (
                         <RetroSlider 
                            label="使用粉重 (g)"
                            name="userCoffeeWeight"
                            min="10"
                            max="40"
                            step="0.5"
                            value={params.userCoffeeWeight}
                            onChange={handleInputChange}
                            displayValue={`${params.userCoffeeWeight} g`}
                        />
                     ) : (
                        <RetroSlider 
                            label="預期液量 (cc)"
                            name="targetVolume"
                            min="200"
                            max="600"
                            step="10"
                            value={params.targetVolume}
                            onChange={handleInputChange}
                            displayValue={`${params.targetVolume} cc`}
                        />
                     )}
                </div>
            </RetroCard>

            <RetroCard>
                <div className="mb-6 flex items-center gap-2">
                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                    <h2 className="font-serif font-bold text-xl text-white">環境與偏好</h2>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <RetroInput
                        type="date"
                        label="烘焙日期"
                        name="roastDate"
                        value={params.roastDate}
                        onChange={handleInputChange}
                        style={{ colorScheme: 'dark' }} 
                    />
                    <RetroSelect 
                        label="目前天氣" 
                        name="weather" 
                        value={params.weather} 
                        onChange={handleInputChange} 
                        options={WEATHER_OPTIONS}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <RetroSelect 
                        label="風味傾向" 
                        name="flavorPreference" 
                        value={params.flavorPreference} 
                        onChange={handleInputChange} 
                        options={FLAVOR_OPTIONS}
                    />
                    <RetroSelect 
                        label="口感重心" 
                        name="notePreference" 
                        value={params.notePreference} 
                        onChange={handleInputChange} 
                        options={NOTE_OPTIONS}
                    />
                </div>
            </RetroCard>

            <RetroCard>
                <RetroSelect 
                    label="沖煮濾杯" 
                    name="brewer" 
                    value={params.brewer} 
                    onChange={handleInputChange} 
                    options={BREWER_OPTIONS}
                />
                {params.brewer === BrewerType.CUSTOM && (
                    <RetroInput 
                        label="自定義濾杯名稱" 
                        name="brewerCustom" 
                        value={params.brewerCustom} 
                        onChange={handleInputChange} 
                        placeholder="例如：Tricolate"
                    />
                )}
            </RetroCard>

            {error && (
                <div className="p-4 rounded-2xl bg-red-900/30 border border-red-500/50 text-red-200 font-bold text-sm mb-4 text-center">
                    ⚠️ {error}
                </div>
            )}

            <RetroButton onClick={handleGenerate} className="w-full text-lg shadow-glow">
                ✨ 生成職人手沖配方
            </RetroButton>
            
          </div>
        )}

        {/* VIEW: TIMER (Includes Recipe Details) */}
        {viewMode === 'timer' && recipe && (
            <BrewTimer 
                recipe={recipe} 
                onReset={() => setViewMode('form')} 
            />
        )}

      </main>

      <footer className="mt-8 pb-8 text-center w-full max-w-lg border-t border-retro-border pt-8 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-retro-mute opacity-50">
         <span>TAIPEI &copy; 2024</span>
         <span>AI BREWING ENGINE</span>
      </footer>
    </div>
  );
};

export default App;