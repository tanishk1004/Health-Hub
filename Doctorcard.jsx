import { useState } from 'react';

const AVAILABILITY_STYLES = {
  available: 'badge-success',
  busy: 'badge-warning',
  offline: 'badge-danger'
};

const AVAILABILITY_LABELS = {
  available: '● Available',
  busy: '● Busy',
  offline: '● Offline'
};

export default function DoctorCard({ doctor, onBook }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start gap-4">
        <img
          src={doctor.imageUrl || `https://api.dicebear.com/7.x/personas/svg?seed=${doctor.name}`}
          alt={doctor.name}
          className="w-16 h-16 rounded-full object-cover bg-slate-100 flex-shrink-0 border-2 border-primary-100"
          onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=2563eb&color=fff`; }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white truncate">{doctor.name}</h3>
              <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">{doctor.specialization}</p>
            </div>
            <span className={`badge ${AVAILABILITY_STYLES[doctor.availability]} flex-shrink-0`}>
              {AVAILABILITY_LABELS[doctor.availability]}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{doctor.qualification}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-2">
          <p className="text-lg font-bold text-slate-900 dark:text-white">{doctor.experience}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Yrs Exp</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-2">
          <p className="text-lg font-bold text-yellow-500">★ {doctor.rating}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{doctor.reviewCount} reviews</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-2">
          <p className="text-lg font-bold text-slate-900 dark:text-white">${doctor.consultationFee}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Fee</p>
        </div>
      </div>

      {/* Hospital & Location */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className="truncate">{doctor.hospital}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{doctor.location}</span>
        </div>
      </div>

      {/* Languages */}
      <div className="flex flex-wrap gap-1">
        {doctor.languages?.map((lang) => (
          <span key={lang} className="badge bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            {lang}
          </span>
        ))}
      </div>

      {/* About (expandable) */}
      {doctor.about && (
        <div>
          <p className={`text-sm text-slate-600 dark:text-slate-400 leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
            {doctor.about}
          </p>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-primary-600 dark:text-primary-400 hover:underline mt-1"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        </div>
      )}

      {/* Book Button */}
      <button
        onClick={() => onBook(doctor)}
        disabled={doctor.availability === 'offline'}
        className="btn btn-primary w-full mt-auto disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {doctor.availability === 'offline' ? 'Currently Unavailable' : 'Book Appointment'}
      </button>
    </div>
  );
}
