import React from 'react';
import { CoffeeRecipe } from '../types';
import { RetroButton, RetroCard } from './RetroUI';

interface RecipeViewProps {
  recipe: CoffeeRecipe;
  onStartBrew: () => void;
  onBack: () => void;
}

const RecipeView: React.FC<RecipeViewProps> = ({ recipe, onStartBrew, onBack }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-retro-dark">Your Recipe</h2>
        <div className="flex flex-wrap justify-center gap-2">
            {recipe.tastingNotes.map((note, i) => (
                <span key={i} className="bg-retro-secondary/10 text-retro-secondary px-3 py-1 text-sm font-bold border border-retro-secondary rounded-full">
                    {note}
                </span>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <RetroCard className="text-center py-4 px-2">
            <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">Dose</div>
            <div className="font-serif text-2xl font-bold">{recipe.coffeeWeight}g</div>
        </RetroCard>
        <RetroCard className="text-center py-4 px-2">
            <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">Water</div>
            <div className="font-serif text-2xl font-bold">{recipe.totalWater}ml</div>
        </RetroCard>
        <RetroCard className="text-center py-4 px-2">
            <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">Ratio</div>
            <div className="font-serif text-2xl font-bold">{recipe.waterRatio}</div>
        </RetroCard>
        <RetroCard className="text-center py-4 px-2">
            <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">Temp</div>
            <div className="font-serif text-2xl font-bold">{recipe.temperature}°C</div>
        </RetroCard>
      </div>

      <RetroCard className="bg-[#F3F0EB]">
        <div className="flex items-start gap-3">
            <span className="text-2xl">⚙️</span>
            <div>
                <h4 className="font-serif font-bold text-lg">Grind Setting</h4>
                <p className="font-body text-gray-700">{recipe.grindSize}</p>
            </div>
        </div>
      </RetroCard>

      <div className="space-y-4">
        <h3 className="font-serif text-xl font-bold border-b-2 border-retro-dark pb-2">Process Preview</h3>
        <div className="space-y-0 relative border-l-2 border-retro-dark/20 ml-3">
            {recipe.steps.map((step, idx) => (
                <div key={idx} className="mb-6 ml-6 relative">
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-retro-accent border-2 border-white shadow-sm"></div>
                    <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-serif font-bold text-lg">{step.action}</h4>
                        <span className="font-mono text-sm text-gray-500 font-bold">{step.startTimeSec}s - {step.waterAmount}g</span>
                    </div>
                    <p className="font-body text-sm text-gray-600">{step.description}</p>
                </div>
            ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <RetroButton onClick={onStartBrew} className="w-full text-lg py-4">
            Start Brewing Timer
        </RetroButton>
        <button onClick={onBack} className="text-sm text-center underline font-body text-gray-500 hover:text-retro-dark mt-2">
            Adjust Parameters
        </button>
      </div>
    </div>
  );
};

export default RecipeView;