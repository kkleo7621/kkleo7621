
import React, { useState, useEffect, useMemo } from 'react';
import { RetroButton, RetroInput, RetroSelect, RetroCard, RetroSlider } from './components/RetroUI';
import { TRANSLATIONS, GET_OPTIONS } from './constants';
import { CoffeeParams, CoffeeRecipe, CalculationMode, Language } from './types';
import { generateCoffeeRecipe } from './services/geminiService';
import BrewTimer from './components/BrewTimer';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('zh-TW');

  // Load options based on current language
  const options = useMemo(() => GET_OPTIONS(language), [language]);
  const t = TRANSLATIONS[language];

  const todayStr = new Date().toISOString().split('T')[0];

  const [params, setParams] = useState<CoffeeParams>({
    origin: options.origins[0],
    process: options.process[0],
    roast: options.roast[0],
    targetVolume: 300,
    userCoffeeWeight: 20,
    calculationMode: CalculationMode.BY_DOSE, 
    structure: options.structure[0],
    championMethod: options.methods[0],
    isChampionMode: true, // Default ON
    brewer: options.brewers[0],
    brewerCustom: '',
    grinder: options.grinders[0], // Default grinder
    flavorPreference: options.flavor[1], // Balanced
    notePreference: options.notes[1], // Balanced
    roastDate: todayStr,
    weather: options.weather[4], // Normal
    envTemp: undefined,
    envHumidity: undefined
  });

  const [recipe, setRecipe] = useState<CoffeeRecipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'form' | 'timer'>('form');
  const [weatherLoading, setWeatherLoading] = useState(false);

  // Sync params dropdown options when language changes
  useEffect(() => {
    let interval: number;
    if (loading) {
      setLoadingMsgIndex(0);
      interval = window.setInterval(() => {
        setLoadingMsgIndex(prev => (prev + 1) % t.loading.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [loading, t.loading.length]);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const generatedRecipe = await generateCoffeeRecipe(params, language);
      setRecipe(generatedRecipe);
      setViewMode('timer');
    } catch (err) {
      console.error(err);
      setError(t.error_msg);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // If user manually changes weather, clear the auto-detected sensor data
    if (name === 'weather') {
        setParams(prev => ({ ...prev, [name]: value, envTemp: undefined, envHumidity: undefined }));
    } else {
        setParams(prev => ({ ...prev, [name]: value }));
    }
  };

  const toggleChampionMode = () => {
    setParams(prev => ({ ...prev, isChampionMode: !prev.isChampionMode }));
  };

  const handleAutoWeather = () => {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }
    setWeatherLoading(true);
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m`);
                const data = await response.json();
                
                if (data.current) {
                    const temp = data.current.temperature_2m;
                    const humidity = data.current.relative_humidity_2m;
                    
                    // Logic to map API data to existing Weather Options
                    // Indices in options.weather:
                    // 0: Sunny/Dry, 1: Rainy/Humid, 2: Cold, 3: Hot, 4: Normal
                    
                    let selectedWeatherIndex = 4; // Default Normal

                    if (humidity > 70) {
                        selectedWeatherIndex = 1; // Humid
                    } else if (temp > 28) {
                        selectedWeatherIndex = 3; // Hot
                    } else if (temp < 15) {
                        selectedWeatherIndex = 2; // Cold
                    } else if (humidity < 40) {
                        selectedWeatherIndex = 0; // Dry
                    } else {
                        selectedWeatherIndex = 4; // Comfortable
                    }

                    // Update params with precise data
                    setParams(prev => ({ 
                        ...prev, 
                        weather: options.weather[selectedWeatherIndex],
                        envTemp: temp,
                        envHumidity: humidity
                    }));
                }
            } catch (err) {
                console.error("Weather fetch failed", err);
                alert("Failed to fetch weather data.");
            } finally {
                setWeatherLoading(false);
            }
        },
        (err) => {
            console.error(err);
            setWeatherLoading(false);
            alert("Location access denied. Please select weather manually.");
        }
    );
  };

  return (
    <div className="min-h-screen bg-[#0f172a] p-6 md:p-12 font-body text-[#f1f5f9] flex flex-col items-center selection:bg-retro-accent selection:text-retro-bg">
      
      {/* Header */}
      <header className="mb-12 w-full max-w-lg flex flex-col items-center text-center animate-fade-in relative z-10">
        
        {/* Language Toggle */}
        <div className="absolute top-0 right-0 md:-right-12 lg:-right-24 flex gap-2">
            <button onClick={() => setLanguage('zh-TW')} className={`text-[10px] font-black px-2 py-1 rounded border ${language === 'zh-TW' ? 'bg-retro-accent text-[#0f172a] border-retro-accent' : 'text-retro-mute border-white/10'}`}>繁體</button>
            <button onClick={() => setLanguage('ja')} className={`text-[10px] font-black px-2 py-1 rounded border ${language === 'ja' ? 'bg-retro-accent text-[#0f172a] border-retro-accent' : 'text-retro-mute border-white/10'}`}>JP</button>
            <button onClick={() => setLanguage('en')} className={`text-[10px] font-black px-2 py-1 rounded border ${language === 'en' ? 'bg-retro-accent text-[#0f172a] border-retro-accent' : 'text-retro-mute border-white/10'}`}>EN</button>
        </div>

        {/* Premium Icon */}
        <div className="relative mb-8 group cursor-default mt-8 md:mt-0">
           <div className="absolute inset-0 bg-retro-accent/20 blur-2xl rounded-full group-hover:bg-retro-accent/30 transition-all duration-700"></div>
           <div className="relative w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-[#1e293b] to-[#020617] border border-white/10 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] flex items-center justify-center transform rotate-0 hover:-rotate-3 transition-all duration-500 ease-out overflow-hidden ring-1 ring-white/5 group-hover:scale-105 group-hover:shadow-[0_25px_50px_-12px_rgba(251,191,36,0.15)]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-100"></div>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 translate-y-1">
                <path d="M21 3C20 3 17 4 16.5 7.5C15.5 11 13.5 10 12.5 10" className="text-slate-300 drop-shadow-md" strokeWidth="1.8" />
                <path d="M12.5 10.5V20" className="text-[#fbbf24] drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]" strokeWidth="2.2" />
                <path d="M12.5 10.5V20" className="text-white animate-pour opacity-90" strokeWidth="1.2" strokeDasharray="3 3" />
                <path d="M8 17Q12.5 19.5 17 17" className="text-retro-accent opacity-50" strokeWidth="1.2" />
                <path d="M9 16Q12.5 18 16 16" className="text-retro-accent opacity-30" strokeWidth="1" />
                <path d="M4 12L12.5 21L21 12" className="text-slate-600 opacity-40" strokeWidth="1" />
                <path d="M4 12H21" className="text-slate-600 opacity-30" strokeWidth="0.5" />
                <path d="M7 7Q6 5 7 3" className="text-white opacity-20" strokeWidth="1" />
              </svg>
           </div>
        </div>

        <h1 className="font-serif text-4xl md:text-5xl font-black tracking-tight text-white mb-3 leading-tight drop-shadow-lg">
           {t.title}
        </h1>
        
        <div className="px-5 py-2 bg-[#1e293b]/50 backdrop-blur-md border border-white/5 rounded-full shadow-inner mt-2">
            <span className="text-retro-accent font-black tracking-[0.2em] text-[10px] uppercase flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-retro-accent animate-pulse"></span>
               {t.subtitle}
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
                        {t.loading[loadingMsgIndex]}
                     </p>
                </div>
            </div>
        )}

        {viewMode === 'form' && (
          <div className="animate-fade-in space-y-8">
            <RetroCard className="!p-8">
                <div className="mb-8 flex items-center gap-4">
                    <div className="w-1.5 h-8 bg-retro-accent rounded-full"></div>
                    <h2 className="font-serif font-black text-2xl text-white">{t.section_origin}</h2>
                </div>
                <RetroSelect label={t.label_origin} name="origin" value={params.origin} onChange={handleInputChange} options={options.origins} />
                <div className="grid grid-cols-2 gap-6">
                    <RetroSelect label={t.label_process} name="process" value={params.process} onChange={handleInputChange} options={options.process} />
                    <RetroSelect label={t.label_roast} name="roast" value={params.roast} onChange={handleInputChange} options={options.roast} />
                </div>
            </RetroCard>

            <RetroCard className="!p-8">
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-8 bg-retro-secondary rounded-full"></div>
                        <h2 className="font-serif font-black text-2xl text-white">{t.section_method}</h2>
                    </div>
                </div>

                {/* Champion Mode Toggle */}
                <div className="mb-6 flex items-center justify-between bg-[#0f172a] p-4 rounded-2xl border border-retro-border">
                    <span className="font-serif font-bold text-retro-mute text-sm">{t.label_champ_switch}</span>
                    <button 
                        onClick={toggleChampionMode}
                        className={`relative w-14 h-8 rounded-full transition-all duration-300 ${params.isChampionMode ? 'bg-retro-accent' : 'bg-slate-700'}`}
                    >
                        <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-md transition-transform duration-300 ${params.isChampionMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                </div>
                
                {/* Conditional Rendering of Method Selector */}
                <div className={`transition-all duration-500 overflow-hidden ${params.isChampionMode ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="mb-6 p-1 bg-gradient-to-r from-retro-accent/20 to-transparent rounded-2xl border border-retro-accent/20">
                        <div className="bg-[#0f172a]/80 backdrop-blur rounded-xl p-2">
                           <RetroSelect label={t.label_method} name="championMethod" value={params.championMethod} onChange={handleInputChange} options={options.methods} />
                           <p className="text-[10px] text-retro-mute px-2 -mt-2 mb-2 leading-relaxed">
                              {params.championMethod.includes("AI") || params.championMethod.includes("Auto") || params.championMethod.includes("智能")
                                ? t.method_hint_auto
                                : t.method_hint_lock}
                           </p>
                        </div>
                    </div>
                </div>
                
                {/* Standard Mode Message */}
                {!params.isChampionMode && (
                    <div className="mb-6 p-4 bg-slate-800/50 rounded-2xl border border-white/5 text-center animate-fade-in">
                        <p className="text-xs text-retro-mute leading-relaxed">{t.method_hint_standard}</p>
                    </div>
                )}

                <div className="mb-8">
                     <RetroSelect label={t.label_structure} name="structure" value={params.structure} onChange={handleInputChange} options={options.structure} />
                </div>
                
                <div className="mb-4">
                     <div className="flex bg-[#0f172a] p-1.5 rounded-[1.5rem] border border-white/10 mb-8">
                        <button onClick={() => setParams(p => ({...p, calculationMode: CalculationMode.BY_DOSE}))} className={`flex-1 py-3 px-3 text-xs font-black rounded-[1rem] transition-all ${params.calculationMode === CalculationMode.BY_DOSE ? 'bg-retro-surface text-white shadow-lg' : 'text-retro-mute'}`}>{t.btn_dose}</button>
                        <button onClick={() => setParams(p => ({...p, calculationMode: CalculationMode.BY_VOLUME}))} className={`flex-1 py-3 px-3 text-xs font-black rounded-[1rem] transition-all ${params.calculationMode === CalculationMode.BY_VOLUME ? 'bg-retro-surface text-white shadow-lg' : 'text-retro-mute'}`}>{t.btn_volume}</button>
                     </div>
                     {params.calculationMode === CalculationMode.BY_DOSE ? (
                         <RetroSlider label={t.label_dose} min="10" max="40" step="0.5" value={params.userCoffeeWeight} onChange={(e) => setParams(p => ({...p, userCoffeeWeight: parseFloat(e.target.value)}))} displayValue={`${params.userCoffeeWeight} g`} />
                     ) : (
                        <RetroSlider label={t.label_volume} min="200" max="600" step="10" value={params.targetVolume} onChange={(e) => setParams(p => ({...p, targetVolume: parseInt(e.target.value)}))} displayValue={`${params.targetVolume} cc`} />
                     )}
                </div>
            </RetroCard>

            <RetroCard className="!p-8">
                <div className="mb-8 flex items-center gap-4">
                    <div className="w-1.5 h-8 bg-blue-500 rounded-full"></div>
                    <h2 className="font-serif font-black text-2xl text-white">{t.section_env}</h2>
                </div>
                
                {/* Date & Weather Row */}
                <div className="mb-8">
                    <div className="grid grid-cols-2 gap-6 mb-2">
                        <RetroInput 
                            type="date" 
                            label={t.label_roast_date} 
                            name="roastDate" 
                            value={params.roastDate} 
                            max={todayStr} 
                            onChange={handleInputChange} 
                            style={{ colorScheme: 'dark' }} 
                        />
                        <div>
                             <RetroSelect label={t.label_weather} name="weather" value={params.weather} onChange={handleInputChange} options={options.weather} />
                        </div>
                    </div>
                    {/* Auto Detect Button & Display */}
                    <div className="flex justify-end items-center gap-4 -mt-3">
                         {params.envTemp !== undefined && params.envHumidity !== undefined && (
                            <div className="flex gap-3 text-[10px] font-mono font-bold text-retro-secondary bg-retro-secondary/10 px-2 py-1.5 rounded border border-retro-secondary/20 animate-fade-in shadow-[0_0_10px_-3px_rgba(52,211,153,0.3)]">
                                <span className="flex items-center gap-1">🌡️ {params.envTemp}°C</span>
                                <span className="w-[1px] h-3 bg-retro-secondary/30"></span>
                                <span className="flex items-center gap-1">💧 {params.envHumidity}%</span>
                            </div>
                         )}
                         <button 
                            onClick={handleAutoWeather}
                            disabled={weatherLoading}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 hover:bg-retro-accent hover:text-[#0f172a] text-[10px] font-black uppercase tracking-widest text-retro-mute rounded-lg transition-all border border-white/10"
                         >
                            {weatherLoading ? 'Detecting...' : t.btn_auto_weather}
                         </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <RetroSelect label={t.label_flavor} name="flavorPreference" value={params.flavorPreference} onChange={handleInputChange} options={options.flavor} />
                    <RetroSelect label={t.label_note} name="notePreference" value={params.notePreference} onChange={handleInputChange} options={options.notes} />
                </div>
            </RetroCard>

            <RetroCard className="!p-8">
                {/* Equipment Section */}
                <div className="mb-4">
                     <RetroSelect label={t.label_brewer} name="brewer" value={params.brewer} onChange={handleInputChange} options={options.brewers} />
                     {params.brewer.includes('Custom') || params.brewer.includes('自定義') || params.brewer.includes('カスタム') ? (
                        <RetroInput label={t.label_custom_brewer} name="brewerCustom" value={params.brewerCustom} onChange={handleInputChange} placeholder="Model Name..." />
                    ) : null}
                </div>
                
                <div className="mb-2">
                     <RetroSelect label={t.label_grinder} name="grinder" value={params.grinder} onChange={handleInputChange} options={options.grinders} />
                </div>
            </RetroCard>

            {error && <div className="p-6 rounded-[1.5rem] bg-red-900/20 border border-red-500/30 text-red-200 font-black text-sm text-center">⚠️ {error}</div>}

            <RetroButton onClick={handleGenerate} className="w-full text-xl font-black py-6 shadow-glow">
                {t.btn_generate}
            </RetroButton>
          </div>
        )}

        {viewMode === 'timer' && recipe && (
            <BrewTimer recipe={recipe} onReset={() => setViewMode('form')} language={language} />
        )}

      </main>

      <footer className="mt-12 mb-12 text-center w-full max-w-lg border-t border-white/5 pt-10 flex flex-col items-center gap-4">
         <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-retro-mute opacity-60">
            <span>TAIPEI &copy; 2025</span>
            <span>WBrc ANALYTICS</span>
         </div>
         <p className="text-[9px] text-retro-mute/40 max-w-[280px] leading-relaxed">
            {t.footer_text}
         </p>
      </footer>
    </div>
  );
};

export default App;
