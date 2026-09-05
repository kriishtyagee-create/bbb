import React, { useState, useEffect } from 'react';
import { collaborationsAPI } from '../../services/api';
import { Modal } from '../../components/common/Modal';
import {
  GraduationCap,
  Plus,
  Building,
  CheckCircle2,
  Clock,
  Send,
  Calendar,
  Layers,
  BookOpen
} from 'lucide-react';

export const IndustryCollaborations = () => {
  const [collaborations, setCollaborations] = useState([]);
  const [partners, setPartners] = useState({ academicians: [], industries: [] });
  const [loading, setLoading] = useState(true);

  // Proposal modal state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'workshop',
    academician_id: '',
    description: '',
    target_topics: 'Clinical Data Analytics, Power BI, AYUSH Informatics',
    proposed_date: '2026-10-15',
  });
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const [collabRes, partRes] = await Promise.all([
        collaborationsAPI.getAll(),
        collaborationsAPI.getPartners(),
      ]);
      setCollaborations(collabRes.collaborations || []);
      setPartners(partRes);
      if (partRes.academicians?.length > 0) {
        setFormData((prev) => ({ ...prev, academician_id: partRes.academicians[0].id }));
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

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await collaborationsAPI.create(formData);
      setShowModal(false);
      setFormData({
        title: '',
        type: 'workshop',
        academician_id: partners.academicians[0]?.id || '',
        description: '',
        target_topics: 'Clinical Data Analytics',
        proposed_date: '2026-10-15',
      });
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to dispatch proposal');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-indigo-600" />
            Academia-Industry Collaboration Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Propose student workshops, faculty guest lectures, research MoUs, and campus placement drives.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Propose Institutional Collaboration</span>
        </button>
      </div>

      {/* Collaborations Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : collaborations.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
          No active collaboration initiatives yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {collaborations.map((collab) => (
            <div
              key={collab.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-indigo-50 text-indigo-800 border border-indigo-200">
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
                  {collab.institution} (Lead: {collab.academician_name})
                </p>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {collab.description}
                </p>

                {collab.target_topics && (
                  <div className="mt-3 p-2.5 bg-slate-50 rounded-lg text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      Target Focus Topics:
                    </span>
                    <span className="font-semibold text-slate-800">{collab.target_topics}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> {collab.proposed_date}
                </span>
                {collab.response_note && (
                  <span className="text-[11px] text-emerald-700 font-semibold truncate max-w-[200px]">
                    "{collab.response_note}"
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Propose Collaboration Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Propose Institutional Partnership"
        subtitle="Connect with faculty deans to align student training with your hiring expectations."
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Select Academic Institution / Faculty Lead *
            </label>
            <select
              required
              value={formData.academician_id}
              onChange={(e) => setFormData({ ...formData, academician_id: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            >
              {partners.academicians?.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} • {a.institution} ({a.department})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Collaboration Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option value="workshop">Skill Workshop / Hands-on BootCamp</option>
                <option value="guest_lecture">Expert Industry Guest Lecture</option>
                <option value="internship_partnership">Exclusive Internship Drive</option>
                <option value="research_collaboration">Joint Research / Clinical MoU</option>
                <option value="curriculum_consultation">Curriculum Advisory Panel</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Proposed Date / Timeline
              </label>
              <input
                type="text"
                value={formData.proposed_date}
                onChange={(e) => setFormData({ ...formData, proposed_date: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Proposal Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. 3-Day BootCamp on Power BI & Clinical Data Science"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Key Focus Areas / Target Topics
            </label>
            <input
              type="text"
              value={formData.target_topics}
              onChange={(e) => setFormData({ ...formData, target_topics: e.target.value })}
              placeholder="e.g. Python, Electronic Health Records, Drug Discovery"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Description & Objectives *
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detail the expected learning outcomes, number of participating scholars, and resource requirements..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 mt-4"
          >
            {submitting ? 'Dispatching...' : 'Submit Partnership Proposal'}
          </button>
        </form>
      </Modal>
    </div>
  );
};
