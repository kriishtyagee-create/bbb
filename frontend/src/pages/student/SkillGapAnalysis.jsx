import React, { useState, useEffect } from 'react';
import { studentAPI, skillsAPI } from '../../services/api';
import { Link } from 'react-router-dom';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import {
  Compass,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Award,
  Clock,
  Layers
} from 'lucide-react';

export const SkillGapAnalysis = () => {
  const [targetRole, setTargetRole] = useState('Data Analyst');
  const [careerRoles, setCareerRoles] = useState([]);
  const [gapData, setGapData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const [rolesRes, profileRes] = await Promise.all([
          skillsAPI.getCareerRoles(),
          studentAPI.getProfile(),
        ]);
        setCareerRoles(rolesRes.roles || []);
        const defaultRole = profileRes.student?.target_role || 'Data Analyst';
        setTargetRole(defaultRole);
        await fetchGapAnalysis(defaultRole);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const fetchGapAnalysis = async (role) => {
    setLoading(true);
    try {
      const data = await studentAPI.getSkillGap(role);
      setGapData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setTargetRole(newRole);
    fetchGapAnalysis(newRole);
  };

  return (
    <div className="space-y-6">
      {/* Header & Role Picker Frosted Glass Bar */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/70 shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-900 text-xs font-extrabold mb-1.5 border border-emerald-400/40">
            <Compass className="w-3.5 h-3.5" /> SMART AUTOMATION ENGINE
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Automated Skill Gap Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
            Real-time benchmarking against live industry requirements & AI-curated learning roadmaps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-600 whitespace-nowrap">
            Target Career Goal:
          </label>
          <select
            value={targetRole}
            onChange={handleRoleChange}
            className="px-4 py-2 bg-slate-950/80 backdrop-blur-md text-white font-bold rounded-2xl text-xs border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {careerRoles.map((r) => (
              <option key={r.id} value={r.title}>
                {r.title} ({r.domain})
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : gapData ? (
        <>
          {/* Top Score Glass Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-5 rounded-3xl text-white shadow-[0_10px_30px_rgba(16,185,129,0.3)] border border-emerald-400/30">
              <div className="text-[10px] font-extrabold text-emerald-100 uppercase tracking-widest">
                Current Readiness
              </div>
              <div className="text-3xl font-black mt-1">{gapData.current_score}%</div>
              <div className="text-xs text-emerald-100 mt-1 font-medium">Overall Profile Fit</div>
            </div>

            <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-5 rounded-3xl text-white shadow-[0_10px_30px_rgba(245,158,11,0.3)] border border-amber-400/30">
              <div className="text-[10px] font-extrabold text-amber-100 uppercase tracking-widest">
                Identified Skill Gap
              </div>
              <div className="text-3xl font-black mt-1">{gapData.gap_score}%</div>
              <div className="text-xs text-amber-100 mt-1 font-medium">
                {gapData.missing_skills.length} Critical Skills Missing
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl p-5 rounded-3xl border border-white/70 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                Market Compensation
              </div>
              <div className="text-xl font-black text-slate-900 mt-1">
                {gapData.typical_salary}
              </div>
              <div className="text-xs text-emerald-700 font-bold mt-1">
                Demand: {gapData.job_demand}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl p-5 rounded-3xl border border-white/70 shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  Target Domain
                </div>
                <div className="text-sm font-extrabold text-slate-900 mt-1">{gapData.domain}</div>
              </div>
              <Link
                to="/student/internships"
                className="mt-2 text-xs font-extrabold text-emerald-700 hover:underline flex items-center gap-1"
              >
                Browse Matching Openings →
              </Link>
            </div>
          </div>

          {/* Radar Visualization & Skill Cards with Glass Design */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 6 cols: Radar Chart in Frosted Glass Panel */}
            <div className="lg:col-span-6 bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white/70 shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" /> Competency Radar: Your Skills vs Industry Standard
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mb-4 font-medium">
                  Visual overlay comparing your self-assessed proficiency against 100% industry benchmark requirement.
                </p>

                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={gapData.radar_chart_data}>
                      <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" />
                      <PolarAngleAxis dataKey="skill" tick={{ fill: '#334155', fontSize: 11, fontWeight: 700 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" />
                      <Radar
                        name="Your Current Level"
                        dataKey="current"
                        stroke="#059669"
                        fill="#10b981"
                        fillOpacity={0.5}
                      />
                      <Radar
                        name="Industry Benchmark"
                        dataKey="required"
                        stroke="#3b82f6"
                        fill="#60a5fa"
                        fillOpacity={0.15}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mt-4 p-4 bg-slate-50/90 rounded-2xl border border-slate-200/80 text-xs text-slate-700 backdrop-blur-md">
                <strong className="text-slate-900 font-extrabold">Diagnosis:</strong> You possess strong fundamentals in{' '}
                {gapData.matched_skills.map((s) => s.name).join(', ') || 'core domains'}, but need practical project exposure in{' '}
                <span className="text-amber-800 font-extrabold">{gapData.missing_skills.map((s) => s.name).join(', ')}</span>.
              </div>
            </div>

            {/* Right 6 cols: Breakdown of Matched vs Missing */}
            <div className="lg:col-span-6 space-y-4">
              {/* Matched Skills Glass Panel */}
              <div className="bg-white/80 backdrop-blur-xl p-5 rounded-3xl border border-emerald-300/60 shadow-[0_8px_25px_rgba(0,0,0,0.03)]">
                <h4 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Acquired & Matched Skills ({gapData.matched_skills.length})
                </h4>
                {gapData.matched_skills.length === 0 ? (
                  <p className="text-xs text-slate-400">No matching skills yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {gapData.matched_skills.map((s, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-400/40 flex items-center justify-between backdrop-blur-xs"
                      >
                        <div>
                          <div className="text-xs font-extrabold text-emerald-950">{s.name}</div>
                          <div className="text-[10px] text-emerald-800 font-semibold">{s.category}</div>
                        </div>
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-200/80 text-emerald-950 border border-emerald-300">
                          {s.proficiency}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Partial Skills Glass Panel */}
              {gapData.partial_skills && gapData.partial_skills.length > 0 && (
                <div className="bg-white/80 backdrop-blur-xl p-5 rounded-3xl border border-blue-300/60 shadow-[0_8px_25px_rgba(0,0,0,0.03)]">
                  <h4 className="text-xs font-extrabold text-blue-950 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    Partially Matched (Level-Up Recommended) ({gapData.partial_skills.length})
                  </h4>
                  <div className="space-y-2">
                    {gapData.partial_skills.map((s, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-blue-500/10 rounded-2xl border border-blue-400/40 flex items-center justify-between text-xs backdrop-blur-xs"
                      >
                        <span className="font-extrabold text-blue-950">{s.name}</span>
                        <span className="text-[11px] text-blue-900 font-medium">{s.gap_note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Skills Glass Panel */}
              <div className="bg-white/80 backdrop-blur-xl p-5 rounded-3xl border border-amber-300/60 shadow-[0_8px_25px_rgba(0,0,0,0.03)]">
                <h4 className="text-xs font-extrabold text-amber-950 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Missing Skills ({gapData.missing_skills.length})
                </h4>
                {gapData.missing_skills.length === 0 ? (
                  <p className="text-xs text-emerald-700 font-bold">🎉 Zero missing skills! You meet 100% of the target requirements.</p>
                ) : (
                  <div className="space-y-2.5">
                    {gapData.missing_skills.map((s, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-amber-500/10 rounded-2xl border border-amber-400/40 flex items-center justify-between backdrop-blur-xs"
                      >
                        <div>
                          <div className="text-xs font-extrabold text-amber-950">{s.name}</div>
                          <div className="text-[10px] text-amber-800 font-semibold">
                            {s.category} • {s.difficulty} Difficulty
                          </div>
                        </div>
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-950 border border-rose-300">
                          Critical Gap
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actionable Personalized Learning Path Glass Container */}
          <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/70 shadow-[0_10px_30px_rgba(0,0,0,0.04)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  Personalized Learning Roadmap (Bridge the Gap)
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Recommended curriculum modules from Swayam, NPTEL, and industry courses.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gapData.learning_roadmap.map((step) => (
                <div
                  key={step.step}
                  className="p-5 rounded-2xl bg-white/70 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-extrabold uppercase mb-1">
                      <span>Step {step.step}</span>
                      <span className="flex items-center gap-1 text-emerald-700 font-bold">
                        <Clock className="w-3 h-3" /> {step.timeline}
                      </span>
                    </div>

                    <h4 className="text-sm font-extrabold text-slate-900">{step.skill}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{step.action}</p>

                    <div className="mt-3 pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                        Recommended Courses:
                      </span>
                      <ul className="mt-1 space-y-1 text-xs text-slate-700">
                        {step.recommended_courses.map((c, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
                            <span className="font-medium">{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <a
                    href="https://swayam.gov.in"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 w-full py-2 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white font-extrabold text-xs text-center transition-colors shadow-2xs"
                  >
                    Start Course on Swayam →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
