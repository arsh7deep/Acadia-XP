const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return sendError(res, 'User not found', 404);
    }
    sendSuccess(res, user, 'Profile retrieved successfully', 200);
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

// Get user badges
exports.getBadges = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }
    sendSuccess(res, user.badges || [], 'Badges retrieved successfully', 200);
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

// Get user stats
exports.getStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('name xp level streak badges');
    if (!user) {
      return sendError(res, 'User not found', 404);
    }
    sendSuccess(res, {
      name: user.name,
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      badgeCount: user.badges?.length || 0,
      badges: user.badges || []
    }, 'Stats retrieved successfully', 200);
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};
