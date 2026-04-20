const { findAll, findById } = require('../db/memoryStore');
const { seedDoctors } = require('../db/seedDoctors');

// GET /api/doctors
const getDoctors = (req, res) => {
  try {
    seedDoctors();
    const { search, specialization, availability } = req.query;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(20, parseInt(req.query.limit) || 12);

    let doctors = findAll('doctors');

    if (search) {
      const s = search.toLowerCase();
      doctors = doctors.filter(d =>
        d.name.toLowerCase().includes(s) ||
        d.specialization.toLowerCase().includes(s) ||
        (d.hospital || '').toLowerCase().includes(s)
      );
    }
    if (specialization) {
      doctors = doctors.filter(d => d.specialization.toLowerCase().includes(specialization.toLowerCase()));
    }
    if (availability) {
      doctors = doctors.filter(d => d.availability === availability);
    }

    doctors.sort((a, b) => b.rating - a.rating);

    const total = doctors.length;
    const paginated = doctors.slice((page - 1) * limit, page * limit);

    res.json({ success: true, doctors: paginated, pagination: { total, page, pages: Math.ceil(total / limit), limit } });
  } catch (err) {
    console.error('Get doctors error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch doctors.' });
  }
};

// GET /api/doctors/:id
const getDoctorById = (req, res) => {
  try {
    const doctor = findById('doctors', req.params.id);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found.' });
    res.json({ success: true, doctor });
  } catch (err) {
    console.error('Get doctor error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch doctor.' });
  }
};

module.exports = { getDoctors, getDoctorById };
