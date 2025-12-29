import React from 'react';

// --- Card ---
export const RetroCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-retro-surface border border-retro-border rounded-3xl shadow-soft p-6 ${className}`}>
    {children}
  </div>
);

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
}

export const RetroButton: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  // Rounded-full (capsule), bold font, soft transitions
  const baseStyles = "px-6 py-4 font-serif font-bold rounded-full transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-base tracking-wide shadow-lg";
  
  const variants = {
    primary: "bg-retro-accent text-retro-bg hover:bg-[#F59E0B] hover:shadow-glow",
    secondary: "bg-retro-border text-retro-dark hover:bg-slate-600",
    outline: "bg-transparent border-2 border-retro-border text-retro-mute hover:text-retro-dark hover:border-retro-dark",
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
  <div className="flex flex-col gap-2 mb-4">
    <label className="font-serif font-bold text-retro-mute text-sm ml-2">{label}</label>
    <input
      className={`w-full bg-[#0f172a] border border-retro-border text-retro-dark p-4 rounded-2xl font-body focus:outline-none focus:ring-2 focus:ring-retro-accent focus:border-transparent transition-all placeholder-slate-600 ${className}`}
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
  <div className="flex flex-col gap-3 mb-6 bg-[#0f172a] p-4 rounded-2xl border border-retro-border">
    <div className="flex justify-between items-center">
        <label className="font-serif font-bold text-retro-mute text-sm">{label}</label>
        {displayValue && <span className="font-serif font-bold text-lg text-retro-accent">{displayValue}</span>}
    </div>
    <div className="relative h-6 flex items-center px-1">
        <input
        type="range"
        className={`w-full h-2 bg-retro-border rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-retro-accent [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-glow hover:[&::-webkit-slider-thumb]:scale-110 transition-all ${className}`}
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
  <div className="flex flex-col gap-2 mb-4">
    <label className="font-serif font-bold text-retro-mute text-sm ml-2">{label}</label>
    <div className="relative">
      <select
        className={`w-full appearance-none bg-[#0f172a] border border-retro-border text-retro-dark p-4 rounded-2xl font-body focus:outline-none focus:ring-2 focus:ring-retro-accent focus:border-transparent cursor-pointer transition-all ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-retro-bg text-retro-dark">{opt}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-retro-mute">
        <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  </div>
);