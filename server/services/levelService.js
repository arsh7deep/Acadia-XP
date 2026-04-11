const calculateLevel = (xp) => {
  return Math.floor(xp / 100) + 1;
};

module.exports = calculateLevel;
