import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { industryAPI } from '../../services/api';
import { MatchScoreBadge } from '../../components/common/MatchScoreBadge';
import {
  Building2,
  Briefcase,
  Layers,
  Users,
  Calendar,
  Award,
  Plus,
  Search,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const IndustryDashboard = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await industryAPI.getDashboard();
        setMetrics(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const companyName = metrics?.company_name || 'AyuHealth Technologies';

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 rounded-2xl p-6 sm:p-8 text-white shadow-lg border border-indigo-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            Enterprise Partner Hub • {metrics?.sector || 'AYUSH & Healthcare'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {companyName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Streamlined student talent pipeline with automated skill-match scoring and seamless academic institution collaboration.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/industry/post-opportunity"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Post Opportunity</span>
          </Link>
          <Link
            to="/industry/candidates"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            <span>Search Candidates</span>
          </Link>
        </div>
      </div>

      {/* 6 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Active Postings</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {metrics?.active_postings_count || 0}
          </div>
          <div className="text-[10px] text-indigo-600 font-semibold mt-0.5">Live on portal</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Total Applicants</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {metrics?.total_applications_count || 0}
          </div>
          <div className="text-[10px] text-slate-400 font-semibold mt-0.5">Across all roles</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Shortlisted</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">
            {metrics?.shortlisted_count || 0}
          </div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">High skill match</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Interviews</div>
          <div className="text-2xl font-extrabold text-indigo-600 mt-1">
            {metrics?.interviews_scheduled_count || 0}
          </div>
          <div className="text-[10px] text-indigo-700 font-semibold mt-0.5">Scheduled calls</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Hired / Selected</div>
          <div className="text-2xl font-extrabold text-teal-600 mt-1">
            {metrics?.hired_count || 0}
          </div>
          <div className="text-[10px] text-teal-700 font-semibold mt-0.5">Offers released</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase">AI Match Rate</div>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">94%</div>
          <div className="text-[10px] text-amber-700 font-semibold mt-0.5">Filter accuracy</div>
        </div>
      </div>

      {/* Recent Applications Pipeline Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Candidate Applications</h3>
            <p className="text-xs text-slate-500">Ranked by automated skill match score</p>
          </div>
          <Link
            to="/industry/applications"
            className="text-xs font-bold text-indigo-700 hover:underline flex items-center gap-1"
          >
            Manage Pipeline <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="p-3 rounded-l-lg">Candidate</th>
                <th className="p-3">Applied Position</th>
                <th className="p-3">College & Branch</th>
                <th className="p-3">Match %</th>
                <th className="p-3">Status</th>
                <th className="p-3 rounded-r-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {metrics?.recent_applications?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-400">
                    No applications received yet.
                  </td>
                </tr>
              ) : (
                metrics?.recent_applications?.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-bold text-slate-900">
                      {app.student?.name || 'Candidate'}
                      <div className="text-[11px] text-slate-400 font-normal">
                        CGPA: {app.student?.cgpa || 8.0}
                      </div>
                    </td>
                    <td className="p-3 font-semibold text-slate-700">
                      {app.opportunity?.title}
                    </td>
                    <td className="p-3 text-slate-600">
                      {app.student?.college}
                      <div className="text-[10px] text-slate-400">{app.student?.branch}</div>
                    </td>
                    <td className="p-3">
                      <MatchScoreBadge score={app.match_score} breakdown={app.match_breakdown} />
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          app.status === 'interview'
                            ? 'bg-indigo-100 text-indigo-800'
                            : app.status === 'shortlisted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'selected'
                            ? 'bg-teal-100 text-teal-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        to="/industry/applications"
                        className="px-3 py-1 bg-slate-100 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-bold text-slate-700 transition-colors inline-block"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
