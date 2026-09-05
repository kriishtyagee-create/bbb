import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { academicianAPI } from '../../services/api';
import {
  BookOpen,
  Users,
  GraduationCap,
  Sparkles,
  BarChart3,
  Compass,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Building,
  CheckCircle2
} from 'lucide-react';

export const AcademicianDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await academicianAPI.getDashboard();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const facultyName = data?.academician?.name || 'Dr. Priya Sharma';
  const institution = data?.academician?.institution || 'All India Institute of Ayurveda';

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-emerald-950 rounded-2xl p-6 sm:p-8 text-white shadow-lg border border-amber-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-500/30">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            Academic Dean & Curriculum Alignment Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {facultyName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            {institution} • {data?.academician?.department}
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/academician/curriculum-insights"
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md shadow-amber-600/25 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Curriculum Insights ({data?.skill_gap_alerts_count || 5} Gaps)</span>
          </Link>
          <Link
            to="/academician/skill-analytics"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all flex items-center gap-1.5"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Cohort Skill Analytics</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Students Cohort</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            {data?.total_students || 20} Enrolled
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">100% Skill Mapped</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Industry MoUs</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-indigo-700 mt-2">
            {data?.industry_connections || 10} Active
          </div>
          <div className="text-[11px] text-slate-500 font-semibold mt-1">
            {data?.pending_collaborations || 1} pending proposal
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Openings</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            {(data?.active_internships || 0) + (data?.active_jobs || 0)} Total
          </div>
          <div className="text-[11px] text-teal-700 font-semibold mt-1">
            {data?.active_internships} Internships • {data?.active_jobs} Placements
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Skill Gap Alerts</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-600 mt-2">
            {data?.skill_gap_alerts_count || 5} Urgent
          </div>
          <div className="text-[11px] text-amber-700 font-semibold mt-1">Action needed in Sem 5/6</div>
        </div>
      </div>

      {/* Curriculum Insight Alerts Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Automated Curriculum Recommendations
            </h3>
            <p className="text-xs text-slate-500">
              Generated by comparing current batch competencies with active enterprise hiring requisitions.
            </p>
          </div>
          <Link
            to="/academician/curriculum-insights"
            className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
          >
            Full Recommendations <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data?.top_curriculum_alerts?.map((item, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                    {item.priority}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">{item.category}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-1">{item.skill}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.reason}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-200/80">
                <Link
                  to="/academician/collaborations"
                  className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <span>Organize Workshop →</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
