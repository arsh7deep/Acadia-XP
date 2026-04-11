const User = require('../models/User');
const hashPassword = require('../utils/hashPassword');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// Validation helpers
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password) {
      return sendError(res, 'Name, email, and password are required', 400);
    }

    if (!validateEmail(email)) {
      return sendError(res, 'Invalid email format', 400);
    }

    if (!validatePassword(password)) {
      return sendError(res, 'Password must be at least 6 characters', 400);
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return sendError(res, 'User already exists', 400);
    }

    const hashed = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashed
    });

    const token = generateToken(user._id);

    sendSuccess(res, {
      _id: user._id,
      name: user.name,
      email: user.email,
      token
    }, 'Registration successful', 201);
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return sendError(res, 'Email and password are required', 400);
    }

    const user = await User.findOne({ email });

    if (!user) {
      return sendError(res, 'Invalid credentials', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return sendError(res, 'Invalid credentials', 401);
    }

    const token = generateToken(user._id);

    sendSuccess(res, {
      _id: user._id,
      name: user.name,
      email: user.email,
      token
    }, 'Login successful', 200);
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};
