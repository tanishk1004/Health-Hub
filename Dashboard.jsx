import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const QUICK_ACTIONS = [
  { to: '/symptom-checker', label: 'Check Symptoms', icon: '🩺', color: 'from-blue-500 to-blue-600', desc: 'AI-powered analysis' },
  { to: '/doctors', label: 'Find Doctors', icon: '👨‍⚕️', color: 'from-teal-500 to-teal-600', desc: 'Browse specialists' },
  { to: '/appointments', label: 'Appointments', icon: '📅', color: 'from-purple-500 to-purple-600', desc: 'Manage bookings' },
  { to: '/profile', label: 'My Profile', icon: '👤', color: 'from-orange-500 to-orange-600', desc: 'Update health info' }
];

const SEVERITY_COLORS = {
  low: 'badge-success',
  moderate: 'badge-warning',
  high: 'badge-danger',
  critical: 'bg-red-600 text-white'
};

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ appointments: 0, symptoms: 0, upcomingAppt: null });
  const [recentHistory, setRecentHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [historyRes, apptRes] = await Promise.all([
          api.get('/symptoms/history?limit=3'),
          api.get('/appointments?limit=5')
        ]);
        setRecentHistory(historyRes.data.records || []);
        const appts = apptRes.data.appointments || [];
        const upcoming = appts.find((a) => a.status === 'pending' || a.status === 'confirmed');
        setStats({
          appointments: apptRes.data.pagination?.total || 0,
          symptoms: historyRes.data.pagination?.total || 0,
          upcomingAppt: upcoming || null
        });
      } catch {
        // silently fail — dashboard still renders
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          {greeting()}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Here's your health overview for today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Symptom Checks', value: loading ? '—' : stats.symptoms, icon: '🩺', color: 'text-blue-600 dark:text-blue-400' },
          { label: 'Appointments', value: loading ? '—' : stats.appointments, icon: '📅', color: 'text-purple-600 dark:text-purple-400' },
          { label: 'Health Score', value: '85%', icon: '❤️', color: 'text-red-500' },
          { label: 'Days Active', value: Math.max(1, Math.floor((Date.now() - new Date(user?.createdAt || Date.now()).getTime()) / 86400000)), icon: '⭐', color: 'text-yellow-500' }
        ].map((s) => (
          <div key={s.label} className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{s.icon}</span>
              <span className={`text-2xl font-bold ${s.color}`}>{s.value}</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Upcoming Appointment Banner */}
      {stats.upcomingAppt && (
        <div className="bg-gradient-to-r from-primary-600 to-teal-600 rounded-xl p-5 mb-8 text-white flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">📅</div>
            <div>
              <p className="font-semibold text-lg">Upcoming Appointment</p>
              <p className="text-blue-100 text-sm">
                {stats.upcomingAppt.doctorId?.name} — {stats.upcomingAppt.date} at {stats.upcomingAppt.time}
              </p>
            </div>
          </div>
          <Link to="/appointments" className="btn bg-white text-primary-700 hover:bg-blue-50 text-sm font-semibold">
            View Details
          </Link>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="card hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 group text-center"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <p className="font-semibold text-slate-900 dark:text-white text-sm">{action.label}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Symptom History */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Symptom Checks</h2>
          <Link to="/symptom-checker" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
            Check symptoms →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-8"><LoadingSpinner /></div>
        ) : recentHistory.length === 0 ? (
          <div className="card text-center py-10">
            <div className="text-4xl mb-3">🩺</div>
            <p className="text-slate-600 dark:text-slate-400 font-medium">No symptom checks yet</p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-1 mb-4">Use the AI symptom checker to get started</p>
            <Link to="/symptom-checker" className="btn btn-primary inline-flex">
              Check Symptoms Now
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentHistory.map((record) => (
              <div key={record._id} className="card flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`badge ${SEVERITY_COLORS[record.result?.severity] || 'badge-info'}`}>
                      {record.result?.severity?.toUpperCase()}
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white truncate">{record.result?.condition}</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{record.symptomsText}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    {new Date(record.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-slate-500 dark:text-slate-400">{record.result?.specialistType}</p>
                  <p className="text-xs text-primary-600 dark:text-primary-400 mt-0.5">{record.result?.urgency}</p>
                </div>
              </div>
            ))}
            <Link to="/symptom-checker" className="block text-center text-sm text-primary-600 dark:text-primary-400 hover:underline pt-2">
              View all history →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

