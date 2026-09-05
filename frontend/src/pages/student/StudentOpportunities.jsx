import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { opportunitiesAPI } from '../../services/api';
import { MatchScoreBadge } from '../../components/common/MatchScoreBadge';
import { Modal } from '../../components/common/Modal';
import {
  Briefcase,
  Search,
  Filter,
  MapPin,
  Building,
  Clock,
  DollarSign,
  CheckCircle2,
  Calendar,
  Sparkles,
  Send,
  Layers
} from 'lucide-react';

export const StudentOpportunities = () => {
  const location = useLocation();
  const defaultType = location.pathname.includes('internships') ? 'internship' : location.pathname.includes('jobs') ? 'job' : 'all';

  const [activeTab, setActiveTab] = useState(defaultType);
  const [opportunities, setOpportunities] = useState([]);
  const [search, setSearch] = useState('');
  const [workMode, setWorkMode] = useState('All');
  const [loading, setLoading] = useState(true);

  // Selected opportunity for detail modal
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [coverNote, setCoverNote] = useState('');
  const [applying, setApplying] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const loadOpportunities = async () => {
    setLoading(true);
    try {
      let query = `?search=${encodeURIComponent(search)}`;
      if (activeTab !== 'all') query += `&type=${activeTab}`;
      if (workMode !== 'All') query += `&work_mode=${workMode}`;

      const res = await opportunitiesAPI.getAll(query);
      setOpportunities(res.opportunities || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOpportunities();
  }, [activeTab, workMode]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadOpportunities();
  };

  const handleApply = async () => {
    if (!selectedOpp) return;
    setApplying(true);
    try {
      await opportunitiesAPI.apply(selectedOpp.id, coverNote);
      setAppliedSuccess(true);
      // update local status
      setOpportunities((prev) =>
        prev.map((o) => (o.id === selectedOpp.id ? { ...o, has_applied: true } : o))
      );
      setTimeout(() => {
        setSelectedOpp(null);
        setAppliedSuccess(false);
        setCoverNote('');
      }, 1500);
    } catch (err) {
      alert(err.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-emerald-600" />
          Internships & Career Opportunities Marketplace
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
          Intelligently ranked based on your skill match, education branch, and career goals.
        </p>
      </div>

      {/* Tabs & Search Filter Controls Glass Panel */}
      <div className="bg-white/80 backdrop-blur-xl p-5 rounded-3xl border border-white/70 shadow-[0_10px_30px_rgba(0,0,0,0.04)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          {/* Opportunity Type Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white/60 text-slate-600 hover:bg-white border border-slate-200/60'
              }`}
            >
              All Openings
            </button>
            <button
              onClick={() => setActiveTab('internship')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'internship'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-700/20'
                  : 'bg-white/60 text-slate-600 hover:bg-white border border-slate-200/60'
              }`}
            >
              Internships
            </button>
            <button
              onClick={() => setActiveTab('job')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'job'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-700/20'
                  : 'bg-white/60 text-slate-600 hover:bg-white border border-slate-200/60'
              }`}
            >
              Full-Time Jobs / Placements
            </button>
          </div>

          {/* Work Mode Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Work Mode:</span>
            <select
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
              className="px-3 py-1.5 bg-white/70 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-800 shadow-2xs backdrop-blur-md"
            >
              <option>All</option>
              <option>Remote</option>
              <option>Hybrid</option>
              <option>On-site</option>
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by role, skills (e.g. Python, Dravyaguna, Clinical Data), or company..."
              className="w-full pl-10 pr-4 py-3 bg-white/70 border border-slate-200/80 rounded-2xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs transition-colors backdrop-blur-md font-medium"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs shadow-md shadow-emerald-700/25 transition-all"
          >
            Search
          </button>
        </form>
      </div>

      {/* Opportunities List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/70 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.08)] hover:border-emerald-400/50 hover:bg-white/95 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                          opp.type === 'internship'
                            ? 'bg-emerald-500/15 text-emerald-900 border border-emerald-400/40'
                            : 'bg-indigo-500/15 text-indigo-900 border border-indigo-400/40'
                        }`}
                      >
                        {opp.type}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">
                        {opp.department || 'General'}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                      {opp.title}
                    </h3>
                  </div>
                  <MatchScoreBadge score={opp.match_score} breakdown={opp.match_breakdown} />
                </div>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 mb-3 font-medium">
                  <span className="flex items-center gap-1 font-bold text-slate-800">
                    <Building className="w-3.5 h-3.5 text-slate-400" /> {opp.company_name}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {opp.location} ({opp.work_mode})
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {opp.duration || 'Full-Time'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed font-medium">
                  {opp.description}
                </p>

                {/* Required Skills Chips */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {opp.required_skills?.map((s, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 bg-slate-100/90 text-slate-700 rounded-lg font-semibold text-[11px] border border-slate-200/60"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom bar */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                    Stipend / Package
                  </div>
                  <div className="text-sm font-black text-emerald-800">
                    {opp.stipend_salary}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedOpp(opp)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shadow-2xs ${
                    opp.has_applied
                      ? 'bg-emerald-500/20 text-emerald-900 border border-emerald-400/50'
                      : 'bg-slate-900 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {opp.has_applied ? '✓ Applied' : 'View & Apply'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail & Apply Modal */}
      {selectedOpp && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedOpp(null)}
          title={selectedOpp.title}
          subtitle={`${selectedOpp.company_name} • ${selectedOpp.location} (${selectedOpp.work_mode})`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50/90 rounded-2xl border border-slate-200/80 backdrop-blur-md">
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Offered Compensation</span>
                <div className="text-lg font-black text-emerald-800">
                  {selectedOpp.stipend_salary}
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Eligible Branches</span>
                <div className="text-xs font-bold text-slate-800">
                  {selectedOpp.branch_eligibility}
                </div>
              </div>
              <MatchScoreBadge score={selectedOpp.match_score} breakdown={selectedOpp.match_breakdown} />
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Opportunity Description
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line font-medium">
                {selectedOpp.description}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Mandatory Required Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedOpp.required_skills?.map((s, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-emerald-500/15 text-emerald-950 border border-emerald-400/40 rounded-xl text-xs font-bold"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Cover note & 1-click submit */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Personal Statement / Note to Recruiter
              </label>
              <textarea
                rows={3}
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                placeholder="Briefly explain your passion and domain background for this role..."
                className="w-full p-3.5 bg-slate-50/90 border border-slate-200 rounded-2xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />

              {appliedSuccess ? (
                <div className="p-3.5 bg-emerald-500/15 border border-emerald-400/40 text-emerald-950 rounded-2xl text-xs font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Application Submitted Successfully!
                </div>
              ) : (
                <button
                  type="button"
                  disabled={applying || selectedOpp.has_applied}
                  onClick={handleApply}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {applying ? (
                    'Submitting Application...'
                  ) : selectedOpp.has_applied ? (
                    'Already Applied'
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit 1-Click Application</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
