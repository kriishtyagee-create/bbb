import React, { useState } from 'react';
import { Sparkles, Info, X, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

export const MatchScoreBadge = ({ score = 85, breakdown = null, size = 'md', showBreakdownButton = true }) => {
  const [showModal, setShowModal] = useState(false);

  const getPillColor = (val) => {
    if (val >= 85) return 'bg-emerald-500/15 text-emerald-950 border-emerald-400/50 shadow-[0_0_12px_rgba(16,185,129,0.2)]';
    if (val >= 70) return 'bg-indigo-500/15 text-indigo-950 border-indigo-400/50 shadow-[0_0_12px_rgba(99,102,241,0.2)]';
    if (val >= 50) return 'bg-amber-500/15 text-amber-950 border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.2)]';
    return 'bg-rose-500/15 text-rose-950 border-rose-400/50 shadow-[0_0_12px_rgba(244,63,94,0.2)]';
  };

  return (
    <>
      <div className="inline-flex items-center gap-1.5">
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-extrabold text-xs border backdrop-blur-md transition-all ${getPillColor(
            score
          )}`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          <span>{score}% Match</span>
        </div>

        {showBreakdownButton && breakdown && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
            title="View Match Breakdown"
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white/80 backdrop-blur-md transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Match Explainability Modal with Glass Backdrop */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] max-w-md w-full border border-white/80 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-950 p-5 text-white flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-sm">Smart Match Explainability</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-slate-900">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/70 border border-slate-200/80 shadow-2xs backdrop-blur-md">
                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Calculated Fit Score</div>
                  <div className="text-3xl font-black text-slate-900 mt-0.5">{score}%</div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-900 border border-emerald-400/40 shadow-2xs">
                    High Fit
                  </span>
                </div>
              </div>

              {/* Factors Breakdown */}
              <div className="space-y-3">
                <div className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  Weighted Factor Scores
                </div>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <div className="flex justify-between font-bold text-slate-700 mb-1">
                      <span>Skill Match (50% Weight)</span>
                      <span className="text-emerald-700">{breakdown.skill_match_percent || score}%</span>
                    </div>
                    <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-300/40">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all"
                        style={{ width: `${breakdown.skill_match_percent || score}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-slate-700 mb-1">
                      <span>Branch / Education Fit (15% Weight)</span>
                      <span className="text-indigo-700">{breakdown.education_match_percent || 90}%</span>
                    </div>
                    <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-300/40">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-blue-500 h-full rounded-full transition-all"
                        style={{ width: `${breakdown.education_match_percent || 90}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-slate-700 mb-1">
                      <span>Experience / Year (10% Weight)</span>
                      <span className="text-blue-700">{breakdown.experience_match_percent || 85}%</span>
                    </div>
                    <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-300/40">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full transition-all"
                        style={{ width: `${breakdown.experience_match_percent || 85}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-slate-700 mb-1">
                      <span>Career Interest Alignment (10% Weight)</span>
                      <span className="text-amber-700">{breakdown.interest_match_percent || 90}%</span>
                    </div>
                    <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-300/40">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all"
                        style={{ width: `${breakdown.interest_match_percent || 90}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-slate-700 mb-1">
                      <span>CGPA & Academic Standing (10% Weight)</span>
                      <span className="text-teal-700">{breakdown.cgpa_match_percent || 95}%</span>
                    </div>
                    <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-300/40">
                      <div
                        className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${breakdown.cgpa_match_percent || 95}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Matched vs Missing */}
              {breakdown.matched_skills && breakdown.matched_skills.length > 0 && (
                <div className="p-3.5 bg-emerald-500/10 rounded-2xl border border-emerald-400/40 text-xs backdrop-blur-md">
                  <div className="font-extrabold text-emerald-950 mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Matched Skills
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {breakdown.matched_skills.map((s, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 bg-emerald-100/90 text-emerald-950 rounded-lg font-bold text-[11px] border border-emerald-300/60"
                      >
                        {typeof s === 'object' ? s.name : s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {breakdown.missing_skills && breakdown.missing_skills.length > 0 && (
                <div className="p-3.5 bg-amber-500/10 rounded-2xl border border-amber-400/40 text-xs backdrop-blur-md">
                  <div className="font-extrabold text-amber-950 mb-1.5 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" /> Missing / Target Skills
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {breakdown.missing_skills.map((s, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 bg-amber-100/90 text-amber-950 rounded-lg font-bold text-[11px] border border-amber-300/60"
                      >
                        {typeof s === 'object' ? s.name : s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50/80 border-t border-slate-100/80 text-center">
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold transition-all shadow-md"
              >
                Close Breakdown
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
