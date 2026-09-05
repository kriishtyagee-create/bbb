import React, { useState } from 'react';
import { AccessibilityBar } from '../common/AccessibilityBar';
import { Header } from '../common/Header';
import { Sidebar } from '../common/Sidebar';
import { DemoSwitcher } from '../common/DemoSwitcher';

export const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col relative overflow-x-hidden font-sans transition-colors duration-200">
      {/* 🌟 Ambient Background Mesh Orbs for Glassmorphic Refraction */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top-left emerald orb */}
        <div className="absolute top-[-8%] left-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-emerald-500/15 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-600/15 blur-[120px] animate-pulse-slow"></div>
        {/* Right indigo orb */}
        <div className="absolute top-[28%] right-[-8%] w-[650px] h-[650px] rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/15 dark:to-purple-600/10 blur-[140px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        {/* Bottom cyan orb */}
        <div className="absolute bottom-[-8%] left-[18%] w-[550px] h-[550px] rounded-full bg-gradient-to-br from-cyan-500/10 to-teal-500/10 dark:from-cyan-500/15 dark:to-blue-600/15 blur-[130px] animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
        {/* Subtle amber accent orb */}
        <div className="absolute top-[55%] left-[5%] w-[420px] h-[420px] rounded-full bg-gradient-to-br from-amber-500/10 to-orange-500/10 dark:from-amber-500/10 dark:to-orange-500/10 blur-[110px]"></div>
      </div>

      {/* 1. National Portal Accessibility & Font Scaler Bar */}
      <div className="relative z-50">
        <AccessibilityBar />
      </div>

      {/* 2. SIH Jury Demo Persona Bar */}
      <div className="relative z-40">
        <DemoSwitcher />
      </div>

      {/* 3. Top Frosted Glass Portal Header */}
      <div className="relative z-30">
        <Header
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />
      </div>

      {/* 4. Main Body: Glass Sidebar + Dynamic Page Content */}
      <div className="flex-1 flex max-w-[1720px] w-full mx-auto relative z-10">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
