import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Building2, GraduationCap, ShieldCheck, Sparkles } from 'lucide-react';

export const DemoSwitcher = () => {
  const { user, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleSwitch = async (role, defaultPath) => {
    try {
      await demoLogin(role);
      navigate(defaultPath);
    } catch (err) {
      console.error('Demo switch failed:', err);
    }
  };

  return (
    <div className="bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 text-slate-800 dark:text-white px-3 sm:px-6 py-2 text-xs sm:text-sm font-medium shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
            SIH 2026 JURY QUICK-SWITCH
          </span>
          <span className="hidden md:inline text-slate-500 dark:text-slate-400 text-xs font-semibold">
            PS 26044 | Ministry of Ayush & AIIA
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-500 dark:text-slate-400 text-xs hidden lg:inline mr-1 font-bold">Switch Persona:</span>
          
          <button
            onClick={() => handleSwitch('student', '/student/dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all text-xs font-bold ${
              user?.role === 'student'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md border border-emerald-400/50 scale-105'
                : 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-slate-300 border border-slate-300/80 dark:border-white/10'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Student (Rahul)</span>
          </button>

          <button
            onClick={() => handleSwitch('industry', '/industry/dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all text-xs font-bold ${
              user?.role === 'industry'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md border border-indigo-400/50 scale-105'
                : 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-slate-300 border border-slate-300/80 dark:border-white/10'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Industry (AyuHealth)</span>
          </button>

          <button
            onClick={() => handleSwitch('academician', '/academician/dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all text-xs font-bold ${
              user?.role === 'academician'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md border border-amber-400/50 scale-105'
                : 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-slate-300 border border-slate-300/80 dark:border-white/10'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Faculty (Dr. Priya)</span>
          </button>

          <button
            onClick={() => handleSwitch('admin', '/admin/dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all text-xs font-bold ${
              user?.role === 'admin'
                ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md border border-rose-400/50 scale-105'
                : 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-slate-300 border border-slate-300/80 dark:border-white/10'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
};
