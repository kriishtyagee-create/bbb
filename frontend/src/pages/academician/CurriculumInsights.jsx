import React, { useState, useEffect } from 'react';
import { academicianAPI, collaborationsAPI } from '../../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { Modal } from '../../components/common/Modal';
import {
  BookOpen,
  Sparkles,
  AlertCircle,
  Building,
  CheckCircle2,
  Calendar,
  Send,
  ArrowRight,
  TrendingUp,
  Layers,
  Award
} from 'lucide-react';

export const CurriculumInsights = () => {
  const navigate = useNavigate();
  const [insights, setInsights] = useState(null);
  const [partners, setPartners] = useState({ industries: [] });
  const [loading, setLoading] = useState(true);

  // Workshop proposal modal
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [industryId, setIndustryId] = useState('');
  const [workshopTitle, setWorkshopTitle] = useState('');
  const [workshopDesc, setWorkshopDesc] = useState('');
  const [proposedDate, setProposedDate] = useState('2026-10-20');
  const [submitting, setSubmitting] = useState(false);
  const [proposalSuccess, setProposalSuccess] = useState(false);

  const loadData = async () => {
    try {
      const [insRes, partRes] = await Promise.all([
        academicianAPI.getCurriculumInsights(),
        collaborationsAPI.getPartners(),
      ]);
      setInsights(insRes);
      setPartners(partRes);
      if (partRes.industries?.length > 0) {
        setIndustryId(partRes.industries[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (rec) => {
    setSelectedRecommendation(rec);
    setWorkshopTitle(`Hands-on Industry Workshop on ${rec.skill}`);
    setWorkshopDesc(
      `Specialized 3-day training module designed in collaboration with industry practitioners to bridge student proficiency in ${rec.skill} for Semester 5/6 scholars.`
    );
  };

  const handleProposeSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await collaborationsAPI.create({
        industry_id: parseInt(industryId),
        type: 'workshop',
        title: workshopTitle,
        description: workshopDesc,
        target_topics: selectedRecommendation?.skill || 'Applied Skills',
        proposed_date: proposedDate,
      });
      setProposalSuccess(true);
      setTimeout(() => {
        setProposalSuccess(false);
        setSelectedRecommendation(null);
        navigate('/academician/collaborations');
      }, 1400);
    } catch (err) {
      alert(err.message || 'Failed to submit proposal');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-1.5 border border-amber-300">
          <Sparkles className="w-3.5 h-3.5" /> AI CURRICULUM ADVISOR
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Curriculum Alignment & Upgrade Insights
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          {insights?.cohort_summary || 'Analysis comparing student competencies with enterprise job demands.'}
        </p>
      </div>

      {/* Main Advisory Box */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-md">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-100" />
          Industry Demand Indicates Training Gaps in Key Disciplines
        </h2>
        <p className="text-xs sm:text-sm text-amber-50 mt-1 leading-relaxed max-w-3xl">
          Based on recent hiring requisitions from 10+ partner enterprises, students require urgent hands-on module integration in:
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {insights?.top_gap_skills?.map((s, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-white/20 backdrop-blur-xs text-white border border-white/30 rounded-xl font-bold text-xs"
            >
              {s.name} ({s.industry_demand_count} Jobs)
            </span>
          ))}
        </div>
      </div>

      {/* Recommendations Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Actionable Recommendations for Academic Year 2026-27
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights?.curriculum_recommendations?.map((rec, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4 flex flex-col justify-between hover:border-amber-300 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
                    {rec.priority}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{rec.category}</span>
                </div>

                <h4 className="text-base font-bold text-slate-900 leading-snug">
                  Enhance Syllabus in: <span className="text-amber-800">{rec.skill}</span>
                </h4>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {rec.reason}
                </p>

                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <span className="font-bold text-slate-700 block mb-1">
                    Recommended Action:
                  </span>
                  <p className="text-slate-600 leading-relaxed">{rec.action}</p>
                </div>

                {rec.proposed_collaborators && (
                  <div className="mt-3 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">Recommended Partners: </span>
                    {rec.proposed_collaborators.join(', ')}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleOpenModal(rec)}
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Propose Industry Workshop for {rec.skill}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workshop Proposal Modal */}
      {selectedRecommendation && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedRecommendation(null)}
          title={`Initiate Collaboration for ${selectedRecommendation.skill}`}
          subtitle="Dispatch an official capacity building proposal to industry partners"
        >
          <form onSubmit={handleProposeSubmit} className="space-y-4">
            {proposalSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Proposal Dispatched to Partner!</span>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Target Enterprise Partner *
                  </label>
                  <select
                    required
                    value={industryId}
                    onChange={(e) => setIndustryId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    {partners.industries?.map((ind) => (
                      <option key={ind.id} value={ind.id}>
                        {ind.name} ({ind.sector}) - {ind.location}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Workshop Proposal Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={workshopTitle}
                    onChange={(e) => setWorkshopTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Proposed Schedule Date
                  </label>
                  <input
                    type="text"
                    value={proposedDate}
                    onChange={(e) => setProposedDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Objectives & Scope *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={workshopDesc}
                    onChange={(e) => setWorkshopDesc(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 mt-4"
                >
                  {submitting ? 'Dispatching...' : 'Dispatch Official Proposal'}
                </button>
              </>
            )}
          </form>
        </Modal>
      )}
    </div>
  );
};
