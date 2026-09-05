import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';
import { Link } from 'react-router-dom';
import { MatchScoreBadge } from '../../components/common/MatchScoreBadge';
import {
  CheckSquare,
  Clock,
  Calendar,
  Building,
  Video,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';

export const ApplicationTracker = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApps = async () => {
      try {
        const res = await studentAPI.getApplications();
        setApplications(res.applications || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadApps();
  }, []);

  const stages = ['applied', 'shortlisted', 'interview', 'selected'];

  const getStageIndex = (status) => {
    if (status === 'rejected') return -1;
    const idx = stages.indexOf(status);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-emerald-600" />
          Application Tracker & Interview Schedules
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Track the live progression of your internship and placement applications in real-time.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No applications yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You haven't submitted any internship or job applications yet. Discover opportunities matching your skills!
            </p>
          </div>
          <Link
            to="/student/internships"
            className="inline-block px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
          >
            Browse Recommended Internships
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const currentStageIdx = getStageIndex(app.status);
            const isRejected = app.status === 'rejected';

            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5"
              >
                {/* Top Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-slate-100 text-slate-700">
                        {app.opportunity?.type || 'Opening'}
                      </span>
                      <span className="text-xs text-slate-400">
                        Applied on {new Date(app.applied_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      {app.opportunity?.title || 'Position'}
                    </h3>
                    <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mt-0.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {app.opportunity?.company_name || 'Enterprise'} • {app.opportunity?.location}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <MatchScoreBadge score={app.match_score} breakdown={app.match_breakdown} />
                  </div>
                </div>

                {/* 5-Step Visual Timeline */}
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Recruitment Stage Progression
                  </div>

                  {isRejected ? (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Application Not Selected for this cohort. Keep enhancing your skills!</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      {stages.map((stg, i) => {
                        const isCompleted = i < currentStageIdx;
                        const isCurrent = i === currentStageIdx;

                        return (
                          <div key={stg} className="text-center">
                            <div
                              className={`h-2 rounded-full mb-2 transition-all ${
                                isCompleted
                                  ? 'bg-emerald-600'
                                  : isCurrent
                                  ? 'bg-emerald-500 animate-pulse'
                                  : 'bg-slate-200'
                              }`}
                            />
                            <span
                              className={`text-[11px] font-bold capitalize ${
                                isCurrent
                                  ? 'text-emerald-700 font-extrabold'
                                  : isCompleted
                                  ? 'text-slate-800'
                                  : 'text-slate-400'
                              }`}
                            >
                              {stg}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Interview Information Banner */}
                {app.interview && (
                  <div className="p-4 bg-gradient-to-r from-indigo-50 via-teal-50 to-emerald-50 rounded-xl border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
                        <Video className="w-4 h-4 text-indigo-600" />
                        <span>Online Interview Scheduled</span>
                      </div>
                      <div className="text-xs text-slate-700 font-semibold mt-1">
                        Time: {app.interview.scheduled_at} ({app.interview.mode})
                      </div>
                      {app.interview.notes && (
                        <p className="text-[11px] text-slate-500 mt-0.5">{app.interview.notes}</p>
                      )}
                    </div>

                    <a
                      href={app.interview.meeting_link}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                    >
                      <span>Join Interview</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
