import React from 'react';

// --- Card ---
export const RetroCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white border-2 border-retro-dark shadow-hard p-6 ${className}`}>
    {children}
  </div>
);

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
}

export const RetroButton: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "px-6 py-3 font-serif font-bold border-2 border-retro-dark transition-all active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide uppercase";
  
  const variants = {
    primary: "bg-retro-accent text-white shadow-hard hover:bg-[#B45309]",
    secondary: "bg-white text-retro-dark shadow-hard hover:bg-gray-50",
    outline: "bg-transparent text-retro-dark shadow-hard hover:bg-gray-100",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const RetroInput: React.FC<InputProps> = ({ label, className = '', ...props }) => (
  <div className="flex flex-col gap-1 mb-4">
    <label className="font-serif font-bold text-retro-dark text-sm uppercase tracking-wider">{label}</label>
    <input
      className={`border-2 border-retro-dark p-3 font-body bg-[#FDFBF7] focus:outline-none focus:ring-2 focus:ring-retro-accent focus:border-retro-accent shadow-hard-sm transition-all ${className}`}
      {...props}
    />
  </div>
);

// --- Slider ---
interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  displayValue?: string | number;
}

export const RetroSlider: React.FC<SliderProps> = ({ label, displayValue, className = '', ...props }) => (
  <div className="flex flex-col gap-2 mb-4">
    <div className="flex justify-between items-baseline">
        <label className="font-serif font-bold text-retro-dark text-sm uppercase tracking-wider">{label}</label>
        {displayValue && <span className="font-serif font-bold text-lg text-retro-accent">{displayValue}</span>}
    </div>
    <div className="relative h-6 flex items-center">
        <input
        type="range"
        className={`w-full h-2 bg-retro-dark/10 rounded-none appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-retro-dark [&::-webkit-slider-thumb]:shadow-hard-sm hover:[&::-webkit-slider-thumb]:bg-retro-accent ${className}`}
        {...props}
        />
    </div>
  </div>
);


// --- Select ---
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
}

export const RetroSelect: React.FC<SelectProps> = ({ label, options, className = '', ...props }) => (
  <div className="flex flex-col gap-1 mb-4">
    <label className="font-serif font-bold text-retro-dark text-sm uppercase tracking-wider">{label}</label>
    <div className="relative">
      <select
        className={`w-full appearance-none border-2 border-retro-dark p-3 font-body bg-[#FDFBF7] focus:outline-none focus:ring-2 focus:ring-retro-accent shadow-hard-sm cursor-pointer ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-retro-dark">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  </div>
);
