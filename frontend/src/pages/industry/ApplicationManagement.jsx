import React, { useState, useEffect } from 'react';
import { industryAPI } from '../../services/api';
import { MatchScoreBadge } from '../../components/common/MatchScoreBadge';
import { Modal } from '../../components/common/Modal';
import {
  Users,
  CheckCircle2,
  Calendar,
  XCircle,
  Clock,
  Video,
  ExternalLink,
  Award,
  Filter,
  Search,
  Building
} from 'lucide-react';

export const ApplicationManagement = () => {
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Interview modal state
  const [selectedAppForInterview, setSelectedAppForInterview] = useState(null);
  const [interviewDate, setInterviewDate] = useState('2026-09-25 15:00 IST');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/ayush-sih-2024');
  const [interviewMode, setInterviewMode] = useState('Online Video (Google Meet / Teams)');
  const [interviewNotes, setInterviewNotes] = useState('Discussion on clinical data pipelines and portfolio project review.');
  const [scheduling, setScheduling] = useState(false);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const res = await industryAPI.getApplications(`?status=${statusFilter}`);
      setApplications(res.applications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [statusFilter]);

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await industryAPI.updateAppStatus(appId, newStatus);
      await loadApplications();
    } catch (err) {
      alert(err.message || 'Status update failed');
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAppForInterview) return;
    setScheduling(true);
    try {
      await industryAPI.scheduleInterview(selectedAppForInterview.id, {
        scheduled_at: interviewDate,
        meeting_link: meetingLink,
        mode: interviewMode,
        notes: interviewNotes,
      });
      setSelectedAppForInterview(null);
      await loadApplications();
    } catch (err) {
      alert(err.message || 'Failed to schedule interview');
    } finally {
      setScheduling(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-600" />
          Candidate Applications & Recruitment Pipeline
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Review candidates, evaluate AI-calculated skill matching scores, shortlist, and schedule interviews.
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['all', 'applied', 'shortlisted', 'interview', 'selected', 'rejected'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              statusFilter === st
                ? 'bg-indigo-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {st === 'all' ? 'All Applicants' : st}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
          No candidate applications found under this status filter.
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm uppercase">
                    {app.student?.name?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {app.student?.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {app.student?.college} • {app.student?.branch} ({app.student?.year}) • CGPA: {app.student?.cgpa}/10
                    </p>
                    <p className="text-[11px] font-semibold text-indigo-700 mt-0.5">
                      Applied for: {app.opportunity?.title} ({app.opportunity?.type})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <MatchScoreBadge score={app.match_score} breakdown={app.match_breakdown} />
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                      app.status === 'interview'
                        ? 'bg-indigo-100 text-indigo-800'
                        : app.status === 'shortlisted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : app.status === 'selected'
                        ? 'bg-teal-100 text-teal-800'
                        : app.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              </div>

              {/* Cover note & skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider block mb-1">
                    Candidate Statement:
                  </span>
                  <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200/80 leading-relaxed italic">
                    "{app.cover_note || 'Excited to apply for this opening and contribute to the team.'}"
                  </p>
                </div>

                <div>
                  <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider block mb-1">
                    Candidate Verified Skills:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {app.student?.skills?.map((sk, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-medium text-[11px] border border-slate-200"
                      >
                        {sk.name} ({sk.proficiency_level})
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Scheduled Interview Banner if any */}
              {app.interview && (
                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-indigo-950 font-semibold">
                    <Video className="w-4 h-4 text-indigo-600" />
                    <span>Interview: {app.interview.scheduled_at}</span>
                  </div>
                  <a
                    href={app.interview.meeting_link}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-indigo-700 hover:underline flex items-center gap-1"
                  >
                    Meeting Link <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
                {app.status !== 'shortlisted' && app.status !== 'selected' && (
                  <button
                    onClick={() => handleUpdateStatus(app.id, 'shortlisted')}
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-300 transition-colors"
                  >
                    ✓ Shortlist
                  </button>
                )}

                <button
                  onClick={() => setSelectedAppForInterview(app)}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-xs rounded-xl border border-indigo-300 transition-colors flex items-center gap-1"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Schedule Interview</span>
                </button>

                {app.status !== 'selected' && (
                  <button
                    onClick={() => handleUpdateStatus(app.id, 'selected')}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    🏆 Hire / Select
                  </button>
                )}

                {app.status !== 'rejected' && (
                  <button
                    onClick={() => handleUpdateStatus(app.id, 'rejected')}
                    className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-colors"
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Interview Modal */}
      {selectedAppForInterview && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedAppForInterview(null)}
          title={`Schedule Interview with ${selectedAppForInterview.student?.name}`}
          subtitle={`Position: ${selectedAppForInterview.opportunity?.title}`}
        >
          <form onSubmit={handleScheduleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Interview Date & Time *
              </label>
              <input
                type="text"
                required
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                placeholder="e.g. 2026-09-25 15:00 IST"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Video Meeting Link *
              </label>
              <input
                type="url"
                required
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="https://meet.google.com/..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Interview Mode
              </label>
              <select
                value={interviewMode}
                onChange={(e) => setInterviewMode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option>Online Video (Google Meet / Teams)</option>
                <option>Technical Coding / Live Assessment</option>
                <option>In-Person On-Site Round</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Notes for Candidate
              </label>
              <textarea
                rows={3}
                value={interviewNotes}
                onChange={(e) => setInterviewNotes(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={scheduling}
              className="w-full py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 mt-4"
            >
              {scheduling ? 'Scheduling...' : 'Confirm & Dispatch Notification to Student'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};
