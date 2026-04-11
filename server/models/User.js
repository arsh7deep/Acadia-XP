const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },

    xp: { type: Number, default: 0, index: true },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 0 },
    lastActivityDate: { type: Date, default: null },
    badges: [
      {
        id: Number,
        title: String,
        description: String,
        icon: String,
        unlockedAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

// Indexes for optimized queries
userSchema.index({ xp: -1 });
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', userSchema);
