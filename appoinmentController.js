const { insert, findAll, findOne, findById, updateById } = require('../db/memoryStore');
const { seedDoctors } = require('../db/seedDoctors');

// POST /api/appointments
const bookAppointment = (req, res) => {
  try {
    seedDoctors();
    const { doctorId, date, time, type, reason } = req.body;

    if (!doctorId || !date || !time) {
      return res.status(400).json({ success: false, message: 'Doctor, date, and time are required.' });
    }

    const doctor = findById('doctors', doctorId);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found.' });
    if (doctor.availability === 'offline') {
      return res.status(400).json({ success: false, message: 'Doctor is currently unavailable.' });
    }

    // Check duplicate booking
    const existing = findOne('appointments', a =>
      a.doctorId === doctorId && a.date === date && a.time === time &&
      (a.status === 'pending' || a.status === 'confirmed')
    );
    if (existing) {
      return res.status(409).json({ success: false, message: 'This time slot is already booked.' });
    }

    const appointment = insert('appointments', {
      userId: req.user._id,
      doctorId,
      date,
      time,
      type: type || 'in-person',
      reason: reason || '',
      status: 'pending',
      fee: doctor.consultationFee
    });

    // Attach doctor info for response
    const populated = { ...appointment, doctorId: doctor };
    res.status(201).json({ success: true, message: 'Appointment booked successfully.', appointment: populated });
  } catch (err) {
    console.error('Book appointment error:', err);
    res.status(500).json({ success: false, message: 'Failed to book appointment.' });
  }
};

// GET /api/appointments
const getMyAppointments = (req, res) => {
  try {
    seedDoctors();
    const { status } = req.query;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(20, parseInt(req.query.limit) || 10);

    let appts = findAll('appointments', a => a.userId === req.user._id);
    if (status) appts = appts.filter(a => a.status === status);

    appts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = appts.length;
    const paginated = appts.slice((page - 1) * limit, page * limit);

    // Populate doctor info
    const populated = paginated.map(a => {
      const doctor = findById('doctors', a.doctorId);
      return { ...a, doctorId: doctor || { name: 'Unknown', specialization: '' } };
    });

    res.json({ success: true, appointments: populated, pagination: { total, page, pages: Math.ceil(total / limit), limit } });
  } catch (err) {
    console.error('Get appointments error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch appointments.' });
  }
};

// PUT /api/appointments/:id/cancel
const cancelAppointment = (req, res) => {
  try {
    const appointment = findOne('appointments', a => a._id === req.params.id && a.userId === req.user._id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found.' });
    if (appointment.status === 'cancelled') return res.status(400).json({ success: false, message: 'Already cancelled.' });
    if (appointment.status === 'completed') return res.status(400).json({ success: false, message: 'Cannot cancel a completed appointment.' });

    const updated = updateById('appointments', req.params.id, { status: 'cancelled' });
    res.json({ success: true, message: 'Appointment cancelled.', appointment: updated });
  } catch (err) {
    console.error('Cancel appointment error:', err);
    res.status(500).json({ success: false, message: 'Failed to cancel appointment.' });
  }
};

module.exports = { bookAppointment, getMyAppointments, cancelAppointment };
