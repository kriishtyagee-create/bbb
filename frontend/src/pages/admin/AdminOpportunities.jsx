import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Briefcase, Building, MapPin, CheckCircle2, Clock } from 'lucide-react';

export const AdminOpportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getOpportunities().then((res) => {
      setOpportunities(res.opportunities || []);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-rose-600" />
          National Opportunity Audit & Compliance Ledger
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Verify and audit enterprise internship and job postings across Indian institutions.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="p-3 rounded-l-lg">ID</th>
                <th className="p-3">Posting Title</th>
                <th className="p-3">Company Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Stipend / Salary</th>
                <th className="p-3">Location</th>
                <th className="p-3">Applicants</th>
                <th className="p-3 rounded-r-lg">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {opportunities.map((opp) => (
                <tr key={opp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-bold text-slate-400">#{opp.id}</td>
                  <td className="p-3 font-bold text-slate-900">
                    {opp.title}
                    <div className="text-[10px] text-slate-400 font-normal">
                      Branch: {opp.branch_eligibility}
                    </div>
                  </td>
                  <td className="p-3 font-semibold text-slate-700">{opp.company_name}</td>
                  <td className="p-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        opp.type === 'internship'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {opp.type}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-emerald-800">{opp.stipend_salary}</td>
                  <td className="p-3 text-slate-600">{opp.location}</td>
                  <td className="p-3 font-extrabold text-indigo-700">
                    {opp.applications_count || 0} applicants
                  </td>
                  <td className="p-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                      ✓ Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
