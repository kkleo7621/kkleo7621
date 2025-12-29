import React, { useState, useEffect, useRef } from 'react';
import { CoffeeRecipe } from '../types';
import { RetroButton } from './RetroUI';

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
    <div className="w-full max-w-lg mx-auto pb-20 animate-fade-in">
        
      {/* 1. Timer & Action Card */}
      <div className="bg-[#1A1818] text-[#FDFBF7] p-6 shadow-hard mb-6 relative overflow-hidden">
        {/* Dotted texture background effect */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
        
        <div className="relative z-10 flex flex-col items-center">
            <div className="text-xs font-serif tracking-[0.2em] text-gray-400 mb-2">沖煮計時 (TIMER)</div>
            <div className="font-serif text-7xl font-bold tabular-nums tracking-tight mb-6">
                {formatTime(seconds)}
            </div>

            {/* Main Action Button */}
            {!isActive && !isFinished && seconds === 0 && (
                 <RetroButton onClick={toggleTimer} className="w-full bg-retro-accent border-white text-white mb-6">開始沖煮 (START)</RetroButton>
            )}
             {isActive && (
                 <RetroButton onClick={toggleTimer} className="w-full bg-white border-white text-retro-dark mb-6">暫停 (PAUSE)</RetroButton>
            )}
             {!isActive && seconds > 0 && !isFinished && (
                 <RetroButton onClick={toggleTimer} className="w-full bg-retro-accent border-white text-white mb-6">繼續 (RESUME)</RetroButton>
             )}
             {isFinished && (
                  <RetroButton onClick={resetTimerState} className="w-full bg-white border-white text-retro-dark mb-6">再次沖煮 (BREW AGAIN)</RetroButton>
             )}

            {!isFinished && (
                <>
                    <div className="w-full border-t border-gray-700 my-4"></div>
                    <div className="w-full flex justify-between items-end">
                        <div>
                            <div className="text-xs font-serif tracking-[0.2em] text-gray-400 mb-1">當前步驟 (ACTION)</div>
                            <div className="font-serif text-3xl font-bold">{currentStep.action}</div>
                        </div>
                        <div className="font-serif text-5xl font-bold text-gray-500 tabular-nums">
                            {isActive ? stepRemaining : currentStep.durationSec}s
                        </div>
                    </div>
                </>
            )}
             {isFinished && (
                <div className="text-center py-4">
                    <p className="font-serif text-2xl text-retro-accent">請享用您的美味咖啡。</p>
                </div>
            )}
        </div>
      </div>

      {/* 2. Parameter Grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="bg-[#FCE7F3] border-2 border-retro-dark shadow-hard-sm p-3 flex flex-col items-center justify-center h-24">
            <span className="text-xs font-bold text-retro-dark/60 uppercase tracking-widest mb-1">粉重 Dose</span>
            <span className="font-serif text-2xl font-bold text-retro-dark">{recipe.coffeeWeight}g</span>
        </div>
        <div className="bg-[#CCFBF1] border-2 border-retro-dark shadow-hard-sm p-3 flex flex-col items-center justify-center h-24">
            <span className="text-xs font-bold text-retro-dark/60 uppercase tracking-widest mb-1">水溫 Temp</span>
            <span className="font-serif text-2xl font-bold text-retro-dark">{recipe.temperature}°C</span>
        </div>
        <div className="bg-[#FEF3C7] border-2 border-retro-dark shadow-hard-sm p-3 flex flex-col items-center justify-center h-auto min-h-[6rem] text-center">
             <span className="text-xs font-bold text-retro-dark/60 uppercase tracking-widest mb-1">研磨度 Grind</span>
             <span className="font-body text-sm font-bold text-retro-dark leading-tight px-1">{recipe.grindSize}</span>
        </div>
         <div className="bg-[#FFEDD5] border-2 border-retro-dark shadow-hard-sm p-3 flex flex-col items-center justify-center h-24">
             <span className="text-xs font-bold text-retro-dark/60 uppercase tracking-widest mb-1">總時 Time</span>
             <span className="font-serif text-2xl font-bold text-retro-dark">{formatTime(totalTime)}</span>
        </div>
      </div>

      {/* 3. Brewing Process List */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
             <div className="h-[2px] bg-retro-dark flex-grow"></div>
             <h3 className="font-serif text-xl font-bold uppercase tracking-widest">沖煮流程</h3>
             <div className="h-[2px] bg-retro-dark flex-grow"></div>
        </div>

        <div className="space-y-6">
            {recipe.steps.map((step, idx) => {
                const isCurrent = idx === currentStepIndex && !isFinished;
                const isPast = idx < currentStepIndex || isFinished;
                return (
                    <div key={idx} className={`flex gap-4 transition-opacity ${isPast ? 'opacity-50' : 'opacity-100'}`}>
                        <div className="flex-shrink-0">
                            <div className={`w-10 h-10 flex items-center justify-center border-2 border-retro-dark font-serif font-bold text-lg ${isCurrent ? 'bg-retro-accent text-white' : 'bg-white text-retro-dark'}`}>
                                {idx + 1}
                            </div>
                        </div>
                        <div className="flex-grow pt-1 pb-4 border-b border-gray-200">
                             <div className="flex justify-between items-baseline mb-2">
                                <h4 className="font-serif text-xl font-bold">{step.action}</h4>
                                <span className="font-mono font-bold text-sm bg-gray-100 px-2 py-1 rounded">{step.waterAmount}ML</span>
                             </div>
                             <p className="font-body text-gray-700 leading-relaxed text-sm">{step.description}</p>
                             <div className="mt-2 text-xs font-bold text-gray-400 font-serif tracking-widest">
                                {formatTime(step.startTimeSec)} - {formatTime(step.startTimeSec + step.durationSec)}
                             </div>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>

      {/* 4. Barista Notes */}
      <div className="border-t-4 border-retro-dark pt-6 mt-8">
          <div className="flex items-center gap-2 mb-3">
              <span className="bg-black text-white px-2 py-1 text-xs font-bold tracking-widest uppercase">職人筆記 (Barista Notes)</span>
          </div>
          <blockquote className="font-serif italic text-lg text-gray-800 leading-relaxed border-l-4 border-retro-accent pl-4 py-1">
              "{recipe.baristaNotes || recipe.tastingNotes.join(', ')}"
          </blockquote>
      </div>

      <div className="mt-12 text-center">
        <button onClick={onReset} className="font-body text-sm underline text-gray-500 hover:text-black">
            調整參數
        </button>
      </div>

    </div>
  );
};

export default BrewTimer;