
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db'); // Ensure MySQL connection code runs

const app = express();
app.use(cors());
app.use(express.json());


// test route
app.get('/api', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

// User registration route
app.post('/register', (req, res) => {
  const { name, email, address, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const sql = `INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [name, email, password, address, role], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Email already exists' });
      }
      return res.status(500).json({ error: 'Database error', details: err });
    }
    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  });
});

// User login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }
  // Hardcoded admin credentials
  if (email === 'admin@store.com' && password === 'Admin@123') {
    return res.json({ message: 'Login successful', user: { id: 0, name: 'Admin', email, role: 'admin' } });
  }
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const user = results[0];
    // NOTE: In production, use bcrypt to compare hashed passwords
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    // You can generate JWT here if needed
    res.json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });
});

// User password update route
app.post('/update-password', (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  if (!email || !oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = results[0];
    // NOTE: In production, use bcrypt to compare hashed passwords
    if (user.password !== oldPassword) {
      return res.status(401).json({ error: 'Old password is incorrect' });
    }
    const updateSql = 'UPDATE users SET password = ? WHERE email = ?';
    db.query(updateSql, [newPassword, email], (updateErr) => {
      if (updateErr) {
        return res.status(500).json({ error: 'Database error', details: updateErr });
      }
      res.json({ message: 'Password updated successfully' });
    });
  });
});

// Add Store (admin)
app.post('/stores', (req, res) => {
  const { name, address, rating } = req.body;
  if (!name || !address || !rating) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const sql = 'INSERT INTO stores (name, address, overall_rating) VALUES (?, ?, ?)';
  db.query(sql, [name, address, rating], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err });
    }
    res.status(201).json({ message: 'Store added successfully', storeId: result.insertId });
  });
});

// Get all stores (for user dashboard)
// Get total user count
app.get('/users/count', (req, res) => {
  const sql = 'SELECT COUNT(*) AS count FROM users';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err });
    }
    res.json({ count: results[0].count });
  });
});

// Get total store count
app.get('/stores/count', (req, res) => {
  const sql = 'SELECT COUNT(*) AS count FROM stores';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err });
    }
    res.json({ count: results[0].count });
  });
});

// Get total ratings count
app.get('/ratings/count', (req, res) => {
  const sql = 'SELECT COUNT(*) AS count FROM ratings';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err });
    }
    res.json({ count: results[0].count });
  });
});

// Get all users
app.get('/users', (req, res) => {
  const sql = 'SELECT id, name, email, address, role FROM users';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err });
    }
    res.json({ users: results });
  });
});
app.get('/stores', (req, res) => {
  const sql = 'SELECT * FROM stores';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err });
    }
    res.json({ stores: results });
  });
});

// Submit rating for a store
app.post('/stores/:id/rate', (req, res) => {
  const storeId = req.params.id;
  const { rating } = req.body;
  if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Invalid rating value' });
  }
  // Update overall_rating for simplicity (in real app, save user rating separately)
  const sql = 'UPDATE stores SET overall_rating = ? WHERE id = ?';
  db.query(sql, [rating, storeId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err });
    }
    res.json({ success: true });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
