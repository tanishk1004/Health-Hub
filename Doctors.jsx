import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import DoctorCard from '../components/DoctorCard';
import LoadingSpinner from '../components/LoadingSpinner';

const SPECIALIZATIONS = [
  'All', 'Cardiologist', 'Neurologist', 'Dermatologist', 'Orthopedist',
  'Pediatrician', 'Gastroenterologist', 'Psychiatrist', 'Endocrinologist',
  'General Physician', 'ENT'
];

const AVAILABILITY_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'available', label: 'Available' },
  { value: 'busy', label: 'Busy' },
  { value: 'offline', label: 'Offline' }
];

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [availability, setAvailability] = useState('');
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [bookForm, setBookForm] = useState({ date: '', time: '', type: 'in-person', reason: '' });
  const [bookLoading, setBookLoading] = useState(false);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (specialization && specialization !== 'All') params.specialization = specialization;
      if (availability) params.availability = availability;
      const { data } = await api.get('/doctors', { params });
      setDoctors(data.doctors || []);
    } catch {
      toast.error('Failed to load doctors.');
    } finally {
      setLoading(false);
    }
  }, [search, specialization, availability]);

  useEffect(() => {
    const timer = setTimeout(fetchDoctors, 300);
    return () => clearTimeout(timer);
  }, [fetchDoctors]);

  const handleBook = (doctor) => {
    setBookingDoctor(doctor);
    setBookForm({ date: '', time: '', type: 'in-person', reason: '' });
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    if (!bookForm.date || !bookForm.time) {
      toast.error('Please select a date and time.');
      return;
    }
    setBookLoading(true);
    try {
      await api.post('/appointments', {
        doctorId: bookingDoctor._id,
        ...bookForm
      });
      toast.success(`Appointment booked with ${bookingDoctor.name}!`);
      setBookingDoctor(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setBookLoading(false);
    }
  };

  // Min date = today
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Find Doctors</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Browse our network of verified healthcare specialists.</p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, specialty..."
              className="input pl-9"
            />
          </div>
          <select
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className="input"
          >
            {SPECIALIZATIONS.map((s) => (
              <option key={s} value={s === 'All' ? '' : s}>{s}</option>
            ))}
          </select>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="input"
          >
            {AVAILABILITY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
      ) : doctors.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-4">👨‍⚕️</div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">No doctors found</p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Try adjusting your search filters</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{doctors.length} doctor{doctors.length !== 1 ? 's' : ''} found</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor._id} doctor={doctor} onBook={handleBook} />
            ))}
          </div>
        </>
      )}

      {/* Booking Modal */}
      {bookingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Book Appointment</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{bookingDoctor.name} — {bookingDoctor.specialization}</p>
                </div>
                <button
                  onClick={() => setBookingDoctor(null)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleBookSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Date</label>
                  <input
                    type="date"
                    value={bookForm.date}
                    min={today}
                    onChange={(e) => setBookForm({ ...bookForm, date: e.target.value })}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Time Slot</label>
                  {bookingDoctor.availableSlots?.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {bookingDoctor.availableSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setBookForm({ ...bookForm, time: slot })}
                          className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                            bookForm.time === slot
                              ? 'bg-primary-600 text-white border-primary-600'
                              : 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-primary-400'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="time"
                      value={bookForm.time}
                      onChange={(e) => setBookForm({ ...bookForm, time: e.target.value })}
                      className="input"
                      required
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Consultation Type</label>
                  <select
                    value={bookForm.type}
                    onChange={(e) => setBookForm({ ...bookForm, type: e.target.value })}
                    className="input"
                  >
                    <option value="in-person">In-Person</option>
                    <option value="video">Video Call</option>
                    <option value="phone">Phone Call</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Reason (optional)</label>
                  <textarea
                    value={bookForm.reason}
                    onChange={(e) => setBookForm({ ...bookForm, reason: e.target.value })}
                    placeholder="Brief reason for consultation..."
                    rows={2}
                    className="input resize-none"
                  />
                </div>

                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 text-sm">
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Consultation Fee</span>
                    <span className="font-semibold">${bookingDoctor.consultationFee}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setBookingDoctor(null)} className="btn btn-secondary flex-1">
                    Cancel
                  </button>
                  <button type="submit" disabled={bookLoading} className="btn btn-primary flex-1">
                    {bookLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <LoadingSpinner size="sm" />
                        Booking...
                      </span>
                    ) : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
