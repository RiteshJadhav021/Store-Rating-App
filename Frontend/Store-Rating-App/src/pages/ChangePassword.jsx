import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const email = localStorage.getItem('userEmail'); // Get user email from localStorage
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validate = (fields) => {
    const errors = {};
    if (!fields.oldPassword) errors.oldPassword = 'Old password required.';
    if (!fields.newPassword || fields.newPassword.length < 8 || !/[A-Z]/.test(fields.newPassword) || !/[!@#$%^&*(),.?":{}|<>]/.test(fields.newPassword)) {
      errors.newPassword = 'New password must be 8+ chars, 1 uppercase, 1 special.';
    }
    if (fields.newPassword !== fields.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
    return errors;
  };

  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrors({ api: 'User email not found. Please log in again.' });
      setSuccess('');
      return;
    }
    const validationErrors = validate(fields);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      setSuccess('');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, ...fields }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Password updated successfully!');
        setFields({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => {
          navigate('/login');
        }, 1200);
      } else {
        setErrors({ api: data.error || 'Update failed.' });
        setSuccess('');
      }
    } catch (err) {
      setErrors({ api: 'Network error.' });
      setSuccess('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-4 tracking-tight text-center drop-shadow">Change Password</h1>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-700">Old Password</label>
            <div className="relative">
              <input
                type={showOld ? "text" : "password"}
                name="oldPassword"
                value={fields.oldPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 bg-gray-50 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
              />
              <button
                type="button"
                className="absolute right-2 top-2 text-gray-500 hover:text-blue-600 focus:outline-none"
                onClick={() => setShowOld((prev) => !prev)}
                tabIndex={-1}
                aria-label={showOld ? "Hide password" : "Show password"}
              >
                {showOld ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M9.88 9.88A3 3 0 0012 15a3 3 0 002.12-5.12M15 12a3 3 0 00-3-3m0 0a3 3 0 00-3 3m0 0a3 3 0 003 3m0 0a3 3 0 003-3m0 0a3 3 0 00-3-3m0 0a3 3 0 00-3 3m0 0a3 3 0 003 3m0 0a3 3 0 003-3" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-9 0c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8-8-3.582-8-8z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.oldPassword && <div className="text-red-600 text-xs mt-1">{errors.oldPassword}</div>}
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-700">New Password</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                name="newPassword"
                value={fields.newPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 bg-gray-50 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
              />
              <button
                type="button"
                className="absolute right-2 top-2 text-gray-500 hover:text-blue-600 focus:outline-none"
                onClick={() => setShowNew((prev) => !prev)}
                tabIndex={-1}
                aria-label={showNew ? "Hide password" : "Show password"}
              >
                {showNew ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M9.88 9.88A3 3 0 0012 15a3 3 0 002.12-5.12M15 12a3 3 0 00-3-3m0 0a3 3 0 00-3 3m0 0a3 3 0 003 3m0 0a3 3 0 003-3m0 0a3 3 0 00-3-3m0 0a3 3 0 00-3 3m0 0a3 3 0 003 3m0 0a3 3 0 003-3" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-9 0c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8-8-3.582-8-8z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.newPassword && <div className="text-red-600 text-xs mt-1">{errors.newPassword}</div>}
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-700">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={fields.confirmPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 bg-gray-50 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
              />
              <button
                type="button"
                className="absolute right-2 top-2 text-gray-500 hover:text-blue-600 focus:outline-none"
                onClick={() => setShowConfirm((prev) => !prev)}
                tabIndex={-1}
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M9.88 9.88A3 3 0 0012 15a3 3 0 002.12-5.12M15 12a3 3 0 00-3-3m0 0a3 3 0 00-3 3m0 0a3 3 0 003 3m0 0a3 3 0 003-3m0 0a3 3 0 00-3-3m0 0a3 3 0 00-3 3m0 0a3 3 0 003 3m0 0a3 3 0 003-3" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-9 0c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8-8-3.582-8-8z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.confirmPassword && <div className="text-red-600 text-xs mt-1">{errors.confirmPassword}</div>}
          </div>
          {errors.api && <div className="text-red-600 text-sm mb-2 text-center">{errors.api}</div>}
          {success && <p className="text-green-500 text-sm mb-2 text-center">{success}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition-colors">Change Password</button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;