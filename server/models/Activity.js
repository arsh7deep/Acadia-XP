const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    type: {
      type: String,
      enum: ['study', 'class', 'workout'],
      required: true
    },
    duration: Number,
    xpEarned: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model('Activity', activitySchema);
