const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');

const {
  addActivity,
  getActivities
} = require('../controllers/activityController');

router.post('/', protect, addActivity);
router.get('/', protect, getActivities);

module.exports = router;
