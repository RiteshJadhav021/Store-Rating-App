import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const initialState = {
  email: '',
  password: '',
};

const validate = (fields) => {
  const errors = {};
  // Email: basic pattern
  if (!fields.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(fields.email)) {
    errors.email = 'Invalid email address.';
  }
  // Password: 8-16 chars, 1 uppercase, 1 special
  if (!fields.password ||
      fields.password.length < 8 ||
      fields.password.length > 16 ||
      !/[A-Z]/.test(fields.password) ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(fields.password)) {
    errors.password = 'Password must be 8-16 chars, include 1 uppercase and 1 special character.';
  }
  return errors;
};


export default function Login() {
  const [fields, setFields] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(fields);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      setSuccess('');
      return;
    }
    try {
  const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Login successful!');
        // Store user email for later use (e.g., change password)
        if (data.user && data.user.email) {
          localStorage.setItem('userEmail', data.user.email);
        }
        // If backend returns user role, redirect to appropriate dashboard
        if (data.user && data.user.role === 'admin') {
          navigate('/admin-dashboard');
        } else if (data.user && data.user.role === 'user') {
          navigate('/user-dashboard');
        }
      } else {
        setErrors({ api: data.error || 'Login failed.' });
        setSuccess('');
      }
    } catch (err) {
      setErrors({ api: 'Network error.' });
      setSuccess('');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#e0e7ff] to-[#f1f5f9] py-10 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center">
        <button
          type="button"
          className="self-start mb-4 text-blue-600 hover:text-blue-800 flex items-center"
          onClick={() => navigate('/')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Signup
        </button>
        <h1 className="text-4xl font-extrabold text-blue-700 mb-2 tracking-tight text-center drop-shadow">Login</h1>
        <p className="text-base text-gray-500 mb-6 text-center">Sign in to your account</p>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-700">Email</label>
            <div className="relative">
              <input type="email" name="email" placeholder="Enter Email" value={fields.email} onChange={handleChange} className="w-full border border-gray-300 bg-gray-50 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow shadow-sm" />
            </div>
            {errors.email && <div className="text-red-600 text-xs mt-1 px-2 py-1 rounded bg-red-50 border border-red-200">{errors.email}</div>}
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-700">Password</label>
            <div className="relative">
              <input type="password" name="password" placeholder="Enter Password" value={fields.password} onChange={handleChange} className="w-full border border-gray-300 bg-gray-50 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow shadow-sm" />
            </div>
            {errors.password && <div className="text-red-600 text-xs mt-1 px-2 py-1 rounded bg-red-50 border border-red-200">{errors.password}</div>}
          </div>
          {errors.api && <div className="text-red-600 text-sm mb-2 px-2 py-1 rounded bg-red-50 border border-red-200 text-center">{errors.api}</div>}
          {success && <p className="text-green-500 text-sm mb-2">{success}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition-colors">Login</button>
        </form>
      </div>
    </div>
  );
}
