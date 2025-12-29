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
      <header className="mb-8 w-full max-w-lg flex justify-between items-baseline border-b-4 border-retro-dark pb-4">
        <div>
            <div className="w-4 h-4 rounded-full bg-retro-dark mb-2"></div>
            <h1 className="font-serif text-4xl font-black tracking-tight text-retro-dark">
            Alishan Drip
            </h1>
        </div>
        <div className="flex gap-4 text-xs font-bold tracking-widest uppercase text-gray-400">
            <span className="text-retro-dark border-b-2 border-retro-accent pb-1">手沖指南</span>
            <span className="cursor-not-allowed">搜索店家</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-lg relative">
        
        {/* Loading Overlay */}
        {loading && (
            <div className="fixed inset-0 bg-retro-bg/90 z-50 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-full max-w-sm border-2 border-retro-dark p-8 bg-white shadow-hard relative">
                     <div className="absolute top-0 left-0 w-full h-1 bg-retro-dark/10">
                        <div className="h-full bg-retro-accent animate-[width_2s_ease-in-out_infinite]" style={{width: '30%'}}></div>
                     </div>
                     <p className="font-serif text-xl font-bold text-retro-dark animate-pulse leading-loose">
                        {LOADING_MESSAGES[loadingMsgIndex]}
                     </p>
                </div>
            </div>
        )}

        {/* VIEW: FORM */}
        {viewMode === 'form' && (
          <div className="animate-fade-in space-y-6">
             <div className="bg-retro-dark text-white p-3 shadow-hard mb-4">
                <h2 className="font-serif font-bold tracking-widest uppercase text-sm">沖煮設定</h2>
             </div>

            <div className="bg-white border-2 border-retro-dark shadow-hard p-6">
                <RetroSelect 
                    label="咖啡產區" 
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

                {/* Structure / Ratio Section (New) */}
                <div className="mt-4 pt-4 border-t-2 border-retro-dark/10">
                     <h3 className="text-xs font-bold text-retro-accent uppercase tracking-widest mb-3">架構與比例 (Structure)</h3>
                     <RetroSelect 
                        label="沖煮架構偏好" 
                        name="structure" 
                        value={params.structure} 
                        onChange={handleInputChange} 
                        options={STRUCTURE_OPTIONS}
                    />
                    <p className="text-xs text-gray-500 font-serif italic mb-4">
                        * 選擇 Bypass 將採用高濃度萃取後加水，可大幅降低雜味。
                    </p>
                </div>

                {/* Environment Section */}
                <div className="mt-4 pt-4 border-t-2 border-retro-dark/10">
                    <h3 className="text-xs font-bold text-retro-accent uppercase tracking-widest mb-3">環境與狀態 (Environment)</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <RetroInput
                            type="date"
                            label="烘焙日期"
                            name="roastDate"
                            value={params.roastDate}
                            onChange={handleInputChange}
                        />
                        <RetroSelect 
                            label="目前天氣" 
                            name="weather" 
                            value={params.weather} 
                            onChange={handleInputChange} 
                            options={WEATHER_OPTIONS}
                        />
                    </div>
                </div>

                {/* Preference Section */}
                <div className="mt-4 pt-4 border-t-2 border-retro-dark/10">
                    <h3 className="text-xs font-bold text-retro-accent uppercase tracking-widest mb-3">風味微調 (Preference)</h3>
                    <RetroSelect 
                        label="風味傾向" 
                        name="flavorPreference" 
                        value={params.flavorPreference} 
                        onChange={handleInputChange} 
                        options={FLAVOR_OPTIONS}
                    />
                    <RetroSelect 
                        label="香氣/口感重心" 
                        name="notePreference" 
                        value={params.notePreference} 
                        onChange={handleInputChange} 
                        options={NOTE_OPTIONS}
                    />
                </div>

                {/* Volume/Dose Toggle Section */}
                <div className="mb-6 mt-4 pt-4 border-t-2 border-retro-dark/10">
                     <h3 className="text-xs font-bold text-retro-accent uppercase tracking-widest mb-3">份量設定 (Ratio Base)</h3>
                     
                     <div className="flex gap-2 mb-4">
                        <button 
                            type="button"
                            onClick={() => handleModeChange(CalculationMode.BY_DOSE)}
                            className={`flex-1 py-2 px-3 text-sm font-bold border-2 border-retro-dark transition-colors ${params.calculationMode === CalculationMode.BY_DOSE ? 'bg-retro-dark text-white' : 'bg-white text-retro-dark hover:bg-gray-100'}`}
                        >
                            鎖定粉重 (Fixed Dose)
                        </button>
                        <button 
                            type="button"
                            onClick={() => handleModeChange(CalculationMode.BY_VOLUME)}
                            className={`flex-1 py-2 px-3 text-sm font-bold border-2 border-retro-dark transition-colors ${params.calculationMode === CalculationMode.BY_VOLUME ? 'bg-retro-dark text-white' : 'bg-white text-retro-dark hover:bg-gray-100'}`}
                        >
                            鎖定液量 (Target Vol)
                        </button>
                     </div>

                     {params.calculationMode === CalculationMode.BY_DOSE ? (
                         <RetroSlider 
                            label="使用咖啡粉量"
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
                            label="預期沖煮液量"
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

                <div className="mb-8">
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
                </div>

                {error && (
                    <div className="p-3 border-2 border-red-500 bg-red-50 text-red-700 font-bold text-sm mb-4">
                        ⚠️ {error}
                    </div>
                )}

                <RetroButton onClick={handleGenerate} className="w-full text-lg py-4 bg-retro-dark text-white hover:bg-black border-retro-dark">
                    生成職人手沖配方
                </RetroButton>
            </div>
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

      <footer className="mt-16 pb-8 text-center w-full max-w-lg border-t-2 border-retro-dark/20 pt-8 flex justify-between items-center text-[10px] font-serif uppercase tracking-widest text-gray-500">
         <span>EST. TAIPEI &copy; 1954 - 2024</span>
         <span>AI BREWING ENGINE</span>
      </footer>
    </div>
  );
};

export default App;