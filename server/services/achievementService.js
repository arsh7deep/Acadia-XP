const User = require('../models/User');
const Activity = require('../models/Activity');
const { badges } = require('../constants/achievementRules');

// Check and unlock badges for user
exports.checkAndUnlockBadges = async (userId) => {
  const user = await User.findById(userId).populate('badges');
  const userActivities = await Activity.find({ user: userId });

  const newBadges = [];

  for (let badge of badges) {
    // Check if already earned
    if (user.badges && user.badges.some(b => b.id === badge.id)) {
      continue;
    }

    let earned = false;

    // Check XP-based badges
    if (badge.xpRequired && user.xp >= badge.xpRequired) {
      earned = true;
    }

    // Check activity count badges
    if (badge.activityCount) {
      const count = userActivities.filter(a => a.type === badge.activityType).length;
      if (count >= badge.activityCount) {
        earned = true;
      }
    }

    // Check streak badges
    if (badge.streakRequired && user.streak >= badge.streakRequired) {
      earned = true;
    }

    // Level-based badges
    if (badge.id === 2 && user.level >= 2) {
      earned = true;
    }
    if (badge.id === 6 && user.level >= 5) {
      earned = true;
    }

    if (earned) {
      newBadges.push(badge);
    }
  }

  if (newBadges.length > 0) {
    user.badges = [...(user.badges || []), ...newBadges];
    await user.save();
  }

  return newBadges;
};

// Get user's badges
exports.getUserBadges = async (userId) => {
  const user = await User.findById(userId);
  return user.badges || [];
};
