const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const User = require('./models/User');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));
// Also serve views folder directly so /login.html, /profile.html etc. work
app.use(express.static(path.join(__dirname, '../frontend/views')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Route for serving frontend pages
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/register.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/profile.html'));
});

app.get('/admin-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/admin-dashboard.html'));
});

app.get('/reset-password', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/reset-password.html'));
});

// Fallback route to frontend index
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/index.html'));
});

// Function to seed default accounts if database has no users
const seedInitialData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding initial system users...');

      // Default Admin Account
      await User.create({
        fullName: 'System Administrator',
        email: 'admin@ums.com',
        password: 'AdminPassword123!',
        role: 'Admin',
        status: 'Active',
        phone: '+1 (555) 019-2831',
        bio: 'Primary system administrator managing users and system policies.'
      });

      // Default Normal User
      await User.create({
        fullName: 'Jane Doe',
        email: 'user@ums.com',
        password: 'UserPassword123!',
        role: 'User',
        status: 'Active',
        phone: '+1 (555) 018-4920',
        bio: 'Software engineer and platform member.'
      });

      // Demo User 2
      await User.create({
        fullName: 'Alex Smith',
        email: 'alex@ums.com',
        password: 'UserPassword123!',
        role: 'User',
        status: 'Active',
        phone: '+1 (555) 014-9988',
        bio: 'Product designer based in San Francisco.'
      });

      console.log('✅ Initial Seed Accounts Created Successfully:');
      console.log('   Admin: admin@ums.com / AdminPassword123!');
      console.log('   User:  user@ums.com / UserPassword123!');
    }
  } catch (err) {
    console.error('Error seeding initial data:', err.message);
  }
};

const PORT = process.env.PORT || 5000;

// Start Server immediately so port 5000 is open for web traffic
const server = app.listen(PORT, () => {
  console.log(`🚀 User Management System running at http://localhost:${PORT}`);
});

// Asynchronously connect database and seed initial data
connectDB().then(() => {
  seedInitialData();
}).catch(err => {
  console.error('Database connection initialization error:', err.message);
});

