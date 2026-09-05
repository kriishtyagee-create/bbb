import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Menu, 
  X, 
  LogOut, 
  User, 
  CheckCheck, 
  ExternalLink,
  ChevronDown,
  Building,
  GraduationCap,
  Shield,
  Briefcase,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import { notificationsAPI } from '../../services/api';

export const Header = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, logout, notifications, unreadCount, refreshNotifications } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const handleMarkAllRead = async () => {
    try {
      await notificationsAPI.markAllRead();
      await refreshNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  const getRoleBadge = () => {
    switch (user?.role) {
      case 'student':
        return (
          <span className="bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 text-[11px] px-2.5 py-0.5 rounded-full font-bold border border-emerald-500/30 flex items-center gap-1">
            <GraduationCap className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Student
          </span>
        );
      case 'industry':
        return (
          <span className="bg-indigo-500/15 text-indigo-800 dark:text-indigo-300 text-[11px] px-2.5 py-0.5 rounded-full font-bold border border-indigo-500/30 flex items-center gap-1">
            <Building className="w-3 h-3 text-indigo-600 dark:text-indigo-400" /> Industry
          </span>
        );
      case 'academician':
        return (
          <span className="bg-amber-500/15 text-amber-800 dark:text-amber-300 text-[11px] px-2.5 py-0.5 rounded-full font-bold border border-amber-500/30 flex items-center gap-1">
            <Briefcase className="w-3 h-3 text-amber-600 dark:text-amber-400" /> Faculty
          </span>
        );
      case 'admin':
        return (
          <span className="bg-rose-500/15 text-rose-800 dark:text-rose-300 text-[11px] px-2.5 py-0.5 rounded-full font-bold border border-rose-500/30 flex items-center gap-1">
            <Shield className="w-3 h-3 text-rose-600 dark:text-rose-400" /> Admin
          </span>
        );
      default:
        return null;
    }
  };

  const getProfileName = () => {
    if (!user) return 'Guest';
    if (user.role === 'student' && user.profile?.name) return user.profile.name;
    if (user.role === 'industry' && user.profile?.company_name) return user.profile.company_name;
    if (user.role === 'academician' && user.profile?.name) return user.profile.name;
    if (user.role === 'admin') return 'National Portal Admin';
    return user.email.split('@')[0];
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-950/85 backdrop-blur-2xl border-b border-slate-200/80 dark:border-white/10 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)] transition-colors duration-200">
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 backdrop-blur-md transition-colors lg:hidden border border-slate-200/80 dark:border-white/10"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 flex items-center justify-center text-white font-bold shadow-[0_4px_16px_rgba(16,185,129,0.35)] group-hover:scale-105 transition-all border border-emerald-300/40">
              <span className="text-xl">🌿</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  AYUSH SkillBridge
                </span>
                <span className="hidden sm:inline bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  SIH 26044
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight mt-0.5">
                Ministry of Ayush • All India Institute of Ayurveda
              </p>
            </div>
          </Link>
        </div>

        {/* Right: Notifications, Quick Theme Toggle & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick theme button */}
          <button
            onClick={() => toggleTheme()}
            aria-label="Toggle Light/Dark theme"
            className="p-2 sm:p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 transition-all"
            title={`Current: ${theme} (Click to switch)`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-emerald-600" />
            )}
          </button>

          {user ? (
            <>
              {/* Notification Popover */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifs(!showNotifs)}
                  className="relative p-2 sm:p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 hover:border-emerald-400/50 backdrop-blur-md transition-all"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-extrabold flex items-center justify-center shadow-xs animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifs && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-200/80 dark:border-white/15 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-slate-900 dark:text-slate-100">
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">Notifications</span>
                        <span className="text-xs bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded-full font-bold">
                          {notifications.length}
                        </span>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-bold"
                        >
                          <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-white/10">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center text-slate-400 text-xs">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-3.5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${
                              !n.is_read ? 'bg-emerald-50/60 dark:bg-emerald-500/10' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-xs font-bold leading-snug">
                                {n.title}
                              </h4>
                              <span className="text-[10px] text-slate-400 font-semibold whitespace-nowrap">
                                {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                              {n.message}
                            </p>
                            {n.action_url && (
                              <Link
                                to={n.action_url}
                                onClick={() => setShowNotifs(false)}
                                className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-2 hover:underline"
                              >
                                View Details <ExternalLink className="w-3 h-3" />
                              </Link>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 border border-slate-200/80 dark:border-white/15 hover:border-emerald-400 shadow-2xs backdrop-blur-md transition-all"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-white flex items-center justify-center font-extrabold text-xs uppercase shadow-xs">
                    {getProfileName().charAt(0)}
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[130px]">
                      {getProfileName()}
                    </div>
                    <div>{getRoleBadge()}</div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-200/80 dark:border-white/15 py-1.5 z-50 animate-in fade-in duration-100 text-slate-900 dark:text-slate-100">
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-white/10">
                      <p className="text-xs font-bold">{getProfileName()}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    </div>

                    <Link
                      to={`/${user.role}/dashboard`}
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 font-semibold"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      Dashboard Hub
                    </Link>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        logout();
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-bold border-t border-slate-100 dark:border-white/10"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-xl transition-colors border border-transparent hover:border-slate-200 dark:hover:border-white/10"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-xs font-extrabold text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 rounded-xl shadow-md shadow-emerald-700/25 transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
