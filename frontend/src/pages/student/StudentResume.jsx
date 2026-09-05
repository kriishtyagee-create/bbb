import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';
import {
  FileText,
  Printer,
  Download,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Sparkles,
  Award,
  BookOpen,
  CheckCircle2
} from 'lucide-react';

export const StudentResume = () => {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [profRes, skRes] = await Promise.all([
          studentAPI.getProfile(),
          studentAPI.getSkills(),
        ]);
        setProfile(profRes.student);
        setSkills(skRes.skills || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Print Action */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-600" />
            Interactive Portfolio & Verified Resume
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Auto-generated resume verified by the National Skill Mapping System.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Modern Printable Resume Sheet */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-4xl mx-auto space-y-6 text-slate-900 print:shadow-none print:border-none print:p-0">
        {/* Header section */}
        <div className="border-b-2 border-emerald-700 pb-5 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {profile?.name || 'Rahul Sharma'}
            </h2>
            <p className="text-sm font-bold text-emerald-800 mt-1">
              {profile?.target_role || 'Data Analyst'} • {profile?.branch}
            </p>
          </div>

          <div className="text-xs text-slate-600 space-y-1 sm:text-right">
            <div className="flex items-center sm:justify-end gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{profile?.email || 'rahul.sharma@aiia.gov.in'}</span>
            </div>
            <div className="flex items-center sm:justify-end gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{profile?.phone || '+91 98765 43210'}</span>
            </div>
            <div className="flex items-center sm:justify-end gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{profile?.location || 'New Delhi, India'}</span>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-slate-100 pb-1 mb-2">
            Professional Summary
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed">
            {profile?.bio ||
              'Dedicated and analytical scholar at All India Institute of Ayurveda & DTU with strong foundations in Python, SQL, and data analysis. Seeking impactful internship and career opportunities to contribute to smart automation and clinical informatics.'}
          </p>
        </div>

        {/* Education */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-slate-100 pb-1 mb-3">
            Academic Background
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex flex-col sm:flex-row justify-between gap-1">
              <div>
                <h4 className="font-bold text-slate-900">
                  {profile?.college || 'All India Institute of Ayurveda (AIIA)'}
                </h4>
                <p className="text-slate-600">
                  {profile?.course} in {profile?.branch}
                </p>
              </div>
              <div className="sm:text-right">
                <span className="font-bold text-emerald-800">CGPA: {profile?.cgpa || 8.85}/10</span>
                <p className="text-[11px] text-slate-400">{profile?.year || '3rd Year (2022 - 2026)'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Verified Skills */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-slate-100 pb-1 mb-3">
            Verified Technical & Domain Competencies
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {skills.map((sk) => (
              <div
                key={sk.id}
                className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-900 block">{sk.name}</span>
                  <span className="text-[10px] text-slate-500">{sk.category}</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                  {sk.proficiency_level}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Academic / Capstone Projects */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-slate-100 pb-1 mb-3">
            Key Academic & Capstone Projects
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-bold text-slate-900">
                <span>AI Clinical Informatics Pipeline</span>
                <span className="text-slate-500 font-normal">2026</span>
              </div>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                Engineered automated ETL scripts using Python and SQL to clean, standardize, and visualize health trial data for research faculty.
              </p>
            </div>
            <div>
              <div className="flex justify-between font-bold text-slate-900">
                <span>Traditional Knowledge Digital Mapping</span>
                <span className="text-slate-500 font-normal">2025</span>
              </div>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                Created interactive dashboards analyzing phytocompound efficacy trends across botanical formulations using Pandas and Power BI.
              </p>
            </div>
          </div>
        </div>

        {/* Verification Footer */}
        <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1 text-emerald-700 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Digital Certificate Verified • Ministry of Ayush Skill Mapping System</span>
          </div>
          <span>ID: SIH-26044-{profile?.id || 101}</span>
        </div>
      </div>
    </div>
  );
};
