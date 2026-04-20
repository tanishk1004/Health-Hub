import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const SEVERITY_CONFIG = {
  low: { color: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800', badge: 'badge-success', icon: '✅', label: 'Low Severity' },
  moderate: { color: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800', badge: 'badge-warning', icon: '⚠️', label: 'Moderate Severity' },
  high: { color: 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800', badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400', icon: '🔶', label: 'High Severity' },
  critical: { color: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800', badge: 'badge-danger', icon: '🚨', label: 'CRITICAL — Seek Emergency Care' }
};

const COMMON_SYMPTOMS = [
  'Headache', 'Fever', 'Cough', 'Chest pain', 'Stomach pain',
  'Nausea', 'Fatigue', 'Back pain', 'Rash', 'Anxiety',
  'Shortness of breath', 'Dizziness', 'Joint pain', 'Sore throat'
];

export default function SymptomChecker() {
  const [text, setText] = useState('');
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const toggleSymptom = (s) => {
    setSelected((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleAnalyze = async () => {
    const combined = [text, ...selected].filter(Boolean).join(', ');
    if (!combined.trim() || combined.trim().length < 5) {
      toast.error('Please describe your symptoms or select from the list.');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.post('/symptoms/analyze', {
        symptomsText: combined,
        symptoms: selected
      });
      setResult(data.result);
      toast.success('Analysis complete!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    if (showHistory) { setShowHistory(false); return; }
    setHistoryLoading(true);
    try {
      const { data } = await api.get('/symptoms/history');
      setHistory(data.records || []);
      setShowHistory(true);
    } catch {
      toast.error('Failed to load history.');
    } finally {
      setHistoryLoading(false);
    }
  };

  const deleteRecord = async (id) => {
    try {
      await api.delete(`/symptoms/history/${id}`);
      setHistory((prev) => prev.filter((r) => r._id !== id));
      toast.success('Record deleted.');
    } catch {
      toast.error('Failed to delete record.');
    }
  };

  const cfg = result ? SEVERITY_CONFIG[result.severity] || SEVERITY_CONFIG.low : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">AI Symptom Checker</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Describe your symptoms for an instant AI-powered health assessment.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6 flex gap-3">
        <span className="text-xl flex-shrink-0">⚠️</span>
        <p className="text-sm text-amber-800 dark:text-amber-300">
          <strong>Medical Disclaimer:</strong> This tool provides informational guidance only and is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-5">
          <div className="card">
            <h2 className="font-semibold text-slate-900 dark:text-white mb-3">Describe Your Symptoms</h2>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g., I have a severe headache and fever since yesterday morning..."
              rows={4}
              className="input resize-none"
            />
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{text.length} characters</p>
          </div>

          <div className="card">
            <h2 className="font-semibold text-slate-900 dark:text-white mb-3">Common Symptoms</h2>
            <div className="flex flex-wrap gap-2">
              {COMMON_SYMPTOMS.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSymptom(s)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                    selected.includes(s)
                      ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-primary-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {selected.length > 0 && (
              <p className="text-xs text-primary-600 dark:text-primary-400 mt-2">
                {selected.length} symptom{selected.length > 1 ? 's' : ''} selected
              </p>
            )}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="btn btn-primary w-full py-3 text-base font-semibold"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" />
                Analyzing...
              </span>
            ) : '🔍 Analyze Symptoms'}
          </button>
        </div>

        {/* Result Panel */}
        <div>
          {loading && (
            <div className="card flex flex-col items-center justify-center py-16">
              <LoadingSpinner size="lg" />
              <p className="text-slate-500 dark:text-slate-400 mt-4">Analyzing your symptoms...</p>
            </div>
          )}

          {!loading && !result && (
            <div className="card flex flex-col items-center justify-center py-16 text-center">
              <div className="text-5xl mb-4">🩺</div>
              <p className="text-slate-600 dark:text-slate-400 font-medium">Your analysis will appear here</p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Describe your symptoms and click Analyze</p>
            </div>
          )}

          {!loading && result && cfg && (
            <div className={`card border-2 ${cfg.color} animate-slide-up`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{cfg.icon}</span>
                <div>
                  <span className={`badge ${cfg.badge} text-xs mb-1`}>{cfg.label}</span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{result.condition}</h3>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white/60 dark:bg-slate-800/60 rounded-lg p-3">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Recommendation</p>
                  <p className="text-sm text-slate-800 dark:text-slate-200">{result.recommendation}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/60 dark:bg-slate-800/60 rounded-lg p-3">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Specialist</p>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{result.specialistType}</p>
                  </div>
                  <div className="bg-white/60 dark:bg-slate-800/60 rounded-lg p-3">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Urgency</p>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{result.urgency}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 italic border-t border-slate-200 dark:border-slate-700 pt-3">
                  {result.disclaimer}
                </p>

                <Link to="/doctors" className="btn btn-primary w-full text-sm">
                  Find a {result.specialistType?.split('/')[0].trim()} →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* History Section */}
      <div className="mt-8">
        <button
          onClick={loadHistory}
          disabled={historyLoading}
          className="btn btn-secondary flex items-center gap-2"
        >
          {historyLoading ? <LoadingSpinner size="sm" /> : null}
          {showHistory ? 'Hide History' : 'View Symptom History'}
        </button>

        {showHistory && (
          <div className="mt-4 space-y-3 animate-fade-in">
            {history.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-sm">No history yet.</p>
            ) : (
              history.map((r) => (
                <div key={r._id} className="card flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`badge ${SEVERITY_CONFIG[r.result?.severity]?.badge || 'badge-info'}`}>
                        {r.result?.severity?.toUpperCase()}
                      </span>
                      <span className="font-medium text-slate-900 dark:text-white text-sm">{r.result?.condition}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{r.symptomsText}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      {new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteRecord(r._id)}
                    className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
                    aria-label="Delete record"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
