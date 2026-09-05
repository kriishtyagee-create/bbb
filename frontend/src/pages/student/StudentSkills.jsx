import React, { useState, useEffect } from 'react';
import { studentAPI, skillsAPI } from '../../services/api';
import { SkillTag } from '../../components/common/SkillTag';
import { Modal } from '../../components/common/Modal';
import {
  Sparkles,
  Plus,
  Star,
  CheckCircle2,
  Trash2,
  Filter,
  Flame,
  Search,
  BookOpen
} from 'lucide-react';

export const StudentSkills = () => {
  const [skills, setSkills] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // Add skill modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [customSkillName, setCustomSkillName] = useState('');
  const [selectedCategoryName, setSelectedCategoryName] = useState('Programming');
  const [proficiency, setProficiency] = useState('Intermediate');
  const [rating, setRating] = useState(3);
  const [submitting, setSubmitting] = useState(false);

  const loadSkills = async () => {
    try {
      const [stdSkillsRes, catalogRes, catRes] = await Promise.all([
        studentAPI.getSkills(),
        skillsAPI.getAll(),
        skillsAPI.getCategories(),
      ]);
      setSkills(stdSkillsRes.skills || []);
      setCatalog(catalogRes.skills || []);
      setCategories(['All', ...(catRes.categories || [])]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        proficiency_level: proficiency,
        rating: parseInt(rating),
      };
      if (selectedSkillId) {
        payload.skill_id = parseInt(selectedSkillId);
      } else if (customSkillName) {
        payload.skill_name = customSkillName;
        payload.category = selectedCategoryName;
      }
      await studentAPI.addSkill(payload);
      setShowAddModal(false);
      setSelectedSkillId('');
      setCustomSkillName('');
      await loadSkills();
    } catch (err) {
      alert(err.message || 'Failed to add skill');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this skill from your profile?')) return;
    try {
      await studentAPI.deleteSkill(id);
      setSkills(skills.filter((s) => s.id !== id));
    } catch (err) {
      alert('Error removing skill');
    }
  };

  const filteredSkills =
    selectedCategory === 'All'
      ? skills
      : skills.filter((s) => s.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-600" />
            My Skills & Verified Competencies
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Maintain your skill portfolio to maximize your match score with industry postings.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-800/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Skill</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((sk) => (
          <div
            key={sk.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {sk.category || 'General'}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">{sk.name}</h3>
                </div>
                <button
                  onClick={() => handleDelete(sk.id)}
                  className="p-1 text-slate-300 hover:text-rose-600 transition-colors"
                  title="Delete skill"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Stars rating */}
              <div className="flex items-center gap-1 mt-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= sk.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                ))}
                <span className="text-xs font-bold text-slate-700 ml-1.5">
                  {sk.proficiency_level}
                </span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" /> Self-Assessed
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                {sk.demand_level || 'High'} Demand
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Skill Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Skill to Profile"
        subtitle="Select from the national skill repository or add a custom domain skill"
      >
        <form onSubmit={handleAddSkill} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Select from Skill Repository
            </label>
            <select
              value={selectedSkillId}
              onChange={(e) => {
                setSelectedSkillId(e.target.value);
                if (e.target.value) setCustomSkillName('');
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
            >
              <option value="">-- Choose from central database --</option>
              {catalog.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.category}) - {c.demand_level} Demand
                </option>
              ))}
            </select>
          </div>

          <div className="text-center text-xs text-slate-400 font-semibold">— OR TYPE CUSTOM SKILL —</div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Custom Skill Name
            </label>
            <input
              type="text"
              value={customSkillName}
              onChange={(e) => {
                setCustomSkillName(e.target.value);
                if (e.target.value) setSelectedSkillId('');
              }}
              placeholder="e.g. Next.js, TKDL Literature, Phytochemistry"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Proficiency Level
              </label>
              <select
                value={proficiency}
                onChange={(e) => setProficiency(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>Expert</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Rating (1 to 5 Stars)
              </label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option value="1">★☆☆☆☆ (Beginner - 1)</option>
                <option value="2">★★☆☆☆ (Elementary - 2)</option>
                <option value="3">★★★☆☆ (Intermediate - 3)</option>
                <option value="4">★★★★☆ (Advanced - 4)</option>
                <option value="5">★★★★★ (Expert - 5)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || (!selectedSkillId && !customSkillName)}
            className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 mt-4"
          >
            {submitting ? 'Saving...' : 'Add Skill to Portfolio'}
          </button>
        </form>
      </Modal>
    </div>
  );
};
