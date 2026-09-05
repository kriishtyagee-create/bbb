import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import {
  ShieldCheck,
  Users,
  Building2,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Award,
  Layers,
  BarChart3
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats().then((res) => {
      setStats(res);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const COLORS = ['#059669', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg border border-rose-900/30">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold mb-3 border border-rose-500/30">
          <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
          Ministry of Ayush & AIIA Portal Governance
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          National Administrator Overview & Metrics
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
          Real-time oversight of skill mapping datasets, university onboarding, enterprise job requisitions, and placement conversion pipelines.
        </p>
      </div>

      {/* 6 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Students</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{stats?.total_students}</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Active candidates</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Companies</div>
          <div className="text-2xl font-extrabold text-indigo-700 mt-1">{stats?.total_industries}</div>
          <div className="text-[10px] text-indigo-600 font-semibold mt-0.5">Verified partners</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Faculty / Deans</div>
          <div className="text-2xl font-extrabold text-amber-700 mt-1">{stats?.total_academicians}</div>
          <div className="text-[10px] text-amber-600 font-semibold mt-0.5">Institutes linked</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Openings</div>
          <div className="text-2xl font-extrabold text-teal-700 mt-1">{stats?.total_opportunities}</div>
          <div className="text-[10px] text-teal-600 font-semibold mt-0.5">Internships + Jobs</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Total Apps</div>
          <div className="text-2xl font-extrabold text-blue-700 mt-1">{stats?.total_applications}</div>
          <div className="text-[10px] text-blue-600 font-semibold mt-0.5">Matched & Routed</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Placements</div>
          <div className="text-2xl font-extrabold text-rose-600 mt-1">{stats?.placed_students}</div>
          <div className="text-[10px] text-rose-700 font-semibold mt-0.5">
            {stats?.placement_success_rate}% Success
          </div>
        </div>
      </div>

      {/* Analytics Visualizations: Funnel & Sector Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funnel chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            National Application to Placement Conversion Funnel
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Progression from initial skill-matched application to verified offer rollout.
          </p>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats?.application_funnel || []}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
              >
                <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis dataKey="stage" type="category" tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#e11d48" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            Participating Industry Sector Distribution
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Categorization across AYUSH Healthcare, Pharma Biotech, IT & Clinical AI.
          </p>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.industry_sector_breakdown || []}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  label
                >
                  {stats?.industry_sector_breakdown?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
