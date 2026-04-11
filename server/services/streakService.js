const User = require('../models/User');

// Update streak when user adds activity
exports.updateStreak = async (userId) => {
  const user = await User.findById(userId);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!user.lastActivityDate) {
    // First activity
    user.streak = 1;
    user.lastActivityDate = new Date();
  } else {
    const lastDate = new Date(user.lastActivityDate);
    lastDate.setHours(0, 0, 0, 0);

    const diffTime = today - lastDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Same day, streak unchanged
      return user.streak;
    } else if (diffDays === 1) {
      // Next day, increment streak
      user.streak += 1;
      user.lastActivityDate = new Date();
    } else {
      // Streak broken
      user.streak = 1;
      user.lastActivityDate = new Date();
    }
  }

  await user.save();
  return user.streak;
};

// Get user's current streak
exports.getStreak = async (userId) => {
  const user = await User.findById(userId);
  return user.streak || 0;
};

// Reset streak if no activity for 24+ hours
exports.checkAndResetStreak = async (userId) => {
  const user = await User.findById(userId);
  
  if (!user.lastActivityDate) {
    return 0;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastDate = new Date(user.lastActivityDate);
  lastDate.setHours(0, 0, 0, 0);

  const diffTime = today - lastDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 1) {
    user.streak = 0;
    await user.save();
  }

  return user.streak;
};
