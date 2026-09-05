import React, { useState, useEffect } from 'react';
import { collaborationsAPI } from '../../services/api';
import { Modal } from '../../components/common/Modal';
import {
  GraduationCap,
  Building,
  CheckCircle2,
  XCircle,
  Calendar,
  Send,
  Clock,
  Plus,
  Layers,
  MessageSquare
} from 'lucide-react';

export const AcademicCollaborations = () => {
  const [collaborations, setCollaborations] = useState([]);
  const [partners, setPartners] = useState({ industries: [] });
  const [loading, setLoading] = useState(true);

  // Response modal state
  const [selectedCollab, setSelectedCollab] = useState(null);
  const [responseStatus, setResponseStatus] = useState('accepted');
  const [responseNote, setResponseNote] = useState('Approved by Dean of Academic Affairs. Seminar Hall reserved.');
  const [submitting, setSubmitting] = useState(false);

  // New proposal modal state
  const [showNewModal, setShowNewModal] = useState(false);
  const [newFormData, setNewFormData] = useState({
    title: '',
    type: 'internship_partnership',
    industry_id: '',
    description: '',
    target_topics: 'Clinical Trials, Herbal Standardization',
    proposed_date: '2026-11-01',
  });

  const loadData = async () => {
    try {
      const [colRes, partRes] = await Promise.all([
        collaborationsAPI.getAll(),
        collaborationsAPI.getPartners(),
      ]);
      setCollaborations(colRes.collaborations || []);
      setPartners(partRes);
      if (partRes.industries?.length > 0) {
        setNewFormData((prev) => ({ ...prev, industry_id: partRes.industries[0].id }));
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

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedCollab) return;
    setSubmitting(true);
    try {
      await collaborationsAPI.updateStatus(selectedCollab.id, {
        status: responseStatus,
        response_note: responseNote,
      });
      setSelectedCollab(null);
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to update proposal');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateNew = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await collaborationsAPI.create(newFormData);
      setShowNewModal(false);
      setNewFormData({
        title: '',
        type: 'internship_partnership',
        industry_id: partners.industries[0]?.id || '',
        description: '',
        target_topics: 'Phytopharmacology',
        proposed_date: '2026-11-01',
      });
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to send proposal');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-amber-600" />
            Institutional Industry Collaborations & MoUs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage incoming industry bootcamps and propose dedicated research & placement partnerships.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Propose Industry MoU</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {collaborations.map((collab) => (
            <div
              key={collab.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-amber-50 text-amber-800 border border-amber-200">
                    {collab.type?.replace('_', ' ')}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      collab.status === 'accepted'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : collab.status === 'pending'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {collab.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {collab.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-semibold">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  Partner: {collab.industry_name} ({collab.industry_sector})
                </p>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {collab.description}
                </p>

                {collab.target_topics && (
                  <div className="mt-3 p-2.5 bg-slate-50 rounded-lg text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      Target Focus:
                    </span>
                    <span className="font-semibold text-slate-800">{collab.target_topics}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> {collab.proposed_date}
                </span>

                {collab.status === 'pending' ? (
                  <button
                    onClick={() => setSelectedCollab(collab)}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    Respond / Accept
                  </button>
                ) : (
                  <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Response Modal */}
      {selectedCollab && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedCollab(null)}
          title={`Respond to: ${selectedCollab.title}`}
          subtitle={`From: ${selectedCollab.industry_name}`}
        >
          <form onSubmit={handleUpdateStatus} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Institutional Decision *
              </label>
              <select
                value={responseStatus}
                onChange={(e) => setResponseStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option value="accepted">✓ Accept & Authorize MoU / Workshop</option>
                <option value="rejected">✕ Decline Proposal</option>
                <option value="completed">Completed / Executed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Official Response Note / Instructions
              </label>
              <textarea
                rows={3}
                required
                value={responseNote}
                onChange={(e) => setResponseNote(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 mt-4"
            >
              {submitting ? 'Updating...' : 'Submit Institutional Response'}
            </button>
          </form>
        </Modal>
      )}

      {/* New MoU Modal */}
      {showNewModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowNewModal(false)}
          title="Propose Industry MoU / Placement Partnership"
          subtitle="Directly request industrial slots or joint research initiatives"
        >
          <form onSubmit={handleCreateNew} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Select Industry Partner *
              </label>
              <select
                required
                value={newFormData.industry_id}
                onChange={(e) => setNewFormData({ ...newFormData, industry_id: e.target.value })}
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
                Proposal Title *
              </label>
              <input
                type="text"
                required
                value={newFormData.title}
                onChange={(e) => setNewFormData({ ...newFormData, title: e.target.value })}
                placeholder="e.g. Annual Winter Industrial Internship Drive 2026"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Description & Target Student Slots *
              </label>
              <textarea
                rows={3}
                required
                value={newFormData.description}
                onChange={(e) => setNewFormData({ ...newFormData, description: e.target.value })}
                placeholder="Detail request for student placement, laboratory access or clinical trials..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 mt-4"
            >
              {submitting ? 'Sending...' : 'Dispatch MoU Proposal'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};
