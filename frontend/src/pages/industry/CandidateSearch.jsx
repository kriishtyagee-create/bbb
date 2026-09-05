import React, { useState, useEffect } from 'react';
import { industryAPI, skillsAPI } from '../../services/api';
import { MatchScoreBadge } from '../../components/common/MatchScoreBadge';
import { Modal } from '../../components/common/Modal';
import {
  Search,
  Users,
  Filter,
  GraduationCap,
  Sparkles,
  MapPin,
  Building,
  CheckCircle2,
  Calendar,
  Send,
  Award,
  ChevronRight
} from 'lucide-react';

export const CandidateSearch = () => {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState('All');
  const [minCgpa, setMinCgpa] = useState(6.0);
  const [loading, setLoading] = useState(true);

  // Selected candidate modal
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const loadCandidates = async () => {
    setLoading(true);
    try {
      let query = `?search=${encodeURIComponent(search)}&min_cgpa=${minCgpa}`;
      if (branch !== 'All') query += `&branch=${encodeURIComponent(branch)}`;

      const res = await industryAPI.searchCandidates(query);
      setCandidates(res.candidates || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, [branch, minCgpa]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadCandidates();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Search className="w-6 h-6 text-indigo-600" />
          Smart Multi-Criteria Candidate Search
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
          Ranked by match against your company's active talent requirements.
        </p>
      </div>

      {/* Filter and Search Frosted Glass Bar */}
      <div className="bg-white/80 backdrop-blur-xl p-5 rounded-3xl border border-white/70 shadow-[0_10px_30px_rgba(0,0,0,0.04)] space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by candidate name, institution, or skills (e.g. Python, Dravyaguna, Clinical Data)..."
              className="w-full pl-10 pr-4 py-3 bg-white/70 border border-slate-200/80 rounded-2xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs font-medium"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white font-extrabold text-xs shadow-md shadow-indigo-700/25 transition-all"
          >
            Filter Talent
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
          <div>
            <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
              Academic Branch / Discipline
            </label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full px-3 py-2 bg-white/70 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-800 backdrop-blur-md"
            >
              <option value="All">All Disciplines & Specializations</option>
              <option value="Data Science">Data Science & Medical Informatics</option>
              <option value="Ayurvedic Pharmacology">Ayurvedic Pharmacology / Dravyaguna</option>
              <option value="Computer Science">Computer Science & Engineering</option>
              <option value="Herbal Drug Technology">Herbal Drug Technology</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
              <span>Minimum CGPA Cutoff</span>
              <span className="text-indigo-700 font-bold">{minCgpa} / 10</span>
            </div>
            <input
              type="range"
              min="5.0"
              max="9.5"
              step="0.5"
              value={minCgpa}
              onChange={(e) => setMinCgpa(parseFloat(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Candidate Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {candidates.map((cand) => (
            <div
              key={cand.id}
              className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/70 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.08)] hover:border-indigo-400/50 hover:bg-white/95 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                      {cand.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">{cand.college}</p>
                  </div>
                  <MatchScoreBadge score={cand.match_score} />
                </div>

                <div className="space-y-1 text-xs text-slate-600 mb-4 font-medium">
                  <div>
                    <span className="font-bold text-slate-700">Course:</span> {cand.course} (
                    {cand.branch})
                  </div>
                  <div>
                    <span className="font-bold text-slate-700">Year:</span> {cand.year} •{' '}
                    <span className="font-extrabold text-emerald-800">CGPA: {cand.cgpa}/10</span>
                  </div>
                  {cand.target_role && (
                    <div>
                      <span className="font-bold text-slate-700">Target Role:</span>{' '}
                      <span className="text-indigo-700 font-bold">{cand.target_role}</span>
                    </div>
                  )}
                </div>

                {/* Skills Preview */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {cand.skills?.slice(0, 4).map((s, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 bg-slate-100/90 text-slate-700 rounded-lg text-[10px] font-bold border border-slate-200/60"
                    >
                      {s.name}
                    </span>
                  ))}
                  {cand.skills?.length > 4 && (
                    <span className="text-[10px] text-slate-400 font-bold self-center">
                      +{cand.skills.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  {cand.skills?.length || 0} skills verified
                </span>
                <button
                  onClick={() => setSelectedCandidate(cand)}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-2xs transition-colors"
                >
                  Inspect Candidate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Candidate Inspect Modal */}
      {selectedCandidate && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedCandidate(null)}
          title={selectedCandidate.name}
          subtitle={`${selectedCandidate.college} • ${selectedCandidate.course}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50/90 rounded-2xl border border-slate-200/80 text-xs backdrop-blur-md">
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px]">CGPA</span>
                <div className="text-base font-extrabold text-emerald-800">
                  {selectedCandidate.cgpa} / 10
                </div>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px]">Branch</span>
                <div className="text-xs font-bold text-slate-800">{selectedCandidate.branch}</div>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px]">Match Fit</span>
                <div className="text-base font-extrabold text-indigo-700">
                  {selectedCandidate.match_score}%
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                All Verified Skills & Proficiency
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {selectedCandidate.skills?.map((sk, i) => (
                  <div
                    key={i}
                    className="p-2.5 bg-slate-50/90 rounded-xl border border-slate-200/80 text-xs flex items-center justify-between"
                  >
                    <span className="font-extrabold text-slate-800">{sk.name}</span>
                    <span className="text-[10px] text-indigo-700 font-extrabold">{sk.proficiency_level}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
