import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { AccessibilityBar } from '../components/common/AccessibilityBar';
import { DemoSwitcher } from '../components/common/DemoSwitcher';
import {
  GraduationCap,
  Building2,
  BookOpen,
  ArrowRight,
  Sparkles,
  Compass,
  CheckCircle2,
  Sun,
  Moon
} from 'lucide-react';

export const LandingPage = () => {
  const { user, demoLogin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Interactive Live Skill Gap Simulator on Landing Page
  const [selectedRole, setSelectedRole] = useState('Data Analyst');
  const rolePresets = {
    'Data Analyst': {
      domain: 'Digital Health & Informatics',
      required: ['Python', 'SQL', 'Power BI', 'Pandas & NumPy', 'Git'],
      matched: ['Python', 'SQL', 'Pandas & NumPy'],
      missing: ['Power BI', 'Git'],
      score: 75,
      demand: 'Very High',
      salary: '₹7 - 12 LPA',
      roadmapTime: '3 Weeks',
      recommendedCourse: 'Applied Data Visualization on Swayam'
    },
    'Ayurvedic Clinical Researcher': {
      domain: 'Ayush Clinical Trials & GCP',
      required: ['Clinical Research & GCP', 'Ayurvedic Pharmacology', 'Biostatistics', 'Medical Data Analytics'],
      matched: ['Ayurvedic Pharmacology', 'Clinical Research & GCP'],
      missing: ['Biostatistics', 'Medical Data Analytics'],
      score: 68,
      demand: 'High Demand',
      salary: '₹8 - 14 LPA',
      roadmapTime: '4 Weeks',
      recommendedCourse: 'Biostatistics in Clinical Trials by AIIA'
    },
    'Full Stack AI Developer': {
      domain: 'Smart Automation & AI',
      required: ['Python', 'React.js', 'REST APIs', 'Machine Learning', 'Docker'],
      matched: ['React.js', 'Python', 'REST APIs'],
      missing: ['Machine Learning', 'Docker'],
      score: 72,
      demand: 'Exceptional',
      salary: '₹10 - 18 LPA',
      roadmapTime: '4 Weeks',
      recommendedCourse: 'Hands-on ML & Containerization (NPTEL)'
    },
    'Herbal Formulation Scientist': {
      domain: 'Ayurvedic Drug R&D',
      required: ['Pharmacognosy', 'Standardization & HPLC', 'GMP Compliance', 'Phytochemistry'],
      matched: ['Pharmacognosy', 'Phytochemistry'],
      missing: ['Standardization & HPLC', 'GMP Compliance'],
      score: 65,
      demand: 'Rapidly Growing',
      salary: '₹6.5 - 11 LPA',
      roadmapTime: '3 Weeks',
      recommendedCourse: 'Modern Phytomedicine Standardization'
    }
  };

  const currentPreset = rolePresets[selectedRole];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col relative overflow-x-hidden font-sans transition-colors duration-200">
      {/* 🌟 Ambient Background Glowing Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-emerald-500/15 to-teal-600/10 dark:from-emerald-500/25 dark:to-teal-600/20 blur-[130px] animate-pulse-slow"></div>
        <div className="absolute top-[35%] right-[-10%] w-[750px] h-[750px] rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-600/10 dark:from-indigo-500/20 dark:to-purple-600/15 blur-[150px] animate-pulse-slow" style={{ animationDelay: '2.5s' }}></div>
        <div className="absolute bottom-[-10%] left-[25%] w-[650px] h-[650px] rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-600/10 dark:from-cyan-500/20 dark:to-blue-600/20 blur-[140px] animate-pulse-slow" style={{ animationDelay: '5s' }}></div>
      </div>

      {/* 1. Official Government Accessibility & Font Scaler Bar */}
      <div className="relative z-50">
        <AccessibilityBar />
      </div>

      {/* 2. SIH 2024 Jury Quick Switcher */}
      <div className="relative z-40">
        <DemoSwitcher />
      </div>

      {/* 3. Main Glass Navbar */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-950/85 backdrop-blur-2xl border-b border-slate-200/80 dark:border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 flex items-center justify-center text-white font-extrabold shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-emerald-300/40 shrink-0">
              <span className="text-2xl">🌿</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  AYUSH SkillBridge
                </span>
                <span className="bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                  SIH PS 26044
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Ministry of Ayush • All India Institute of Ayurveda
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick theme button */}
            <button
              onClick={() => toggleTheme()}
              aria-label="Toggle theme"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 transition-colors"
              title={`Switch Theme (Current: ${theme})`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-600" />}
            </button>

            {user ? (
              <Link
                to={`/${user.role}/dashboard`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all hover:scale-105"
              >
                <span>Dashboard Hub</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all hover:scale-105"
                >
                  Register Free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 4. Hero Section - Multi-Generational Appeal */}
      <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-6 shadow-xs backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              National Smart Automation & Industry Skill Mapping Platform
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Bridging{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-300">
                Academia
              </span>{' '}
              and{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 dark:from-indigo-300 dark:via-blue-300 dark:to-purple-300">
                Industry
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              An intelligent, transparent ecosystem connecting <strong>students</strong>, <strong>employers</strong>, and <strong>academic institutions</strong>. Pinpoint skill gaps, discover high-fit opportunities, and align curriculum with real-time national demand.
            </p>

            {/* 3 Call to Action Persona Buttons */}
            <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
              <button
                onClick={() => demoLogin('student').then(() => navigate('/student/dashboard'))}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Launch Student Demo</span>
              </button>

              <button
                onClick={() => demoLogin('industry').then(() => navigate('/industry/dashboard'))}
                className="px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-white border border-slate-300 dark:border-white/20 font-extrabold text-xs sm:text-sm shadow-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
              >
                <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Launch Industry Demo</span>
              </button>

              <button
                onClick={() => demoLogin('academician').then(() => navigate('/academician/dashboard'))}
                className="px-6 py-3.5 rounded-2xl bg-amber-500/15 dark:bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-400/40 font-extrabold text-xs sm:text-sm shadow-sm hover:bg-amber-500/25 transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
              >
                <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Launch Faculty Demo</span>
              </button>
            </div>

            {/* Quick Metrics Badges */}
            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-slate-200/80 dark:border-white/10 text-left">
              <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-xs hover:border-emerald-500/40 transition-all">
                <div className="text-emerald-600 dark:text-emerald-400 font-black text-2xl sm:text-3xl">35+ Skills</div>
                <div className="text-slate-500 dark:text-slate-400 text-xs mt-1 font-semibold">Tech & AYUSH Domain</div>
              </div>
              <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-xs hover:border-teal-500/40 transition-all">
                <div className="text-teal-600 dark:text-teal-400 font-black text-2xl sm:text-3xl">92% Match</div>
                <div className="text-slate-500 dark:text-slate-400 text-xs mt-1 font-semibold">Explainable AI Formula</div>
              </div>
              <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-xs hover:border-indigo-500/40 transition-all">
                <div className="text-indigo-600 dark:text-indigo-400 font-black text-2xl sm:text-3xl">10+ Partners</div>
                <div className="text-slate-500 dark:text-slate-400 text-xs mt-1 font-semibold">Top Research & Pharma</div>
              </div>
              <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-xs hover:border-amber-500/40 transition-all">
                <div className="text-amber-600 dark:text-amber-400 font-black text-2xl sm:text-3xl">Zero Cost</div>
                <div className="text-slate-500 dark:text-slate-400 text-xs mt-1 font-semibold">Open National Portal</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Interactive Skill-Gap Simulator with Clear Multi-generational UX */}
      <section className="py-16 relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2">
              <Compass className="w-3.5 h-3.5" /> LIVE GAP SIMULATOR
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
              Interactive Skill Gap & Matching Engine
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5">
              Select a target career role to see how our engine automatically benchmarks student competencies against live industry requirements.
            </p>
          </div>

          <div className="bg-white/90 dark:bg-slate-900/75 backdrop-blur-2xl rounded-3xl border border-slate-200/80 dark:border-white/15 p-6 sm:p-8 shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all">
            {/* Role selector tabs */}
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-8">
              {Object.keys(rolePresets).map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRole(r)}
                  className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all min-h-[44px] ${
                    selectedRole === r
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md border border-emerald-400/50 scale-105'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-300/80 dark:border-white/10'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Target Requirements */}
              <div className="bg-slate-50/90 dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                    Industry Competency Repertoire
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">{selectedRole}</h4>
                  <div className="text-xs text-emerald-700 dark:text-emerald-400 font-bold mt-1">
                    Demand: {currentPreset.demand} • Package: {currentPreset.salary}
                  </div>
                  <div className="mt-5 space-y-2">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Skills Required:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {currentPreset.required.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-white dark:bg-white/10 text-slate-800 dark:text-slate-200 rounded-lg font-bold text-xs border border-slate-300/80 dark:border-white/10 shadow-2xs"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10 text-[11px] text-slate-500 dark:text-slate-400">
                  Domain: <strong>{currentPreset.domain}</strong>
                </div>
              </div>

              {/* Card 2: Candidate Status & Match Score */}
              <div className="bg-slate-50/90 dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                    Explainable Candidate Fit
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div className="text-4xl sm:text-5xl font-black text-emerald-600 dark:text-emerald-400">
                      {currentPreset.score}%
                    </div>
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/40">
                      Eligible for Interview
                    </span>
                  </div>

                  <div className="mt-5 space-y-3.5">
                    <div>
                      <div className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 mb-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Matched Skills ({currentPreset.matched.length})
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {currentPreset.matched.map((s, i) => (
                          <span key={i} className="px-2.5 py-1 bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 rounded-md font-bold text-xs border border-emerald-500/30">
                            ✓ {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-extrabold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 mb-1.5">
                        <Compass className="w-4 h-4" /> Skill Gaps Identified ({currentPreset.missing.length})
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {currentPreset.missing.map((s, i) => (
                          <span key={i} className="px-2.5 py-1 bg-amber-500/15 text-amber-800 dark:text-amber-300 rounded-md font-bold text-xs border border-amber-500/30">
                            ⚠️ {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Actionable Roadmap */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-100/60 dark:from-emerald-950/60 dark:to-teal-950/80 p-6 rounded-2xl border border-emerald-400/40 dark:border-emerald-500/30 shadow-md flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-widest mb-2">
                    Actionable Learning Roadmap
                  </div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white mb-2">
                    Bridge the Gap in {currentPreset.roadmapTime}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    Completing the accredited module <strong>{currentPreset.recommendedCourse}</strong> will boost your candidate fit from {currentPreset.score}% to 95%.
                  </p>
                </div>

                <button
                  onClick={() => demoLogin('student').then(() => navigate('/student/skill-gap'))}
                  className="mt-6 w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs sm:text-sm font-extrabold shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Explore Full Skill Radar & Course Path</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Generational Pillars: Built for Students, Employers, and Academicians */}
      <section className="py-16 relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
              Empowering Every Age Group & Stakeholder
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
              A unified national ecosystem designed specifically to eliminate mismatched expectations, empower youth, and foster high-trust institutional partnerships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Student Pillar (Youth, 17-25) */}
            <div className="bg-white/90 dark:bg-slate-900/70 backdrop-blur-2xl rounded-3xl p-8 border border-slate-200/80 dark:border-white/15 shadow-lg hover:border-emerald-500/50 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-bold text-xl mb-6 shadow-xs group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <div className="text-[11px] font-black uppercase text-emerald-700 dark:text-emerald-400 tracking-wider mb-1">For Students & Graduates</div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">Accelerate Your Career</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                  "No more guessing what skills employers want. See your exact readiness score and land verified internships."
                </p>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    Interactive Skill Gap Radar Visualizer
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    Swayam & NPTEL Micro-Course Roadmaps
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    Live Application Tracking & Interview Alerts
                  </li>
                </ul>
              </div>
              <button
                onClick={() => demoLogin('student').then(() => navigate('/student/dashboard'))}
                className="mt-8 w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all"
              >
                Explore Student Portal
              </button>
            </div>

            {/* Industry Pillar (Recruiters & Professionals, 25-45) */}
            <div className="bg-white/90 dark:bg-slate-900/70 backdrop-blur-2xl rounded-3xl p-8 border border-slate-200/80 dark:border-white/15 shadow-lg hover:border-indigo-500/50 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold text-xl mb-6 shadow-xs group-hover:scale-110 transition-transform">
                  <Building2 className="w-7 h-7" />
                </div>
                <div className="text-[11px] font-black uppercase text-indigo-700 dark:text-indigo-400 tracking-wider mb-1">For Industry & Recruiters</div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">Hire Pre-Vetted Talent</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                  "Filter hundreds of applicants in seconds with multi-factor explainable AI match scores and branch validation."
                </p>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    Multi-Factor Candidate Match Scoring (50% Skills)
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    Deep Candidate Search with multi-skill filters
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    Establish MoUs & Campus Placement Drives
                  </li>
                </ul>
              </div>
              <button
                onClick={() => demoLogin('industry').then(() => navigate('/industry/dashboard'))}
                className="mt-8 w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all"
              >
                Explore Industry Portal
              </button>
            </div>

            {/* Academician Pillar (Senior Faculty, Deans & Policy, 45-70+) */}
            <div className="bg-white/90 dark:bg-slate-900/70 backdrop-blur-2xl rounded-3xl p-8 border border-slate-200/80 dark:border-white/15 shadow-lg hover:border-amber-500/50 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold text-xl mb-6 shadow-xs group-hover:scale-110 transition-transform">
                  <BookOpen className="w-7 h-7" />
                </div>
                <div className="text-[11px] font-black uppercase text-amber-700 dark:text-amber-400 tracking-wider mb-1">For Deans & Faculty</div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">Upgrade Curriculum</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                  "Get automated syllabus upgrade recommendations based on actual hiring demand and track cohort skill mastery."
                </p>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    Real-time cohort skill distribution analytics
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    AI-generated curriculum upgrade recommendations
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    Formal institutional MoUs & Collaboration Tracking
                  </li>
                </ul>
              </div>
              <button
                onClick={() => demoLogin('academician').then(() => navigate('/academician/dashboard'))}
                className="mt-8 w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all"
              >
                Explore Faculty Portal
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Official Accreditation & Trust Seals */}
      <section className="py-12 relative z-10 border-t border-slate-200/80 dark:border-white/10 bg-slate-100/60 dark:bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6">
            Aligned with National Frameworks & Government Digital Initiatives
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-12 opacity-80 dark:opacity-90">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-slate-700 dark:text-slate-300">
              <span className="text-lg">🏛️</span> Ministry of Ayush
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-slate-700 dark:text-slate-300">
              <span className="text-lg">🌿</span> All India Institute of Ayurveda (AIIA)
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-slate-700 dark:text-slate-300">
              <span className="text-lg">🏆</span> Smart India Hackathon 2024
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-slate-700 dark:text-slate-300">
              <span className="text-lg">📜</span> NSQF Compliant
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-slate-700 dark:text-slate-300">
              <span className="text-lg">🇮🇳</span> Skill India Digital
            </div>
          </div>
        </div>
      </section>

      {/* 8. Frosted Glass Dignified Footer */}
      <footer className="relative z-10 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 pt-12 pb-8 border-t border-slate-200/80 dark:border-white/10 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-200/80 dark:border-white/10 text-xs sm:text-sm">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-base sm:text-lg mb-3">
                <span className="text-xl">🌿</span> AYUSH SkillBridge National Portal
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-md text-xs sm:text-sm">
                Smart India Hackathon (SIH) Solution for Problem Statement ID 26044. Built for the Ministry of Ayush and All India Institute of Ayurveda under the theme Smart Automation.
              </p>
              <div className="mt-4 text-xs text-emerald-700 dark:text-emerald-400 font-bold">
                यतो धर्मस्ततो जयः • सत्यमेव जयते
              </div>
            </div>

            <div>
              <div className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-3 text-xs">Portals & Hubs</div>
              <ul className="space-y-2">
                <li><Link to="/student/dashboard" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Student Career Hub</Link></li>
                <li><Link to="/industry/dashboard" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Industry Partner Hub</Link></li>
                <li><Link to="/academician/dashboard" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Faculty & Deans Hub</Link></li>
                <li><Link to="/admin/dashboard" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">National Administration</Link></li>
              </ul>
            </div>

            <div>
              <div className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-3 text-xs">Government Links</div>
              <ul className="space-y-2 text-slate-500 dark:text-slate-400">
                <li>Ministry of Ayush (ayush.gov.in)</li>
                <li>All India Institute of Ayurveda (aiia.gov.in)</li>
                <li>Swayam & NPTEL Portals</li>
                <li>National Skill Development Corp (NSDC)</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
            <div>
              © 2024 Ministry of Ayush & AIIA • Government of India. All rights reserved.
            </div>
            <div className="flex gap-4">
              <span>Universal Accessibility Compliant (WCAG 2.1 AAA)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
