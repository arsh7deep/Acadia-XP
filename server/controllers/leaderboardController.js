const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/responseHandler');

exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find()
      .select('name xp level badges')
      .sort({ xp: -1 })
      .limit(10);

    if (!users || users.length === 0) {
      return sendSuccess(res, [], 'No users found', 200);
    }

    sendSuccess(res, users, 'Leaderboard retrieved successfully', 200);
  } catch (error) {
    sendError(res, error.message, 500, error);
  }
};
