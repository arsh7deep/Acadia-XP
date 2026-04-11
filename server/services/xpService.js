const xpRules = require('../constants/xpRules');

const calculateXP = (type, duration = 1) => {
  return xpRules[type] * duration;
};

module.exports = calculateXP;
