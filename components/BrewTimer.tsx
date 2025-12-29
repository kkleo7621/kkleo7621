import React, { useState, useEffect, useRef } from 'react';
import { CoffeeRecipe } from '../types';
import { RetroButton, RetroCard } from './RetroUI';

interface BrewTimerProps {
  recipe: CoffeeRecipe;
  onReset: () => void;
}

const BrewTimer: React.FC<BrewTimerProps> = ({ recipe, onReset }) => {
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);

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

  // Sync current step
  useEffect(() => {
    if (isFinished) return;
    const stepIdx = recipe.steps.findIndex((step, idx) => {
      const nextStep = recipe.steps[idx + 1];
      const stepEnd = step.startTimeSec + step.durationSec;
      
      // If we are within this step's time range
      if (seconds >= step.startTimeSec && seconds < stepEnd) return true;
      // If it's the last step and we are past start
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

  const resetTimerState = () => {
    setIsActive(false);
    setSeconds(0);
    setIsFinished(false);
    setCurrentStepIndex(0);
  };

  const playBeep = (freq: number, duration: number) => {
    if (!audioContextRef.current) return;
    const osc = audioContextRef.current.createOscillator();
    const gain = audioContextRef.current.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioContextRef.current.currentTime);
    gain.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
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

  return (
    <div className="w-full max-w-lg mx-auto pb-20 animate-fade-in space-y-6">
        
      {/* 1. Timer & Action Card */}
      <div className="bg-gradient-to-b from-retro-surface to-[#161e2e] text-white p-8 rounded-[2.5rem] shadow-soft relative overflow-hidden border border-retro-border">
        {/* Glow effect */}
        {isActive && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-retro-accent/20 blur-[50px] rounded-full"></div>}
        
        <div className="relative z-10 flex flex-col items-center">
            <div className="text-xs font-bold tracking-[0.2em] text-retro-mute mb-2 uppercase">Brewing Timer</div>
            <div className="font-serif text-8xl font-bold tabular-nums tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                {formatTime(seconds)}
            </div>

            {/* Main Action Button */}
            <div className="w-full px-4 mb-6">
                {!isActive && !isFinished && seconds === 0 && (
                    <RetroButton onClick={toggleTimer} className="w-full shadow-glow py-5 text-xl">開始沖煮 (START)</RetroButton>
                )}
                {isActive && (
                    <RetroButton onClick={toggleTimer} variant="secondary" className="w-full py-5 text-xl">暫停 (PAUSE)</RetroButton>
                )}
                {!isActive && seconds > 0 && !isFinished && (
                    <RetroButton onClick={toggleTimer} className="w-full shadow-glow py-5 text-xl">繼續 (RESUME)</RetroButton>
                )}
                {isFinished && (
                    <RetroButton onClick={resetTimerState} variant="outline" className="w-full py-5 text-xl text-white border-white">重置 (RESET)</RetroButton>
                )}
            </div>

            {!isFinished && (
                <div className="w-full bg-[#0f172a]/50 p-6 rounded-3xl border border-retro-border/50 backdrop-blur-md">
                    <div className="w-full flex justify-between items-end">
                        <div>
                            <div className="text-xs font-bold tracking-[0.2em] text-retro-secondary mb-1">CURRENT STEP</div>
                            <div className="font-serif text-2xl font-bold text-white">{currentStep.action}</div>
                        </div>
                        <div className="font-serif text-4xl font-bold text-retro-accent tabular-nums">
                            {isActive ? stepRemaining : currentStep.durationSec}s
                        </div>
                    </div>
                </div>
            )}
             {isFinished && (
                <div className="text-center py-4">
                    <p className="font-serif text-2xl text-retro-accent animate-pulse">Enjoy your coffee.</p>
                </div>
            )}
        </div>
      </div>

      {/* 2. Parameter Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-pink-900/20 border border-pink-500/30 rounded-3xl p-4 flex flex-col items-center justify-center h-28">
            <span className="text-[10px] font-bold text-pink-300 uppercase tracking-widest mb-1">Dose</span>
            <span className="font-serif text-3xl font-bold text-pink-100">{recipe.coffeeWeight}<span className="text-lg ml-1">g</span></span>
        </div>
        <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-3xl p-4 flex flex-col items-center justify-center h-28">
            <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-widest mb-1">Temp</span>
            <span className="font-serif text-3xl font-bold text-cyan-100">{recipe.temperature}<span className="text-lg ml-1">°C</span></span>
        </div>
        <div className="col-span-1 bg-amber-900/20 border border-amber-500/30 rounded-3xl p-4 flex flex-col items-center justify-center min-h-[7rem] text-center">
             <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest mb-1">Grind</span>
             <span className="font-body text-xs font-bold text-amber-100 leading-tight px-1 line-clamp-3">{recipe.grindSize}</span>
        </div>
         <div className="col-span-1 bg-emerald-900/20 border border-emerald-500/30 rounded-3xl p-4 flex flex-col items-center justify-center h-28">
             <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest mb-1">Total Time</span>
             <span className="font-serif text-3xl font-bold text-emerald-100">{formatTime(totalTime)}</span>
        </div>
      </div>

      {/* 3. Brewing Process List */}
      <RetroCard>
        <div className="flex items-center gap-4 mb-6">
             <div className="h-2 w-2 rounded-full bg-retro-accent"></div>
             <h3 className="font-serif text-xl font-bold text-white">沖煮流程</h3>
        </div>

        <div className="space-y-6 relative">
            {/* Timeline line */}
            <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-retro-border z-0"></div>

            {recipe.steps.map((step, idx) => {
                const isCurrent = idx === currentStepIndex && !isFinished;
                const isPast = idx < currentStepIndex || isFinished;
                return (
                    <div key={idx} className={`relative z-10 flex gap-5 transition-opacity duration-500 ${isPast ? 'opacity-40' : 'opacity-100'}`}>
                        <div className="flex-shrink-0 pt-1">
                            <div className={`w-10 h-10 flex items-center justify-center rounded-full border-4 text-sm font-bold shadow-lg transition-all ${isCurrent ? 'bg-retro-accent border-[#0f172a] text-[#0f172a] scale-110 shadow-glow' : 'bg-[#0f172a] border-retro-border text-retro-mute'}`}>
                                {idx + 1}
                            </div>
                        </div>
                        <div className="flex-grow bg-[#0f172a]/50 p-4 rounded-2xl border border-retro-border/50">
                             <div className="flex justify-between items-baseline mb-2">
                                <h4 className={`font-serif text-lg font-bold ${isCurrent ? 'text-retro-accent' : 'text-white'}`}>{step.action}</h4>
                                <span className="font-mono font-bold text-xs bg-retro-border/50 text-retro-dark px-2 py-1 rounded-md">{step.waterAmount} ML</span>
                             </div>
                             <p className="font-body text-retro-mute leading-relaxed text-sm mb-2">{step.description}</p>
                             <div className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">
                                {formatTime(step.startTimeSec)} - {formatTime(step.startTimeSec + step.durationSec)}
                             </div>
                        </div>
                    </div>
                );
            })}
        </div>
      </RetroCard>

      {/* 4. Barista Notes */}
      <div className="py-2">
          <div className="flex items-center gap-2 mb-3 justify-center">
              <span className="bg-retro-secondary/20 text-retro-secondary border border-retro-secondary/30 px-3 py-1 text-xs font-bold rounded-full tracking-widest uppercase">Barista Notes</span>
          </div>
          <blockquote className="font-serif text-center text-lg text-gray-300 leading-relaxed italic px-4">
              "{recipe.baristaNotes || recipe.tastingNotes.join(', ')}"
          </blockquote>
      </div>

      <div className="mt-8 text-center pb-8">
        <button onClick={onReset} className="font-body text-sm text-retro-mute hover:text-white transition-colors underline decoration-retro-accent/50 underline-offset-4">
            ← 調整參數
        </button>
      </div>

    </div>
  );
};

export default BrewTimer;