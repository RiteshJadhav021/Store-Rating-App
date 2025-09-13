function StoreCard({ store }) {
  const [rating, setRating] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
    const [currentRating, setCurrentRating] = useState(store.overall_rating);

  const handleRate = () => {
    if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
      setError('Please enter a rating between 1 and 5.');
      setSuccess('');
      return;
    }
    fetch(`http://localhost:5000/stores/${store.id}/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSuccess('Rating submitted!');
          setError('');
            setCurrentRating(rating);
        } else {
          setError(data.error || 'Failed to submit rating.');
          setSuccess('');
        }
      })
      .catch(() => {
        setError('Network error.');
        setSuccess('');
      });
  };

  return (
    <div className="bg-blue-50 rounded-xl p-6 shadow flex flex-col items-center">
      <h2 className="text-2xl font-bold text-blue-600 mb-2">{store.name}</h2>
      <p className="text-gray-500 mb-2 text-center">{store.address}</p>
        <div className="text-yellow-500 font-bold mb-2">Rating: {currentRating} ⭐</div>
      <div className="flex flex-col items-center w-full">
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={e => setRating(e.target.value)}
          placeholder="Your rating (1-5)"
          className="w-32 border border-gray-300 bg-gray-50 px-2 py-1 rounded-lg mb-2 text-center"
        />
        <button
          className="bg-blue-600 text-white px-4 py-1 rounded font-semibold hover:bg-blue-700 transition-colors"
          onClick={handleRate}
        >Submit Rating</button>
        {error && <div className="text-red-600 text-xs mt-1">{error}</div>}
        {success && <div className="text-green-600 text-xs mt-1">{success}</div>}
      </div>
    </div>
  );
}
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [search, setSearch] = useState('');
  const [stores, setStores] = useState([]);

  const fetchStores = () => {
    fetch('http://localhost:5000/stores')
      .then(res => res.json())
      .then(data => setStores(data.stores || []));
  };

  useEffect(() => {
    fetchStores();
  }, []);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      {/* Navbar */}
      <nav className="w-full bg-white shadow flex items-center justify-between px-8 py-4">
        <div className="text-2xl font-bold text-blue-700 tracking-tight">Store Rating App</div>
        <div className="relative" ref={accountRef}>
          <button
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:outline-none"
            onClick={() => setAccountOpen((open) => !open)}
          >
            <span>Account</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {accountOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <button className="w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-700 font-medium border-b border-gray-100" onClick={() => { setAccountOpen(false); navigate('/change-password'); }}>Change Password</button>
              <button className="w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-700 font-medium" onClick={() => { localStorage.clear(); setAccountOpen(false); navigate('/'); }}>Logout</button>
            </div>
          )}
        </div>
      </nav>
      {/* Dashboard Content */}
      {/* Search Bar */}
      <div className="flex justify-center py-6">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by store name or address..."
          className="w-96 border border-gray-300 bg-gray-50 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
        />
      </div>
      <div className="flex flex-col items-center justify-center py-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl flex flex-col items-center">
          <h1 className="text-4xl font-extrabold text-blue-700 mb-4 tracking-tight text-center drop-shadow">Welcome to Your Dashboard</h1>
          <p className="text-lg text-gray-600 mb-6 text-center">Here you can rate stores, view your ratings, and explore top-rated stores!</p>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            {stores.length === 0 ? (
              <div className="text-gray-500 text-center col-span-2">No stores available yet.</div>
            ) : (
              stores
                .filter(store =>
                  store.name.toLowerCase().includes(search.toLowerCase()) ||
                  store.address.toLowerCase().includes(search.toLowerCase())
                )
                .map(store => (
                  <StoreCard key={store.id} store={store} fetchStores={fetchStores} />
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;