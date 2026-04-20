import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const BLOOD_GROUPS = ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('profile');
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
    gender: user?.gender || '',
    bloodGroup: user?.bloodGroup || '',
    allergies: user?.allergies?.join(', ') || '',
    chronicConditions: user?.chronicConditions?.join(', ') || '',
    emergencyName: user?.emergencyContact?.name || '',
    emergencyPhone: user?.emergencyContact?.phone || '',
    emergencyRelation: user?.emergencyContact?.relation || ''
  });

  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

  const handleProfileChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: profile.name.trim(),
        phone: profile.phone,
        dateOfBirth: profile.dateOfBirth || undefined,
        gender: profile.gender,
        bloodGroup: profile.bloodGroup,
        allergies: profile.allergies ? profile.allergies.split(',').map((s) => s.trim()).filter(Boolean) : [],
        chronicConditions: profile.chronicConditions ? profile.chronicConditions.split(',').map((s) => s.trim()).filter(Boolean) : [],
        emergencyContact: {
          name: profile.emergencyName,
          phone: profile.emergencyPhone,
          relation: profile.emergencyRelation
        }
      };
      const { data } = await api.put('/user/profile', payload);
      updateUser(data.user);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwords.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters.'); return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Passwords do not match.'); return;
    }
    setSaving(true);
    try {
      await api.put('/user/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      toast.success('Password changed successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setSaving(false);
    }
  };

  const PasswordInput = ({ name, value, label, placeholder, show, onToggle }) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={handlePasswordChange}
          placeholder={placeholder}
          className="input pr-10"
          required
        />
        <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-teal-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{user?.name}</h1>
          <p className="text-slate-500 dark:text-slate-400">{user?.email}</p>
          <span className="badge badge-success mt-1">Active Patient</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-700">
        {[
          { id: 'profile', label: 'Personal Info' },
          { id: 'health', label: 'Health Info' },
          { id: 'security', label: 'Security' }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === t.id
                ? 'border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Personal Info Tab */}
      {tab === 'profile' && (
        <form onSubmit={handleProfileSave} className="card space-y-5 animate-fade-in">
          <h2 className="font-semibold text-slate-900 dark:text-white">Personal Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
              <input type="text" name="name" value={profile.name} onChange={handleProfileChange} className="input" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Phone Number</label>
              <input type="tel" name="phone" value={profile.phone} onChange={handleProfileChange} placeholder="+1 (555) 000-0000" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Date of Birth</label>
              <input type="date" name="dateOfBirth" value={profile.dateOfBirth} onChange={handleProfileChange} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Gender</label>
              <select name="gender" value={profile.gender} onChange={handleProfileChange} className="input">
                <option value="">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
            <input type="email" value={user?.email} disabled className="input opacity-60 cursor-not-allowed" />
            <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
          </div>

          <div className="pt-2">
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? <span className="flex items-center gap-2"><LoadingSpinner size="sm" /> Saving...</span> : 'Save Changes'}
            </button>
          </div>
        </form>
      )}

      {/* Health Info Tab */}
      {tab === 'health' && (
        <form onSubmit={handleProfileSave} className="space-y-5 animate-fade-in">
          <div className="card space-y-4">
            <h2 className="font-semibold text-slate-900 dark:text-white">Medical Information</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Blood Group</label>
              <select name="bloodGroup" value={profile.bloodGroup} onChange={handleProfileChange} className="input">
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{bg || 'Unknown'}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Allergies</label>
              <input
                type="text"
                name="allergies"
                value={profile.allergies}
                onChange={handleProfileChange}
                placeholder="e.g., Penicillin, Peanuts, Latex (comma-separated)"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Chronic Conditions</label>
              <input
                type="text"
                name="chronicConditions"
                value={profile.chronicConditions}
                onChange={handleProfileChange}
                placeholder="e.g., Diabetes, Hypertension (comma-separated)"
                className="input"
              />
            </div>
          </div>

          <div className="card space-y-4">
            <h2 className="font-semibold text-slate-900 dark:text-white">Emergency Contact</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Name</label>
                <input type="text" name="emergencyName" value={profile.emergencyName} onChange={handleProfileChange} placeholder="Contact name" className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Phone</label>
                <input type="tel" name="emergencyPhone" value={profile.emergencyPhone} onChange={handleProfileChange} placeholder="+1 (555) 000-0000" className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Relation</label>
                <input type="text" name="emergencyRelation" value={profile.emergencyRelation} onChange={handleProfileChange} placeholder="e.g., Spouse, Parent" className="input" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? <span className="flex items-center gap-2"><LoadingSpinner size="sm" /> Saving...</span> : 'Save Health Info'}
          </button>
        </form>
      )}

      {/* Security Tab */}
      {tab === 'security' && (
        <form onSubmit={handlePasswordSave} className="card space-y-5 animate-fade-in">
          <h2 className="font-semibold text-slate-900 dark:text-white">Change Password</h2>
          <PasswordInput
            name="currentPassword"
            value={passwords.currentPassword}
            label="Current Password"
            placeholder="Enter current password"
            show={showPasswords.current}
            onToggle={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
          />
          <PasswordInput
            name="newPassword"
            value={passwords.newPassword}
            label="New Password"
            placeholder="Min. 8 characters"
            show={showPasswords.new}
            onToggle={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
          />
          <PasswordInput
            name="confirmPassword"
            value={passwords.confirmPassword}
            label="Confirm New Password"
            placeholder="Re-enter new password"
            show={showPasswords.confirm}
            onToggle={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
          />
          {passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword && (
            <p className="text-xs text-red-500">Passwords do not match</p>
          )}
          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? <span className="flex items-center gap-2"><LoadingSpinner size="sm" /> Updating...</span> : 'Update Password'}
          </button>
        </form>
      )}
    </div>
  );
}
