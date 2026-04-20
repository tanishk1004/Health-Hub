const bcrypt = require('bcryptjs');
const { findById, updateById } = require('../db/memoryStore');

const safeUser = (u) => { const { password, ...rest } = u; return rest; };

// GET /api/user/profile
const getProfile = (req, res) => {
  res.json({ success: true, user: safeUser(req.user) });
};

// PUT /api/user/profile
const updateProfile = (req, res) => {
  try {
    const allowed = ['name', 'phone', 'dateOfBirth', 'gender', 'bloodGroup',
      'allergies', 'chronicConditions', 'emergencyContact'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const updated = updateById('users', req.user._id, updates);
    if (!updated) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, message: 'Profile updated.', user: safeUser(updated) });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// PUT /api/user/change-password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Both passwords are required.' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters.' });
    }
    const user = findById('users', req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    }
    const hashed = await bcrypt.hash(newPassword, 12);
    updateById('users', req.user._id, { password: hashed });
    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getProfile, updateProfile, changePassword };
