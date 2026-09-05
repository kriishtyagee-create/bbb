import React, { useState, useEffect } from 'react';
import { academicianAPI } from '../../services/api';
import { Link } from 'react-router-dom';
import {
  Compass,
  TrendingUp,
  Flame,
  Building,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const IndustryDemand = () => {
  const [demandData, setDemandData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await academicianAPI.getIndustryDemand();
        setDemandData(res.top_demanded_skills || []);
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

  const maxDemand = Math.max(1, ...demandData.map((d) => d.industry_demand_count || 1));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            Live Industry Skill Demand Repertoire
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time market ranking of competencies requested in active employer requisitions.
          </p>
        </div>

        <Link
          to="/academician/curriculum-insights"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Curriculum Action Plan →</span>
        </Link>
      </div>

      {/* Demand Bar Ranking List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Skill Requisition Frequency
          </span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Requisition Intensity
          </span>
        </div>

        <div className="space-y-4">
          {demandData.map((item, idx) => {
            const percentage = Math.round((item.industry_demand_count / maxDemand) * 100);

            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-slate-400 font-bold text-[11px]">#{idx + 1}</span>
                    <span className="font-bold text-slate-900">{item.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                      {item.category}
                    </span>
                    {item.is_ayush && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                        🌿 AYUSH
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-indigo-700">
                      {item.industry_demand_count} Openings
                    </span>
                    <span className="text-slate-400">({percentage}%)</span>
                  </div>
                </div>

                {/* Visual Progress Bar */}
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full rounded-full transition-all ${
                      idx < 3
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600'
                        : idx < 6
                        ? 'bg-gradient-to-r from-indigo-500 to-blue-600'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
