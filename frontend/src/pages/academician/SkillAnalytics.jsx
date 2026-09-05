import React, { useState, useEffect } from 'react';
import { academicianAPI } from '../../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Sparkles,
  AlertCircle,
  Users,
  CheckCircle2,
  Flame,
  Award
} from 'lucide-react';

export const SkillAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await academicianAPI.getSkillAnalytics();
        setAnalytics(res);
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

  const COLORS = ['#059669', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6'];

  const studentSkillsData = analytics?.top_student_skills?.map((s) => ({
    name: s.name.length > 14 ? s.name.slice(0, 12) + '...' : s.name,
    fullName: s.name,
    students: s.student_count,
    proficiency: s.average_proficiency,
  })) || [];

  const gapSkillsData = analytics?.highest_skill_gaps?.map((s) => ({
    name: s.name.length > 14 ? s.name.slice(0, 12) + '...' : s.name,
    fullName: s.name,
    industryDemand: s.industry_demand_count,
    studentsEquipped: s.student_count,
    gapIndex: s.gap_index,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-amber-600" />
          Student Cohort Skill Distribution & Gap Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Real-time aggregated analysis across {analytics?.total_students_analyzed} students and {analytics?.total_active_postings_analyzed} industry job requisitions.
        </p>
      </div>

      {/* 2 Big Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Cohort Skill Strengths */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Top Acquired Skills in Batch
            </h3>
            <span className="text-xs text-slate-400">Headcount</span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Most prevalent competencies currently possessed by registered students.
          </p>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentSkillsData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} angle={-25} textAnchor="end" />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar name="Students with Skill" dataKey="students" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Highest Skill Gaps (High Demand vs Low Student Supply) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-600" /> High-Risk Curriculum Gaps
            </h3>
            <span className="text-xs text-rose-600 font-bold">Urgent Action</span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Skills with high industry requisition frequency but low student proficiency.
          </p>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gapSkillsData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} angle={-25} textAnchor="end" />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar name="Industry Job Requisitions" dataKey="industryDemand" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar name="Students Proficient" dataKey="studentsEquipped" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Cohort Skills Diagnostic Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 mb-1">
          Detailed Skill Competency & Industry Repertoire Table
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Holistic matrix across Technical, Data Science, and Ministry of Ayush specialized competencies.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="p-3 rounded-l-lg">Skill Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Student Headcount</th>
                <th className="p-3">Avg Proficiency</th>
                <th className="p-3">Industry Requisitions</th>
                <th className="p-3">Gap Severity</th>
                <th className="p-3 rounded-r-lg">Specialization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {analytics?.top_demanded_skills?.map((sk, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-bold text-slate-900">{sk.name}</td>
                  <td className="p-3 text-slate-600">{sk.category}</td>
                  <td className="p-3 font-semibold text-slate-800">{sk.student_count} students</td>
                  <td className="p-3 text-amber-600 font-bold">★ {sk.average_proficiency}/5</td>
                  <td className="p-3 font-bold text-indigo-700">{sk.industry_demand_count} jobs</td>
                  <td className="p-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        sk.gap_index > 40
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : sk.gap_index > 20
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {sk.gap_index > 40 ? 'High Gap' : sk.gap_index > 20 ? 'Moderate' : 'Balanced'}
                    </span>
                  </td>
                  <td className="p-3">
                    {sk.is_ayush ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                        🌿 AYUSH / AIIA
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">General</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
