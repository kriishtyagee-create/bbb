import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Eye, Type } from 'lucide-react';

export const AccessibilityBar = () => {
  const { theme, setTheme, fontScale, setFontScale } = useTheme();

  return (
    <div className="w-full select-none z-50 text-xs transition-colors duration-200">
      {/* 🇮🇳 Official Tricolor National Accent Stripe */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-[#FF9933]"></div>
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-[#138808]"></div>
      </div>

      {/* Main Bar */}
      <div className={`px-3 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b backdrop-blur-md transition-colors duration-200 ${
        theme === 'light'
          ? 'bg-amber-50/80 border-amber-200/80 text-slate-700'
          : theme === 'high-contrast'
          ? 'bg-black border-yellow-400 text-yellow-300'
          : 'bg-slate-950/90 border-white/10 text-slate-300'
      }`}>
        {/* Left: National & Ministry Branding */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 font-bold tracking-tight">
            <span className="text-base" role="img" aria-label="India Flag">🇮🇳</span>
            <span className="hidden sm:inline font-extrabold text-emerald-600 dark:text-emerald-400">
              भारत सरकार
            </span>
            <span className="text-slate-400 dark:text-slate-600">|</span>
            <span className="font-semibold text-[11px] sm:text-xs">
              Ministry of Ayush & AIIA
            </span>
          </div>

          <span className="hidden md:inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-medium italic">
            आयुष्याय भव • विद्या सर्वस्य भूषणम्
          </span>
        </div>

        {/* Right: Accessibility Controls (Font Size + Theme) */}
        <div className="flex items-center gap-2 sm:gap-4 ml-auto">
          {/* Font Scaler (A- / A / A+) */}
          <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 rounded-lg p-0.5 border border-black/10 dark:border-white/10" aria-label="Text Size Controller">
            <span className="text-[10px] uppercase font-extrabold px-1.5 text-slate-500 dark:text-slate-400 hidden sm:inline flex items-center gap-0.5">
              <Type className="w-3 h-3" /> Text:
            </span>
            <button
              onClick={() => setFontScale('normal')}
              aria-label="Normal Font Size"
              title="Normal Text Size (100%)"
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                fontScale === 'normal'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-black/10 dark:hover:bg-white/10'
              }`}
            >
              A-
            </button>
            <button
              onClick={() => setFontScale('large')}
              aria-label="Large Font Size"
              title="Large Text Size (115%)"
              className={`px-2 py-0.5 rounded text-[12px] font-bold transition-all ${
                fontScale === 'large'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-black/10 dark:hover:bg-white/10'
              }`}
            >
              A
            </button>
            <button
              onClick={() => setFontScale('xlarge')}
              aria-label="Extra Large Font Size"
              title="Extra Large Text Size (130%)"
              className={`px-2 py-0.5 rounded text-[13px] font-extrabold transition-all ${
                fontScale === 'xlarge'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-black/10 dark:hover:bg-white/10'
              }`}
            >
              A+
            </button>
          </div>

          {/* Theme Selector: Light / Dark / High-Contrast */}
          <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 rounded-lg p-0.5 border border-black/10 dark:border-white/10" aria-label="Theme Controller">
            <button
              onClick={() => setTheme('light')}
              title="Light Mode (Recommended for bright daylight/reading)"
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                theme === 'light'
                  ? 'bg-amber-400 text-amber-950 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-black/10 dark:hover:bg-white/10'
              }`}
            >
              <Sun className="w-3 h-3 text-amber-600" />
              <span className="hidden sm:inline">Light</span>
            </button>
            <button
              onClick={() => setTheme('dark')}
              title="Dark Mode (Modern glassmorphic style)"
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                theme === 'dark'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-black/10 dark:hover:bg-white/10'
              }`}
            >
              <Moon className="w-3 h-3 text-emerald-300" />
              <span className="hidden sm:inline">Dark</span>
            </button>
            <button
              onClick={() => setTheme('high-contrast')}
              title="High Contrast Mode (Maximum legibility for seniors)"
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                theme === 'high-contrast'
                  ? 'bg-yellow-400 text-black shadow-xs font-black'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-black/10 dark:hover:bg-white/10'
              }`}
            >
              <Eye className="w-3 h-3 text-yellow-500" />
              <span className="hidden sm:inline">Contrast</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
