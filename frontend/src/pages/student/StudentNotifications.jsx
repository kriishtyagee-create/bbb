import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { notificationsAPI } from '../../services/api';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, ExternalLink, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';

export const StudentNotifications = () => {
  const { notifications, refreshNotifications } = useAuth();

  const handleMarkAll = async () => {
    await notificationsAPI.markAllRead();
    await refreshNotifications();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-emerald-600" />
            Notifications & Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time updates regarding interview invites, match scores, and application status.
          </p>
        </div>

        <button
          onClick={handleMarkAll}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 shadow-2xs transition-colors"
        >
          <CheckCheck className="w-4 h-4 text-emerald-600" />
          <span>Mark All as Read</span>
        </button>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
            No notifications at the moment.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`bg-white p-5 rounded-2xl border transition-all ${
                !n.is_read
                  ? 'border-emerald-300 bg-emerald-50/30 shadow-xs'
                  : 'border-slate-200 shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 ${
                      n.type === 'interview'
                        ? 'bg-indigo-100 text-indigo-700'
                        : n.type === 'match_alert'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {n.type === 'interview' ? (
                      <Calendar className="w-5 h-5" />
                    ) : n.type === 'match_alert' ? (
                      <Sparkles className="w-5 h-5" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{n.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                    {n.action_url && (
                      <Link
                        to={n.action_url}
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 mt-2 hover:underline"
                      >
                        <span>Take Action / View Details</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>

                <span className="text-[11px] text-slate-400 whitespace-nowrap">
                  {new Date(n.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
