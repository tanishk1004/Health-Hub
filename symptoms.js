const express = require('express');
const { analyze, getHistory, deleteHistory } = require('../controllers/symptomsController');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/analyze', optionalAuth, analyze);
router.get('/history', protect, getHistory);
router.delete('/history/:id', protect, deleteHistory);

module.exports = router;
