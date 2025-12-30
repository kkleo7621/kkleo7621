import React, { useState, useEffect, useRef } from 'react';
import { CoffeeRecipe } from '../types';
import { RetroButton, RetroCard } from './RetroUI';
// @ts-ignore - html2canvas is imported via ESM in index.html
import html2canvas from 'html2canvas';

interface BrewTimerProps {
  recipe: CoffeeRecipe;
  onReset: () => void;
}

const BrewTimer: React.FC<BrewTimerProps> = ({ recipe, onReset }) => {
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const shareTargetRef = useRef<HTMLDivElement>(null);

  const totalTime = recipe.steps.length > 0 
    ? recipe.steps[recipe.steps.length - 1].startTimeSec + recipe.steps[recipe.steps.length - 1].durationSec 
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
    const stepIdx = recipe.steps.findIndex((step, idx) => {
      const nextStep = recipe.steps[idx + 1];
      const stepEnd = step.startTimeSec + step.durationSec;
      if (seconds >= step.startTimeSec && seconds < stepEnd) return true;
      if (!nextStep && seconds >= step.startTimeSec) return true;
      return false;
    });

    if (stepIdx !== -1 && stepIdx !== currentStepIndex) {
        setCurrentStepIndex(stepIdx);
        if(isActive) playBeep(440, 0.1); 
    }
  }, [seconds, recipe.steps, currentStepIndex, isActive, isFinished]);

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

  const currentStep = recipe.steps[currentStepIndex] || recipe.steps[recipe.steps.length - 1];
  const stepRemaining = Math.max(0, (currentStep.startTimeSec + currentStep.durationSec) - seconds);

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSaveImage = async () => {
    const cardElement = shareTargetRef.current;
    if (!cardElement) return;

    setIsSaving(true);
    await new Promise(r => setTimeout(r, 200));

    try {
        const canvas = await html2canvas(cardElement, {
            scale: 3, 
            backgroundColor: '#ffffff', // Force pure white
            useCORS: true,
            allowTaint: true,
            onclone: (clonedDoc) => {
              const el = clonedDoc.getElementById('share-container');
              if (el) {
                el.style.opacity = '1';
                el.style.visibility = 'visible';
                el.style.position = 'relative';
                el.style.left = '0';
                el.style.top = '0';
              }
            }
        });

        canvas.toBlob(async (blob) => {
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
                } catch (e) { console.log("Share failed, falling back to download"); }
            }

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.click();
            URL.revokeObjectURL(url);
            setIsSaving(false);
        }, 'image/png');

    } catch (error) {
        console.error("Save failed:", error);
        alert("儲存失敗，請嘗試手動截圖。");
        setIsSaving(false);
    }
  };

  // --- INTERNAL COMPONENT: THE CAPTURE TARGET ---
  // We use hardcoded styles to bypass theme/inversion issues during html2canvas capture
  const SharableCard = ({ id }: { id?: string }) => (
    <div id={id} className="bg-white p-8 rounded-[2rem] border-[4px] border-black text-black w-full max-w-[380px] mx-auto overflow-hidden shadow-none" style={{ background: '#ffffff', color: '#000000', fontFamily: 'sans-serif' }}>
        <header className="border-b-[4px] border-black pb-5 mb-6 text-center">
            <h2 className="text-3xl font-black uppercase tracking-tighter" style={{ margin: 0 }}>BARISTA'S LOG</h2>
            <div className="text-[10px] font-black tracking-[0.4em] uppercase opacity-50">AI MASTER BREWING ENGINE</div>
        </header>

        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <span className="text-[9px] font-black uppercase text-gray-500 block mb-1">Dose / Water</span>
                    <p className="font-bold text-xl">{recipe.coffeeWeight}g / {recipe.totalWater}ml</p>
                </div>
                <div className="text-right flex-1">
                    <span className="text-[9px] font-black uppercase text-gray-500 block mb-1">Temp / Ratio</span>
                    <p className="font-bold text-xl">{recipe.temperature}°C / {recipe.waterRatio}</p>
                </div>
            </div>

            <div className="bg-gray-100 p-5 rounded-3xl border border-gray-200">
                <span className="text-[9px] font-black uppercase text-gray-600 block mb-1">Master Analysis (變因總結)</span>
                <p className="text-[11px] leading-relaxed font-bold text-gray-800 italic">{recipe.variableAnalysis}</p>
            </div>

            <div className="border-t-[2px] border-gray-200 pt-5">
                 <span className="text-[9px] font-black uppercase text-gray-500 block mb-3">Brewing Sequence</span>
                 <div className="space-y-2">
                    {recipe.steps.map((s, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <span className="bg-black text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">{i+1}</span>
                            <span className="font-bold text-[11px] flex-1">{s.action}</span>
                            <span className="font-bold text-[10px] text-gray-400">{s.waterAmount}ml</span>
                        </div>
                    ))}
                 </div>
            </div>

            <div className="bg-black text-white p-5 rounded-3xl">
                 <span className="text-[8px] font-black uppercase text-yellow-400 tracking-[0.2em] block mb-1">Champion Inspiration (手法融合)</span>
                 <p className="font-bold text-[11px] leading-snug">{recipe.championInspiration}</p>
            </div>
        </div>

        <footer className="mt-8 pt-5 border-t-[2px] border-dashed border-gray-200 text-center">
            <div className="text-[8px] font-black tracking-[0.3em] uppercase text-gray-400">Validated 2014-2025 WBrC Analytics</div>
        </footer>
    </div>
  );

  return (
    <div className="w-full max-w-lg mx-auto pb-24 animate-fade-in space-y-6 px-1 relative">
        
      {/* 0. Hidden Capture Target (To ensure perfect '另存' every time) */}
      <div className="fixed -left-[1000px] -top-[1000px] opacity-0 pointer-events-none">
          <div ref={shareTargetRef} id="share-container">
              <SharableCard />
          </div>
      </div>

      {/* 1. Timer UI */}
      {!showShareCard && (
        <>
          <div className="bg-gradient-to-b from-retro-surface to-[#0f172a] text-white p-10 rounded-[3rem] shadow-soft relative overflow-hidden border border-retro-border">
            {isActive && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-retro-accent/10 blur-[80px] rounded-full"></div>}
            
            <div className="relative z-10 flex flex-col items-center">
                <div className="text-[10px] font-black tracking-[0.3em] text-retro-accent mb-4 uppercase opacity-80">Brewing Real-time</div>
                <div className="font-serif text-8xl font-extrabold tabular-nums tracking-tighter mb-10 text-white">
                    {formatTime(seconds)}
                </div>

                <div className="w-full mb-8">
                    <RetroButton onClick={toggleTimer} className={`w-full py-5 text-xl font-black ${isActive ? 'bg-retro-border text-white' : 'bg-retro-accent text-retro-bg shadow-glow'}`}>
                        {isFinished ? '已完成' : isActive ? '暫停' : seconds > 0 ? '繼續' : '開始沖煮'}
                    </RetroButton>
                </div>

                {!isFinished && (
                    <div className="w-full bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-black tracking-widest text-retro-mute uppercase">Next Action</span>
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

          {/* Master Analysis Section (Variable Conclusion) */}
          <div className="bg-[#1e293b] border-2 border-retro-accent/30 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-3 mb-5">
                  <div className="w-2 h-2 rounded-full bg-retro-accent animate-pulse"></div>
                  <h3 className="font-serif font-black text-white text-lg tracking-widest uppercase">職人變因分析報告</h3>
              </div>
              <p className="font-body text-slate-300 leading-relaxed font-bold text-[14px] bg-black/20 p-5 rounded-2xl border border-white/5">
                  {recipe.variableAnalysis}
              </p>
          </div>

          {/* Champion Inspiration Section */}
          <div className="bg-retro-surface/50 border border-white/10 rounded-[2.5rem] p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                  <span className="text-xl">🏆</span>
                  <h3 className="font-serif font-black text-white text-lg tracking-widest uppercase">冠軍手法融合說明</h3>
              </div>
              <p className="font-body text-slate-300 leading-relaxed font-bold text-[13px] border-l-4 border-retro-accent pl-4">
                  {recipe.championInspiration}
              </p>
          </div>

          {/* Brewing Steps List (Keep existing) */}
          <RetroCard className="!p-8">
            <h3 className="font-serif text-2xl font-black text-white mb-8 flex items-center gap-3">
                 <span className="w-1.5 h-6 bg-retro-accent rounded-full"></span>
                 沖煮流程詳解
            </h3>
            <div className="space-y-6 relative">
                <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-white/5 z-0"></div>
                {recipe.steps.map((step, idx) => {
                    const isCurrent = idx === currentStepIndex && !isFinished;
                    const isPast = idx < currentStepIndex || isFinished;
                    return (
                        <div key={idx} className={`relative z-10 flex gap-6 transition-all duration-500 ${isPast ? 'opacity-30' : 'opacity-100'}`}>
                            <div className="flex-shrink-0 pt-1">
                                <div className={`w-12 h-12 flex items-center justify-center rounded-full border-4 font-black text-base transition-all ${isCurrent ? 'bg-retro-accent border-[#0f172a] text-[#0f172a] scale-110' : 'bg-[#0f172a] border-white/10 text-retro-mute'}`}>
                                    {idx + 1}
                                </div>
                            </div>
                            <div className="flex-grow">
                                 <h4 className={`font-serif text-lg font-black ${isCurrent ? 'text-retro-accent' : 'text-white'}`}>{step.action}</h4>
                                 <p className="font-body text-retro-mute/80 leading-relaxed text-sm font-bold">{step.description}</p>
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
                <h3 className="font-serif font-black text-2xl text-white mb-2">職人分享卡 (2014-2025 WBrC)</h3>
                <p className="text-[10px] font-black text-retro-mute uppercase tracking-widest">點擊下方按鈕將配方導出為專業影像</p>
             </div>
             
             {/* The visual preview for the user */}
             <div className="transform scale-[0.9] origin-top md:scale-100 mb-8">
                <SharableCard />
             </div>

             <div className="flex flex-col gap-4 max-w-[400px] mx-auto px-4">
                <RetroButton 
                    onClick={handleSaveImage} 
                    disabled={isSaving}
                    className="w-full text-[#0f172a] bg-retro-accent flex items-center justify-center gap-3 text-lg shadow-glow"
                >
                   {isSaving ? '正在渲染高解析圖片...' : '📥 另存圖片到相簿'}
                </RetroButton>
                <button onClick={() => setShowShareCard(false)} className="text-retro-mute font-black text-xs uppercase tracking-widest hover:text-white transition-all py-4">
                   ← 返回計時器介面
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
                🗃️ 生成分享卡
            </RetroButton>
            <RetroButton 
                onClick={onReset} 
                variant="outline" 
                className="bg-black/50 backdrop-blur-md text-white border-white/20 px-8"
            >
                重設
            </RetroButton>
        </div>
      )}
    </div>
  );
};

export default BrewTimer;