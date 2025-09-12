import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const initialState = {
  name: '',
  email: '',
  address: '',
  password: '',
  role: '',
};

const validate = (fields) => {
  const errors = {};
  // Name: Min 20, Max 60 chars
  if (!fields.name || fields.name.length < 20 || fields.name.length > 60) {
    errors.name = 'Name must be 20-60 characters.';
  }
  // Email: basic pattern
  if (!fields.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(fields.email)) {
    errors.email = 'Invalid email address.';
  }
  // Address: Max 400 chars
  if (!fields.address || fields.address.length > 400) {
    errors.address = 'Address must be less than 400 characters.';
  }
  // Password: 8-16 chars, 1 uppercase, 1 special
  if (!fields.password ||
      fields.password.length < 8 ||
      fields.password.length > 16 ||
      !/[A-Z]/.test(fields.password) ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(fields.password)) {
    errors.password = 'Password must be 8-16 chars, include 1 uppercase and 1 special character.';
  }
  // Role: required
  if (!fields.role) {
    errors.role = 'Role is required.';
  }
  return errors;
};


export default function Signup() {
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
      const res = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Registration successful!');
        setFields(initialState);
        if (fields.role === 'user') {
          navigate('/user-dashboard');
        }
      } else {
        setErrors({ api: data.error || 'Registration failed.' });
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
        <h1 className="text-4xl font-extrabold text-blue-700 mb-2 tracking-tight text-center drop-shadow">Store Rating App</h1>
        <p className="text-base text-gray-500 mb-6 text-center">Create your account to rate stores and share feedback!</p>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-700">Name</label>
            <div className="relative">
              <input type="text" name="name" placeholder="Enter Name" value={fields.name} onChange={handleChange} className="w-full border border-gray-300 bg-gray-50 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow shadow-sm" />
              {/* Example icon: <span className="absolute left-3 top-2 text-gray-400"><svg ... /></span> */}
            </div>
            {errors.name && <div className="text-red-600 text-xs mt-1 px-2 py-1">{errors.name}</div>}
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-700">Email</label>
            <div className="relative">
              <input type="email" name="email" placeholder="Enter Email" value={fields.email} onChange={handleChange} className="w-full border border-gray-300 bg-gray-50 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow shadow-sm" />
            </div>
            {errors.email && <div className="text-red-600 text-xs mt-1 px-2 ">{errors.email}</div>}
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-700">Address</label>
            <textarea name="address" placeholder="Enter Address" value={fields.address} onChange={handleChange} className="w-full border border-gray-300 bg-gray-50 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow shadow-sm resize-none" />
            {errors.address && <div className="text-red-600 text-xs mt-1 px-2 ">{errors.address}</div>}
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-700">Password</label>
            <div className="relative">
              <input type="password" name="password" placeholder="Enter Password" value={fields.password} onChange={handleChange} className="w-full border border-gray-300 bg-gray-50 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow shadow-sm" />
            </div>
            {errors.password && <div className="text-red-600 text-xs mt-1 px-2 ">{errors.password}</div>}
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-700">Role</label>
            <select name="role" value={fields.role} onChange={handleChange} className="w-full border border-gray-300 bg-gray-50 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow shadow-sm">
              <option value="">-- Select Role --</option>
              <option value="user">Normal User</option>
              <option value="owner">Store Owner</option>
            </select>
            {errors.role && <div className="text-red-600 text-xs mt-1 px-2 py-1 ">{errors.role}</div>}
          </div>
          <p className="text-xs text-gray-500 mb-4 text-center">By creating an account, you agree to our <span className="text-blue-600 underline cursor-pointer">Terms & Policy</span>.</p>
          {errors.api && <div className="text-red-600 text-sm mb-2 px-2 py-1 rounded bg-red-50 border border-red-200 text-center">{errors.api}</div>}
          {success && <p className="text-green-500 text-sm mb-2">{success}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition-colors">Sign Up</button>
          <div className="mt-4 text-center">
            <span className="text-gray-600">Already have an account?</span>
            <button
              type="button"
              className="ml-2 text-blue-600 underline font-medium hover:text-blue-800"
              onClick={() => window.open('/login', '_blank')}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
