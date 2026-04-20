const express = require('express');
const { bookAppointment, getMyAppointments, cancelAppointment } = require('../controllers/appointmentsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, bookAppointment);
router.get('/', protect, getMyAppointments);
router.put('/:id/cancel', protect, cancelAppointment);

module.exports = router;
