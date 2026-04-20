import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const STATUS_CONFIG = {
  pending: { badge: 'badge-warning', label: 'Pending', icon: '⏳' },
  confirmed: { badge: 'badge-success', label: 'Confirmed', icon: '✅' },
  cancelled: { badge: 'badge-danger', label: 'Cancelled', icon: '❌' },
  completed: { badge: 'badge-info', label: 'Completed', icon: '🏁' }
};

const TYPE_ICONS = { 'in-person': '🏥', video: '📹', phone: '📞' };

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [cancelling, setCancelling] = useState(null);

  const fetchAppointments = async (status = '') => {
    setLoading(true);
    try {
      const params = status ? { status } : {};
      const { data } = await api.get('/appointments', { params });
      setAppointments(data.appointments || []);
    } catch {
      toast.error('Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(filter); }, [filter]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    setCancelling(id);
    try {
      await api.put(`/appointments/${id}/cancel`);
      toast.success('Appointment cancelled.');
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: 'cancelled' } : a))
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel appointment.');
    } finally {
      setCancelling(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">My Appointments</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your upcoming and past consultations.</p>
        </div>
        <Link to="/doctors" className="btn btn-primary">
          + Book New
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {[
          { value: '', label: 'All' },
          { value: 'pending', label: 'Pending' },
          { value: 'confirmed', label: 'Confirmed' },
          { value: 'completed', label: 'Completed' },
          { value: 'cancelled', label: 'Cancelled' }
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === tab.value
                ? 'bg-primary-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
      ) : appointments.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-4">📅</div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">No appointments found</p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-1 mb-4">
            {filter ? `No ${filter} appointments` : 'Book your first appointment with a specialist'}
          </p>
          <Link to="/doctors" className="btn btn-primary inline-flex">
            Find a Doctor
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => {
            const cfg = STATUS_CONFIG[appt.status] || STATUS_CONFIG.pending;
            const doctor = appt.doctorId;
            return (
              <div key={appt._id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4 flex-wrap">
                  {/* Doctor Avatar */}
                  <img
                    src={doctor?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor?.name || 'Dr')}&background=2563eb&color=fff`}
                    alt={doctor?.name}
                    className="w-14 h-14 rounded-full object-cover bg-slate-100 border-2 border-primary-100 flex-shrink-0"
                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=Dr&background=2563eb&color=fff`; }}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">{doctor?.name || 'Doctor'}</h3>
                        <p className="text-sm text-primary-600 dark:text-primary-400">{doctor?.specialization}</p>
                      </div>
                      <span className={`badge ${cfg.badge}`}>{cfg.icon} {cfg.label}</span>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {appt.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {appt.time}
                      </span>
                      <span>{TYPE_ICONS[appt.type]} {appt.type?.charAt(0).toUpperCase() + appt.type?.slice(1)}</span>
                      <span className="font-medium text-slate-900 dark:text-white">${appt.fee}</span>
                    </div>

                    {appt.reason && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 italic">"{appt.reason}"</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {(appt.status === 'pending' || appt.status === 'confirmed') && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                    <button
                      onClick={() => handleCancel(appt._id)}
                      disabled={cancelling === appt._id}
                      className="btn text-sm text-red-600 border border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
                    >
                      {cancelling === appt._id ? (
                        <span className="flex items-center gap-2"><LoadingSpinner size="sm" /> Cancelling...</span>
                      ) : 'Cancel Appointment'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
