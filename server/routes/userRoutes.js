const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { getProfile, getBadges, getStats } = require('../controllers/userController');

router.get('/profile', protect, getProfile);
router.get('/badges', protect, getBadges);
router.get('/stats', protect, getStats);

module.exports = router;
