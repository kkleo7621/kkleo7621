
import React, { useState, useEffect, useRef } from 'react';
import { CoffeeRecipe, Language } from '../types';
import { RetroButton } from './RetroUI';
import { TRANSLATIONS } from '../constants';
// @ts-ignore
import html2canvas from 'html2canvas';

interface BrewTimerProps {
  recipe: CoffeeRecipe;
  onReset: () => void;
  language: Language;
}

// ----------------------------------------------------------------------------
// Share Card Component (Hidden for Image Generation)
// ----------------------------------------------------------------------------
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

// ----------------------------------------------------------------------------
// Main BrewTimer Component
// ----------------------------------------------------------------------------
const BrewTimer: React.FC<BrewTimerProps> = ({ recipe, onReset, language }) => {
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const shareTargetRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[language];

  const steps = recipe?.steps || [];
  const totalTime = steps.length > 0 ? steps[steps.length - 1].startTimeSec + steps[steps.length - 1].durationSec : 0;

  // -------------------------
  // Timer Logic
  // -------------------------
  useEffect(() => {
    let interval: number | undefined;
    if (isActive && !isFinished) {
      interval = window.setInterval(() => {
        setSeconds(s => {
          if (s >= totalTime) {
            setIsFinished(true);
            setIsActive(false);
            if(soundEnabled) playBeep(880, 0.8, 'sine'); // Long finish beep
            return totalTime;
          }
          return s + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isFinished, totalTime, soundEnabled]);

  // Step Tracking & Auto Scroll
  useEffect(() => {
    if (isFinished) return;
    const stepIdx = steps.findIndex((step, idx) => {
      const nextStep = steps[idx + 1];
      const stepEnd = step.startTimeSec + step.durationSec;
      // Current if within time range
      if (seconds >= step.startTimeSec && seconds < stepEnd) return true;
      // Or if it's the last step and we are past its start (but before finish total)
      if (!nextStep && seconds >= step.startTimeSec) return true;
      return false;
    });

    if (stepIdx !== -1 && stepIdx !== currentStepIndex) {
        setCurrentStepIndex(stepIdx);
        if(isActive && soundEnabled) playBeep(523.25, 0.2, 'square'); // C5 note for step change
        
        // Focus active step
        const element = document.getElementById(`step-${stepIdx}`);
        if(element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
  }, [seconds, steps, currentStepIndex, isActive, isFinished, soundEnabled]);

  // -------------------------
  // Helpers
  // -------------------------
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

  const playBeep = (freq: number, duration: number, type: OscillatorType = 'sine') => {
    if (!audioContextRef.current) return;
    const osc = audioContextRef.current.createOscillator();
    const gain = audioContextRef.current.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioContextRef.current.currentTime);
    gain.gain.setValueAtTime(0.05, audioContextRef.current.currentTime);
    osc.connect(gain);
    gain.connect(audioContextRef.current.destination);
    osc.start();
    osc.stop(audioContextRef.current.currentTime + duration);
  };

  const handleSaveImage = async () => {
    const cardElement = shareTargetRef.current;
    if (!cardElement) return;
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 300));
    try {
        const canvas = await html2canvas(cardElement, {
            scale: 3, 
            backgroundColor: '#ffffff',
            useCORS: true,
            windowWidth: cardElement.scrollWidth,
            windowHeight: cardElement.scrollHeight,
            onclone: (doc: Document) => {
               const el = doc.getElementById('share-container');
               if(el) { el.style.display='block'; el.style.visibility='visible'; }
            }
        });
        canvas.toBlob(async (blob: Blob | null) => {
            if (!blob) { setIsSaving(false); return; }
            const file = new File([blob], `WBrC-Log-${Date.now()}.png`, { type: 'image/png' });
            if (navigator.share && navigator.canShare({ files: [file] })) {
                try { await navigator.share({ files: [file], title: 'Brewing Log' }); } catch(e){}
            } else {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url; link.download = file.name;
                document.body.appendChild(link); link.click(); document.body.removeChild(link);
            }
            setIsSaving(false);
        }, 'image/png');
    } catch (error) { setIsSaving(false); alert("Error generating image"); }
  };

  const formatDigitalTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };
  
  const formatFriendlyTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    if(m > 0) return `${m}m ${sec}s`;
    return `${sec}s`;
  };

  // -------------------------
  // Render
  // -------------------------
  const currentStep = steps[currentStepIndex] || { startTimeSec: 0, durationSec: 0, action: 'Ready', description: 'Prepare equipment...', waterAmount: 0 };
  const stepRemaining = Math.max(0, (currentStep.startTimeSec + currentStep.durationSec) - seconds);
  const stepProgressPercent = Math.min(100, Math.max(0, ((currentStep.durationSec - stepRemaining) / currentStep.durationSec) * 100));

  const isSetupMode = !isActive && seconds === 0 && !isFinished;

  return (
    <div className="w-full max-w-lg mx-auto pb-48 animate-fade-in relative px-1">
        
      {/* Hidden Capture Target */}
      <div style={{ position: 'absolute', left: '-9999px', top: '0', width: '450px' }}>
          <div ref={shareTargetRef} id="share-container"><SharableCard recipe={recipe} language={language} /></div>
      </div>

      {!showShareCard ? (
        <>
            {/* 1. Global Header (Compact) */}
            <div className="sticky top-0 z-50 bg-[#0f172a]/95 backdrop-blur-md border-b border-white/5 -mx-6 px-6 py-3 shadow-lg flex justify-between items-center transition-all">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" style={{ opacity: isActive ? 1 : 0 }}></div>
                    <span className="font-mono text-2xl font-bold text-white tracking-tight">{formatDigitalTime(seconds)}</span>
                </div>
                <div className="flex gap-4">
                     <button onClick={() => setSoundEnabled(!soundEnabled)} className="text-retro-mute hover:text-white">
                        {soundEnabled ? '🔊' : '🔇'}
                     </button>
                </div>
            </div>

            {/* 2. Setup Briefing (Visible clearly before start, dims after start) */}
            <div className={`transition-all duration-700 ease-out space-y-4 mt-6 ${isSetupMode ? 'opacity-100 translate-y-0' : 'opacity-40 scale-95 hidden'}`}>
                {/* Equipment & Analysis Card */}
                <div className="bg-[#1e293b] rounded-3xl p-6 border border-white/10 shadow-xl">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl">📋</span>
                        <h3 className="text-xs font-black uppercase text-retro-mute tracking-[0.2em]">{t.timer_analysis}</h3>
                    </div>
                    
                    {/* Grind Size Highlight */}
                    <div className="mb-4 bg-retro-accent/10 border border-retro-accent/20 rounded-xl p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-retro-accent flex items-center justify-center text-[#0f172a] font-bold text-lg">⚙️</div>
                        <div>
                            <span className="text-[10px] text-retro-mute uppercase tracking-widest block mb-0.5">{t.timer_grind}</span>
                            <span className="font-serif text-base font-black text-white leading-tight block">{recipe?.grindSize}</span>
                        </div>
                    </div>

                    <p className="text-sm font-bold text-slate-300 leading-relaxed text-justify border-t border-white/5 pt-4">
                        {recipe?.variableAnalysis}
                    </p>
                    <div className="mt-4 flex gap-4 text-xs font-mono text-retro-mute">
                        <span>🌡️ {recipe?.temperature}°C</span>
                        <span>💧 {recipe?.totalWater}ml</span>
                        <span>⚖️ 1:{recipe?.waterRatio}</span>
                    </div>
                </div>
                
                <div className="text-center py-2">
                     <span className="text-[10px] text-retro-mute uppercase tracking-widest animate-pulse">
                         ↓ SCROLL FOR TIMELINE ↓
                     </span>
                </div>
            </div>

            {/* 3. Integrated Timeline */}
            <div className={`relative space-y-6 mt-6 transition-all ${isSetupMode ? '' : 'mt-20'}`}>
                {/* Connector Line */}
                <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-white/5 z-0"></div>

                {steps.map((step, idx) => {
                    const isCurrent = idx === currentStepIndex && !isFinished;
                    const isPast = idx < currentStepIndex || isFinished;
                    const isFuture = idx > currentStepIndex;
                    
                    return (
                        <div 
                            key={idx} 
                            id={`step-${idx}`} 
                            className={`relative z-10 transition-all duration-500 ease-out ${isCurrent ? 'scale-100 opacity-100 my-8' : 'scale-95 my-2'} ${isPast ? 'opacity-40 grayscale' : ''} ${isFuture ? 'opacity-50' : ''}`}
                        >
                            <div className={`
                                overflow-hidden rounded-[2rem] border transition-all duration-500
                                ${isCurrent 
                                    ? 'bg-[#1e293b] border-retro-accent shadow-[0_0_40px_-10px_rgba(251,191,36,0.2)]' 
                                    : 'bg-[#0f172a] border-white/5'
                                }
                            `}>
                                {/* Active Step Header (Timer Mode) */}
                                {isCurrent && (
                                    <div className="bg-retro-accent/10 p-6 flex justify-between items-center border-b border-retro-accent/10">
                                        <div>
                                            <span className="text-[9px] font-black uppercase text-retro-accent tracking-widest block mb-1">Step {idx+1} Timer</span>
                                            <span className="font-mono text-4xl font-black text-white tracking-tighter tabular-nums">{stepRemaining}s</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[9px] font-black uppercase text-retro-mute tracking-widest block mb-1">{t.step_water_to}</span>
                                            <span className="font-mono text-3xl font-black text-white tracking-tighter tabular-nums">{step.waterAmount}<span className="text-base text-retro-mute ml-1">ml</span></span>
                                        </div>
                                    </div>
                                )}

                                <div className="p-6 flex gap-5 items-start">
                                    {/* Number Circle */}
                                    <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full font-black text-sm border-2 ${isCurrent ? 'bg-retro-accent border-retro-accent text-[#0f172a]' : 'bg-transparent border-white/10 text-retro-mute'}`}>
                                        {isPast ? '✓' : idx + 1}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className={`font-serif text-xl font-black ${isCurrent ? 'text-retro-accent' : 'text-white'}`}>
                                                {step.action}
                                            </h4>
                                            {!isCurrent && (
                                                 <span className="font-mono text-xs font-bold text-retro-mute bg-white/5 px-2 py-1 rounded">
                                                    {t.step_water_to} {step.waterAmount}ml
                                                 </span>
                                            )}
                                        </div>
                                        
                                        <p className={`font-body font-bold text-sm leading-relaxed ${isCurrent ? 'text-slate-200' : 'text-slate-500'}`}>
                                            {step.description}
                                        </p>

                                        {/* Progress Bar (Only Active) */}
                                        {isCurrent && isActive && (
                                            <div className="mt-6 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-retro-accent transition-all duration-1000 ease-linear shadow-[0_0_10px_#FBBF24]" style={{ width: `${stepProgressPercent}%` }}></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                
                {/* Finish Message */}
                {isFinished && (
                    <div className="text-center p-8 bg-green-900/20 border border-green-500/30 rounded-3xl animate-fade-in">
                        <div className="text-4xl mb-4">☕</div>
                        <h3 className="font-serif text-2xl font-black text-white mb-2">Enjoy your coffee!</h3>
                        <p className="text-sm text-green-200/60 font-bold">Extraction Complete.</p>
                    </div>
                )}
            </div>

        </>
      ) : (
        /* 3. SHARE VIEW */
        <div className="space-y-8 py-6">
             <div className="text-center px-8">
                <h3 className="font-serif font-black text-2xl text-white mb-2">{t.share_title}</h3>
                <p className="text-[10px] font-black text-retro-mute uppercase tracking-widest">{t.share_subtitle}</p>
             </div>
             <div className="transform scale-[0.85] origin-top md:scale-100 mb-0 flex justify-center">
                <SharableCard recipe={recipe} language={language} />
             </div>
             <div className="flex flex-col gap-4 max-w-[400px] mx-auto px-4">
                <RetroButton onClick={handleSaveImage} disabled={isSaving} className="w-full text-[#0f172a] bg-retro-accent flex items-center justify-center gap-3 text-lg shadow-glow">
                   {isSaving ? 'Saving...' : t.share_save}
                </RetroButton>
                <button onClick={() => setShowShareCard(false)} className="text-retro-mute font-black text-xs uppercase tracking-widest hover:text-white transition-all py-4">
                   {t.share_back}
                </button>
             </div>
        </div>
      )}

      {/* Floating Action Buttons (Only in Timer View) */}
      {!showShareCard && (
        <div className="fixed bottom-8 left-0 right-0 px-6 z-50 max-w-lg mx-auto flex gap-4">
            {/* Play Button - Main Action */}
            <button 
                onClick={toggleTimer}
                className={`flex-1 h-16 rounded-full flex items-center justify-center font-black text-lg uppercase tracking-widest shadow-2xl transition-all ${isActive ? 'bg-retro-surface text-white border border-white/20' : 'bg-retro-accent text-[#0f172a] shadow-glow scale-105'}`}
            >
                {isFinished ? t.timer_done : isActive ? t.timer_pause : seconds > 0 ? t.timer_resume : t.timer_start}
            </button>
            
            {/* Secondary Actions */}
            <div className="flex gap-2">
                <button onClick={() => setShowShareCard(true)} className="h-16 w-16 rounded-full bg-white text-[#0f172a] flex items-center justify-center text-xl shadow-lg hover:scale-105 transition-transform">
                    🗃️
                </button>
                <button onClick={onReset} className="h-16 w-16 rounded-full bg-black/60 backdrop-blur text-white border border-white/20 flex items-center justify-center text-xl hover:scale-105 transition-transform">
                    ↺
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default BrewTimer;
