
import React, { useState, useEffect, useRef } from 'react';
import { CoffeeRecipe, Language } from '../types';
import { RetroButton, RetroCard } from './RetroUI';
import { TRANSLATIONS } from '../constants';
// @ts-ignore
import html2canvas from 'html2canvas';

interface BrewTimerProps {
  recipe: CoffeeRecipe;
  onReset: () => void;
  language: Language;
}

// Extract SharableCard outside
const SharableCard = ({ id, recipe, language }: { id?: string; recipe: CoffeeRecipe | null, language: Language }) => {
    const steps = recipe?.steps || [];
    const t = TRANSLATIONS[language];
    
    const formatFriendlyTime = (totalSeconds: number) => {
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        if (m > 0) {
            return `${m}m ${s.toString().padStart(2, '0')}s`;
        }
        return `${s}s`;
    };

    return (
    <div id={id} className="bg-white p-8 pb-10 rounded-[0px] text-black w-[450px] mx-auto overflow-hidden shadow-none border border-gray-100" style={{ background: '#ffffff', color: '#000000', fontFamily: 'sans-serif' }}>
        <header className="border-b-[3px] border-black pb-6 mb-8 text-center">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-2" style={{ margin: 0 }}>BARISTA'S LOG</h2>
            <div className="flex justify-center items-center gap-3">
                 <div className="h-[1px] w-8 bg-gray-400"></div>
                 <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-500">AI MASTER BREWING ENGINE</div>
                 <div className="h-[1px] w-8 bg-gray-400"></div>
            </div>
        </header>

        <div className="space-y-8">
            <div className="grid grid-cols-2 gap-8">
                <div>
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">{t.label_dose} / {t.label_volume}</span>
                    <p className="font-black text-3xl tracking-tight">{recipe?.coffeeWeight || 0}g <span className="text-gray-300 text-lg">/</span> {recipe?.totalWater || 0}ml</p>
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Temp / Ratio</span>
                    <p className="font-black text-3xl tracking-tight">{recipe?.temperature || 90}°C <span className="text-gray-300 text-lg">/</span> {recipe?.waterRatio || '1:15'}</p>
                </div>
            </div>

            <div className="bg-gray-50 border-l-4 border-black p-5">
                <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest block mb-2">{t.timer_grind}</span>
                <p className="font-bold text-lg leading-tight text-gray-900">{recipe?.grindSize || 'N/A'}</p>
            </div>

            <div>
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-3">{t.timer_analysis}</span>
                <p className="text-xs leading-relaxed font-medium text-gray-600 text-justify bg-white border border-gray-200 p-4 rounded-xl">
                    {recipe?.variableAnalysis || 'N/A'}
                </p>
            </div>

            <div>
                 <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-4">{t.timer_steps}</span>
                 <div className="relative">
                    <div className="absolute left-[13px] top-2 bottom-2 w-[2px] bg-gray-100"></div>
                    <div className="space-y-4">
                        {steps.map((s, i) => {
                            const endTime = s.startTimeSec + s.durationSec;
                            return (
                                <div key={i} className="flex items-start gap-4 relative z-10">
                                    <div className="bg-black text-white w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5 shadow-sm">{i+1}</div>
                                    <div className="flex-1 pb-4 border-b border-gray-100 last:border-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <span className="font-bold text-sm text-black">{s.action}</span>
                                            <div className="text-right flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-gray-400 font-mono tracking-tight bg-gray-100 px-1.5 rounded">
                                                    {formatFriendlyTime(s.startTimeSec)} - {formatFriendlyTime(endTime)}
                                                </span>
                                                <span className="font-bold text-xs text-black tabular-nums">→ {s.waterAmount}ml</span>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-gray-500 leading-snug">{s.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                 </div>
            </div>

            <div className="bg-black text-white p-6 rounded-2xl mt-4">
                 <span className="text-[9px] font-black uppercase text-[#FBBF24] tracking-[0.2em] block mb-2">{t.timer_champ}</span>
                 <p className="font-medium text-xs leading-relaxed opacity-90">{recipe?.championInspiration || 'N/A'}</p>
            </div>
        </div>
    </div>
    );
};

const BrewTimer: React.FC<BrewTimerProps> = ({ recipe, onReset, language }) => {
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const shareTargetRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[language];

  // Safety check: ensure steps exist
  const steps = recipe?.steps || [];

  const totalTime = steps.length > 0 
    ? steps[steps.length - 1].startTimeSec + steps[steps.length - 1].durationSec 
    : 0;

  useEffect(() => {
    let interval: number | undefined;
    if (isActive && !isFinished) {
      interval = window.setInterval(() => {
        setSeconds(s => {
          if (s >= totalTime) {
            setIsFinished(true);
            setIsActive(false);
            playBeep(880, 0.5); 
            return totalTime;
          }
          return s + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isFinished, totalTime]);

  useEffect(() => {
    if (isFinished) return;
    const stepIdx = steps.findIndex((step, idx) => {
      const nextStep = steps[idx + 1];
      const stepEnd = step.startTimeSec + step.durationSec;
      if (seconds >= step.startTimeSec && seconds < stepEnd) return true;
      if (!nextStep && seconds >= step.startTimeSec) return true;
      return false;
    });

    if (stepIdx !== -1 && stepIdx !== currentStepIndex) {
        setCurrentStepIndex(stepIdx);
        if(isActive) playBeep(440, 0.1); 
    }
  }, [seconds, steps, currentStepIndex, isActive, isFinished]);

  const toggleTimer = () => {
    if(!audioContextRef.current) {
        const AudioContextCtor = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContextCtor();
    }
    if(audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
    }
    setIsActive(!isActive);
  };

  const playBeep = (freq: number, duration: number) => {
    if (!audioContextRef.current) return;
    const osc = audioContextRef.current.createOscillator();
    const gain = audioContextRef.current.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioContextRef.current.currentTime);
    gain.gain.setValueAtTime(0.05, audioContextRef.current.currentTime);
    osc.connect(gain);
    gain.connect(audioContextRef.current.destination);
    osc.start();
    osc.stop(audioContextRef.current.currentTime + duration);
  };

  const currentStep = steps[currentStepIndex] || steps[steps.length - 1] || { startTimeSec: 0, durationSec: 0, action: 'Ready', description: 'Preparing...', waterAmount: 0 };
  const stepRemaining = Math.max(0, (currentStep.startTimeSec + currentStep.durationSec) - seconds);

  const formatDigitalTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatFriendlyTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    if (m > 0) {
        return `${m}m ${s.toString().padStart(2, '0')}s`;
    }
    return `${s}s`;
  };

  const handleSaveImage = async () => {
    const cardElement = shareTargetRef.current;
    if (!cardElement) {
        console.error("Capture target not found");
        return;
    }

    setIsSaving(true);
    await new Promise(r => setTimeout(r, 300));

    try {
        const canvas = await html2canvas(cardElement, {
            scale: 3, 
            backgroundColor: '#ffffff',
            useCORS: true,
            allowTaint: true,
            logging: false,
            windowWidth: cardElement.scrollWidth,
            windowHeight: cardElement.scrollHeight,
            onclone: (clonedDoc: Document) => {
              const el = clonedDoc.getElementById('share-container');
              if (el) {
                el.style.transform = 'none';
                el.style.opacity = '1';
                el.style.visibility = 'visible';
                el.style.display = 'block';
                el.style.position = 'relative'; 
                el.style.left = 'auto';
                el.style.top = 'auto';
                el.style.margin = '20px auto';
              }
            }
        });

        canvas.toBlob(async (blob: Blob | null) => {
            if (!blob) {
                setIsSaving(false);
                return;
            }

            const fileName = `WBrC-MasterLog-${Date.now()}.png`;
            const file = new File([blob], fileName, { type: 'image/png' });

            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        files: [file],
                        title: 'AI Master Brewing Log',
                        text: '專業手沖變因分析與冠軍配方',
                    });
                    setIsSaving(false);
                    return;
                } catch (e) { console.log("Share API cancelled/failed, falling back to download"); }
            }

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            setIsSaving(false);
        }, 'image/png');

    } catch (error) {
        console.error("Save failed:", error);
        alert("Image generation failed.");
        setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto pb-24 animate-fade-in space-y-6 px-1 relative">
        
      {/* 0. Hidden Capture Target */}
      <div style={{ position: 'absolute', left: '-9999px', top: '0', width: '450px', overflow: 'hidden' }}>
          <div ref={shareTargetRef} id="share-container">
              <SharableCard recipe={recipe} language={language} />
          </div>
      </div>

      {/* 1. Timer UI */}
      {!showShareCard && (
        <>
          <div className="bg-gradient-to-b from-retro-surface to-[#0f172a] text-white p-10 rounded-[3rem] shadow-soft relative overflow-hidden border border-retro-border">
            {isActive && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-retro-accent/10 blur-[80px] rounded-full"></div>}
            
            <div className="relative z-10 flex flex-col items-center">
                <div className="text-[10px] font-black tracking-[0.3em] text-retro-accent mb-4 uppercase opacity-80">{t.timer_brewing}</div>
                <div className="font-serif text-8xl font-extrabold tabular-nums tracking-tighter mb-10 text-white">
                    {formatDigitalTime(seconds)}
                </div>

                <div className="w-full mb-8">
                    <RetroButton onClick={toggleTimer} className={`w-full py-5 text-xl font-black ${isActive ? 'bg-retro-border text-white' : 'bg-retro-accent text-retro-bg shadow-glow'}`}>
                        {isFinished ? t.timer_done : isActive ? t.timer_pause : seconds > 0 ? t.timer_resume : t.timer_start}
                    </RetroButton>
                </div>

                {!isFinished && (
                    <div className="w-full bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-black tracking-widest text-retro-mute uppercase">{t.timer_next}</span>
                            {currentStep.waterTemp && <span className="text-xs font-black text-retro-accent bg-retro-accent/10 px-2 rounded-full border border-retro-accent/20">{currentStep.waterTemp}°C</span>}
                        </div>
                        <div className="flex justify-between items-end">
                            <div className="font-serif text-2xl font-black text-white">{currentStep.action}</div>
                            <div className="font-serif text-4xl font-black text-retro-accent tabular-nums">
                                {isActive ? stepRemaining : currentStep.durationSec}<span className="text-xl ml-1">s</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
          </div>

          {/* NEW: Dashboard for Critical Parameters */}
          <div className="grid grid-cols-3 gap-3">
             <div className="bg-[#1e293b] p-4 rounded-2xl border border-white/5 text-center flex flex-col justify-center">
                  <span className="text-[9px] text-retro-mute uppercase tracking-widest mb-1">{t.timer_temp}</span>
                  <span className="font-serif text-lg font-black text-white">{recipe?.temperature || 0}°C</span>
             </div>
             <div className="bg-[#1e293b] p-4 rounded-2xl border border-white/5 text-center flex flex-col justify-center">
                  <span className="text-[9px] text-retro-mute uppercase tracking-widest mb-1">{t.timer_total}</span>
                  <span className="font-serif text-lg font-black text-white">{recipe?.totalWater || 0}ml</span>
             </div>
             <div className="bg-[#1e293b] p-4 rounded-2xl border border-white/5 text-center flex flex-col justify-center">
                  <span className="text-[9px] text-retro-mute uppercase tracking-widest mb-1">{t.timer_ratio}</span>
                  <span className="font-serif text-lg font-black text-white">{recipe?.waterRatio || '1:15'}</span>
             </div>
          </div>

          {/* NEW: Prominent Grind Size Banner */}
          <div className="bg-retro-surface p-5 rounded-[2rem] border border-retro-accent/30 shadow-lg flex items-center gap-4 relative overflow-hidden">
             <div className="absolute right-0 top-0 bottom-0 w-2 bg-retro-accent"></div>
             <div className="w-10 h-10 rounded-full bg-retro-accent flex items-center justify-center text-[#0f172a] font-black text-lg shadow-glow">⚙️</div>
             <div>
                 <span className="text-[10px] text-retro-mute uppercase tracking-widest block mb-1">{t.timer_grind}</span>
                 <span className="font-serif text-lg font-black text-white leading-tight">{recipe?.grindSize || 'N/A'}</span>
             </div>
          </div>

          {/* Master Analysis Section */}
          <div className="bg-[#1e293b] border-2 border-white/5 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-3 mb-5">
                  <div className="w-2 h-2 rounded-full bg-retro-accent animate-pulse"></div>
                  <h3 className="font-serif font-black text-white text-lg tracking-widest uppercase">{t.timer_analysis}</h3>
              </div>
              <p className="font-body text-slate-300 leading-relaxed font-bold text-[14px] bg-black/20 p-5 rounded-2xl border border-white/5 text-justify">
                  {recipe?.variableAnalysis || 'Analysis not available.'}
              </p>
          </div>

          {/* Champion Inspiration Section */}
          <div className="bg-retro-surface/50 border border-white/10 rounded-[2.5rem] p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                  <span className="text-xl">🏆</span>
                  <h3 className="font-serif font-black text-white text-lg tracking-widest uppercase">{t.timer_champ}</h3>
              </div>
              <p className="font-body text-slate-300 leading-relaxed font-bold text-[13px] border-l-4 border-retro-accent pl-4">
                  {recipe?.championInspiration || 'N/A'}
              </p>
          </div>

          {/* Brewing Steps List (Updated with Time & Water) */}
          <RetroCard className="!p-8">
            <h3 className="font-serif text-2xl font-black text-white mb-8 flex items-center gap-3">
                 <span className="w-1.5 h-6 bg-retro-accent rounded-full"></span>
                 {t.timer_steps}
            </h3>
            <div className="space-y-6 relative">
                <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-white/5 z-0"></div>
                {steps.map((step, idx) => {
                    const isCurrent = idx === currentStepIndex && !isFinished;
                    const isPast = idx < currentStepIndex || isFinished;
                    const endTime = step.startTimeSec + step.durationSec;
                    
                    return (
                        <div key={idx} className={`relative z-10 flex gap-5 transition-all duration-500 ${isPast ? 'opacity-40' : 'opacity-100'}`}>
                            <div className="flex-shrink-0 pt-1">
                                <div className={`w-12 h-12 flex items-center justify-center rounded-full border-4 font-black text-base transition-all ${isCurrent ? 'bg-retro-accent border-[#0f172a] text-[#0f172a] scale-110' : 'bg-[#0f172a] border-white/10 text-retro-mute'}`}>
                                    {idx + 1}
                                </div>
                            </div>
                            <div className="flex-grow">
                                 {/* New Header Line with Time and Water */}
                                 <div className="flex justify-between items-center mb-2">
                                     <h4 className={`font-serif text-lg font-black ${isCurrent ? 'text-retro-accent' : 'text-white'}`}>{step.action}</h4>
                                     <div className="flex gap-2">
                                        <span className="bg-[#0f172a] border border-white/10 px-2 py-0.5 rounded text-[10px] font-mono text-retro-mute font-bold">
                                            {formatFriendlyTime(step.startTimeSec)} - {formatFriendlyTime(endTime)}
                                        </span>
                                        <span className="bg-retro-accent/10 border border-retro-accent/20 px-2 py-0.5 rounded text-[10px] font-mono text-retro-accent font-bold">
                                            {t.step_water_to} {step.waterAmount}ml
                                        </span>
                                     </div>
                                 </div>
                                 <p className="font-body text-retro-mute/90 leading-relaxed text-sm font-bold bg-[#0f172a]/50 p-3 rounded-xl border border-white/5">
                                    {step.description}
                                 </p>
                            </div>
                        </div>
                    );
                })}
            </div>
          </RetroCard>
        </>
      )}

      {/* 2. Share View UI */}
      {showShareCard && (
        <div className="space-y-8 py-6">
             <div className="text-center px-8">
                <h3 className="font-serif font-black text-2xl text-white mb-2">{t.share_title}</h3>
                <p className="text-[10px] font-black text-retro-mute uppercase tracking-widest">{t.share_subtitle}</p>
             </div>
             
             {/* The visual preview for the user (Scaled down) */}
             <div className="transform scale-[0.85] origin-top md:scale-100 mb-0 flex justify-center">
                <SharableCard recipe={recipe} language={language} />
             </div>

             <div className="flex flex-col gap-4 max-w-[400px] mx-auto px-4">
                <RetroButton 
                    onClick={handleSaveImage} 
                    disabled={isSaving}
                    className="w-full text-[#0f172a] bg-retro-accent flex items-center justify-center gap-3 text-lg shadow-glow"
                >
                   {isSaving ? '...' : t.share_save}
                </RetroButton>
                <button onClick={() => setShowShareCard(false)} className="text-retro-mute font-black text-xs uppercase tracking-widest hover:text-white transition-all py-4">
                   {t.share_back}
                </button>
             </div>
        </div>
      )}

      {/* Persistent Controls */}
      {!showShareCard && (
        <div className="fixed bottom-8 left-0 right-0 px-6 z-40 max-w-lg mx-auto flex gap-4">
            <RetroButton 
                onClick={() => setShowShareCard(true)} 
                className="flex-1 bg-white text-[#0f172a] hover:bg-slate-200 border-none shadow-2xl"
            >
                🗃️ {t.timer_share}
            </RetroButton>
            <RetroButton 
                onClick={onReset} 
                variant="outline" 
                className="bg-black/50 backdrop-blur-md text-white border-white/20 px-8"
            >
                {t.timer_reset}
            </RetroButton>
        </div>
      )}
    </div>
  );
};

export default BrewTimer;
