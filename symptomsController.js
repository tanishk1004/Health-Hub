const { insert, findAll, findOne, deleteById, count } = require('../db/memoryStore');

const DISCLAIMER =
  'This is an AI-assisted assessment for informational purposes only. It is NOT a medical diagnosis. Always consult a qualified healthcare professional.';

const CONDITIONS = [
  { keywords: ['chest pain', 'chest tightness', 'heart attack', 'palpitation', 'left arm pain'], condition: 'Possible Cardiac Issue', severity: 'critical', recommendation: 'Call emergency services (911) immediately. Do not drive yourself.', specialistType: 'Cardiologist / Emergency Medicine', urgency: 'EMERGENCY — Call 911 now' },
  { keywords: ['stroke', 'face drooping', 'arm weakness', 'speech difficulty', 'sudden numbness'], condition: 'Possible Stroke', severity: 'critical', recommendation: 'Call 911 immediately. Note the time symptoms started.', specialistType: 'Neurologist / Emergency Medicine', urgency: 'EMERGENCY — Call 911 now' },
  { keywords: ['high fever', 'fever', 'chills', 'sweating', 'body ache', 'fatigue', 'temperature'], condition: 'Fever / Systemic Infection', severity: 'moderate', recommendation: 'Rest, stay hydrated, take OTC fever reducers. See a doctor if fever exceeds 103°F or persists beyond 3 days.', specialistType: 'General Physician', urgency: 'Within 24–48 hours' },
  { keywords: ['headache', 'migraine', 'head pain', 'throbbing', 'light sensitivity'], condition: 'Headache / Migraine', severity: 'low', recommendation: 'Rest in a quiet dark room. OTC pain relief. Stay hydrated.', specialistType: 'Neurologist', urgency: 'Within a week if persistent' },
  { keywords: ['cough', 'cold', 'sore throat', 'runny nose', 'congestion', 'sneezing'], condition: 'Upper Respiratory Infection', severity: 'low', recommendation: 'Rest, fluids, OTC medications. See a doctor if symptoms worsen after 7 days.', specialistType: 'General Physician / ENT', urgency: 'A few days if not improving' },
  { keywords: ['stomach pain', 'abdominal pain', 'nausea', 'vomiting', 'diarrhea', 'bloating', 'indigestion'], condition: 'Gastrointestinal Issue', severity: 'moderate', recommendation: 'Stay hydrated with clear fluids. Seek care if pain is severe or persists beyond 48 hours.', specialistType: 'Gastroenterologist', urgency: 'Within 24 hours if severe' },
  { keywords: ['rash', 'itching', 'hives', 'skin irritation', 'eczema', 'acne', 'blisters'], condition: 'Dermatological Condition', severity: 'low', recommendation: 'Avoid scratching. Apply cool compress. OTC antihistamines for itching.', specialistType: 'Dermatologist', urgency: 'Within a week' },
  { keywords: ['back pain', 'lower back', 'spine pain', 'neck pain', 'joint pain', 'muscle pain', 'stiffness'], condition: 'Musculoskeletal Pain', severity: 'low', recommendation: 'Rest, ice/heat therapy, OTC pain relievers. Gentle stretching.', specialistType: 'Orthopedist / Physiotherapist', urgency: 'Within a week if persistent' },
  { keywords: ['anxiety', 'panic attack', 'depression', 'stress', 'mood swings', 'insomnia', 'sleep problems'], condition: 'Mental Health Concern', severity: 'moderate', recommendation: 'Practice deep breathing and mindfulness. Seek professional help.', specialistType: 'Psychiatrist / Psychologist', urgency: 'Within a few days' },
  { keywords: ['diabetes', 'blood sugar', 'frequent urination', 'excessive thirst', 'blurred vision'], condition: 'Possible Diabetes / Blood Sugar Issue', severity: 'high', recommendation: 'Monitor blood sugar levels. Avoid sugary foods. See a doctor promptly.', specialistType: 'Endocrinologist / General Physician', urgency: 'Within 24–48 hours' },
  { keywords: ['allergy', 'allergic reaction', 'swelling', 'throat swelling', 'difficulty breathing'], condition: 'Allergic Reaction', severity: 'high', recommendation: 'If throat swelling or difficulty breathing, call 911. For mild reactions, take antihistamines.', specialistType: 'Allergist / Emergency Medicine', urgency: 'Immediate if severe' }
];

const analyzeSymptoms = (text) => {
  const t = text.toLowerCase();
  let best = null, maxScore = 0;
  for (const c of CONDITIONS) {
    const score = c.keywords.filter(k => t.includes(k)).length;
    if (score > maxScore) { maxScore = score; best = c; }
  }
  return best || { condition: 'General Health Concern', severity: 'low', recommendation: 'Consult a general physician for a thorough evaluation.', specialistType: 'General Physician', urgency: 'Routine appointment within a week' };
};

// POST /api/symptoms/analyze
const analyze = (req, res) => {
  try {
    const { symptomsText, symptoms } = req.body;
    if (!symptomsText || symptomsText.trim().length < 5) {
      return res.status(400).json({ success: false, message: 'Please describe your symptoms in at least 5 characters.' });
    }
    const result = { ...analyzeSymptoms(symptomsText), disclaimer: DISCLAIMER };

    if (req.user) {
      insert('symptomHistory', {
        userId: req.user._id,
        symptomsText: symptomsText.trim(),
        symptoms: symptoms || [],
        result
      });
    }
    res.json({ success: true, result });
  } catch (err) {
    console.error('Symptom analysis error:', err);
    res.status(500).json({ success: false, message: 'Analysis failed. Please try again.' });
  }
};

// GET /api/symptoms/history
const getHistory = (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(20, parseInt(req.query.limit) || 10);

    const all = findAll('symptomHistory', r => r.userId === req.user._id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = all.length;
    const records = all.slice((page - 1) * limit, page * limit);

    res.json({ success: true, records, pagination: { total, page, pages: Math.ceil(total / limit), limit } });
  } catch (err) {
    console.error('Get history error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch history.' });
  }
};

// DELETE /api/symptoms/history/:id
const deleteHistory = (req, res) => {
  try {
    const record = findOne('symptomHistory', r => r._id === req.params.id && r.userId === req.user._id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found.' });
    deleteById('symptomHistory', req.params.id);
    res.json({ success: true, message: 'Record deleted.' });
  } catch (err) {
    console.error('Delete history error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete record.' });
  }
};

module.exports = { analyze, getHistory, deleteHistory };
