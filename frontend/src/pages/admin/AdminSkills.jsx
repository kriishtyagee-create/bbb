import React, { useState, useEffect } from 'react';
import { skillsAPI } from '../../services/api';
import { Modal } from '../../components/common/Modal';
import { Sparkles, Plus, Search, Filter, Flame, CheckCircle2 } from 'lucide-react';

export const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Skill Modal State
  const [showModal, setShowModal] = useState(false);
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'Programming',
    description: '',
    demand_level: 'High',
    difficulty_level: 'Intermediate',
    is_ayush_specialized: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const loadSkills = async () => {
    try {
      const [skRes, catRes] = await Promise.all([
        skillsAPI.getAll(`?category=${categoryFilter}`),
        skillsAPI.getCategories(),
      ]);
      setSkills(skRes.skills || []);
      setCategories(['All', ...(catRes.categories || [])]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, [categoryFilter]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await skillsAPI.create(newSkill);
      setShowModal(false);
      setNewSkill({
        name: '',
        category: 'Programming',
        description: '',
        demand_level: 'High',
        difficulty_level: 'Intermediate',
        is_ayush_specialized: false,
      });
      await loadSkills();
    } catch (err) {
      alert(err.message || 'Failed to create skill');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-rose-600" />
            Central National Skill Database & Taxonomy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Standardized technical, analytical, management, and AYUSH healthcare competencies.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Standardized Skill</span>
        </button>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              categoryFilter === c
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Skills Table */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="p-3 rounded-l-lg">Skill Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Industry Demand</th>
                  <th className="p-3">Difficulty Level</th>
                  <th className="p-3 rounded-r-lg">Specialization Tag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {skills.map((sk) => (
                  <tr key={sk.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-bold text-slate-900">
                      {sk.name}
                      <p className="text-[11px] text-slate-500 font-normal mt-0.5">{sk.description}</p>
                    </td>
                    <td className="p-3 font-semibold text-slate-700">{sk.category}</td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          sk.demand_level === 'High' || sk.demand_level === 'Very High'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {sk.demand_level}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-600">{sk.difficulty_level}</td>
                    <td className="p-3">
                      {sk.is_ayush_specialized ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          🌿 AYUSH / AIIA
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Core Engineering / Tech</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Skill Modal */}
      {showModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowModal(false)}
          title="Curate Standardized Skill"
          subtitle="Add a new competency to the national NSQF repository."
        >
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Skill Name *
              </label>
              <input
                type="text"
                required
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                placeholder="e.g. Next.js, TKDL Literature, Phytochemistry"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Category *
                </label>
                <input
                  type="text"
                  required
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                  placeholder="e.g. Programming, Healthcare & AYUSH"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Demand Level
                </label>
                <select
                  value={newSkill.demand_level}
                  onChange={(e) => setNewSkill({ ...newSkill, demand_level: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <option>Very High</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Moderate</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Description / Benchmark
              </label>
              <textarea
                rows={2}
                value={newSkill.description}
                onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                placeholder="Briefly define core knowledge and capabilities..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <label className="flex items-center gap-2 text-xs font-bold text-emerald-800">
              <input
                type="checkbox"
                checked={newSkill.is_ayush_specialized}
                onChange={(e) => setNewSkill({ ...newSkill, is_ayush_specialized: e.target.checked })}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Ministry of Ayush / AIIA Specialized Skill</span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 mt-4"
            >
              {submitting ? 'Saving...' : 'Add Skill to Central Catalog'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};
