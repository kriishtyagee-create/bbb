import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { studentAPI } from '../../services/api';
import { MatchScoreBadge } from '../../components/common/MatchScoreBadge';
import {
  GraduationCap,
  Sparkles,
  Compass,
  Briefcase,
  Clock,
  ArrowRight,
  AlertCircle,
  Building,
  MapPin
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [gapData, setGapData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profRes, recRes, appRes] = await Promise.all([
          studentAPI.getProfile(),
          studentAPI.getRecommendations('internship'),
          studentAPI.getApplications(),
        ]);
        setProfile(profRes.student);
        setRecommendations(recRes.opportunities?.slice(0, 3) || []);
        setApplications(appRes.applications?.slice(0, 3) || []);

        const gapRes = await studentAPI.getSkillGap(profRes.student?.target_role || 'Data Analyst');
        setGapData(gapRes);
      } catch (err) {
        console.error('Error loading student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const studentName = profile?.name || user?.profile?.name || 'Rahul Sharma';
  const targetRole = profile?.target_role || 'Data Analyst';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bold">Loading Student Intelligence Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Welcome Frosted Glass Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-900/90 via-teal-950/90 to-slate-950/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 text-white shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden border border-emerald-500/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/25 text-emerald-300 text-xs font-bold mb-3 border border-emerald-400/40 shadow-xs backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            AI-Powered Career Intelligence
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Welcome back, {studentName} 👋
          </h1>
          <p className="text-xs sm:text-base text-emerald-100/90 mt-2 leading-relaxed font-medium">
            Target Career Goal: <strong className="text-amber-300">{targetRole}</strong> at{' '}
            <span className="text-white font-bold">{profile?.college || 'All India Institute of Ayurveda, New Delhi'}</span>. Your competency profile is actively matched against live industry requisitions.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/student/skill-gap"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 hover:scale-105"
            >
              <Compass className="w-4 h-4" />
              <span>Skill Gap Analysis ({gapData?.gap_score || 25}% Gap)</span>
            </Link>
            <Link
              to="/student/internships"
              className="px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/25 font-bold text-xs sm:text-sm backdrop-blur-xl transition-all hover:scale-105"
            >
              Explore Matching Internships
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Theme-Aware Glass Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-white/15 shadow-md dark:shadow-xl hover:border-emerald-400/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Profile Score</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-2">92%</div>
          <div className="text-[11px] sm:text-xs text-emerald-600 dark:text-emerald-400 font-extrabold mt-1">Verified & Active Profile</div>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-white/15 shadow-md dark:shadow-xl hover:border-indigo-400/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Skill Fit Score</span>
            <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-700 dark:text-indigo-400">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-2">
            {gapData?.current_score || 75}%
          </div>
          <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold mt-1">
            Benchmark: {targetRole}
          </div>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-white/15 shadow-md dark:shadow-xl hover:border-amber-400/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Skill Gap</span>
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-400">
              <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-amber-600 dark:text-amber-400 mt-2">
            {gapData?.gap_score || 25}%
          </div>
          <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold mt-1">
            {gapData?.missing_skills?.length || 1} priority skill to master
          </div>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-white/15 shadow-md dark:shadow-xl hover:border-teal-400/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Applications</span>
            <div className="p-2 rounded-xl bg-teal-500/15 text-teal-700 dark:text-teal-400">
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-2">
            {applications.length} Active
          </div>
          <div className="text-[11px] sm:text-xs text-emerald-600 dark:text-emerald-400 font-extrabold mt-1">
            1 Interview Scheduled
          </div>
        </div>
      </div>

      {/* 3. Skill Gap Priority Alert Glass Widget */}
      {gapData && gapData.missing_skills && gapData.missing_skills.length > 0 && (
        <div className="bg-amber-500/15 dark:bg-amber-500/20 backdrop-blur-xl border border-amber-400/50 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-amber-500/25 text-amber-800 dark:text-amber-300 rounded-2xl shadow-2xs border border-amber-400/50 shrink-0">
              <AlertCircle className="w-6 h-6 text-amber-700 dark:text-amber-300" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold text-amber-950 dark:text-amber-200 uppercase tracking-wider">
                Priority Skill Gap Identified
              </h3>
              <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-300 mt-0.5 leading-relaxed font-medium">
                Your highest missing competency for <strong>{targetRole}</strong> is{' '}
                <span className="font-extrabold underline">{gapData.missing_skills[0].name}</span>. Completing this recommended module will increase your candidate fit by 24%.
              </p>
            </div>
          </div>
          <Link
            to="/student/skill-gap"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold text-xs sm:text-sm shrink-0 shadow-md transition-all hover:scale-105"
          >
            View Learning Path →
          </Link>
        </div>
      )}

      {/* 4. Two Columns: Recommended Internships & Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Recommended Opportunities Glass Panel */}
        <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-white/15 p-6 shadow-md dark:shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">Recommended Opportunities</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Ranked based on your competencies & branch</p>
            </div>
            <Link
              to="/student/internships"
              className="text-xs sm:text-sm font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3.5">
            {recommendations.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No opportunities available right now.</p>
            ) : (
              recommendations.map((opp) => (
                <div
                  key={opp.id}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:border-emerald-400/50 hover:bg-white dark:hover:bg-white/10 shadow-2xs transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{opp.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                        <span className="flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-slate-400" /> {opp.company_name}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" /> {opp.location}
                        </span>
                      </div>
                    </div>
                    <MatchScoreBadge score={opp.match_score} breakdown={opp.match_breakdown} />
                  </div>

                  <div className="mt-3.5 flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-white/10 text-xs sm:text-sm">
                    <span className="font-extrabold text-emerald-700 dark:text-emerald-400">{opp.stipend_salary}</span>
                    <Link
                      to="/student/internships"
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                    >
                      {opp.has_applied ? 'Applied' : 'View & Apply'}
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Application Tracker Preview Glass Panel */}
        <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-white/15 p-6 shadow-md dark:shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">Application Pipeline</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Live recruitment progress</p>
            </div>
            <Link
              to="/student/applications"
              className="text-xs sm:text-sm font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              Full Tracker <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3.5">
            {applications.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">You have not applied to any opportunities yet.</p>
            ) : (
              applications.map((app) => (
                <div
                  key={app.id}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {app.opportunity?.title || 'Application'}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                        {app.opportunity?.company_name || 'Enterprise'}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] sm:text-xs font-extrabold px-3 py-1 rounded-full uppercase ${
                        app.status === 'interview'
                          ? 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-400/40'
                          : app.status === 'shortlisted'
                          ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-400/40'
                          : app.status === 'selected'
                          ? 'bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-400/40'
                          : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/10'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  {app.interview && (
                    <div className="mt-3.5 p-3.5 bg-indigo-500/15 dark:bg-indigo-500/20 rounded-2xl border border-indigo-400/40 text-xs sm:text-sm backdrop-blur-md">
                      <div className="font-extrabold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        Interview scheduled on {app.interview.scheduled_at}
                      </div>
                      <a
                        href={app.interview.meeting_link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 mt-1 text-xs font-extrabold text-indigo-700 dark:text-indigo-400 hover:underline"
                      >
                        Join Video Meeting Link →
                      </a>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
