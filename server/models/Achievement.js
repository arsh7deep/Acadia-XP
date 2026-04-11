const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: String,
  description: String,
  xpRequired: Number
});

module.exports = mongoose.model('Achievement', achievementSchema);
