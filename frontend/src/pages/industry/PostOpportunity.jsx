import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { opportunitiesAPI, skillsAPI } from '../../services/api';
import {
  Send,
  Sparkles,
  CheckCircle2,
  Building,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  AlertCircle
} from 'lucide-react';

export const PostOpportunity = () => {
  const navigate = useNavigate();
  const [catalogSkills, setCatalogSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    type: 'internship',
    department: 'Health Analytics & AI',
    description: '',
    required_skills: ['Python', 'SQL'],
    preferred_skills: ['Power BI', 'Git & GitHub'],
    branch_eligibility: 'Data Science, CSE, IT, BAMS, AYUSH Informatics',
    min_cgpa: '7.5',
    experience_level: 'Fresher',
    location: 'New Delhi',
    work_mode: 'Hybrid',
    stipend_salary: '₹25,000 / month',
    duration: '6 Months',
    openings: '3',
    deadline: '2026-10-31',
  });

  const [customSkillInput, setCustomSkillInput] = useState('');

  useEffect(() => {
    skillsAPI.getAll().then((res) => {
      setCatalogSkills(res.skills || []);
      setLoadingSkills(false);
    });
  }, []);

  const handleAddSkill = (skillName, isRequired = true) => {
    if (!skillName) return;
    const targetKey = isRequired ? 'required_skills' : 'preferred_skills';
    if (!formData[targetKey].includes(skillName)) {
      setFormData({
        ...formData,
        [targetKey]: [...formData[targetKey], skillName],
      });
    }
  };

  const handleRemoveSkill = (skillName, isRequired = true) => {
    const targetKey = isRequired ? 'required_skills' : 'preferred_skills';
    setFormData({
      ...formData,
      [targetKey]: formData[targetKey].filter((s) => s !== skillName),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await opportunitiesAPI.create({
        ...formData,
        min_cgpa: parseFloat(formData.min_cgpa) || 6.0,
        openings: parseInt(formData.openings) || 1,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/industry/candidates');
      }, 1500);
    } catch (err) {
      alert(err.message || 'Failed to post opportunity');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Send className="w-6 h-6 text-indigo-600" />
          Create New Internship or Job Opportunity
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Specify your skill prerequisites to enable automated AI candidate matching across national colleges.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Opportunity successfully posted! Matching algorithm is now ranking candidates...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Opportunity Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Clinical Data Science & Machine Learning Intern"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option value="internship">Internship Position</option>
                <option value="job">Full-Time Job / Placement</option>
              </select>
            </div>
          </div>

          {/* Department & Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Department / Function
            </label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="e.g. Clinical Research, AI Systems, R&D Labs"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Detailed Role Description & Responsibilities *
            </label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Explain key deliverables, technologies used, mentorship provided and daily workflows..."
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Mandatory Required Skills Tagger */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Mandatory Required Skills (Evaluated in 50% AI Match Score) *
              </label>
              <span className="text-[11px] text-slate-500">Click to add from catalog</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {formData.required_skills.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 bg-indigo-100 text-indigo-900 border border-indigo-300 rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <span>{s}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(s, true)}
                    className="text-indigo-600 hover:text-rose-600 font-extrabold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <select
                onChange={(e) => {
                  handleAddSkill(e.target.value, true);
                  e.target.value = '';
                }}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700"
              >
                <option value="">+ Add from Skill Catalog</option>
                {catalogSkills.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.category})
                  </option>
                ))}
              </select>

              <div className="flex gap-1 flex-1">
                <input
                  type="text"
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  placeholder="Or type custom skill..."
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs flex-1"
                />
                <button
                  type="button"
                  onClick={() => {
                    handleAddSkill(customSkillInput, true);
                    setCustomSkillInput('');
                  }}
                  className="px-3 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-lg"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Eligibility & Thresholds */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Eligible Branches
              </label>
              <input
                type="text"
                value={formData.branch_eligibility}
                onChange={(e) => setFormData({ ...formData, branch_eligibility: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Minimum CGPA (Cutoff)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.min_cgpa}
                onChange={(e) => setFormData({ ...formData, min_cgpa: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Experience Level
              </label>
              <select
                value={formData.experience_level}
                onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option>Fresher</option>
                <option>0-1 years</option>
                <option>1-3 years</option>
                <option>3+ years</option>
              </select>
            </div>
          </div>

          {/* Location & Compensation */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Work Mode
              </label>
              <select
                value={formData.work_mode}
                onChange={(e) => setFormData({ ...formData, work_mode: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option>Hybrid</option>
                <option>Remote</option>
                <option>On-site</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Stipend / Salary *
              </label>
              <input
                type="text"
                required
                value={formData.stipend_salary}
                onChange={(e) => setFormData({ ...formData, stipend_salary: e.target.value })}
                placeholder="e.g. ₹30,000 / month or ₹8 - 12 LPA"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Openings
              </label>
              <input
                type="number"
                value={formData.openings}
                onChange={(e) => setFormData({ ...formData, openings: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs shadow-md shadow-indigo-700/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
          >
            <Send className="w-4 h-4" />
            <span>Publish Opportunity to National Portal</span>
          </button>
        </form>
      </div>
    </div>
  );
};
