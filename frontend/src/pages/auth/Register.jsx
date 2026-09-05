import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DemoSwitcher } from '../../components/common/DemoSwitcher';
import { AccessibilityBar } from '../../components/common/AccessibilityBar';
import {
  GraduationCap,
  Building2,
  BookOpen,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Mail,
  Lock,
  User,
  Phone,
  Building,
  Briefcase,
  MapPin,
  Globe
} from 'lucide-react';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Common fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Student specific fields
  const [studentData, setStudentData] = useState({
    name: '',
    phone: '',
    college: 'All India Institute of Ayurveda (AIIA)',
    course: 'B.Tech / BAMS',
    branch: 'Data Science & Health Informatics',
    year: '3rd Year',
    cgpa: '8.5',
    career_interest: 'Data Analyst',
    target_role: 'Data Analyst',
    bio: '',
  });

  // Industry specific fields
  const [industryData, setIndustryData] = useState({
    company_name: '',
    sector: 'AYUSH & Healthcare',
    company_size: '51-200',
    location: 'New Delhi',
    website: 'https://',
    description: '',
  });

  // Academician specific fields
  const [academicData, setAcademicData] = useState({
    name: '',
    institution: 'All India Institute of Ayurveda',
    department: 'Dravyaguna & Clinical Pharmacology',
    designation: 'Professor & Training Coordinator',
    expertise_areas: 'Ayurvedic Pharmacology, Clinical Trials, AI in Healthcare',
    bio: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let payload = { email, password, role };

    if (role === 'student') {
      payload = { ...payload, ...studentData, cgpa: parseFloat(studentData.cgpa) || 8.0 };
    } else if (role === 'industry') {
      payload = { ...payload, ...industryData };
    } else if (role === 'academician') {
      payload = { ...payload, ...academicData };
    }

    try {
      const registeredUser = await register(payload);
      navigate(`/${registeredUser.role}/dashboard`);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <AccessibilityBar />
      <DemoSwitcher />

      <div className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white font-bold text-2xl shadow-md border border-emerald-300/30">
              🌿
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">AYUSH SkillBridge</span>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">Create Your Account</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Select your role to register on the national collaboration platform</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`p-3.5 sm:p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all text-xs sm:text-sm font-extrabold ${
              role === 'student'
                ? 'bg-emerald-500/15 dark:bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-md scale-105'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
            }`}
          >
            <GraduationCap className={`w-6 h-6 ${role === 'student' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
            <span>Student</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('industry')}
            className={`p-3.5 sm:p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all text-xs sm:text-sm font-extrabold ${
              role === 'industry'
                ? 'bg-indigo-500/15 dark:bg-indigo-500/20 border-indigo-500 text-indigo-800 dark:text-indigo-300 shadow-md scale-105'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
            }`}
          >
            <Building2 className={`w-6 h-6 ${role === 'industry' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
            <span>Industry Partner</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('academician')}
            className={`p-3.5 sm:p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all text-xs sm:text-sm font-extrabold ${
              role === 'academician'
                ? 'bg-amber-500/15 dark:bg-amber-500/20 border-amber-500 text-amber-800 dark:text-amber-300 shadow-md scale-105'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
            }`}
          >
            <BookOpen className={`w-6 h-6 ${role === 'academician' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`} />
            <span>Academician / Dean</span>
          </button>
        </div>

        {/* Registration Form */}
        <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/15 shadow-xl">
          {error && (
            <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Common Credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@institute.edu"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create secure password"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Role Specific Fields */}
            {role === 'student' && (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={studentData.name}
                      onChange={(e) => setStudentData({ ...studentData, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={studentData.phone}
                      onChange={(e) => setStudentData({ ...studentData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">College / Institution *</label>
                    <input
                      type="text"
                      required
                      value={studentData.college}
                      onChange={(e) => setStudentData({ ...studentData, college: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Course & Degree *</label>
                    <input
                      type="text"
                      required
                      value={studentData.course}
                      onChange={(e) => setStudentData({ ...studentData, course: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Branch / Specialization *</label>
                    <input
                      type="text"
                      required
                      value={studentData.branch}
                      onChange={(e) => setStudentData({ ...studentData, branch: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Year of Study *</label>
                    <select
                      value={studentData.year}
                      onChange={(e) => setStudentData({ ...studentData, year: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    >
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>Final Year</option>
                      <option>Graduate / Post-Grad</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Current CGPA *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={studentData.cgpa}
                      onChange={(e) => setStudentData({ ...studentData, cgpa: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Target Career Role *</label>
                    <select
                      value={studentData.target_role}
                      onChange={(e) => setStudentData({ ...studentData, target_role: e.target.value, career_interest: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    >
                      <option>Data Analyst</option>
                      <option>Ayurvedic Clinical Researcher</option>
                      <option>Full Stack AI Developer</option>
                      <option>Healthcare Informatics Specialist</option>
                      <option>Machine Learning Engineer</option>
                      <option>Ayurvedic Pharmacovigilance Associate</option>
                      <option>Cloud & DevOps Architect</option>
                      <option>Herbal Formulation & QA Analyst</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Career Interests</label>
                    <input
                      type="text"
                      value={studentData.career_interest}
                      onChange={(e) => setStudentData({ ...studentData, career_interest: e.target.value })}
                      placeholder="e.g. AI in Healthcare, Clinical Data"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {role === 'industry' && (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Company / Organization Name *</label>
                    <input
                      type="text"
                      required
                      value={industryData.company_name}
                      onChange={(e) => setIndustryData({ ...industryData, company_name: e.target.value })}
                      placeholder="e.g. AyuHealth Technologies"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Industry Sector *</label>
                    <select
                      value={industryData.sector}
                      onChange={(e) => setIndustryData({ ...industryData, sector: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    >
                      <option>AYUSH & Healthcare</option>
                      <option>Pharma & Biotech</option>
                      <option>IT & Software</option>
                      <option>AI/ML & MedTech</option>
                      <option>Clinical Research & Hospital</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Company Size</label>
                    <select
                      value={industryData.company_size}
                      onChange={(e) => setIndustryData({ ...industryData, company_size: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    >
                      <option>1-50 employees</option>
                      <option>51-200 employees</option>
                      <option>201-1000 employees</option>
                      <option>1000+ employees</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Primary Location *</label>
                    <input
                      type="text"
                      required
                      value={industryData.location}
                      onChange={(e) => setIndustryData({ ...industryData, location: e.target.value })}
                      placeholder="e.g. New Delhi"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Website URL</label>
                    <input
                      type="url"
                      value={industryData.website}
                      onChange={(e) => setIndustryData({ ...industryData, website: e.target.value })}
                      placeholder="https://company.com"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {role === 'academician' && (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={academicData.name}
                      onChange={(e) => setAcademicData({ ...academicData, name: e.target.value })}
                      placeholder="e.g. Dr. Priya Sharma"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Academic Institution *</label>
                    <input
                      type="text"
                      required
                      value={academicData.institution}
                      onChange={(e) => setAcademicData({ ...academicData, institution: e.target.value })}
                      placeholder="e.g. All India Institute of Ayurveda"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Department *</label>
                    <input
                      type="text"
                      required
                      value={academicData.department}
                      onChange={(e) => setAcademicData({ ...academicData, department: e.target.value })}
                      placeholder="e.g. Clinical Pharmacology"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Designation *</label>
                    <input
                      type="text"
                      required
                      value={academicData.designation}
                      onChange={(e) => setAcademicData({ ...academicData, designation: e.target.value })}
                      placeholder="e.g. Professor / Dean / TPO"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-800/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 mt-6"
            >
              {loading ? 'Creating Account...' : `Register as ${role.toUpperCase()}`}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-emerald-700 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
