import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [fields, setFields] = useState({ name: '', address: '', rating: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [userCount, setUserCount] = useState(0);
  const [storeCount, setStoreCount] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [userFilters, setUserFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [storeFilters, setStoreFilters] = useState({ name: '', address: '', rating: '' });

  useEffect(() => {
    fetch('http://localhost:5000/users/count')
      .then(res => res.json())
      .then(data => setUserCount(data.count || 0));
    fetch('http://localhost:5000/stores/count')
      .then(res => res.json())
      .then(data => setStoreCount(data.count || 0));
    fetch('http://localhost:5000/ratings/count')
      .then(res => res.json())
      .then(data => setRatingCount(data.count || 4));
    fetch('http://localhost:5000/users')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.users)) {
          setUsers(data.users.filter(u => u.role !== 'admin'));
        }
      });
    fetch('http://localhost:5000/stores')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.stores)) {
          setStores(data.stores);
        }
      });
  }, []);

  const validate = (fields) => {
    const errors = {};
    if (!fields.name) errors.name = 'Store name required.';
    if (!fields.address) errors.address = 'Address required.';
    if (!fields.rating || isNaN(fields.rating) || fields.rating < 1 || fields.rating > 5) errors.rating = 'Rating must be 1-5.';
    return errors;
  };

  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(fields);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      setSuccess('');
      return;
    }
    fetch('http://localhost:5000/stores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    })
      .then(res => res.json())
      .then(data => {
        if (data.storeId) {
          setSuccess('Store added successfully!');
          setFields({ name: '', address: '', rating: '' });
          setTimeout(() => {
            setShowModal(false);
            setSuccess('');
          }, 1200);
        } else {
          setErrors({ api: data.error || 'Failed to add store.' });
        }
      })
      .catch(() => {
        setErrors({ api: 'Network error.' });
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-yellow-300">
      {/* Navbar */}
      <nav className="w-full bg-white shadow flex items-center justify-between px-8 py-4 relative">
        <div className="relative">
          <button
            className="text-2xl font-bold text-yellow-700 tracking-tight focus:outline-none"
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            Admin Panel
          </button>
          {showDropdown && (
            <div className="absolute left-0 mt-2 w-40 bg-white border rounded shadow z-10">
              <button
                className="w-full text-left px-4 py-2 hover:bg-yellow-100 text-yellow-700 font-semibold"
                onClick={() => {
                  // Clear session (if any)
                  localStorage.clear();
                  setShowDropdown(false);
                  navigate('/login');
                }}
              >Logout</button>
            </div>
          )}
        </div>
        <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-700 transition-colors focus:outline-none" onClick={() => setShowModal(true)}>Add Store</button>
      </nav>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold" onClick={() => setShowModal(false)}>&times;</button>
            <h2 className="text-2xl font-bold text-yellow-700 mb-4">Add Store</h2>
            <form className="w-full" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-1 font-semibold text-gray-700">Store Name</label>
                <input type="text" name="name" value={fields.name} onChange={handleChange} className="w-full border border-gray-300 bg-gray-50 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                {errors.name && <div className="text-red-600 text-xs mt-1">{errors.name}</div>}
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-semibold text-gray-700">Address</label>
                <input type="text" name="address" value={fields.address} onChange={handleChange} className="w-full border border-gray-300 bg-gray-50 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                {errors.address && <div className="text-red-600 text-xs mt-1">{errors.address}</div>}
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-semibold text-gray-700">Rating (1-5)</label>
                <input type="number" name="rating" value={fields.rating} onChange={handleChange} min="1" max="5" className="w-full border border-gray-300 bg-gray-50 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                {errors.rating && <div className="text-red-600 text-xs mt-1">{errors.rating}</div>}
              </div>
              {success && <div className="text-green-600 text-sm mb-2 text-center">{success}</div>}
              <button type="submit" className="w-full bg-yellow-600 text-white py-2 rounded font-semibold hover:bg-yellow-700 transition-colors">Add Store</button>
            </form>
          </div>
        </div>
      )}
      {/* Dashboard Content */}
      <div className="flex flex-col items-center justify-center py-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl flex flex-col items-center">
          <h1 className="text-3xl font-extrabold text-yellow-700 mb-4 tracking-tight text-center drop-shadow">Admin Overview</h1>
          <div className="flex gap-8 mb-6">
            <div className="bg-yellow-50 rounded-xl p-6 shadow flex flex-col items-center">
              <span className="text-2xl font-bold text-yellow-700 mb-2">Total Users</span>
              <span className="text-3xl font-extrabold text-yellow-600">{userCount}</span>
            </div>
            <div className="bg-yellow-50 rounded-xl p-6 shadow flex flex-col items-center">
              <span className="text-2xl font-bold text-yellow-700 mb-2">Total Stores</span>
              <span className="text-3xl font-extrabold text-yellow-600">{storeCount}</span>
            </div>
            <div className="bg-yellow-50 rounded-xl p-6 shadow flex flex-col items-center">
              <span className="text-2xl font-bold text-yellow-700 mb-2">Total Ratings</span>
              <span className="text-3xl font-extrabold text-yellow-600">{ratingCount}</span>
            </div>
          </div>
          {/* Users List */}
          <div className="w-full mt-8">
            <h2 className="text-2xl font-bold text-yellow-700 mb-4">Normal Users</h2>
            <div className="flex gap-4 mb-4">
              <input type="text" placeholder="Name" className="border px-2 py-1 rounded" value={userFilters.name} onChange={e => setUserFilters(f => ({ ...f, name: e.target.value }))} />
              <input type="text" placeholder="Email" className="border px-2 py-1 rounded" value={userFilters.email} onChange={e => setUserFilters(f => ({ ...f, email: e.target.value }))} />
              <input type="text" placeholder="Address" className="border px-2 py-1 rounded" value={userFilters.address} onChange={e => setUserFilters(f => ({ ...f, address: e.target.value }))} />
              {/* <input type="text" placeholder="Role" className="border px-2 py-1 rounded" value={userFilters.role} onChange={e => setUserFilters(f => ({ ...f, role: e.target.value }))} /> */}
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg mb-8">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left">Name</th>
                    <th className="py-2 px-4 border-b text-left">Email</th>
                    <th className="py-2 px-4 border-b text-left">Address</th>
                    <th className="py-2 px-4 border-b text-left">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.filter(user =>
                    user.name.toLowerCase().includes(userFilters.name.toLowerCase()) &&
                    user.email.toLowerCase().includes(userFilters.email.toLowerCase()) &&
                    user.address.toLowerCase().includes(userFilters.address.toLowerCase()) &&
                    user.role.toLowerCase().includes(userFilters.role.toLowerCase())
                  ).length === 0 ? (
                    <tr><td colSpan={4} className="py-4 text-center text-gray-500">No users found.</td></tr>
                  ) : (
                    users.filter(user =>
                      user.name.toLowerCase().includes(userFilters.name.toLowerCase()) &&
                      user.email.toLowerCase().includes(userFilters.email.toLowerCase()) &&
                      user.address.toLowerCase().includes(userFilters.address.toLowerCase()) &&
                      user.role.toLowerCase().includes(userFilters.role.toLowerCase())
                    ).map(user => (
                      <tr key={user.id} className="hover:bg-yellow-50">
                        <td className="py-2 px-4 border-b">{user.name}</td>
                        <td className="py-2 px-4 border-b">{user.email}</td>
                        <td className="py-2 px-4 border-b">{user.address}</td>
                        <td className="py-2 px-4 border-b">{user.role}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Stores List */}
            <h2 className="text-2xl font-bold text-yellow-700 mb-4">Stores</h2>
            <div className="flex gap-4 mb-4">
              <input type="text" placeholder="Name" className="border px-2 py-1 rounded" value={storeFilters.name} onChange={e => setStoreFilters(f => ({ ...f, name: e.target.value }))} />
              <input type="text" placeholder="Address" className="border px-2 py-1 rounded" value={storeFilters.address} onChange={e => setStoreFilters(f => ({ ...f, address: e.target.value }))} />
              <input type="text" placeholder="Rating" className="border px-2 py-1 rounded" value={storeFilters.rating} onChange={e => setStoreFilters(f => ({ ...f, rating: e.target.value }))} />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left">Name</th>
                    <th className="py-2 px-4 border-b text-left">Address</th>
                    <th className="py-2 px-4 border-b text-left">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.filter(store =>
                    store.name.toLowerCase().includes(storeFilters.name.toLowerCase()) &&
                    store.address.toLowerCase().includes(storeFilters.address.toLowerCase()) &&
                    String(store.overall_rating).toLowerCase().includes(storeFilters.rating.toLowerCase())
                  ).length === 0 ? (
                    <tr><td colSpan={3} className="py-4 text-center text-gray-500">No stores found.</td></tr>
                  ) : (
                    stores.filter(store =>
                      store.name.toLowerCase().includes(storeFilters.name.toLowerCase()) &&
                      store.address.toLowerCase().includes(storeFilters.address.toLowerCase()) &&
                      String(store.overall_rating).toLowerCase().includes(storeFilters.rating.toLowerCase())
                    ).map(store => (
                      <tr key={store.id} className="hover:bg-yellow-50">
                        <td className="py-2 px-4 border-b">{store.name}</td>
                        <td className="py-2 px-4 border-b">{store.address}</td>
                        <td className="py-2 px-4 border-b">{store.overall_rating}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
