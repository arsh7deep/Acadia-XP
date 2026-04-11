const Activity = require('../models/Activity');
const User = require('../models/User');
const calculateXP = require('../services/xpService');
const calculateLevel = require('../services/levelService');
const { updateStreak } = require('../services/streakService');
const { checkAndUnlockBadges } = require('../services/achievementService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// Validate activity data
const validateActivity = (type, duration) => {
  const validTypes = ['study', 'class', 'workout'];
  console.log('validateActivity called - type:', type, 'duration:', duration);
  console.log('Type is in validTypes?', validTypes.includes(type));
  console.log('Duration check:', duration, 'valid?', duration && duration > 0 && duration <= 12);
  
  if (!validTypes.includes(type)) {
    return { valid: false, message: 'Invalid activity type. Must be study, class, or workout' };
  }
  if (!duration || duration <= 0 || duration > 12) {
    return { valid: false, message: 'Duration must be between 1 and 12 hours' };
  }
  return { valid: true };
};

// Add Activity
exports.addActivity = async (req, res) => {
  try {
    const { type, duration } = req.body;
    
    console.log('=== addActivity called ===');
    console.log('Request body:', req.body);
    console.log('Type:', type, 'Type type:', typeof type);
    console.log('Duration:', duration, 'Duration type:', typeof duration);

    // Validate input
    const validation = validateActivity(type, parseInt(duration));
    console.log('Validation result:', validation);
    
    if (!validation.valid) {
      console.log('Validation failed, returning error');
      return sendError(res, validation.message, 400);
    }

    const xp = calculateXP(type, parseInt(duration));
    console.log('Calculated XP:', xp);

    const activity = await Activity.create({
      user: req.user._id,
      type,
      duration: parseInt(duration),
      xpEarned: xp
    });
    
    console.log('Activity created:', activity);

    const user = await User.findById(req.user._id);

    user.xp += xp;
    user.level = calculateLevel(user.xp);

    // Update streak
    await updateStreak(user._id);

    await user.save();
    console.log('User saved with new XP:', user.xp, 'Level:', user.level);

    // Check for new badges
    const newBadges = await checkAndUnlockBadges(user._id);

    sendSuccess(res, {
      activity,
      xpEarned: xp,
      newLevel: user.level,
      totalXP: user.xp,
      newBadges,
      streak: user.streak
    }, 'Activity added successfully', 201);
  } catch (error) {
    console.error('=== addActivity error ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Full error:', error);
    sendError(res, error.message, 500, error);
  }
};

// Get User Activities
exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user._id }).sort({ createdAt: -1 });
    sendSuccess(res, activities, 'Activities retrieved successfully', 200);
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};

// Get User Profile with badges and streak
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    sendSuccess(res, user, 'Profile retrieved successfully', 200);
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};
