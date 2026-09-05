import React, { useState, useEffect } from 'react';
import { academicianAPI } from '../../services/api';
import { Modal } from '../../components/common/Modal';
import {
  Users,
  Search,
  Filter,
  GraduationCap,
  Sparkles,
  Award,
  BookOpen,
  CheckCircle2
} from 'lucide-react';

export const AcademicianStudents = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Selected student for detail modal
  const [selectedStudent, setSelectedStudent] = useState(null);

  const loadStudents = async () => {
    setLoading(true);
    try {
      let query = `?search=${encodeURIComponent(search)}`;
      if (branchFilter !== 'All') query += `&branch=${branchFilter}`;
      if (yearFilter !== 'All') query += `&year=${yearFilter}`;

      const res = await academicianAPI.getStudents(query);
      setStudents(res.students || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [branchFilter, yearFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadStudents();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-amber-600" />
          Enrolled Student Cohort Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Inspect student skill competencies, academic performance, and career readiness.
        </p>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Branch Filter
            </label>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            >
              <option value="All">All Branches</option>
              <option value="Data Science">Data Science & AYUSH Informatics</option>
              <option value="Ayurvedic Pharmacology">Ayurvedic Pharmacology / Dravyaguna</option>
              <option value="Computer Science">Computer Science & Engineering</option>
              <option value="Herbal Drug Technology">Herbal Drug Technology</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Year of Study
            </label>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            >
              <option value="All">All Years</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="Final Year">Final Year</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Quick Search
            </label>
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, college..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Student Table */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="p-3 rounded-l-lg">Student Name</th>
                  <th className="p-3">Institution & Course</th>
                  <th className="p-3">Branch & Year</th>
                  <th className="p-3">CGPA</th>
                  <th className="p-3">Target Career Goal</th>
                  <th className="p-3">Verified Skills</th>
                  <th className="p-3 rounded-r-lg text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((std) => (
                  <tr key={std.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-bold text-slate-900">{std.name}</td>
                    <td className="p-3 text-slate-700">
                      {std.college}
                      <div className="text-[10px] text-slate-400">{std.course}</div>
                    </td>
                    <td className="p-3 text-slate-600">
                      {std.branch}
                      <div className="text-[10px] text-slate-400">{std.year}</div>
                    </td>
                    <td className="p-3 font-extrabold text-emerald-800">{std.cgpa}/10</td>
                    <td className="p-3 font-semibold text-indigo-700">
                      {std.target_role || 'General'}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {std.skills?.slice(0, 3).map((sk, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] border border-slate-200"
                          >
                            {sk.name}
                          </span>
                        ))}
                        {std.skills?.length > 3 && (
                          <span className="text-[10px] text-slate-400 font-semibold">
                            +{std.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedStudent(std)}
                        className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold rounded-lg text-xs transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inspect Modal */}
      {selectedStudent && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedStudent(null)}
          title={selectedStudent.name}
          subtitle={`${selectedStudent.college} • ${selectedStudent.course} (${selectedStudent.branch})`}
        >
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">CGPA: {selectedStudent.cgpa}/10</span>
              <span className="font-bold text-emerald-800">Target: {selectedStudent.target_role}</span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                All Verified Skills ({selectedStudent.skills?.length})
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {selectedStudent.skills?.map((sk, i) => (
                  <div
                    key={i}
                    className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-center justify-between"
                  >
                    <span className="font-bold text-slate-800">{sk.name}</span>
                    <span className="text-[10px] text-emerald-800 font-bold">{sk.proficiency_level}</span>
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
