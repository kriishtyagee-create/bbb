import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Sparkles,
  Compass,
  Briefcase,
  Layers,
  FileText,
  UserCheck,
  Send,
  BarChart3,
  BookOpen,
  Users,
  Shield,
  Search,
  Bell,
  CheckSquare,
  GraduationCap
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  if (!user) return null;

  const getLinks = () => {
    switch (user.role) {
      case 'student':
        return [
          { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/student/skills', icon: Sparkles, label: 'My Skills & Rating' },
          { to: '/student/skill-gap', icon: Compass, label: 'Skill Gap Analysis', badge: 'AI Gap' },
          { to: '/student/internships', icon: Layers, label: 'Internships' },
          { to: '/student/jobs', icon: Briefcase, label: 'Placements & Jobs' },
          { to: '/student/applications', icon: CheckSquare, label: 'Application Tracker' },
          { to: '/student/resume', icon: FileText, label: 'Interactive Resume' },
          { to: '/student/notifications', icon: Bell, label: 'Notifications' },
        ];
      case 'industry':
        return [
          { to: '/industry/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/industry/post-opportunity', icon: Send, label: 'Post Opportunity', badge: 'New' },
          { to: '/industry/candidates', icon: Search, label: 'Candidate Search', badge: 'AI Match' },
          { to: '/industry/applications', icon: Users, label: 'Applications Pipeline' },
          { to: '/industry/collaborations', icon: GraduationCap, label: 'Academia Collaboration' },
        ];
      case 'academician':
        return [
          { to: '/academician/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/academician/students', icon: Users, label: 'Student Cohort' },
          { to: '/academician/skill-analytics', icon: BarChart3, label: 'Skill Analytics', badge: 'Live' },
          { to: '/academician/industry-demand', icon: Compass, label: 'Industry Demand Trends' },
          { to: '/academician/curriculum-insights', icon: BookOpen, label: 'Curriculum Insights', badge: 'AI Advisor' },
          { to: '/academician/collaborations', icon: UserCheck, label: 'Industry Collaborations' },
        ];
      case 'admin':
        return [
          { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard Overview' },
          { to: '/admin/users', icon: Users, label: 'User Management' },
          { to: '/admin/skills', icon: Sparkles, label: 'Skill Repository' },
          { to: '/admin/opportunities', icon: Briefcase, label: 'Opportunity Audits' },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 z-40 lg:hidden backdrop-blur-md transition-opacity"
        />
      )}

      {/* Adaptive Frosted Glass Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-[96px] left-0 z-40 h-screen lg:h-[calc(100vh-96px)] w-64 sm:w-72 bg-white/90 dark:bg-slate-950/85 backdrop-blur-2xl text-slate-800 dark:text-slate-100 flex flex-col transition-all duration-200 ease-in-out border-r border-slate-200/80 dark:border-white/10 shadow-xl dark:shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Navigation list */}
        <div className="p-4 space-y-1.5 flex-1 overflow-y-auto">
          <div className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 px-3 py-1 mb-2 flex items-center justify-between">
            <span>{user.role} Portal</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>

          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all min-h-[44px] ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-[0_4px_20px_rgba(16,185,129,0.35)] border border-emerald-400/40 translate-x-1'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white border border-transparent'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <span className="truncate">{link.label}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 font-extrabold shadow-2xs">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Footer info box with glowing badge */}
        <div className="p-4 border-t border-slate-200/80 dark:border-white/10 text-xs bg-slate-50/80 dark:bg-white/5 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse"></div>
            <span className="font-extrabold text-slate-800 dark:text-slate-200">AYUSH Portal Online</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
            National Smart Automation & Skill Mapping Platform
          </p>
        </div>
      </aside>
    </>
  );
};
