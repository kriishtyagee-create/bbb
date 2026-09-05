import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AccessibilityBar } from '../../components/common/AccessibilityBar';
import { DemoSwitcher } from '../../components/common/DemoSwitcher';
import { Lock, Mail, GraduationCap, Building2, BookOpen, Shield, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

export const Login = () => {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      navigate(`/${loggedUser.role}/dashboard`);
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role) => {
    try {
      const loggedUser = await demoLogin(role);
      navigate(`/${loggedUser.role}/dashboard`);
    } catch (err) {
      setError('Demo login failed: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <AccessibilityBar />
      <DemoSwitcher />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-md w-full">
          {/* Brand header */}
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2 mb-2">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white font-bold text-2xl shadow-md border border-emerald-300/30">
                🌿
              </div>
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">AYUSH SkillBridge</span>
            </Link>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">Welcome Back</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Sign in to your unified academia-industry portal</p>
          </div>

          {/* Quick 1-Click Demo Login Box */}
          <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 p-4 sm:p-5 rounded-3xl text-white mb-6 shadow-xl border border-emerald-500/30">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-400 mb-3">
              <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} /> 1-Click SIH Presentation Logins
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
              <button
                type="button"
                onClick={() => handleDemo('student')}
                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center gap-2 transition-all hover:scale-105"
              >
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span>Student (Rahul)</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemo('industry')}
                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center gap-2 transition-all hover:scale-105"
              >
                <Building2 className="w-4 h-4 text-indigo-400" />
                <span>Industry (AyuTech)</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemo('academician')}
                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center gap-2 transition-all hover:scale-105"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Faculty (Dr. Priya)</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemo('admin')}
                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center gap-2 transition-all hover:scale-105"
              >
                <Shield className="w-4 h-4 text-rose-400" />
                <span>Admin Portal</span>
              </button>
            </div>
          </div>

          {/* Regular Login Form */}
          <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/15 shadow-xl">
            {error && (
              <div className="mb-5 p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 rounded-2xl text-xs sm:text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Official / Student Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. rahul.sharma@aiia.gov.in"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/15 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/15 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Sign In to Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-white/10 text-center text-xs text-slate-500 dark:text-slate-400">
              New to AYUSH SkillBridge?{' '}
              <Link to="/register" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
