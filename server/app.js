// Express configuration and middleware setup
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Security Middleware
app.use(helmet());

// CORS Configuration
app.use(cors());

// Body Parser Middleware
app.use(express.json());

// Rate Limiting Middleware
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 login attempts per windowMs
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true
});

// Apply rate limiting to all routes
app.use(generalLimiter);

// Routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/activity', require('./routes/activityRoutes'));
app.use('/api/leaderboard', require('./routes/leaderboardRoutes'));

// Default route
app.get('/', (req, res) => {
  res.send('API is running...');
});

module.exports = app;